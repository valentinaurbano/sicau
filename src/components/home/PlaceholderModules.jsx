import PlaceholderModuleCard from './PlaceholderModuleCard.jsx'
import { MODULOS_PROXIMOS } from './modulosProximos.js'

export default function PlaceholderModules() {
  return (
    <section className="home-section" aria-labelledby="modulos-proximos">
      <div className="home-section__head home-section__head--tight">
        <div>
          <h2 id="modulos-proximos">Otras áreas de bienestar</h2>
          <p>Cascarón a propósito: el diseño ya está, el contenido llega con cada módulo.</p>
        </div>
      </div>
      <div className="placeholder-grid">
        {MODULOS_PROXIMOS.map((modulo) => (
          <PlaceholderModuleCard key={modulo.id} modulo={modulo} />
        ))}
      </div>
    </section>
  )
}
