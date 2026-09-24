import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeporteCard from './DeporteCard.jsx'

export default function DeportesSection({
  deportes,
  users,
  user,
  onInscribir,
  titulo = 'Deportes que te mueven',
  standalone = false,
}) {
  const [disciplina, setDisciplina] = useState('Todas')

  const nombres = useMemo(
    () => ['Todas', ...deportes.map((deporte) => deporte.nombre)],
    [deportes],
  )

  const filtrados = useMemo(
    () => (disciplina === 'Todas' ? deportes : deportes.filter((deporte) => deporte.nombre === disciplina)),
    [deportes, disciplina],
  )

  const destacado = useMemo(() => {
    if (filtrados.length === 0) return null
    return [...filtrados].sort(
      (a, b) => (b.cupo - b.inscritosIds.length) - (a.cupo - a.inscritosIds.length),
    )[0]
  }, [filtrados])

  const resto = filtrados.filter((deporte) => deporte.id !== destacado?.id)

  return (
    <section className="home-section" id="deportes" aria-labelledby="modulo-deportes">
      <div className="deportes-band">
        <div className="home-section__head">
          <div>
            <span className="home-section__eyebrow">Deporte y movimiento</span>
            <h2 id="modulo-deportes">{titulo}</h2>
            <p>
              {user?.rol === 'estudiante'
                ? 'Consulta los horarios disponibles e inscríbete según tu categoría y disponibilidad.'
                : 'Descubre la oferta deportiva del campus. Elige una disciplina e inicia sesión como estudiante para inscribirte.'}
            </p>
          </div>
          {!standalone && user?.rol === 'estudiante' && (
            <Link className="btn ghost" to="/estudiante/catalogo">Ver catálogo completo</Link>
          )}
          {!standalone && user?.rol === 'admin' && (
            <Link className="btn ghost" to="/admin/deportes">Panel de deportes</Link>
          )}
          {!standalone && !user && (
            <Link className="btn ghost" to="/deportes">Explorar todos</Link>
          )}
        </div>

        {nombres.length > 1 && (
          <div className="disciplina-row" role="group" aria-label="Filtrar disciplinas">
            {nombres.map((nombre) => (
              <button
                key={nombre}
                type="button"
                className={`disciplina ${disciplina === nombre ? 'is-on' : ''}`}
                aria-pressed={disciplina === nombre}
                onClick={() => setDisciplina(nombre)}
              >
                {nombre}
              </button>
            ))}
          </div>
        )}

        {destacado ? (
          <>
            <DeporteCard
              deporte={destacado}
              users={users}
              user={user}
              onInscribir={onInscribir}
            />
            {resto.length > 0 && (
              <div className="deporte-grid">
                {resto.map((deporte) => (
                  <DeporteCard
                    key={deporte.id}
                    compact
                    deporte={deporte}
                    users={users}
                    user={user}
                    onInscribir={onInscribir}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="public-empty">No hay deportes disponibles con este filtro.</p>
        )}
      </div>
    </section>
  )
}
