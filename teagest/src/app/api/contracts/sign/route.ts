import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, firmanteName, firmanteRut, firmanteEmail, firmaData, consentimiento } = body;

    // Validations
    if (!slug || !firmanteName || !firmanteRut || !firmaData) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (!consentimiento) {
      return NextResponse.json({ error: "Debe aceptar el consentimiento" }, { status: 400 });
    }

    // Find contract
    const contract = await prisma.contract.findUnique({ where: { slug } });
    if (!contract) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }
    if (contract.status === "SIGNED") {
      return NextResponse.json({ error: "Este contrato ya fue firmado" }, { status: 400 });
    }

    // Generate SHA-256 hash
    const firmaHash = createHash("sha256").update(firmaData).digest("hex");
    const timestamp = new Date().toISOString();

    // Capture audit info
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "desconocida";
    const userAgent = request.headers.get("user-agent") || "desconocido";

    const auditoria = {
      firmante: { nombre: firmanteName, rut: firmanteRut, email: firmanteEmail },
      timestamp,
      ip: ip.split(",")[0].trim(),
      user_agent: userAgent,
      firma_hash: firmaHash,
      consentimiento_aceptado: true,
      metodo: "firma_electronica_simple",
      ley: "Ley 19.799 Chile",
    };

    // Update contract
    await prisma.contract.update({
      where: { slug },
      data: {
        firmanteName,
        firmanteRut,
        firmanteEmail,
        firmaDigital: firmaData,
        firmadoAt: new Date(),
        auditoriaFirma: auditoria,
        status: "SIGNED",
      },
    });

    return NextResponse.json({
      ok: true,
      evidencia: { timestamp, firma_hash: firmaHash },
    });
  } catch (error) {
    console.error("Sign error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
