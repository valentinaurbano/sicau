import { useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import HomeHeader from '../components/home/HomeHeader.jsx'
import EventsCarousel from '../components/home/EventsCarousel.jsx'
import DeportesSection from '../components/home/DeportesSection.jsx'
import PlaceholderModules from '../components/home/PlaceholderModules.jsx'
import EstudianteResumen from '../components/home/EstudianteResumen.jsx'
import '../components/home/home.css'

export default function Home() {
  const { user, users, deportes, eventos, asistencias, inscribir, inscribirEvento } = useStore()
  const [aviso, setAviso] = useState(null)
  const esEstudiante = user?.rol === 'estudiante'

  function mostrar(tipo, texto) {
    setAviso({ tipo, texto })
  }

  function participarEvento(evento) {
    if (!esEstudiante) return
    const r = inscribirEvento(evento.id, user.id)
    mostrar(r.ok ? 'ok' : 'err', r.ok ? `Quedaste en ${evento.nombre}.` : r.error)
  }

  function inscribirDeporte(deporte) {
    if (!esEstudiante) return
    const r = inscribir(deporte.id, user.id)
    mostrar(r.ok ? 'ok' : 'err', r.ok ? `Inscripción lista en ${deporte.nombre}.` : r.error)
  }

  return (
    <div className="home">
      <HomeHeader user={user} />
      <EventsCarousel eventos={eventos} user={user} onParticipar={participarEvento} />
      <DeportesSection deportes={deportes} users={users} user={user} onInscribir={inscribirDeporte} />
      {esEstudiante && (
        <EstudianteResumen user={user} deportes={deportes} asistencias={asistencias} />
      )}
      <PlaceholderModules />

      {aviso && (
        <div className="modal-bg" onClick={() => setAviso(null)}>
          <div
            className={`modal ${aviso.tipo === 'err' ? 'danger-box' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{aviso.tipo === 'err' ? 'No se pudo completar' : 'Listo'}</h2>
            <p>{aviso.texto}</p>
            <button className="btn primary" onClick={() => setAviso(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
