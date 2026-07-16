import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  centerName: z.string().min(2, "Nombre del centro requerido"),
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este correo ya está registrado" },
        { status: 400 }
      );
    }

    // Create tenant and admin user in a transaction
    const passwordHash = await bcrypt.hash(validated.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      // Create the tenant (center)
      const tenant = await tx.tenant.create({
        data: {
          name: validated.centerName,
        },
      });

      // Create default development areas
      const defaultAreas = [
        { name: "Comunicación", icon: "🗣️", order: 1 },
        { name: "Socialización", icon: "🤝", order: 2 },
        { name: "Autonomía", icon: "🧑‍🦯", order: 3 },
        { name: "Académico", icon: "📚", order: 4 },
        { name: "Sensorial", icon: "🎯", order: 5 },
        { name: "Conducta", icon: "🧠", order: 6 },
        { name: "Motricidad", icon: "🏃", order: 7 },
      ];

      for (const area of defaultAreas) {
        await tx.devArea.create({
          data: { ...area, tenantId: tenant.id },
        });
      }

      // Create the admin user
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: validated.email,
          passwordHash,
          name: validated.name,
          role: "ADMIN",
        },
      });

      return { tenant, user };
    });

    return NextResponse.json(
      { message: "Centro registrado exitosamente", tenantId: result.tenant.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
