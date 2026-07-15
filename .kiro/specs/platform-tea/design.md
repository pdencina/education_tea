# Diseño Técnico: TEAGest - Plataforma de Gestión para Centros Educativos TEA

#[[file:requirements.md]]

---

## 1. Arquitectura General

### Patrón: Monolito Modular → Microservicios

Comenzamos con un **monolito modular** que permite iterar rápido y desplegar fácil en las primeras fases. La estructura interna está preparada para extraer módulos a microservicios cuando el crecimiento lo justifique.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTES                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │ Web App  │  │ Mobile   │  │ Tablet (Docente)     │   │
│  │ (React)  │  │ (PWA)    │  │ (PWA optimizada)     │   │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘   │
└───────┼──────────────┼───────────────────┼───────────────┘
        │              │                   │
        ▼              ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY / BFF                       │
│              (Next.js API Routes / tRPC)                  │
├─────────────────────────────────────────────────────────┤
│                  CAPA DE APLICACIÓN                       │
│  ┌─────────┐ ┌─────┐ ┌──────┐ ┌───────┐ ┌──────────┐  │
│  │Alumnos  │ │ PEI │ │Sesion│ │Comunic│ │ Reportes │  │
│  │& Exped. │ │     │ │ es   │ │ación  │ │          │  │
│  └─────────┘ └─────┘ └──────┘ └───────┘ └──────────┘  │
│  ┌─────────┐ ┌───────────┐ ┌────────────────────────┐  │
│  │ Equipo  │ │Agenda Vis.│ │ Admin & Configuración  │  │
│  └─────────┘ └───────────┘ └────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                CAPA DE DOMINIO / SERVICIOS               │
│        (Lógica de negocio, validaciones, permisos)       │
├─────────────────────────────────────────────────────────┤
│                 CAPA DE PERSISTENCIA                      │
│  ┌──────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │ PostgreSQL   │  │   Redis    │  │  Object Store  │  │
│  │ (datos)      │  │  (cache/   │  │  (archivos/    │  │
│  │              │  │   sesiones)│  │   media)       │  │
│  └──────────────┘  └────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

### Frontend
| Tecnología | Justificación |
|-----------|---------------|
| **Next.js 14+ (App Router)** | SSR + RSC para rendimiento, SEO en landing, API routes integradas |
| **React 18+** | Ecosistema maduro, componentes reutilizables |
| **TypeScript** | Tipado estricto, menos errores en runtime |
| **Tailwind CSS** | Utilidades, diseño responsive rápido, consistencia visual |
| **shadcn/ui** | Componentes accesibles, personalizables, sin vendor lock-in |
| **TanStack Query** | Cache de datos del servidor, sincronización optimista |
| **React Hook Form + Zod** | Formularios con validación tipada |
| **Recharts** | Gráficos de progreso para dashboards y PEI |
| **dnd-kit** | Drag & drop para agenda visual |
| **next-pwa** | Capacidad offline para registro de sesiones |

### Backend
| Tecnología | Justificación |
|-----------|---------------|
| **Next.js API Routes + tRPC** | Full-stack TypeScript, tipo end-to-end, rápido de desarrollar |
| **Prisma ORM** | Type-safe queries, migraciones, soporte PostgreSQL |
| **PostgreSQL 16** | Relacional robusto, JSON support, Row Level Security para multi-tenancy |
| **Redis** | Cache, sesiones, colas de notificaciones |
| **NextAuth.js (Auth.js)** | Autenticación flexible, soporte para credenciales + OAuth |
| **Resend / Nodemailer** | Envío de emails transaccionales |
| **Uploadthing / S3** | Almacenamiento de archivos y media |
| **BullMQ** | Cola de trabajos (generación de PDFs, notificaciones batch) |

### Infraestructura
| Tecnología | Justificación |
|-----------|---------------|
| **Vercel** (MVP/inicio) | Deploy simple, edge functions, preview deployments |
| **AWS** (escalado) | Migración a ECS/EKS cuando se necesite más control |
| **Supabase** (alternativa) | PostgreSQL managed + Auth + Storage en un paquete |
| **Docker** | Contenedores para desarrollo local y producción |

---

## 3. Modelo de Datos Principal

