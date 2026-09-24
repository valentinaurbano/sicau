import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import HomeHeader from '../components/home/HomeHeader.jsx'
import EventsCarousel from '../components/home/EventsCarousel.jsx'
import DeportesSection from '../components/home/DeportesSection.jsx'
import EstudianteResumen from '../components/home/EstudianteResumen.jsx'
import '../components/home/home.css'

export default function Home() {
  const { user, users, deportes, eventos, asistencias, inscribir, inscribirEvento } = useStore()
  const location = useLocation()
  const [aviso, setAviso] = useState(() => (
    location.state?.mensaje
      ? { tipo: 'ok', texto: location.state.mensaje }
      : null
  ))
  const esEstudiante = user?.rol === 'estudiante'

  function mostrar(tipo, texto) {
    setAviso({ tipo, texto })
  }

  function participarEvento(evento) {
    if (!esEstudiante) return
    const resultado = inscribirEvento(evento.id, user.id)
    mostrar(resultado.ok ? 'ok' : 'err', resultado.ok ? `Quedaste en ${evento.nombre}.` : resultado.error)
  }

  function inscribirDeporte(deporte) {
    if (!esEstudiante) return
    const resultado = inscribir(deporte.id, user.id)
    mostrar(
      resultado.ok ? 'ok' : 'err',
      resultado.ok ? `Tu inscripción en ${deporte.nombre} quedó lista.` : resultado.error,
    )
  }

  return (
    <div className="home">
      <HomeHeader user={user} deportes={deportes} />
      <DeportesSection
        deportes={deportes}
        users={users}
        user={user}
        onInscribir={inscribirDeporte}
      />
      {esEstudiante && (
        <EstudianteResumen user={user} deportes={deportes} asistencias={asistencias} />
      )}
      <EventsCarousel eventos={eventos} user={user} onParticipar={participarEvento} />

      {aviso && (
        <div className="modal-bg" onClick={() => setAviso(null)}>
          <div
            className={`modal ${aviso.tipo === 'err' ? 'danger-box' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="home-notice-title">
              {aviso.tipo === 'err' ? 'No se pudo completar' : '¡Listo!'}
            </h2>
            <p>{aviso.texto}</p>
            <button className="btn primary" onClick={() => setAviso(null)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  )
}
