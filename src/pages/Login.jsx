import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { rutaInicial } from '../auth/rutas.js'
import { EMAIL_DOMAIN, emailDomainError, isInstitutionalEmail } from '../utils/email.js'

export default function Login() {
  const { login } = useStore()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const deporteId = searchParams.get('deporte')
  const eventoId = searchParams.get('evento')
  const tieneActividadSeleccionada = Boolean(deporteId || eventoId)
  const [correo, setCorreo] = useState('estudiante@uniautonoma.edu.co')
  const [password, setPassword] = useState('estudiante123')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const correoNormalizado = correo.trim().toLowerCase()
    if (!isInstitutionalEmail(correoNormalizado)) {
      setError(emailDomainError())
      return
    }
    const res = login(
      correoNormalizado,
      password,
      tieneActividadSeleccionada ? { rolRequerido: 'estudiante' } : undefined,
    )
    if (!res.ok) {
      setError(res.error)
      return
    }
    if (deporteId) nav(`/registro-estudiante?deporte=${encodeURIComponent(deporteId)}`)
    else if (eventoId) nav(`/registro-estudiante?evento=${encodeURIComponent(eventoId)}`)
    else nav(rutaInicial(res.user))
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1 className="brand">
          Uniautónoma
          <small>DEL CAUCA</small>
        </h1>
        <p style={{ color: 'var(--muted)' }}>Dirección de Bienestar Universitario · Universidad Autónoma del Cauca</p>
        {tieneActividadSeleccionada && (
          <p className="login-card__context">
            Inicia sesión como estudiante para mostrarte el formulario de confirmación.
          </p>
        )}
        <label className="field">
          <span>Correo institucional</span>
          <input
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            type="email"
            required
            placeholder={`usuario@${EMAIL_DOMAIN}`}
            pattern="^[a-zA-Z0-9._%+-]+@uniautonoma\.edu\.co$"
            title={emailDomainError()}
          />
          <small className="hint">Solo se aceptan correos @{EMAIL_DOMAIN}</small>
        </label>
        <label className="field">
          <span>Contraseña</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <p className="err">{error}</p>}
        <button className="btn gold" type="submit" style={{ width: '100%' }}>Ingresar</button>
        <p className="hint" style={{ marginTop: 14, textAlign: 'center' }}>
          Acceso exclusivo para cuentas institucionales habilitadas.
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
          <strong>Credenciales frontend de prueba</strong><br />
          {tieneActividadSeleccionada ? (
            <>estudiante@{EMAIL_DOMAIN} / estudiante123</>
          ) : (
            <>
              admin@{EMAIL_DOMAIN} / admin123<br />
              docente@{EMAIL_DOMAIN} / docente123<br />
              estudiante@{EMAIL_DOMAIN} / estudiante123
            </>
          )}
        </p>
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/">Volver al inicio</Link>
        </p>
      </form>
    </div>
  )
}
