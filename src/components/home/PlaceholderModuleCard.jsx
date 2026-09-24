export default function PlaceholderModuleCard({ modulo }) {
  return (
    <article className="placeholder-card" style={{ '--blob': modulo.blob }}>
      <span className="badge-soon">{modulo.estado}</span>
      <h3>{modulo.titulo}</h3>
      <p>{modulo.resumen}</p>
    </article>
  )
}
