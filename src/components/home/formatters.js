const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function formatFechaLarga(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${d} ${meses[m - 1]} ${y}`
}

export function saludoSegunHora(date = new Date()) {
  const hora = date.getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function etiquetaRol(rol) {
  if (rol === 'admin') return 'Administración'
  if (rol === 'docente') return 'Cuerpo docente'
  return 'Estudiantado'
}
