import { createContext, useContext, useMemo, useState } from 'react'
import { emailDomainError, isInstitutionalEmail } from '../utils/email.js'

const StoreContext = createContext(null)

const seedUsers = [
  { id: 'a1', nombre: 'Laura Admin', correo: 'admin@uniautonoma.edu.co', password: 'admin123', rol: 'admin' },
  { id: 'p1', nombre: 'Carlos Pérez', correo: 'docente@uniautonoma.edu.co', password: 'docente123', rol: 'docente', especialidad: 'Fútbol' },
  { id: 'p2', nombre: 'Ana Gómez', correo: 'ana.docente@uniautonoma.edu.co', password: 'docente123', rol: 'docente', especialidad: 'Voleibol' },
  { id: 'e1', nombre: 'Juan Estudiante', correo: 'estudiante@uniautonoma.edu.co', password: 'estudiante123', rol: 'estudiante', categoria: 'Pregrado', documento: '1001' },
  { id: 'e2', nombre: 'María López', correo: 'maria@uniautonoma.edu.co', password: 'est123', rol: 'estudiante', categoria: 'Postgrado', documento: '1002' },
  { id: 'e3', nombre: 'Pedro Ruiz', correo: 'pedro@uniautonoma.edu.co', password: 'est123', rol: 'estudiante', categoria: 'Egresado', documento: '1003' },
]

const seedDeportes = [
  {
    id: 'd1',
    nombre: 'Fútbol 11',
    descripcion: 'Entrenamiento táctico y partido interno.',
    cupo: 22,
    categorias: ['Pregrado', 'Postgrado'],
    imagen: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    inscritosIds: ['e2'],
    horarios: [{ id: 'h1', dia: 'Lunes', inicio: '16:00', fin: '18:00', lugar: 'Cancha norte', docenteId: 'p1' }],
  },
  {
    id: 'd2',
    nombre: 'Voleibol',
    descripcion: 'Técnica de saque, recepción y juego colectivo.',
    cupo: 14,
    categorias: ['Pregrado', 'Postgrado', 'Egresado'],
    imagen: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    inscritosIds: ['e1'],
    horarios: [{ id: 'h2', dia: 'Martes', inicio: '17:00', fin: '19:00', lugar: 'Coliseo', docenteId: 'p2' }],
  },
  {
    id: 'd3',
    nombre: 'Natación',
    descripcion: 'Resistencia y técnica de crol. Solo posgrado y egresados.',
    cupo: 10,
    categorias: ['Postgrado', 'Egresado'],
    imagen: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    inscritosIds: [],
    horarios: [{ id: 'h3', dia: 'Jueves', inicio: '06:00', fin: '07:30', lugar: 'Piscina', docenteId: 'p1' }],
  },
]

const seedEventos = [
  { id: 'ev1', nombre: 'Torneo relámpago', fecha: '2026-10-12', lugar: 'Cancha norte', tipo: 'Torneo', cupo: 32, inscritosIds: [] },
  { id: 'ev2', nombre: 'Masterclass de yoga', fecha: '2026-10-04', lugar: 'Gimnasio', tipo: 'Masterclass', cupo: 20, inscritosIds: ['e1'] },
]

function overlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

