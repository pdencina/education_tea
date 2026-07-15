# Requerimientos: Plataforma de Gestión Integral para Centros Educativos TEA

## Visión del Producto

**TEAGest** es una plataforma SaaS diseñada para centros educativos que atienden niños y jóvenes con Trastorno del Espectro Autista (TEA). Unifica la gestión administrativa, pedagógica y terapéutica en un solo sistema, reemplazando el papel, WhatsApp y hojas de cálculo con una solución profesional, medible y colaborativa.

## Usuarios del Sistema

| Rol | Descripción |
|-----|-------------|
| **Administrador del Centro** | Gestiona el centro, configuración general, facturación, reportes institucionales |
| **Coordinador Pedagógico** | Diseña planes educativos, supervisa docentes, revisa avances globales |
| **Docente / Terapeuta** | Ejecuta sesiones, registra avances, documenta conductas |
| **Especialista** | Psicólogo, fonoaudiólogo, terapeuta ocupacional — registra evaluaciones y seguimiento |
| **Familiar / Tutor** | Consulta avances de su hijo, recibe tareas para casa, se comunica con el equipo |

---

## Módulos y Historias de Usuario

### Módulo 1: Gestión de Alumnos y Expedientes

**HU-1.1** Como administrador, quiero registrar nuevos alumnos con sus datos personales, diagnóstico, nivel de apoyo (1, 2, 3 DSM-5), y documentación adjunta, para tener un expediente digital completo.

**Criterios de aceptación:**
- Formulario con campos: nombre, fecha de nacimiento, foto, diagnóstico, nivel de apoyo, fecha de ingreso, contacto de emergencia, documentos adjuntos (PDF/imagen)
- Validación de campos obligatorios
- Generación automática de código de alumno
- Historial de cambios en el expediente

**HU-1.2** Como coordinador, quiero ver un listado filtrable de todos los alumnos activos con su nivel de apoyo y grupo asignado, para gestionar la distribución.

**Criterios de aceptación:**
- Lista con filtros por: nivel de apoyo, grupo, edad, estado (activo/egresado/baja)
- Búsqueda por nombre o código
- Vista rápida con foto, nombre, grupo y nivel

**HU-1.3** Como familiar, quiero acceder al perfil de mi hijo y ver su información básica y equipo asignado.

**Criterios de aceptación:**
- Acceso restringido solo al perfil del hijo vinculado
- Visualización de datos generales (no clínicos sensibles)
- Lista de profesionales asignados con rol

---

### Módulo 2: Plan Educativo Individualizado (PEI)

**HU-2.1** Como coordinador, quiero crear un PEI para cada alumno con objetivos organizados por áreas de desarrollo, para estructurar su proceso educativo.

**Criterios de aceptación:**
- Áreas predefinidas configurables: Comunicación, Socialización, Autonomía, Académico, Sensorial, Conducta, Motricidad
- Cada objetivo tiene: descripción, nivel de logro esperado, fecha meta, responsable
- El PEI tiene fecha de inicio, fecha de revisión y estado (vigente/en revisión/cerrado)
- Se puede duplicar un PEI anterior como base para el siguiente período

**HU-2.2** Como docente, quiero registrar avances en los objetivos del PEI de mis alumnos después de cada sesión, para documentar el progreso.

**Criterios de aceptación:**
- Selección rápida de alumno y objetivo
- Registro con: fecha, nivel de logro alcanzado (escala configurable: no iniciado, en proceso, logrado con apoyo, logrado independiente), observaciones, evidencia opcional (foto/video)
- Guardado rápido para registrar varios objetivos en secuencia

**HU-2.3** Como familiar, quiero ver el progreso de mi hijo en cada área del PEI con gráficos visuales, para entender su evolución.

**Criterios de aceptación:**
- Gráfico de barras/líneas por área mostrando evolución temporal
- Indicador visual de porcentaje de objetivos logrados por área
- Explicación en lenguaje sencillo (no técnico) de cada nivel de logro

---

### Módulo 3: Registro de Sesiones y Actividades

**HU-3.1** Como docente, quiero registrar cada sesión de trabajo con un alumno indicando actividades realizadas, conductas observadas y nivel de participación, para tener un historial detallado.

**Criterios de aceptación:**
- Campos: fecha, hora inicio/fin, alumno(s), tipo de sesión (individual/grupal), actividades realizadas (selección múltiple de catálogo + texto libre), conductas observadas, estado emocional, nivel de participación
- Registro de incidentes conductuales con antecedente-conducta-consecuencia (ACC)
- Adjuntar evidencia multimedia

**HU-3.2** Como coordinador, quiero ver un calendario con todas las sesiones programadas y realizadas, para supervisar la actividad del centro.

**Criterios de aceptación:**
- Vista calendario semanal/mensual
- Filtros por docente, alumno, tipo de sesión
- Indicador visual de sesiones completadas vs programadas
- Alertas de sesiones no registradas

---

### Módulo 4: Equipo Multidisciplinario

