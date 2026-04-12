DO $$
DECLARE
    v_sucursal RECORD;
    v_numero_mesa INT;
BEGIN
    -- 1. Actualizar el modo de confirmación de TODAS las sucursales a 'manual'
    UPDATE sucursales SET modo_confirmacion = 'manual';

    -- 2. Eliminar las mesas existentes 
    -- (Nota: Esto también eliminará reservas asociadas si las hubiera, gracias al ON DELETE CASCADE)
    DELETE FROM mesas;

    -- 3. Iterar sobre cada sucursal existente para insertar las 25 mesas correspondientes
    FOR v_sucursal IN SELECT id, nombre FROM sucursales LOOP
        v_numero_mesa := 1;
        
        -- === ZONA: SALÓN (15 mesas) ===
        -- 8 mesas de 4
        FOR i IN 1..8 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'salon', 4); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- 4 mesas de 6
        FOR i IN 1..4 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'salon', 6); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- 3 mesas de 2
        FOR i IN 1..3 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'salon', 2); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- === ZONA: TERRAZA (7 mesas) ===
        -- 4 mesas de 4
        FOR i IN 1..4 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'terraza', 4); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- 1 mesa de 6
        FOR i IN 1..1 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'terraza', 6); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- 2 mesas de 2
        FOR i IN 1..2 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'terraza', 2); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
        -- === ZONA: PRIVADO (3 mesas) ===
        -- 3 mesas de 4
        FOR i IN 1..3 LOOP 
            INSERT INTO mesas (sucursal_id, numero_mesa, zona, capacidad) VALUES (v_sucursal.id, v_numero_mesa, 'privado', 4); 
            v_numero_mesa := v_numero_mesa + 1; 
        END LOOP;
        
    END LOOP;
END $$;
