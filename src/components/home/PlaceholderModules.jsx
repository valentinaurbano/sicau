import PlaceholderBanner from './PlaceholderBanner.jsx'
import PlaceholderModuleCard from './PlaceholderModuleCard.jsx'
import { MODULOS_PROXIMOS } from './modulosProximos.js'

export default function PlaceholderModules() {
  return (
    <section className="home-section" aria-labelledby="modulos-proximos">
      <div className="home-section__head home-section__head--tight">
        <div>
          <h2 id="modulos-proximos">Otras áreas de bienestar</h2>
          <p>Cuatro puertas abiertas en el mapa; el interior se construye después.</p>
        </div>
      </div>
      <PlaceholderBanner />
      <div className="placeholder-grid">
        {MODULOS_PROXIMOS.map((modulo) => (
          <PlaceholderModuleCard key={modulo.id} modulo={modulo} />
        ))}
      </div>
    </section>
  )
}