**HU-4.1** Como administrador, quiero registrar al personal del centro con su especialidad, horario y alumnos asignados, para organizar la cobertura.

**Criterios de aceptación:**
- Perfil profesional: nombre, especialidad, cédula/matrícula profesional, horario, foto
- Asignación de alumnos a cada profesional
- Vista de carga de trabajo (número de alumnos por profesional)

**HU-4.2** Como especialista, quiero dejar notas de evolución visibles para el equipo del alumno, para mantener comunicación interdisciplinaria.

**Criterios de aceptación:**
- Notas vinculadas al expediente del alumno
- Visibilidad configurable: solo equipo del alumno, todo el equipo, incluir familia
- Notificación al equipo cuando se agrega una nota relevante

---

### Módulo 5: Comunicación con Familias

**HU-5.1** Como docente, quiero enviar un resumen diario/semanal a la familia sobre cómo estuvo su hijo, para mantenerlos informados.

**Criterios de aceptación:**
- Plantilla configurable de resumen (pictogramas + texto)
- Selección rápida de estado: alimentación, sueño/descanso, humor, participación, logros del día
- Envío por notificación push y/o email
- Historial de resúmenes enviados

**HU-5.2** Como familiar, quiero enviar mensajes al equipo de mi hijo y recibir respuestas, para tener comunicación bidireccional.

**Criterios de aceptación:**
- Chat por alumno (no personal) visible para todo su equipo
- El familiar solo ve su hilo
- Notificaciones de nuevos mensajes
- No reemplaza emergencias (indicador claro de que no es canal de urgencia)

**HU-5.3** Como familiar, quiero recibir actividades sugeridas para reforzar en casa, para apoyar el proceso de mi hijo.

**Criterios de aceptación:**
- El docente asigna actividades del catálogo o personalizadas
- La familia puede marcar como "realizada" con comentario opcional
- Vinculadas a objetivos del PEI

---

### Módulo 6: Agenda Visual

**HU-6.1** Como docente, quiero crear una agenda visual diaria para cada alumno o grupo con pictogramas, para anticipar las actividades del día.

**Criterios de aceptación:**
- Biblioteca de pictogramas (compatible con ARASAAC)
- Arrastrar y soltar para crear secuencia
- Plantillas reutilizables por grupo
- Vista imprimible y vista digital (tablet/pantalla en aula)

---

### Módulo 7: Reportes e Indicadores

**HU-7.1** Como administrador, quiero generar reportes de progreso por alumno para entregar a familias y autoridades educativas, en formato PDF profesional.

**Criterios de aceptación:**
- Reporte configurable con: datos del alumno, período, objetivos PEI y avances, gráficos, observaciones generales, recomendaciones
- Logo del centro y formato institucional
- Exportación a PDF

**HU-7.2** Como coordinador, quiero ver dashboards con indicadores globales del centro: porcentaje de objetivos logrados, asistencia, sesiones realizadas, para tomar decisiones.

**Criterios de aceptación:**
- Dashboard con KPIs: % objetivos PEI logrados, tasa de asistencia, sesiones realizadas/programadas, alumnos por nivel de apoyo
- Filtros por período, grupo, área
- Comparativa entre períodos

---

### Módulo 8: Administración y Configuración

**HU-8.1** Como administrador, quiero gestionar los datos del centro, períodos académicos, grupos y configuraciones generales.

**Criterios de aceptación:**
- Datos del centro: nombre, logo, dirección, contacto
- Períodos académicos con fechas de inicio/fin
- Creación de grupos con capacidad y docente asignado
- Catálogos configurables: áreas de desarrollo, escalas de logro, tipos de sesión

**HU-8.2** Como administrador, quiero gestionar usuarios y roles con permisos diferenciados.

**Criterios de aceptación:**
- CRUD de usuarios con asignación de rol
- Invitación por email
- Vinculación de familiar con alumno específico
- Auditoría de accesos

---

## Requerimientos No Funcionales

| Categoría | Requisito |
|-----------|-----------|
| **Seguridad** | Datos sensibles de menores: cifrado en reposo y tránsito (AES-256, TLS 1.3). Autenticación con MFA opcional. Cumplimiento con ley de protección de datos de menores. |
| **Disponibilidad** | 99.5% uptime. Funcionalidad offline para registro de sesiones (sincronización posterior). |
| **Rendimiento** | Carga de página < 2s. Soporte para centros de hasta 200 alumnos sin degradación. |
| **Accesibilidad** | WCAG 2.1 AA. Soporte para lectores de pantalla. Alto contraste configurable. |
| **Multi-tenancy** | Cada centro es un tenant aislado. Los datos no se cruzan entre centros. |
| **Idioma** | Español (Latinoamérica y España). Preparado para i18n futura. |
| **Responsive** | Funcional en desktop, tablet y móvil. La app del docente optimizada para tablet. |
| **Integraciones futuras** | API REST para integración con sistemas de gobierno, ARASAAC (pictogramas), calendarios externos. |
