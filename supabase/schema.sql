-- 1. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tipos ENUM
CREATE TYPE zona_tipo AS ENUM ('salon', 'terraza', 'privado');
CREATE TYPE reserva_estado AS ENUM ('pendiente', 'confirmada', 'rechazada', 'cancelada');
CREATE TYPE confirmacion_modo AS ENUM ('manual', 'automatico');

-- 3. Tablas
CREATE TABLE sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    modo_confirmacion confirmacion_modo NOT NULL DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE horarios_sucursal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mesas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    numero_mesa INT NOT NULL,
    zona zona_tipo NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad IN (2, 4, 6)),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(sucursal_id, numero_mesa)
);

CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    mesa_id UUID NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMPTZ NOT NULL,
    personas_totales INT NOT NULL CHECK (personas_totales > 0),
    personas_sin_tacc INT NOT NULL DEFAULT 0,
    estado reserva_estado NOT NULL DEFAULT 'pendiente',
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_sin_tacc_limit CHECK (personas_sin_tacc <= personas_totales)
);

-- 4. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sucursales_modtime BEFORE UPDATE ON sucursales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_horarios_modtime BEFORE UPDATE ON horarios_sucursal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mesas_modtime BEFORE UPDATE ON mesas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_modtime BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_sucursal ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para configuración
CREATE POLICY "Lectura pública de sucursales" ON sucursales FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON horarios_sucursal FOR SELECT USING (true);
CREATE POLICY "Lectura pública de mesas" ON mesas FOR SELECT USING (true);

-- Políticas para reservas (Público puede insertar, solo admin puede ver todas)
CREATE POLICY "Público puede crear reservas" ON reservas FOR INSERT WITH CHECK (true);
-- Nota: En producción, agregar políticas para que los admins vean todas las reservas.

-- 6. Función de Disponibilidad (SECURITY DEFINER para poder leer reservas sin exponerlas al público)
CREATE OR REPLACE FUNCTION get_disponibilidad(
    p_sucursal_id UUID,
    p_fecha DATE,
    p_personas INT
)
RETURNS TABLE (
    hora TIME,
    mesas_disponibles BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_dia_semana INT;
BEGIN
    -- Postgres EXTRACT(DOW) devuelve 0 para Domingo, 1 para Lunes...
    v_dia_semana := EXTRACT(DOW FROM p_fecha);

    RETURN QUERY
    WITH turnos AS (
        -- Convertir los horarios de la sucursal a timestamps reales para la fecha solicitada
        SELECT 
            (p_fecha + h.hora_inicio)::timestamp with time zone AS turno_inicio,
            -- Si la hora de fin es menor o igual a la de inicio, asume que cruza la medianoche (+1 día)
            (p_fecha + h.hora_fin + CASE WHEN h.hora_fin <= h.hora_inicio THEN interval '1 day' ELSE interval '0' END)::timestamp with time zone AS turno_fin
        FROM horarios_sucursal h
        WHERE h.sucursal_id = p_sucursal_id
          AND h.dia_semana = v_dia_semana
    ),
    slots_ts AS (
        -- Generar slots cada 30 minutos. El último slot debe permitir 1.5hs de estadía antes del cierre.
        SELECT generate_series(
            turno_inicio,
            turno_fin - interval '1.5 hours',
            interval '30 minutes'
        ) AS slot_tstz
        FROM turnos
    ),
    slots_validos AS (
        -- Regla: No se aceptan reservas con menos de 3hs de anticipación
        SELECT slot_tstz
        FROM slots_ts
        WHERE slot_tstz >= (now() + interval '3 hours')
    ),
    mesas_capaces AS (
        -- Mesas que tienen capacidad suficiente para el grupo
        SELECT id
        FROM mesas
        WHERE sucursal_id = p_sucursal_id
          AND capacidad >= p_personas
          AND is_active = true
    )
    SELECT
        s.slot_tstz::time AS hora,
        COUNT(mc.id) AS mesas_disponibles
    FROM slots_validos s
    CROSS JOIN mesas_capaces mc
    WHERE NOT EXISTS (
        -- Verificar si la mesa ya está ocupada en ese horario
        SELECT 1
        FROM reservas r
        WHERE r.mesa_id = mc.id
          AND r.estado IN ('pendiente', 'confirmada')
          -- Lógica de solapamiento: Una reserva dura 1.5 horas
          AND s.slot_tstz < (r.fecha_hora + interval '1.5 hours')
          AND (s.slot_tstz + interval '1.5 hours') > r.fecha_hora
    )
    GROUP BY s.slot_tstz
    ORDER BY s.slot_tstz;
END;
$$;

-- 7. Seed Data
DO $$
DECLARE
    v_gp_id UUID;
    v_cerro_id UUID;
BEGIN
    -- Insertar Sucursales
    INSERT INTO sucursales (nombre, modo_confirmacion) 
    VALUES ('General Paz', 'manual') 
    RETURNING id INTO v_gp_id;

    INSERT INTO sucursales (nombre, modo_confirmacion) 
    VALUES ('Cerro de las Rosas', 'automatico') 
    RETURNING id INTO v_cerro_id;

    -- Insertar Horarios General Paz
    -- Martes a Sábado (2 a 6): 12:00-15:00 y 20:00-00:00
    FOR i IN 2..6 LOOP
        INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_gp_id, i, '12:00', '15:00');
        INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_gp_id, i, '20:00', '00:00');
    END LOOP;
    -- Domingo (0): 12:00-15:00 y 20:30-00:30
    INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_gp_id, 0, '12:00', '15:00');
    INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_gp_id, 0, '20:30', '00:30');

    -- Insertar Horarios Cerro
    -- Martes a Domingo (2..6 y 0): 09:00-00:00
    FOR i IN 2..6 LOOP
        INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_cerro_id, i, '09:00', '00:00');
    END LOOP;
    INSERT INTO horarios_sucursal (sucursal_id, dia_semana, hora_inicio, hora_fin) VALUES (v_cerro_id, 0, '09:00', '00:00');

    -- Insertar Mesas General Paz
    INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES
    (v_gp_id, 1, 'salon', 2),
    (v_gp_id, 2, 'salon', 2),
    (v_gp_id, 3, 'salon', 4),
    (v_gp_id, 4, 'salon', 4),
    (v_gp_id, 5, 'terraza', 4),
    (v_gp_id, 6, 'terraza', 6),
    (v_gp_id, 7, 'privado', 6);

    -- Insertar Mesas Cerro
    INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES
    (v_cerro_id, 1, 'salon', 2),
    (v_cerro_id, 2, 'salon', 4),
    (v_cerro_id, 3, 'salon', 4),
    (v_cerro_id, 4, 'terraza', 2),
    (v_cerro_id, 5, 'terraza', 4),
    (v_cerro_id, 6, 'terraza', 6),
    (v_cerro_id, 7, 'privado', 6);

END $$;
