# Tareas de Implementación: TEAGest

#[[file:requirements.md]]
#[[file:design.md]]

---

## Fase 1: Fundación (Semanas 1-3)

### 1.1 Setup del Proyecto
- [ ] Inicializar proyecto Next.js 14 con TypeScript y App Router
- [ ] Configurar Tailwind CSS + shadcn/ui
- [ ] Configurar ESLint + Prettier con reglas del proyecto
- [ ] Configurar docker-compose con PostgreSQL 16 + Redis
- [ ] Configurar Prisma ORM con conexión a PostgreSQL
- [ ] Crear schema.prisma inicial con modelo Tenant y User
- [ ] Configurar tRPC con Next.js App Router
- [ ] Crear .env.example con todas las variables necesarias

### 1.2 Autenticación y Multi-Tenancy
- [ ] Implementar NextAuth.js con proveedor de credenciales (email/password)
- [ ] Crear páginas de login y registro
- [ ] Implementar middleware de autenticación
- [ ] Crear modelo de Tenant (Centro) en Prisma
- [ ] Implementar Row Level Security en PostgreSQL
- [ ] Crear middleware de inyección de tenant_id en contexto tRPC
- [ ] Implementar sistema RBAC con permisos por rol
- [ ] Crear flujo de onboarding: registro de centro → admin → configuración inicial

### 1.3 Layout y Navegación
- [ ] Crear layout principal del dashboard con sidebar responsive
- [ ] Implementar navegación por módulos con iconos
- [ ] Crear componente de header con perfil de usuario y selector de período
- [ ] Implementar breadcrumbs dinámicos
- [ ] Crear página 404 y manejo de errores global
- [ ] Implementar loading states y skeletons

---

## Fase 2: Módulo de Alumnos (Semanas 3-5)

### 2.1 Modelo de Datos
- [ ] Crear modelos Prisma: Student, Group, Period, Document, FamilyLink
- [ ] Crear migración y seed con datos de ejemplo
- [ ] Implementar validadores Zod para Student

### 2.2 Backend (tRPC Router)
- [ ] Crear router `students` con procedimientos: list, getById, create, update, archive
- [ ] Implementar filtros: por grupo, nivel de apoyo, estado, búsqueda por nombre
- [ ] Crear router `groups` con CRUD
- [ ] Implementar subida de documentos y fotos (Uploadthing/S3)
- [ ] Crear procedimiento para vincular familiar con alumno

### 2.3 Frontend
- [ ] Crear página de listado de alumnos con tabla filtrable
- [ ] Crear formulario de registro de nuevo alumno (multi-step)
- [ ] Crear página de detalle/expediente del alumno
- [ ] Crear vista de gestión de grupos
- [ ] Implementar modal de carga de documentos
- [ ] Crear vista de perfil del alumno para familias (con restricciones)

---

## Fase 3: Plan Educativo Individualizado - PEI (Semanas 5-8)

### 3.1 Modelo de Datos
- [ ] Crear modelos Prisma: PEI, PEIObjective, DevArea, Progress, AchievementScale
- [ ] Crear migración con áreas de desarrollo predefinidas
- [ ] Implementar validadores Zod para PEI y objetivos

### 3.2 Backend
- [ ] Crear router `pei` con: create, getByStudent, update, clone (duplicar anterior)
- [ ] Crear router `objectives` con: create, update, delete, reorder
- [ ] Crear router `progress` con: register, listByObjective, listByStudent
- [ ] Implementar lógica de cálculo de % de avance por área
- [ ] Crear endpoint para datos de gráficos de progreso

### 3.3 Frontend
- [ ] Crear página de PEI del alumno con vista por áreas
- [ ] Crear formulario de creación/edición de PEI
- [ ] Crear componente de objetivo con indicador de progreso
- [ ] Crear formulario rápido de registro de avance (optimizado para tablet)
- [ ] Implementar gráficos de evolución con Recharts (líneas por área, barras por objetivo)
- [ ] Crear vista de PEI para familias (simplificada, lenguaje no técnico)
- [ ] Implementar función de duplicar PEI para nuevo período

---

## Fase 4: Registro de Sesiones (Semanas 8-10)

### 4.1 Modelo de Datos
- [ ] Crear modelos Prisma: Session, ActivityCatalog, BehaviorRecord (ACC)
- [ ] Crear catálogo inicial de actividades tipo
- [ ] Implementar validadores Zod

### 4.2 Backend
- [ ] Crear router `sessions` con: create, update, listByStudent, listByProfessional, listByDate
- [ ] Implementar lógica de sesiones grupales (múltiples alumnos)
- [ ] Crear endpoint de calendario con sesiones programadas/realizadas
- [ ] Implementar alertas de sesiones no registradas (cron job)

### 4.3 Frontend
- [ ] Crear formulario de registro de sesión (optimizado para velocidad)
- [ ] Crear vista de calendario semanal/mensual con react-big-calendar o similar
- [ ] Implementar registro de conducta ACC (antecedente-conducta-consecuencia)
- [ ] Crear componente de adjuntar evidencia (foto/video desde tablet)
- [ ] Implementar vista de historial de sesiones por alumno

### 4.4 Funcionalidad Offline
- [ ] Configurar next-pwa con service worker
- [ ] Implementar almacenamiento en IndexedDB para sesiones pendientes
- [ ] Crear indicador visual de modo offline
- [ ] Implementar sincronización al recuperar conexión
- [ ] Manejar conflictos de sincronización

