import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando datos de ejemplo...");

  // 1. Crear Tenant (Centro)
  const tenant = await prisma.tenant.create({
    data: {
      name: "Centro Educativo Arcoíris",
      email: "contacto@centroarcoiris.com",
      phone: "+52 55 1234 5678",
      address: "Av. Reforma 123, Ciudad de México",
      plan: "professional",
    },
  });
  console.log("✅ Centro creado:", tenant.name);

  // 2. Crear áreas de desarrollo
  const areas = await Promise.all([
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Comunicación", icon: "🗣️", order: 1 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Socialización", icon: "🤝", order: 2 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Autonomía", icon: "🧑‍🦯", order: 3 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Académico", icon: "📚", order: 4 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Sensorial", icon: "🎯", order: 5 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Conducta", icon: "🧠", order: 6 } }),
    prisma.devArea.create({ data: { tenantId: tenant.id, name: "Motricidad", icon: "🏃", order: 7 } }),
  ]);
  console.log("✅ Áreas de desarrollo creadas:", areas.length);

  // 3. Crear período académico
  const period = await prisma.period.create({
    data: {
      tenantId: tenant.id,
      name: "Marzo - Julio 2026",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-07-31"),
      isActive: true,
    },
  });
  console.log("✅ Período creado:", period.name);

  // 4. Crear grupos
  const groupA = await prisma.group.create({
    data: { tenantId: tenant.id, name: "Grupo A (4-6 años)", capacity: 6, level: "preescolar" },
  });
  const groupB = await prisma.group.create({
    data: { tenantId: tenant.id, name: "Grupo B (7-9 años)", capacity: 8, level: "primaria_baja" },
  });
  const groupC = await prisma.group.create({
    data: { tenantId: tenant.id, name: "Grupo C (10-12 años)", capacity: 8, level: "primaria_alta" },
  });
  console.log("✅ Grupos creados: 3");

  // 5. Crear usuarios
  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "admin@centroarcoiris.com",
      passwordHash,
      name: "María Rodríguez",
      role: "ADMIN",
    },
  });

  const coordinator = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "coordinacion@centroarcoiris.com",
      passwordHash,
      name: "Laura Campos",
      role: "COORDINATOR",
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "ana.garcia@centroarcoiris.com",
      passwordHash,
      name: "Ana García",
      role: "TEACHER",
      specialty: "Educación Especial",
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "carlos.lopez@centroarcoiris.com",
      passwordHash,
      name: "Carlos López",
      role: "TEACHER",
      specialty: "Terapia Ocupacional",
    },
  });

  const specialist = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "dr.perez@centroarcoiris.com",
      passwordHash,
      name: "Dr. Daniel Pérez",
      role: "SPECIALIST",
      specialty: "Psicología Infantil",
      license: "PSI-2024-1234",
    },
  });

  const familyUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: "familia.sanchez@gmail.com",
      passwordHash,
      name: "Roberto Sánchez",
      role: "FAMILY",
    },
  });

  console.log("✅ Usuarios creados: 6");

  // 6. Crear alumnos
  const student1 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0001",
      firstName: "Mateo",
      lastName: "Sánchez",
      birthDate: new Date("2020-03-15"),
      diagnosis: "TEA - Trastorno del Espectro Autista",
      supportLevel: "LEVEL_2",
      groupId: groupA.id,
      entryDate: new Date("2024-08-01"),
      notes: "Buena respuesta a apoyos visuales. Interés especial en dinosaurios.",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0002",
      firstName: "Valentina",
      lastName: "Rojas",
      birthDate: new Date("2021-07-22"),
      diagnosis: "TEA - Nivel 2 de apoyo",
      supportLevel: "LEVEL_2",
      groupId: groupA.id,
      entryDate: new Date("2025-01-15"),
      notes: "Comunicación con pictogramas PECS. Progreso en señalización.",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0003",
      firstName: "Santiago",
      lastName: "Díaz",
      birthDate: new Date("2018-11-08"),
      diagnosis: "TEA - Nivel 3 de apoyo con discapacidad intelectual asociada",
      supportLevel: "LEVEL_3",
      groupId: groupB.id,
      entryDate: new Date("2023-03-01"),
      notes: "Requiere apoyo 1:1. Sensibilidad auditiva significativa.",
    },
  });

  const student4 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0004",
      firstName: "Lucas",
      lastName: "Martínez",
      birthDate: new Date("2016-05-30"),
      diagnosis: "TEA - Nivel 1 de apoyo (anteriormente Asperger)",
      supportLevel: "LEVEL_1",
      groupId: groupC.id,
      entryDate: new Date("2022-08-01"),
      notes: "Alto funcionamiento. Dificultades en interacción social con pares. Interés en matemáticas y programación.",
    },
  });

  const student5 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0005",
      firstName: "Isabella",
      lastName: "Torres",
      birthDate: new Date("2019-01-12"),
      diagnosis: "TEA - Nivel 2 con TDAH comórbido",
      supportLevel: "LEVEL_2",
      groupId: groupB.id,
      entryDate: new Date("2024-02-01"),
      notes: "Necesita estructura clara. Muy visual. Buena motricidad gruesa.",
    },
  });

  const student6 = await prisma.student.create({
    data: {
      tenantId: tenant.id,
      code: "ALU-0006",
      firstName: "Emiliano",
      lastName: "Vargas",
      birthDate: new Date("2017-09-04"),
      diagnosis: "TEA - Nivel 1 de apoyo",
      supportLevel: "LEVEL_1",
      groupId: groupC.id,
      entryDate: new Date("2023-08-01"),
      notes: "Buen lenguaje expresivo. Dificultad en comprensión de sarcasmo y doble sentido.",
    },
  });

  console.log("✅ Alumnos creados: 6");

  // 7. Crear asignaciones profesional-alumno
  await prisma.assignment.createMany({
    data: [
      { userId: teacher1.id, studentId: student1.id },
      { userId: teacher1.id, studentId: student2.id },
      { userId: specialist.id, studentId: student1.id },
      { userId: teacher2.id, studentId: student3.id },
      { userId: specialist.id, studentId: student3.id },
      { userId: teacher1.id, studentId: student4.id },
      { userId: teacher2.id, studentId: student5.id },
      { userId: specialist.id, studentId: student5.id },
      { userId: coordinator.id, studentId: student6.id },
    ],
  });
  console.log("✅ Asignaciones profesional-alumno creadas: 9");

  // 8. Vincular familia
  await prisma.familyLink.create({
    data: {
      userId: familyUser.id,
      studentId: student1.id,
      relationship: "Padre",
    },
  });
  console.log("✅ Vínculo familiar creado");

  // 9. Crear PEI con objetivos para Mateo
  const pei = await prisma.pEI.create({
    data: {
      studentId: student1.id,
      periodId: period.id,
      startDate: new Date("2026-03-01"),
      reviewDate: new Date("2026-07-15"),
      status: "ACTIVE",
      notes: "PEI enfocado en comunicación funcional y autonomía básica.",
    },
  });

  await prisma.pEIObjective.createMany({
    data: [
      {
        peiId: pei.id,
        areaId: areas[0].id, // Comunicación
        description: "Solicitar objetos usando pictogramas de forma espontánea",
        targetLevel: "ACHIEVED_INDEPENDENT",
        currentStatus: "ACHIEVED_INDEPENDENT",
        targetDate: new Date("2026-05-01"),
        responsibleId: teacher1.id,
        order: 1,
      },
      {
        peiId: pei.id,
        areaId: areas[0].id, // Comunicación
        description: "Saludar espontáneamente a adultos conocidos",
        targetLevel: "ACHIEVED_INDEPENDENT",
        currentStatus: "ACHIEVED_WITH_SUPPORT",
        targetDate: new Date("2026-04-15"),
        responsibleId: teacher1.id,
        order: 2,
      },
      {
        peiId: pei.id,
        areaId: areas[0].id, // Comunicación
        description: "Expresar emociones básicas verbalmente (contento, triste, enojado)",
        targetLevel: "ACHIEVED_WITH_SUPPORT",
        currentStatus: "IN_PROGRESS",
        targetDate: new Date("2026-07-01"),
        responsibleId: specialist.id,
        order: 3,
      },
      {
        peiId: pei.id,
        areaId: areas[2].id, // Autonomía
        description: "Lavarse las manos siguiendo secuencia visual de 5 pasos",
        targetLevel: "ACHIEVED_INDEPENDENT",
        currentStatus: "ACHIEVED_INDEPENDENT",
        targetDate: new Date("2026-04-01"),
        responsibleId: coordinator.id,
        order: 1,
      },
      {
        peiId: pei.id,
        areaId: areas[2].id, // Autonomía
        description: "Guardar su mochila y materiales al llegar al centro",
        targetLevel: "ACHIEVED_INDEPENDENT",
        currentStatus: "IN_PROGRESS",
        targetDate: new Date("2026-06-01"),
        responsibleId: coordinator.id,
        order: 2,
      },
      {
        peiId: pei.id,
        areaId: areas[2].id, // Autonomía
        description: "Ir al baño de forma autónoma (secuencia completa)",
        targetLevel: "ACHIEVED_INDEPENDENT",
        currentStatus: "NOT_STARTED",
        targetDate: new Date("2026-07-15"),
        responsibleId: coordinator.id,
        order: 3,
      },
      {
        peiId: pei.id,
        areaId: areas[1].id, // Socialización
        description: "Participar en juego paralelo con un compañero durante 5 minutos",
        targetLevel: "ACHIEVED_WITH_SUPPORT",
        currentStatus: "IN_PROGRESS",
        targetDate: new Date("2026-06-01"),
        responsibleId: teacher1.id,
        order: 1,
      },
      {
        peiId: pei.id,
        areaId: areas[1].id, // Socialización
        description: "Esperar turno en actividades grupales (con apoyo visual)",
        targetLevel: "ACHIEVED_WITH_SUPPORT",
        currentStatus: "NOT_STARTED",
        targetDate: new Date("2026-07-01"),
        responsibleId: teacher1.id,
        order: 2,
      },
    ],
  });
  console.log("✅ PEI con 8 objetivos creado para Mateo");

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📧 Credenciales de acceso:");
  console.log("   Admin: admin@centroarcoiris.com / password123");
  console.log("   Coordinadora: coordinacion@centroarcoiris.com / password123");
  console.log("   Docente: ana.garcia@centroarcoiris.com / password123");
  console.log("   Familia: familia.sanchez@gmail.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
