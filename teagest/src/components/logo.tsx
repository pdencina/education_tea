// TEAGest Logo - Concepto 3: Comunidad
// Niño al centro (coral), equipo protector (teal), arco de conexión

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      {/* Arco protector inferior */}
      <path d="M12 33c3 4 6.5 6 12 6s9-2 12-6" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />

      {/* Persona izquierda (profesional) */}
      <circle cx="15" cy="22" r="3" fill="#0f766e" />
      <path d="M15 25c0 0 2.5 2.5 5 3.5" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />

      {/* Persona derecha (profesional/familia) */}
      <circle cx="33" cy="22" r="3" fill="#0f766e" />
      <path d="M33 25c0 0-2.5 2.5-5 3.5" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />

      {/* Niño central (protagonista) */}
      <circle cx="24" cy="18" r="4" fill="#f97316" />
      <path d="M24 22v6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 25l-1 2" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27 25l1 2" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />

      {/* Destellos de progreso */}
      <circle cx="21" cy="11" r="1.2" fill="#14b8a6" opacity="0.5" />
      <circle cx="24" cy="9" r="1.5" fill="#14b8a6" opacity="0.7" />
      <circle cx="27" cy="11" r="1.2" fill="#14b8a6" opacity="0.5" />
    </svg>
  );
}

// White version for dark backgrounds
export function LogoWhite({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      {/* Arco protector inferior */}
      <path d="M12 33c3 4 6.5 6 12 6s9-2 12-6" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round" />

      {/* Persona izquierda */}
      <circle cx="15" cy="22" r="3" fill="white" />
      <path d="M15 25c0 0 2.5 2.5 5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Persona derecha */}
      <circle cx="33" cy="22" r="3" fill="white" />
      <path d="M33 25c0 0-2.5 2.5-5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Niño central */}
      <circle cx="24" cy="18" r="4" fill="#f97316" />
      <path d="M24 22v6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 25l-1 2" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27 25l1 2" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />

      {/* Destellos */}
      <circle cx="21" cy="11" r="1.2" fill="#5eead4" opacity="0.5" />
      <circle cx="24" cy="9" r="1.5" fill="#5eead4" opacity="0.7" />
      <circle cx="27" cy="11" r="1.2" fill="#5eead4" opacity="0.5" />
    </svg>
  );
}