---

## Fase 5: Comunicación con Familias (Semanas 10-12)

### 5.1 Modelo de Datos
- [ ] Crear modelos Prisma: Message, DailyReport, HomeActivity
- [ ] Implementar validadores Zod

### 5.2 Backend
- [ ] Crear router `messages` con: send, listByStudent, markAsRead
- [ ] Crear router `dailyReports` con: create, send, listByStudent
- [ ] Crear router `homeActivities` con: assign, complete, listPending
- [ ] Implementar envío de notificaciones push (Web Push API)
- [ ] Implementar envío de email con resumen (Resend)
- [ ] Crear plantillas de reporte diario configurables

### 5.3 Frontend
- [ ] Crear interfaz de chat por alumno (vista equipo)
- [ ] Crear vista de mensajes para familias
- [ ] Crear formulario de reporte diario con selección rápida (emojis/iconos)
- [ ] Crear vista de actividades para casa (familia puede marcar como hecha)
- [ ] Implementar notificaciones en tiempo real (polling o WebSocket)

---

## Fase 6: Agenda Visual y Equipo (Semanas 12-14)

### 6.1 Agenda Visual
- [ ] Integrar API de ARASAAC para búsqueda de pictogramas
- [ ] Crear modelo Prisma: VisualSchedule, ScheduleTemplate
- [ ] Crear componente de agenda con drag & drop (dnd-kit)
- [ ] Implementar biblioteca de pictogramas con búsqueda
- [ ] Crear plantillas reutilizables por grupo
- [ ] Implementar vista imprimible (CSS print) y vista digital para pantalla en aula

### 6.2 Equipo Multidisciplinario
- [ ] Crear modelos Prisma: Professional, Assignment, ClinicalNote
- [ ] Crear router `staff` con: list, getById, assign, unassign
- [ ] Crear router `clinicalNotes` con: create, listByStudent (con permisos)
- [ ] Crear página de gestión del equipo
- [ ] Crear vista de carga de trabajo por profesional
- [ ] Implementar notas de evolución con visibilidad configurable
- [ ] Crear notificación al equipo por nuevas notas relevantes

---

## Fase 7: Reportes y Dashboard (Semanas 14-16)

### 7.1 Dashboard
- [ ] Crear componentes de KPI cards (objetivos logrados, asistencia, sesiones)
- [ ] Implementar gráficos de dashboard con Recharts
- [ ] Crear filtros globales de período y grupo
- [ ] Implementar comparativa entre períodos
- [ ] Crear vista de dashboard por rol (admin ve todo, docente ve sus alumnos)

### 7.2 Reportes PDF
- [ ] Configurar generación de PDF con @react-pdf/renderer o Puppeteer
- [ ] Crear plantilla de reporte de progreso por alumno
- [ ] Incluir gráficos, datos del PEI, observaciones
- [ ] Implementar personalización con logo del centro
- [ ] Crear cola de generación de reportes masivos (BullMQ)
- [ ] Crear endpoint de descarga de reportes

---

## Fase 8: Administración y Polish (Semanas 16-18)

### 8.1 Administración del Centro
- [ ] Crear página de configuración general (datos del centro, logo)
- [ ] Implementar gestión de períodos académicos
- [ ] Crear CRUD de catálogos configurables (áreas, escalas, tipos de sesión)
- [ ] Implementar gestión de usuarios con invitación por email
- [ ] Crear log de auditoría de accesos y cambios

### 8.2 Calidad y Deploy
- [ ] Escribir tests unitarios para servicios críticos (PEI, progreso, permisos)
- [ ] Escribir tests e2e para flujos principales (Playwright)
- [ ] Optimizar rendimiento: lazy loading, prefetch, image optimization
- [ ] Implementar manejo de errores robusto con Sentry
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Deploy a producción (Vercel + Supabase)
- [ ] Configurar dominio, SSL y emails transaccionales
- [ ] Crear landing page con información del producto y precios

---

## Fase 9: MVP Launch y Feedback (Semanas 18-20)

### 9.1 Beta Testing
- [ ] Reclutar 3-5 centros educativos TEA para beta
- [ ] Crear onboarding guiado para nuevos centros
- [ ] Recopilar feedback y priorizar mejoras
- [ ] Corregir bugs críticos

### 9.2 Lanzamiento
- [ ] Preparar planes de precio (Básico/Profesional/Premium)
- [ ] Implementar sistema de billing (Stripe)
- [ ] Crear documentación de usuario / centro de ayuda
- [ ] Lanzar en redes y comunidades de educación especial

---

## Resumen de Esfuerzo Estimado

| Fase | Duración | Prioridad |
|------|----------|-----------|
| 1. Fundación | 3 semanas | Crítica |
| 2. Alumnos | 2 semanas | Crítica |
| 3. PEI | 3 semanas | Crítica |
| 4. Sesiones | 2 semanas | Alta |
| 5. Comunicación | 2 semanas | Alta |
| 6. Agenda y Equipo | 2 semanas | Media |
| 7. Reportes | 2 semanas | Alta |
| 8. Admin y Polish | 2 semanas | Media |
| 9. Launch | 2 semanas | Alta |
| **Total** | **~20 semanas** | — |

> **Nota:** Con las Fases 1-3 completadas ya tienes un producto usable para validar con centros reales. El MVP mínimo viable son Fases 1-4 (~10 semanas).
