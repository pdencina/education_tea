"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isModuleAllowed } from "@/lib/plans";

// This component wraps gated pages and redirects if plan doesn't allow access
// Usage: wrap your page content with <PlanGate module="/evaluaciones">...</PlanGate>

interface PlanGateProps {
  module: string;
  plan?: string; // Current tenant plan (passed from session or fetched)
  children: React.ReactNode;
}

export function PlanGate({ module, plan, children }: PlanGateProps) {
  const router = useRouter();

  useEffect(() => {
    // If plan is "basic" and module is gated, redirect to upgrade
    if (plan && !isModuleAllowed(plan, module)) {
      router.replace(`/upgrade?module=${encodeURIComponent(module)}`);
    }
  }, [plan, module, router]);

  // If no plan info yet (loading), show content (will redirect on next render if needed)
  // If plan allows, show content
  if (!plan || isModuleAllowed(plan, module)) {
    return <>{children}</>;
  }

  // Redirecting...
  return null;
}
