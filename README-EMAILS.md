# Configuración de Emails con Resend y Supabase Edge Functions

Para mantener la seguridad de tu API Key de Resend (y no exponerla en el código frontend de React), hemos implementado el envío de emails utilizando **Supabase Edge Functions**.

Sigue estos pasos para desplegar la función y configurar tu entorno:

## 1. Instalar Supabase CLI
Si aún no tienes la herramienta de línea de comandos de Supabase, instálala:

**Mac/Linux (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Windows (Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

*(O consulta la [documentación oficial](https://supabase.com/docs/guides/cli) para otros métodos).*

## 2. Iniciar sesión en Supabase CLI
Abre tu terminal y ejecuta:
```bash
supabase login
```
Te pedirá un Access Token que puedes generar en tu panel de Supabase (Account > Access Tokens).

## 3. Vincular tu proyecto
Vincula tu repositorio local con tu proyecto de Supabase usando el ID de tu proyecto (lo encuentras en la URL de tu panel de Supabase, ej: `ocfyoxyuhqlrfigcvagn`):
```bash
supabase link --project-ref ocfyoxyuhqlrfigcvagn
```

## 4. Configurar la variable de entorno de Resend
Necesitas guardar tu API Key de Resend como un "secreto" en Supabase para que la Edge Function pueda usarla de forma segura.

Ejecuta este comando reemplazando `re_123456789...` por tu API Key real de Resend:
```bash
supabase secrets set RESEND_API_KEY=re_123456789...
```

## 5. Desplegar la Edge Function
Finalmente, sube la función a Supabase:
```bash
supabase functions deploy send-email
```

---

## Notas Importantes sobre Resend
1. **Dominio Verificado:** Para enviar correos a cualquier dirección, necesitas verificar tu propio dominio en Resend (ej. `tudominio.com`). Si usas el dominio de prueba de Resend (`onboarding@resend.dev`), **solo podrás enviar correos a la dirección de email con la que te registraste en Resend**.
2. **Personalización:** Si necesitas cambiar el email del administrador o el email de origen ("From"), edita las variables `adminEmail` y `fromEmail` en el archivo `supabase/functions/send-email/index.ts` y vuelve a ejecutar el comando de deploy (Paso 5).
