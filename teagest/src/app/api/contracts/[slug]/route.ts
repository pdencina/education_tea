import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const contract = await prisma.contract.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      title: true,
      content: true,
      plan: true,
      modalidad: true,
      precio: true,
      firmanteName: true,
      firmanteRut: true,
      firmaDigital: true,
      firmadoAt: true,
      status: true,
    },
  });

  if (!contract) {
    return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
  }

  return NextResponse.json(contract);
}
