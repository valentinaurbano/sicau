import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import DeportesSection from '../components/home/DeportesSection.jsx'

export default function DeportesPublicos() {
  const { user, users, deportes, inscribir } = useStore()
  const [aviso, setAviso] = useState(null)
  const disponibles = deportes.reduce((total, deporte) => total + deporte.cupo - deporte.inscritosIds.length, 0)

  function manejarInscripcion(deporte) {
    if (user?.rol !== 'estudiante') return
    const resultado = inscribir(deporte.id, user.id)
    setAviso({
      error: !resultado.ok,
      texto: resultado.ok
        ? `Tu inscripción en ${deporte.nombre} quedó lista.`
        : resultado.error,
    })
  }

  return (
    <div className="public-page">
      <section className="public-hero" aria-labelledby="deportes-publicos-title">
        <div className="public-hero__copy">
          <p className="public-hero__eyebrow">Deporte y movimiento</p>
          <h1 id="deportes-publicos-title">Tu próxima disciplina <em>te está esperando.</em></h1>
          <p className="public-hero__lead">
            Explora la oferta deportiva del campus, revisa horarios e inicia sesión
            como estudiante para confirmar tu inscripción.
          </p>
          <div className="public-hero__actions">
            <a className="btn gold" href="#catalogo-deportes">Ver deportes</a>
            {!user && <Link className="btn ghost" to="/login">Iniciar sesión como estudiante</Link>}
          </div>
        </div>
        <aside className="public-hero__panel" aria-label="Resumen de la oferta deportiva">
          <small>Oferta disponible</small>
          <div className="public-hero__stats">
            <div className="public-stat">
              <strong>{deportes.length}</strong>
              <span>disciplinas</span>
            </div>
            <div className="public-stat">
              <strong>{Math.max(0, disponibles)}</strong>
              <span>cupos libres</span>
            </div>
          </div>
        </aside>
      </section>

      <div className="public-page__section" id="catalogo-deportes">
        <DeportesSection
          deportes={deportes}
          users={users}
          user={user}
          onInscribir={manejarInscripcion}
          titulo="Elige tu disciplina"
          standalone
        />
      </div>

      {aviso && (
        <div className={`public-notice${aviso.error ? ' is-error' : ''}`} role="status">
          <p>{aviso.texto}</p>
          <button type="button" onClick={() => setAviso(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
