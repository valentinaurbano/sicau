import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeporteCard from './DeporteCard.jsx'

export default function DeportesSection({ deportes, users, user, onInscribir }) {
  const [disciplina, setDisciplina] = useState('Todas')

  const nombres = useMemo(
    () => ['Todas', ...deportes.map((d) => d.nombre)],
    [deportes],
  )

  const filtrados = useMemo(
    () => (disciplina === 'Todas' ? deportes : deportes.filter((d) => d.nombre === disciplina)),
    [deportes, disciplina],
  )

  // El destacado es el que todavía tiene más aire en el cupo.
  const destacado = useMemo(() => {
    if (filtrados.length === 0) return null
    return [...filtrados].sort(
      (a, b) => (b.cupo - b.inscritosIds.length) - (a.cupo - a.inscritosIds.length),
    )[0]
  }, [filtrados])

  const resto = filtrados.filter((d) => d.id !== destacado?.id)

  return (
    <section className="home-section" aria-labelledby="modulo-deportes">
      <div className="deportes-band">
        <div className="home-section__head">
          <div>
            <h2 id="modulo-deportes">Deportes</h2>
            <p>Disciplinas, horarios reales e inscripción según tu rol. Este módulo sí está vivo.</p>
          </div>
          {user.rol === 'estudiante' && (
            <Link className="btn ghost" to="/estudiante/catalogo">Catálogo completo</Link>
          )}
          {user.rol === 'admin' && (
            <Link className="btn ghost" to="/admin/deportes">Panel de deportes</Link>
          )}
        </div>

        <div className="disciplina-row" role="tablist" aria-label="Filtrar disciplinas">
          {nombres.map((nombre) => (
            <button
              key={nombre}
              type="button"
              className={`disciplina ${disciplina === nombre ? 'is-on' : ''}`}
              onClick={() => setDisciplina(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>

        {destacado && (
          <DeporteCard
            deporte={destacado}
            users={users}
            user={user}
            onInscribir={onInscribir}
          />
        )}

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
      </div>
    </section>
  )
}
