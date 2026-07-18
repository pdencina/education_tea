import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/super-admin";
import { prisma } from "@/lib/db";
import { encode } from "next-auth/jwt";

// POST /api/impersonate - Signs in as another user (super admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isSuperAdmin((session.user as any)?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tenant: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Create a new session token for this user
  const token = await encode({
    token: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
      tenantPlan: user.tenant.plan,
      impersonatedBy: (session.user as any)?.email, // Track who is impersonating
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  // Set the session cookie
  const response = NextResponse.json({
    success: true,
    user: { name: user.name, email: user.email, tenant: user.tenant.name },
  });

  response.cookies.set("next-auth.session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours max for impersonation
  });

  return response;
}
