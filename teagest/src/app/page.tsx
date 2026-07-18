import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-surface-warm/90 backdrop-blur-md z-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-brand-dark">TEAGest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
            <a href="#features" className="hover:text-brand-dark transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-brand-dark transition">Precios</a>
            <a href="#testimonials" className="hover:text-brand-dark transition">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-[13px] font-medium text-gray-500 hover:text-brand-dark transition">Iniciar Sesión</Link>
            <Link href="/auth/registro" className="px-4 py-2 bg-brand-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-medium transition">
              Prueba Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Editorial style */}
      <section className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 rounded-full text-[12px] font-semibold text-brand-medium mb-6">
              Plataforma para educación TEA
            </div>
            <h1 className="text-[3.2rem] lg:text-[4rem] font-extrabold text-brand-dark leading-[1.05] tracking-tight mb-6">
              Donde cada<br />
              <span className="text-accent">progreso</span><br />
              cuenta.
            </h1>
            <p className="text-[17px] text-gray-500 max-w-md leading-relaxed mb-8">
              La herramienta que conecta a docentes, terapeutas y familias en torno al desarrollo de cada niño con TEA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/registro"
                className="px-6 py-3 bg-accent text-white rounded-lg text-[14px] font-semibold hover:bg-accent-dark transition shadow-lg shadow-accent/20 text-center"
              >
                Comenzar Gratis
              </Link>
              <a
                href="#features"
                className="px-6 py-3 bg-white text-brand-dark rounded-lg text-[14px] font-medium border border-gray-200 hover:border-brand-medium hover:text-brand-medium transition text-center"
              >
                Conoce más
              </a>
            </div>
            <p className="text-[12px] text-gray-400 mt-3">14 días gratis. Sin tarjeta.</p>
          </div>

          {/* Hero visual - abstract cards */}
          <div className="hidden lg:block relative">
            <div className="bg-white rounded-2xl shadow-elevated p-5 max-w-xs ml-auto transform rotate-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-lg">🎯</div>
                <div>
                  <p className="text-[13px] font-semibold text-brand-dark">PEI — Mateo S.</p>
                  <p className="text-[11px] text-gray-400">8 objetivos · 5 logrados</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-brand-light h-2 rounded-full" style={{ width: "62%" }} />
              </div>
              <p className="text-[11px] text-brand-medium font-medium text-right">62%</p>
            </div>
            <div className="bg-brand-dark rounded-2xl shadow-elevated p-5 max-w-[240px] ml-12 -mt-4 transform -rotate-2">
              <p className="text-[12px] text-white/60 mb-1">Sesiones esta semana</p>
              <p className="text-3xl font-bold text-white">24</p>
              <div className="flex gap-1 mt-2">
                {[40, 65, 80, 55, 90, 70, 45].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-sm overflow-hidden h-8">
                    <div className="bg-accent w-full rounded-sm" style={{ height: `${h}%`, marginTop: `${100-h}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-4 max-w-[200px] ml-auto -mt-2 transform rotate-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">😊</span>
                <div>
                  <p className="text-[12px] font-medium text-brand-dark">Valentina hoy</p>
                  <p className="text-[10px] text-gray-400">Participación alta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-3">Todo integrado.</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Sin Excel, sin WhatsApp, sin papel. Una plataforma que tu equipo realmente va a usar todos los días.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature icon="📋" title="Plan Educativo (PEI)" desc="Objetivos individualizados por área. Registra progreso con un clic. Visualiza la evolución con gráficos claros." />
            <Feature icon="📅" title="Registro de Sesiones" desc="Documenta actividades, conductas, estado emocional y participación. Todo queda vinculado al expediente." />
            <Feature icon="💬" title="Comunicación" desc="Chat por alumno visible para el equipo completo. Reportes diarios visuales para familias." />
            <Feature icon="🖼️" title="Agenda Visual" desc="Pictogramas ARASAAC integrados. Crea secuencias para anticipar actividades con búsqueda en español." />
            <Feature icon="👥" title="Equipo" desc="Gestiona docentes, terapeutas y especialistas. Visualiza carga de trabajo y asignaciones." />
            <Feature icon="📊" title="Reportes" desc="KPIs del centro en tiempo real. Genera reportes PDF de progreso para entregar a familias o autoridades." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-brand-dark mb-3">Precio justo, sin sorpresas.</h2>
            <p className="text-gray-500 text-[15px]">14 días gratis en todos los planes. Cancela cuando quieras.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <PlanCard
              name="Básico"
              price="29"
              desc="Para centros que inician"
              features={["10 alumnos", "1 grupo", "3 profesionales", "PEI y sesiones", "Comunicación"]}
              highlighted={false}
            />
            <PlanCard
              name="Profesional"
              price="79"
              desc="Para centros en crecimiento"
              features={["30 alumnos", "3 grupos", "10 profesionales", "Todo del Básico", "Agenda Visual", "Reportes PDF", "Dashboard avanzado"]}
              highlighted={true}
            />
            <PlanCard
              name="Premium"
              price="149"
              desc="Para redes de centros"
              features={["Alumnos ilimitados", "Grupos ilimitados", "Usuarios ilimitados", "Todo del Profesional", "Soporte prioritario", "API de integración"]}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 lg:px-12 bg-brand-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Lo que dicen quienes lo usan.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Quote text="Por fin puedo mostrarle a las familias el progreso real con gráficos claros. Antes era todo en papel." name="Ana G." role="Docente" />
            <Quote text="La agenda visual con pictogramas nos ahorró horas. Los niños responden mejor cuando anticipan." name="Carlos M." role="Terapeuta Ocupacional" />
            <Quote text="Como madre, al fin entiendo qué pasa en el centro. Los reportes diarios me dan paz." name="Laura T." role="Madre de alumno" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Empieza hoy.</h2>
          <p className="text-gray-500 text-[15px] mb-8">
            Tu centro merece una herramienta a la altura del trabajo que hacen. Configúralo en 3 minutos.
          </p>
          <Link
            href="/auth/registro"
            className="inline-block px-8 py-3.5 bg-accent text-white rounded-lg font-semibold text-[15px] hover:bg-accent-dark transition shadow-lg shadow-accent/20"
          >
            Crear mi Cuenta Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-brand-dark">TEAGest</span>
          </div>
          <p className="text-[12px] text-gray-400">© 2026 TEAGest. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="group">
      <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-3 text-xl group-hover:bg-primary-100 transition">
        {icon}
      </div>
      <h3 className="font-semibold text-brand-dark text-[15px] mb-1.5">{title}</h3>
      <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function PlanCard({ name, price, desc, features, highlighted }: { name: string; price: string; desc: string; features: string[]; highlighted: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl p-6 flex flex-col",
      highlighted ? "bg-brand-dark text-white ring-2 ring-accent shadow-elevated" : "bg-white border border-gray-200"
    )}>
      <div className="mb-5">
        <h3 className={cn("text-[15px] font-semibold", highlighted ? "text-white" : "text-brand-dark")}>{name}</h3>
        <p className={cn("text-[12px] mt-0.5", highlighted ? "text-white/60" : "text-gray-400")}>{desc}</p>
        <div className="mt-3">
          <span className={cn("text-3xl font-bold", highlighted ? "text-white" : "text-brand-dark")}>${price}</span>
          <span className={cn("text-[12px] ml-1", highlighted ? "text-white/60" : "text-gray-400")}>USD/mes</span>
        </div>
      </div>
      <ul className="space-y-2 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className={cn("flex items-center gap-2 text-[13px]", highlighted ? "text-white/80" : "text-gray-600")}>
            <svg className={cn("w-3.5 h-3.5 flex-shrink-0", highlighted ? "text-accent" : "text-brand-light")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/auth/registro"
        className={cn(
          "w-full py-2.5 rounded-lg text-[13px] font-semibold text-center transition block",
          highlighted
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-brand-dark text-white hover:bg-brand-medium"
        )}
      >
        Comenzar Gratis
      </Link>
    </div>
  );
}

function Quote({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-[13px] text-white/80 leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="text-[13px] font-medium text-white">{name}</p>
        <p className="text-[11px] text-white/40">{role}</p>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
