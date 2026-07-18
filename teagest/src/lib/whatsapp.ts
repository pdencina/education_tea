// WhatsApp link generator (wa.me)
// Generates pre-filled WhatsApp messages that open in a new tab

/**
 * Formats a phone number for WhatsApp (removes spaces, dashes, adds country code)
 * Assumes Chilean numbers if no country code
 */
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/[^0-9+]/g, "");

  // If starts with +, remove it (wa.me doesn't need it)
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);

  // If starts with 56 (Chile), keep as is
  if (cleaned.startsWith("56")) return cleaned;

  // If starts with 9 and is 9 digits, add Chile code
  if (cleaned.startsWith("9") && cleaned.length === 9) return `56${cleaned}`;

  // Otherwise return as is
  return cleaned;
}

/**
 * Generates a WhatsApp link with a pre-filled message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// === MESSAGE TEMPLATES ===

export function appointmentReminderMessage(data: {
  parentName: string;
  childName: string;
  date: string;
  time: string;
  therapist: string;
  centerName?: string;
}): string {
  return `Hola ${data.parentName}, le recordamos que ${data.childName} tiene cita ${data.date} a las ${data.time} con ${data.therapist}.${data.centerName ? ` — ${data.centerName}` : ""}\n\nPor favor confirme su asistencia respondiendo este mensaje.`;
}

export function noShowMessage(data: {
  parentName: string;
  childName: string;
  date: string;
  centerName?: string;
}): string {
  return `Hola ${data.parentName}, notamos que ${data.childName} no asistió a su cita del ${data.date}. ¿Está todo bien? Nos gustaría reagendar.${data.centerName ? `\n— ${data.centerName}` : ""}`;
}

export function paymentReminderMessage(data: {
  parentName: string;
  amount: string;
  description: string;
  dueDate: string;
  centerName?: string;
}): string {
  return `Hola ${data.parentName}, le recordamos que tiene un pago pendiente:\n\n📋 ${data.description}\n💰 ${data.amount}\n📅 Vencimiento: ${data.dueDate}\n\n¿Necesita información para realizar la transferencia?${data.centerName ? `\n— ${data.centerName}` : ""}`;
}

export function welcomeMessage(data: {
  parentName: string;
  childName: string;
  centerName: string;
}): string {
  return `Hola ${data.parentName}, bienvenido/a a ${data.centerName}. ${data.childName} ha sido inscrito/a exitosamente. Pronto nos comunicaremos para agendar la primera sesión.\n\n¿Tiene alguna consulta?`;
}

export function customMessage(text: string): string {
  return text;
}
