import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { rutaInicial } from '../auth/rutas.js'
import { EMAIL_DOMAIN, emailDomainError, isInstitutionalEmail } from '../utils/email.js'

export default function Login() {
  const { login } = useStore()
  const nav = useNavigate()
  const [correo, setCorreo] = useState('estudiante@uniautonoma.edu.co')
  const [password, setPassword] = useState('estudiante123')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    if (!isInstitutionalEmail(correo)) {
      setError(emailDomainError())
      return
    }
    const res = login(correo, password)
    if (!res.ok) setError(res.error)
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
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
          admin@{EMAIL_DOMAIN} / admin123<br />
          docente@{EMAIL_DOMAIN} / docente123<br />
          estudiante@{EMAIL_DOMAIN} / estudiante123
        </p>
        <p style={{ marginTop: 12 }}>
          <Link to="/">Volver al inicio</Link>
        </p>
      </form>
    </div>
  )
}
