# Uniautónoma · Frontend (React + Vite)

Sistema de Gestión Deportiva de la Universidad Autónoma del Cauca (Uniautónoma). Solo frontend, con datos simulados (sin backend).

## Cómo ejecutar

```bash
cd todo
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Cuentas de prueba

Los correos deben usar el dominio institucional `@uniautonoma.edu.co`.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@uniautonoma.edu.co | admin123 |
| Docente | docente@uniautonoma.edu.co | docente123 |
| Estudiante (pregrado) | estudiante@uniautonoma.edu.co | estudiante123 |

## Qué incluye

- Login y rutas protegidas por rol
- Admin: dashboard, CRUD deportes/eventos, usuarios, comunicados
- Docente: clases de hoy, listado, asistencia
- Estudiante: catálogo, inscripción, eventos, horario, retiro
