import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { formatFechaLarga } from '../components/home/formatters.js'

export default function RegistroEstudiante() {
  const {
    user,
    deportes,
    eventos,
    inscribir,
    inscribirEvento,
  } = useStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [aceptado, setAceptado] = useState(false)
  const [error, setError] = useState('')

  const deporteId = searchParams.get('deporte')
  const eventoId = searchParams.get('evento')
  const deporte = deportes.find((item) => item.id === deporteId)
  const evento = eventos.find((item) => item.id === eventoId)
  const seleccionInvalida = Boolean((deporteId && !deporte) || (eventoId && !evento))
  const sinSeleccion = !deporteId && !eventoId
  const lleno = Boolean(
    (deporte && deporte.inscritosIds.length >= deporte.cupo)
    || (evento && evento.inscritosIds.length >= evento.cupo),
  )
  const categoriaInvalida = Boolean(deporte && user.categoria && !deporte.categorias.includes(user.categoria))
  const yaRegistrado = Boolean(
    (deporte && deporte.inscritosIds.includes(user.id))
    || (evento && evento.inscritosIds.includes(user.id)),
  )

  function confirmar() {
    setError('')
    if (!aceptado) {
      setError('Confirma que revisaste la información de la actividad.')
      return
    }

    const resultado = deporte
      ? inscribir(deporte.id, user.id)
      : inscribirEvento(evento.id, user.id)

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    const mensaje = deporte
      ? `¡Inscripción completa! Ya formas parte de ${deporte.nombre}.`
      : `¡Participación confirmada! Tu registro en ${evento.nombre} quedó listo.`

    navigate('/inicio', { state: { mensaje } })
  }

  if (sinSeleccion || seleccionInvalida) {
    return (
      <div className="public-page registration-page">
        <section className="areas-intro" aria-labelledby="sin-seleccion-title">
          <p className="page-eyebrow">Inscripción deportiva</p>
          <h1 id="sin-seleccion-title">
            {seleccionInvalida ? 'La actividad ya no está disponible.' : 'Elige una disciplina para continuar.'}
          </h1>
          <p>
            {seleccionInvalida
              ? 'Vuelve al catálogo para consultar la oferta sporting vigente.'
              : 'Selecciona el deporte o evento que deseas confirmar desde el catálogo.'}
          </p>
          <div className="registration-actions">
            <Link className="btn primary" to="/estudiante/catalogo">Ir al catálogo</Link>
            <Link className="btn ghost" to="/inicio">Volver al inicio</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="public-page registration-page">
      <div className="registration-wrap">
        <aside className="registration-aside">
          <div className="registration-selection">
            {deporte?.imagen && <img className="registration-selection__image" src={deporte.imagen} alt="" />}
            <div className="registration-selection__label">
              <small>Tu selección</small>
              <strong>{deporte?.nombre || evento?.nombre}</strong>
            </div>
          </div>
          <dl className="registration-selection__details">
            {deporte && (
              <>
                <div>
                  <dt>Horario</dt>
                  <dd>{deporte.horarios.map((h) => `${h.dia} ${h.inicio}–${h.fin} · ${h.lugar}`).join(' | ')}</dd>
                </div>
                <div>
                  <dt>Categorías habilitadas</dt>
                  <dd>{deporte.categorias.join(', ')}</dd>
                </div>
              </>
            )}
            {evento && (
              <>
                <div>
                  <dt>Fecha y lugar</dt>
                  <dd>{formatFechaLarga(evento.fecha)} · {evento.lugar}</dd>
                </div>
                <div>
                  <dt>Tipo de evento</dt>
                  <dd>{evento.tipo}</dd>
                </div>
              </>
            )}
          </dl>
          <p className="registration-aside__note">
            La confirmación reservará tu cupo dentro de esta demostración frontend.
          </p>
        </aside>

        <section className="registration-card" aria-labelledby="registration-title">
          <div className="registration-card__heading">
            <h2 id="registration-title">
              {deporte ? 'Confirmar inscripción' : 'Confirmar participación'}
            </h2>
            <p>Revisa tus datos institucionales y confirma la actividad.</p>
          </div>

          <form
            className="registration-form"
            onSubmit={(event) => {
              event.preventDefault()
              confirmar()
            }}
          >
            <label className="field field--wide">
              <span>Nombre</span>
              <input type="text" value={user.nombre} readOnly />
            </label>
            <label className="field">
              <span>Correo institucional</span>
              <input type="email" value={user.correo} readOnly />
            </label>
            <label className="field">
              <span>Documento</span>
              <input type="text" value={user.documento || 'No registrado'} readOnly />
            </label>
            <label className="field field--wide">
              <span>Categoría estudiantil</span>
              <input type="text" value={user.categoria || 'No registrada'} readOnly />
            </label>

            {categoriaInvalida && (
              <p className="registration-warning" role="alert">
                Tu categoría no está habilitada para esta disciplina. Inicia sesión con una cuenta de la categoría indicada en el catálogo.
              </p>
            )}
            {lleno && (
              <p className="registration-warning" role="alert">Esta actividad no tiene cupos disponibles.</p>
            )}
            {yaRegistrado && (
              <p className="registration-success" role="status">Tu inscripción ya está registrada.</p>
            )}
            {error && <p className="registration-error" role="alert">{error}</p>}

            <label className="registration-check">
              <input
                type="checkbox"
                checked={aceptado}
                onChange={(event) => setAceptado(event.target.checked)}
              />
              <span>Confirmo que revisé el horario, el lugar y los datos de la actividad.</span>
            </label>

            <button
              className="btn primary"
              type="submit"
              disabled={lleno || categoriaInvalida || yaRegistrado}
            >
              {deporte ? 'Confirmar mi inscripción' : 'Confirmar mi participación'}
            </button>
          </form>

          <p className="hint" style={{ marginTop: '1rem', textAlign: 'center' }}>
            ¿Quieres cambiar la actividad? <Link to="/estudiante/catalogo">Volver al catálogo</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
