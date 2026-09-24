import { Link, useParams } from 'react-router-dom'
import { MODULOS_PROXIMOS } from '../components/home/modulosProximos.js'

export default function Areas() {
  const { areaId } = useParams()
  const area = MODULOS_PROXIMOS.find((item) => item.id === areaId)

  if (area) {
    return (
      <div className="public-page">
        <section
          className="area-detail"
          style={{ '--area-color': area.blob }}
          aria-labelledby="area-detail-title"
        >
          <p className="page-eyebrow">Área de bienestar</p>
          <span className="badge-soon">{area.estado}</span>
          <h1 id="area-detail-title">{area.titulo}</h1>
          <p className="area-detail__lead">{area.resumen}</p>
          <div className="area-detail__meta">
            <span className="chip">Experiencias universitarias</span>
            <span className="chip">Acompañamiento cercano</span>
          </div>
          <div className="area-detail__actions">
            <Link className="btn primary" to="/areas">Ver todas las áreas</Link>
            <Link className="btn ghost" to="/">Volver al inicio</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="public-page">
      <section className="areas-intro" aria-labelledby="areas-title">
        <p className="page-eyebrow">Áreas de bienestar</p>
        <h1 id="areas-title">Una puerta, distintas formas de bienestar.</h1>
        <p>
          Deportes y eventos ya están disponibles. Estas áreasforallan el mapa de
          bienestar de la Uniautónoma y se activarán por etapas.
        </p>
      </section>

      <div className="areas-grid">
        {MODULOS_PROXIMOS.map((area, index) => (
          <Link
            className="area-card"
            key={area.id}
            to={`/areas/${area.id}`}
            style={{ '--area-color': area.blob }}
          >
            <span className="area-card__index">ÁREA 0{index + 1}</span>
            <h2>{area.titulo}</h2>
            <p>{area.resumen}</p>
            <div className="area-card__footer">
              <span className="badge-soon">{area.estado}</span>
              <span aria-hidden="true">Conocer más →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
