import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { reserva_id, action } = await req.json()

    // 1. Fetch reserva details including branch name and table zone
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*, sucursales(nombre), mesas(zona)')
      .eq('id', reserva_id)
      .single()

    if (error || !reserva) {
      throw new Error('Reserva no encontrada')
    }

    const sucursalNombre = reserva.sucursales.nombre
    const direccion = sucursalNombre.toLowerCase().includes('cerro') 
      ? 'Av. Rafael Núñez 4005, Cerro de las Rosas' 
      : 'Viamonte 45, General Paz'
    
    // Format date and time
    const dateObj = new Date(reserva.fecha_hora)
    const fechaStr = dateObj.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const horaStr = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    // Email Configuration
    const adminEmail = 'admin@sanpietro.com' // Cambiar por el email real del administrador
    const fromEmail = 'San Pietro <reservas@tudominio.com>' // Cambiar por tu dominio verificado en Resend

    let clientSubject = ''
    let clientHtml = ''
    let adminSubject = ''
    let adminHtml = ''

    // Premium Italian Restaurant Email Styling
    const baseStyles = `
      body { background-color: #1a1a1a; color: #f5f2ed; font-family: Arial, sans-serif; padding: 40px 20px; margin: 0; }
      .container { max-width: 500px; margin: 0 auto; background-color: #262626; border: 1px solid rgba(212,175,55,0.3); padding: 40px; text-align: center; }
      .logo { font-family: Georgia, serif; color: #d4af37; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 30px; }
      h1 { font-family: Georgia, serif; color: #f5f2ed; font-weight: normal; font-size: 20px; margin-bottom: 10px; }
      p { color: #a3a3a3; line-height: 1.6; font-size: 14px; }
      .details { text-align: left; margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(212,175,55,0.2); }
      .details p { margin: 8px 0; color: #d4d4d4; font-size: 14px; }
      .details strong { color: #d4af37; font-weight: normal; font-family: Georgia, serif; letter-spacing: 1px; font-size: 13px; text-transform: uppercase; display: inline-block; width: 120px; }
      .footer { margin-top: 40px; font-size: 12px; color: #737373; }
    `

    const detailsHtml = `
      <div class="details">
        <p><strong>Sucursal:</strong> ${sucursalNombre}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Fecha:</strong> <span style="text-transform: capitalize;">${fechaStr}</span></p>
        <p><strong>Hora:</strong> ${horaStr}</p>
        <p><strong>Zona:</strong> <span style="text-transform: capitalize;">${reserva.mesas?.zona || 'Salón'}</span></p>
        <p><strong>Comensales:</strong> ${reserva.personas_totales} (${reserva.personas_sin_tacc} Sin TACC)</p>
        <p><strong>A nombre de:</strong> ${reserva.cliente_nombre}</p>
        ${reserva.observaciones ? `<p><strong>Observaciones:</strong> ${reserva.observaciones}</p>` : ''}
      </div>
      <div class="footer">
        San Pietro Ristorante<br>
        La vera cucina italiana
      </div>
    `

    // 2. Determine Email Content based on Action and Status
    if (action === 'create') {
      if (reserva.estado === 'confirmada') {
        // AUTOMATIC MODE
        clientSubject = 'Reserva Confirmada - San Pietro'
        clientHtml = `
          <html><head><style>${baseStyles}</style></head><body><div class="container">
            <div class="logo">San Pietro</div>
            <h1>Reserva Confirmada</h1>
            <p>Estimado/a ${reserva.cliente_nombre}, su mesa ha sido confirmada exitosamente. Lo esperamos para disfrutar de una experiencia única.</p>
            ${detailsHtml}
          </div></body></html>
        `
        adminSubject = `Nueva Reserva Confirmada - ${sucursalNombre}`
        adminHtml = `
          <html><head><style>${baseStyles}</style></head><body><div class="container">
            <div class="logo">San Pietro Admin</div>
            <h1>Nueva Reserva (Automática)</h1>
            <p>Se ha registrado una nueva reserva confirmada automáticamente en el sistema.</p>
            ${detailsHtml}
          </div></body></html>
        `
      } else {
        // MANUAL MODE
        clientSubject = 'Solicitud de Reserva Recibida - San Pietro'
        clientHtml = `
          <html><head><style>${baseStyles}</style></head><body><div class="container">
            <div class="logo">San Pietro</div>
            <h1>Solicitud Recibida</h1>
            <p>Estimado/a ${reserva.cliente_nombre}, hemos recibido su solicitud de reserva. Nuestro equipo la revisará y le enviaremos la confirmación definitiva a la brevedad.</p>
            ${detailsHtml}
          </div></body></html>
        `
        adminSubject = `NUEVA RESERVA PENDIENTE - ${sucursalNombre}`
        adminHtml = `
          <html><head><style>${baseStyles}</style></head><body><div class="container">
            <div class="logo">San Pietro Admin</div>
            <h1>Nueva Reserva Pendiente</h1>
            <p>Por favor, ingrese al panel de administración para confirmar o rechazar esta solicitud.</p>
            ${detailsHtml}
          </div></body></html>
        `
      }
    } else if (action === 'confirm') {
      // ADMIN CONFIRMED
      clientSubject = 'Reserva Confirmada - San Pietro'
      clientHtml = `
        <html><head><style>${baseStyles}</style></head><body><div class="container">
          <div class="logo">San Pietro</div>
          <h1>Reserva Confirmada</h1>
          <p>Estimado/a ${reserva.cliente_nombre}, nos complace informarle que su solicitud de reserva ha sido confirmada.</p>
          ${detailsHtml}
        </div></body></html>
      `
    } else if (action === 'reject') {
      // ADMIN REJECTED
      clientSubject = 'Actualización sobre su solicitud de reserva - San Pietro'
      clientHtml = `
        <html><head><style>${baseStyles}</style></head><body><div class="container">
          <div class="logo">San Pietro</div>
          <h1>Disponibilidad Agotada</h1>
          <p>Estimado/a ${reserva.cliente_nombre}, lamentamos informarle que no contamos con disponibilidad para los detalles solicitados. Lo invitamos a intentar con otro horario o en nuestra otra sucursal.</p>
          ${detailsHtml}
        </div></body></html>
      `
    }

    const emailsToSend = []

    // 3. Send Emails via Resend API
    if (clientHtml) {
      emailsToSend.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: reserva.cliente_email,
            subject: clientSubject,
            html: clientHtml
          })
        })
      )
    }

    if (adminHtml) {
      emailsToSend.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: adminEmail,
            subject: adminSubject,
            html: adminHtml
          })
        })
      )
    }

    await Promise.all(emailsToSend)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