### Diagrama Entidad-Relación (simplificado)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Tenant     │       │    User      │       │    Role      │
│ (Centro)     │1────N │              │N────1 │              │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ name         │       │ tenantId     │       │ name         │
│ logo         │       │ email        │       │ permissions  │
│ config (JSON)│       │ passwordHash │       └──────────────┘
│ plan         │       │ roleId       │
│ createdAt    │       │ profile (JSON│
└──────────────┘       └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼──────┐     ┌──────▼───────┐
              │  Student   │     │Professional  │
              ├────────────┤     ├──────────────┤
              │ id         │     │ userId       │
              │ tenantId   │     │ specialty    │
              │ code       │     │ license      │
              │ firstName  │     │ schedule(JSON│
              │ lastName   │     └──────────────┘
              │ birthDate  │            │
              │ photo      │            │ N:N
              │ diagnosis  │     ┌──────▼───────┐
              │ supportLvl │     │  Assignment  │
              │ entryDate  │     │ (profesional │
              │ status     │     │  ↔ alumno)   │
              │ groupId    │     └──────────────┘
              │ documents[]│
              └─────┬──────┘
                    │
       ┌────────────┼────────────────┐
       │            │                │
┌──────▼──────┐ ┌───▼────────┐ ┌────▼─────────┐
│     PEI     │ │  Session   │ │  FamilyLink  │
├─────────────┤ ├────────────┤ ├──────────────┤
│ id          │ │ id         │ │ userId       │
│ studentId   │ │ studentId  │ │ studentId    │
│ periodId    │ │ date       │ │ relationship │
│ startDate   │ │ startTime  │ └──────────────┘
│ reviewDate  │ │ endTime    │
│ status      │ │ type       │
└──────┬──────┘ │ activities │
       │        │ behaviors  │
┌──────▼──────┐ │ notes      │
│PEI_Objective│ │ mood       │
├─────────────┤ │ evidence[] │
│ id          │ └────────────┘
│ peiId       │
│ areaId      │     ┌────────────────┐
│ description │     │  VisualSchedule│
│ targetLevel │     ├────────────────┤
│ targetDate  │     │ id             │
│ responsibleId     │ studentId/grpId│
│ status      │     │ date           │
└──────┬──────┘     │ items (JSON[]) │
       │            │ template       │
┌──────▼──────┐     └────────────────┘
│  Progress   │
├─────────────┤     ┌────────────────┐
│ id          │     │   Message      │
│ objectiveId │     ├────────────────┤
│ date        │     │ id             │
│ levelAchieved    │ studentId      │
│ notes       │     │ senderId       │
│ evidence[]  │     │ content        │
│ registeredBy│     │ createdAt      │
└─────────────┘     └────────────────┘
```

### Tablas de Soporte

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Group     │  │   Period     │  │ DevArea      │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ id           │  │ id           │  │ id           │
│ tenantId     │  │ tenantId     │  │ tenantId     │
│ name         │  │ name         │  │ name         │
│ capacity     │  │ startDate    │  │ description  │
│ teacherId    │  │ endDate      │  │ icon         │
│ level        │  │ status       │  │ order        │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│DailyReport   │  │HomeActivity  │
├──────────────┤  ├──────────────┤
│ id           │  │ id           │
│ studentId    │  │ studentId    │
│ date         │  │ objectiveId  │
│ feeding      │  │ title        │
│ rest         │  │ description  │
│ mood         │  │ assignedBy   │
│ participation│  │ completedAt  │
│ highlights   │  │ familyNotes  │
│ sentAt       │  └──────────────┘
└──────────────┘
```

---

## 4. Multi-Tenancy

**Estrategia:** Tenant ID en cada tabla + Row Level Security (RLS) de PostgreSQL.

```sql
-- Ejemplo de política RLS
CREATE POLICY tenant_isolation ON students
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

Cada request inyecta el `tenant_id` del usuario autenticado en la sesión de BD, garantizando aislamiento sin bases de datos separadas.

---

## 5. Autenticación y Autorización

### Flujo de Auth
```
Usuario → Login (email/password) → NextAuth → JWT + Session
                                       ↓
                              Middleware verifica:
                              1. Token válido
                              2. Tenant del usuario
                              3. Rol y permisos
                                       ↓
                              Inyecta tenant_id en contexto
```

### Permisos por Rol (RBAC)
```typescript
const PERMISSIONS = {
  admin: ['*'], // acceso total dentro de su tenant
  coordinator: ['students:read', 'pei:*', 'sessions:read', 'reports:*', 'staff:read'],
  teacher: ['students:read:assigned', 'pei:progress:write', 'sessions:*:own', 'schedule:*', 'messages:write'],
  specialist: ['students:read:assigned', 'pei:read', 'notes:*:own', 'sessions:*:own'],
  family: ['students:read:own', 'pei:progress:read:own', 'messages:*:own', 'activities:read:own']
};
```

---

## 6. Funcionalidad Offline

Para el módulo de registro de sesiones (uso principal en tablet):

```
┌─────────────────────────────────────────┐
│          Service Worker (PWA)            │
│                                         │
│  1. Intercepta requests cuando offline  │
│  2. Guarda en IndexedDB local           │
│  3. Al recuperar conexión → sincroniza  │
│  4. Resolución de conflictos: último    │
│     registro gana (con timestamp)       │
└─────────────────────────────────────────┘
```

---

## 7. Estructura de Carpetas del Proyecto

```
education_tea/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Páginas de login/registro
│   │   ├── (dashboard)/        # Layout principal autenticado
│   │   │   ├── alumnos/        # Gestión de alumnos
│   │   │   ├── pei/            # Plan Educativo Individualizado
│   │   │   ├── sesiones/       # Registro de sesiones
│   │   │   ├── equipo/         # Equipo multidisciplinario
│   │   │   ├── comunicacion/   # Mensajes y reportes a familias
│   │   │   ├── agenda-visual/  # Agenda con pictogramas
│   │   │   ├── reportes/       # Dashboards y reportes PDF
│   │   │   └── configuracion/  # Admin del centro
│   │   ├── api/                # API routes
│   │   │   └── trpc/           # tRPC router
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Formularios reutilizables
│   │   ├── charts/             # Componentes de gráficos
│   │   └── shared/             # Header, Sidebar, etc.
│   ├── lib/
│   │   ├── auth/               # Configuración de autenticación
│   │   ├── db/                 # Prisma client y utilidades
│   │   ├── trpc/               # Configuración tRPC
│   │   ├── validators/         # Schemas Zod
│   │   └── utils/              # Utilidades generales
│   ├── server/
│   │   ├── routers/            # tRPC routers por módulo
│   │   ├── services/           # Lógica de negocio
│   │   └── middleware/         # Middleware de auth/tenant
│   ├── hooks/                  # React hooks custom
│   ├── stores/                 # Estado global (Zustand si necesario)
│   └── types/                  # Tipos TypeScript compartidos
├── prisma/
│   ├── schema.prisma           # Schema de base de datos
│   ├── migrations/             # Migraciones
│   └── seed.ts                 # Datos de prueba
├── public/
│   ├── pictograms/             # Pictogramas ARASAAC cache
│   └── manifest.json           # PWA manifest
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker-compose.yml          # PostgreSQL + Redis local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. API Design (tRPC Routers)

```typescript
// Estructura de routers
const appRouter = router({
  students: studentRouter,      // CRUD alumnos, expedientes
  pei: peiRouter,               // Planes educativos, objetivos, progreso
  sessions: sessionRouter,      // Registro de sesiones
  staff: staffRouter,           // Equipo profesional
  communication: commRouter,    // Mensajes, reportes diarios, actividades casa
  schedule: scheduleRouter,     // Agenda visual
  reports: reportsRouter,       // Generación de reportes y dashboards
  admin: adminRouter,           // Configuración del centro
  auth: authRouter,             // Login, registro, perfiles
});
```

---

## 9. Decisiones de Diseño Clave

| Decisión | Razonamiento |
|----------|-------------|
| Monolito modular (no microservicios) | Velocidad de desarrollo, un solo deploy, equipo pequeño al inicio |
| tRPC sobre REST | Type-safety end-to-end, menos boilerplate, autocompletado en frontend |
| PostgreSQL sobre MongoDB | Datos altamente relacionales (alumno→PEI→objetivos→progreso), integridad referencial importa |
| PWA sobre app nativa | Un solo codebase, instalable, funciona offline, sin pasar por app stores |
| Multi-tenancy con RLS | Más eficiente que BD por tenant, escala hasta miles de centros, un solo schema |
| shadcn/ui sobre Material UI | Más ligero, totalmente customizable, accesible por defecto |
| Pictogramas ARASAAC | Estándar open source usado en educación especial, familiar para profesionales del sector |

---

## 10. Plan de Escalado

```
Fase 1 (MVP): Vercel + Supabase (PostgreSQL + Auth + Storage)
    → 0-50 centros, costo ~$50/mes

Fase 2 (Crecimiento): Vercel Pro + Supabase Pro + Redis Cloud
    → 50-500 centros, costo ~$200-500/mes

Fase 3 (Escala): AWS (ECS + RDS + ElastiCache + S3)
    → 500+ centros, costo según consumo
```