function uid(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`
}

export function StoreProvider({ children }) {
  const [users, setUsers] = useState(seedUsers)
  const [deportes, setDeportes] = useState(seedDeportes)
  const [eventos, setEventos] = useState(seedEventos)
  const [alertas, setAlertas] = useState([
    { id: 'al1', titulo: 'Inicio de inscripciones', mensaje: 'Ya puedes inscribirte al catálogo 2026-2.', audiencia: 'Todos' },
  ])
  const [asistencias, setAsistencias] = useState([])
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sicau-user')) || null
    } catch {
      return null
    }
  })
  const [periodoCerrado, setPeriodoCerrado] = useState(false)

  function persist(u) {
    setUser(u)
    if (u) localStorage.setItem('sicau-user', JSON.stringify(u))
    else localStorage.removeItem('sicau-user')
  }

  function login(correo, password) {
    if (!isInstitutionalEmail(correo)) return { ok: false, error: emailDomainError() }
    const found = users.find((u) => u.correo === correo && u.password === password)
    if (!found) return { ok: false, error: 'Credenciales inválidas' }
    const { password: _, ...safe } = found
    persist(safe)
    return { ok: true }
  }

  function logout() {
    persist(null)
  }

  function saveDeporte(payload) {
    if (payload.id) {
      setDeportes((list) => list.map((d) => (d.id === payload.id ? { ...d, ...payload } : d)))
      return payload.id
    }
    const id = uid('d')
    setDeportes((list) => [...list, { inscritosIds: [], horarios: [], categorias: [], cupo: 20, ...payload, id }])
    return id
  }

  function deleteDeporte(id) {
    setDeportes((list) => list.filter((d) => d.id !== id))
  }

  function addHorario(deporteId, horario) {
    const conflict = deportes.some((d) =>
      d.horarios.some(
        (h) => h.lugar === horario.lugar && h.dia === horario.dia && overlap(h.inicio, h.fin, horario.inicio, horario.fin),
      ),
    )
    if (conflict) return { ok: false, error: 'Conflicto de espacio físico en ese horario.' }
    setDeportes((list) =>
      list.map((d) => (d.id === deporteId ? { ...d, horarios: [...d.horarios, { ...horario, id: uid('h') }] } : d)),
    )
    return { ok: true }
  }

  function asignarDocente(deporteId, horarioId, docenteId) {
    const target = deportes.find((d) => d.id === deporteId)?.horarios.find((h) => h.id === horarioId)
    if (!target) return { ok: false, error: 'Horario no encontrado' }
    const busy = deportes.some((d) =>
      d.horarios.some(
        (h) =>
          h.docenteId === docenteId &&
          h.dia === target.dia &&
          overlap(h.inicio, h.fin, target.inicio, target.fin) &&
          h.id !== horarioId,
      ),
    )
    if (busy) return { ok: false, error: 'El docente ya tiene un grupo en ese bloque.' }
    setDeportes((list) =>
      list.map((d) =>
        d.id === deporteId
          ? { ...d, horarios: d.horarios.map((h) => (h.id === horarioId ? { ...h, docenteId } : h)) }
          : d,
      ),
    )
    return { ok: true }
  }

  function inscribir(deporteId, estudianteId, { forzar = false } = {}) {
    const deporte = deportes.find((d) => d.id === deporteId)
    const est = users.find((u) => u.id === estudianteId)
    if (!deporte || !est) return { ok: false, error: 'Datos no encontrados' }
    if (deporte.inscritosIds.includes(estudianteId)) return { ok: false, error: 'Ya está inscrito.' }
    if (!forzar) {
      if (deporte.inscritosIds.length >= deporte.cupo) return { ok: false, error: 'No hay cupos disponibles.' }
      if (!deporte.categorias.includes(est.categoria)) {
        return { ok: false, error: `Tu categoría (${est.categoria}) no puede inscribirse en este deporte.` }
      }
      const misHorarios = deportes
        .filter((d) => d.inscritosIds.includes(estudianteId))
        .flatMap((d) => d.horarios)
      const cruce = deporte.horarios.some((h) =>
        misHorarios.some((m) => m.dia === h.dia && overlap(m.inicio, m.fin, h.inicio, h.fin)),
      )
      if (cruce) return { ok: false, error: 'Cruce de horarios con otro deporte inscrito.' }
    }
    setDeportes((list) =>
      list.map((d) => (d.id === deporteId ? { ...d, inscritosIds: [...d.inscritosIds, estudianteId] } : d)),
    )
    return { ok: true }
  }

  function retirar(deporteId, estudianteId, { admin = false } = {}) {
    if (!admin && periodoCerrado) return { ok: false, error: 'El periodo de retiro ya cerró (mitad de semestre).' }
    setDeportes((list) =>
      list.map((d) =>
        d.id === deporteId ? { ...d, inscritosIds: d.inscritosIds.filter((id) => id !== estudianteId) } : d,
      ),
    )
    return { ok: true }
  }

  function saveEvento(payload) {
    if (payload.id) {
      setEventos((list) => list.map((e) => (e.id === payload.id ? { ...e, ...payload } : e)))
      return
    }
    setEventos((list) => [...list, { inscritosIds: [], ...payload, id: uid('ev') }])
  }

  function inscribirEvento(eventoId, estudianteId) {
    const ev = eventos.find((e) => e.id === eventoId)
    if (!ev) return { ok: false, error: 'Evento no encontrado' }
    if (ev.inscritosIds.length >= ev.cupo) return { ok: false, error: 'Evento sin cupos.' }
    if (ev.inscritosIds.includes(estudianteId)) return { ok: false, error: 'Ya participas.' }
    setEventos((list) =>
      list.map((e) => (e.id === eventoId ? { ...e, inscritosIds: [...e.inscritosIds, estudianteId] } : e)),
    )
    return { ok: true }
  }

  function saveUser(payload) {
    if (!isInstitutionalEmail(payload.correo)) {
      return { ok: false, error: emailDomainError() }
    }
    if (users.some((u) => u.correo === payload.correo && u.id !== payload.id)) {
      return { ok: false, error: 'El correo ya existe (409).' }
    }
    if (payload.id) {
      setUsers((list) => list.map((u) => (u.id === payload.id ? { ...u, ...payload } : u)))
      return { ok: true }
    }
    setUsers((list) => [...list, { ...payload, id: uid('u'), password: payload.password || 'temporal123' }])
    return { ok: true }
  }

  function importDocentesCsv(text) {
    const lines = text.trim().split(/\r?\n/).slice(1)
    const nuevos = lines
      .map((line) => line.split(',').map((s) => s.trim()))
      .filter((cols) => cols[0] && isInstitutionalEmail(cols[1]))
      .map(([nombre, correo, especialidad]) => ({
        id: uid('p'),
        nombre,
        correo,
        especialidad,
        rol: 'docente',
        password: 'docente123',
      }))
    setUsers((list) => [...list, ...nuevos])
  }

  function addAlerta(alerta) {
    setAlertas((list) => [{ ...alerta, id: uid('al') }, ...list])
  }

  function guardarAsistencia(deporteId, fecha, registros) {
    const existing = asistencias.find((a) => a.deporteId === deporteId && a.fecha === fecha)
    if (existing) {
      const hours = (Date.now() - new Date(existing.createdAt).getTime()) / 36e5
      if (hours > 24) return { ok: false, error: 'Han pasado más de 24 horas; no se puede editar.' }
      setAsistencias((list) =>
        list.map((a) => (a.id === existing.id ? { ...a, registros } : a)),
      )
      return { ok: true }
    }
    setAsistencias((list) => [
      ...list,
      { id: uid('as'), deporteId, fecha, registros, createdAt: new Date().toISOString() },
    ])
    return { ok: true }
  }

  const value = useMemo(
    () => ({
      user,
      users,
      deportes,
      eventos,
      alertas,
      asistencias,
      periodoCerrado,
      setPeriodoCerrado,
      login,
      logout,
      saveDeporte,
      deleteDeporte,
      addHorario,
      asignarDocente,
      inscribir,
      retirar,
      saveEvento,
      inscribirEvento,
      saveUser,
      importDocentesCsv,
      addAlerta,
      guardarAsistencia,
    }),
    [user, users, deportes, eventos, alertas, asistencias, periodoCerrado],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore fuera de provider')
  return ctx
}
