import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// This endpoint is called by a cron job (Vercel Cron, external service, etc.)
// It finds appointments for tomorrow and sends reminders
// In production, integrate with:
// - WhatsApp Business API (Meta/Twilio): https://developers.facebook.com/docs/whatsapp/cloud-api
// - Email: Resend (resend.com) or similar

export async function GET(request: Request) {
  // Verify cron secret (basic auth)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    // Find all appointments for tomorrow
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: tomorrow, lt: dayAfter },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: {
        student: {
          include: {
            familyLinks: { include: { user: { select: { phone: true, email: true, name: true } } } },
          },
        },
        therapist: { select: { name: true, specialty: true } },
        room: { select: { name: true } },
      },
    });

    const sent: string[] = [];
    const failed: string[] = [];

    for (const appt of appointments) {
      const familyContacts = appt.student.familyLinks.map((fl) => fl.user);

      for (const contact of familyContacts) {
        const message = `Recordatorio: ${appt.student.firstName} tiene cita mañana ${tomorrow.toLocaleDateString("es-CL")} a las ${appt.startTime} con ${appt.therapist.name}${appt.room ? ` en ${appt.room.name}` : ""}. — Centro TEA`;

        // TODO: In production, send via WhatsApp Business API
        // const whatsappResult = await sendWhatsApp(contact.phone, message);

        // TODO: In production, send via email
        // const emailResult = await sendEmail(contact.email, "Recordatorio de cita", message);

        // Log the reminder
        await prisma.reminderLog.create({
          data: {
            tenantId: appt.tenantId,
            type: "APPOINTMENT_24H",
            channel: "whatsapp",
            recipient: contact.phone || contact.email || "unknown",
            studentName: `${appt.student.firstName} ${appt.student.lastName}`,
            message,
            status: "sent", // In production: check actual result
          },
        });

        sent.push(`${appt.student.firstName} → ${contact.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      date: tomorrow.toISOString().split("T")[0],
      appointmentsFound: appointments.length,
      remindersSent: sent.length,
      details: sent,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
