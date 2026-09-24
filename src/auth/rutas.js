export function rutaInicial(user) {
  if (!user) return '/'
  if (user.rol === 'admin' || user.rol === 'docente' || user.rol === 'estudiante') return '/inicio'
  return '/'
}
