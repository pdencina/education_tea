import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-[16px] font-bold text-gray-900">TEAGest</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-gray-600">
              <a href="#features" className="hover:text-gray-900 transition">Soluciones</a>
              <a href="#pricing" className="hover:text-gray-900 transition">Planes</a>
              <a href="#testimonials" className="hover:text-gray-900 transition">Testimonios</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition">Iniciar sesión</Link>
            <Link href="/auth/registro" className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-[14px] font-semibold hover:bg-brand-medium transition">
              Agendar demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            {/* Left - Copy */}
            <div className="py-12 lg:py-20">
              <h1 className="text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                Niños que <span className="text-brand-medium">avanzan</span>,<br />
                familias que <span className="text-brand-medium">confían</span>.
              </h1>
              <p className="text-[16px] text-gray-500 mt-5 max-w-md leading-relaxed">
                Centralizá la gestión pedagógica, el seguimiento de progreso y la comunicación con familias en una sola plataforma. Diseñada para centros que atienden niños con TEA.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/auth/registro"
                  className="px-7 py-3.5 bg-brand-dark text-white rounded-full text-[14px] font-semibold hover:bg-brand-medium transition"
                >
                  Agendar una demo
                </Link>
                <Link
                  href="/auth/login"
                  className="px-7 py-3.5 bg-white text-brand-dark rounded-full text-[14px] font-semibold border-2 border-brand-dark hover:bg-brand-muted transition"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>

            {/* Right - Visual with floating badges */}
            <div className="relative">
              {/* Background image area */}
              <div className="bg-gradient-to-br from-brand-muted to-primary-100 rounded-t-3xl h-[380px] lg:h-[440px] relative overflow-hidden">
                {/* Simulated app screenshot */}
                <div className="absolute inset-4 bg-white rounded-xl shadow-elevated overflow-hidden">
                  <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 px-3">
                    <div className="w-2.5 h-2.5 bg-red-300 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-green-300 rounded-full" />
                  </div>
                  <div className="flex h-full">
                    <div className="w-16 bg-brand-dark" />
                    <div className="flex-1 p-3 bg-gray-50">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="h-14 bg-white rounded-lg shadow-soft" />
                        <div className="h-14 bg-white rounded-lg shadow-soft" />
                        <div className="h-14 bg-white rounded-lg shadow-soft" />
                      </div>
                      <div className="h-32 bg-white rounded-lg shadow-soft" />
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-6 right-6 bg-white rounded-xl shadow-elevated px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-800">Objetivo logrado</span>
                </div>

                <div className="absolute top-1/3 right-4 bg-white rounded-xl shadow-elevated px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-800">Reporte enviado</span>
                </div>

                <div className="absolute bottom-12 left-6 bg-white rounded-xl shadow-elevated px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-800">Mensaje de familia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof logos */}
        <div className="border-t border-gray-100 mt-0 py-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <p className="text-center text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-5">Centros que confían en nosotros</p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-50">
              <span className="text-[14px] font-bold text-gray-600">Centro Arcoíris</span>
              <span className="text-[14px] font-bold text-gray-600">Instituto Puentes</span>
              <span className="text-[14px] font-bold text-gray-600">Fundación Crecer</span>
              <span className="text-[14px] font-bold text-gray-600">CEDEI</span>
              <span className="text-[14px] font-bold text-gray-600">Centro Vincular</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-[2.5rem] font-bold text-gray-900 leading-tight">Todo lo que tu centro necesita, en un solo lugar</h2>
            <p className="text-gray-500 text-[15px] mt-3">Sin Excel, sin WhatsApp, sin carpetas de papel.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              color="bg-teal-50"
              iconColor="text-teal-600"
              title="Plan Educativo (PEI)"
              desc="Objetivos por área de desarrollo con seguimiento de progreso visual. Registrá avances con un clic."
            />
            <FeatureCard
              color="bg-blue-50"
              iconColor="text-blue-600"
              title="Registro de Sesiones"
              desc="Documentá actividades, conductas y estado emocional. Todo vinculado al expediente del alumno."
            />
            <FeatureCard
              color="bg-orange-50"
              iconColor="text-orange-600"
              title="Comunicación con Familias"
              desc="Chat por alumno y reportes diarios visuales. Las familias ven el progreso real de sus hijos."
            />
            <FeatureCard
              color="bg-purple-50"
              iconColor="text-purple-600"
              title="Agenda Visual"
              desc="Pictogramas ARASAAC integrados. Creá secuencias para anticipar actividades del día."
            />
            <FeatureCard
              color="bg-pink-50"
              iconColor="text-pink-600"
              title="Equipo Multidisciplinario"
              desc="Gestioná docentes, terapeutas y especialistas. Asignaciones y carga de trabajo visibles."
            />
            <FeatureCard
              color="bg-green-50"
              iconColor="text-green-600"
              title="Reportes PDF"
              desc="Dashboard con indicadores del centro. Generá reportes de progreso para familias y autoridades."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 lg:px-10 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Planes para cada centro</h2>
            <p className="text-gray-500 text-[15px] mt-2">14 días gratis. Sin tarjeta de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <PricingCard
              name="Básico"
              price="29"
              desc="Para centros que inician"
              features={["10 alumnos", "1 grupo", "3 profesionales", "PEI y sesiones", "Comunicación con familias"]}
              cta="Empezar gratis"
              highlighted={false}
            />
            <PricingCard
              name="Profesional"
              price="79"
              desc="Para centros en crecimiento"
              features={["30 alumnos", "3 grupos", "10 profesionales", "Todo del plan Básico", "Agenda Visual", "Reportes PDF"]}
              cta="Empezar gratis"
              highlighted={true}
            />
            <PricingCard
              name="Premium"
              price="149"
              desc="Para redes de centros"
              features={["Alumnos ilimitados", "Grupos ilimitados", "Equipo ilimitado", "Todo del Profesional", "Soporte prioritario", "API de integración"]}
              cta="Contactar ventas"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Por fin puedo mostrarle a las familias el progreso real de sus hijos. Antes era todo en papel y se perdía."
              name="Ana García"
              role="Docente de Educación Especial"
              initials="AG"
            />
            <TestimonialCard
              quote="La agenda visual con pictogramas nos ahorró horas de trabajo. Los niños responden mejor cuando anticipan."
              name="Carlos Méndez"
              role="Terapeuta Ocupacional"
              initials="CM"
            />
            <TestimonialCard
              quote="Como madre, al fin entiendo qué está pasando en el centro. Los reportes me dan tranquilidad."
              name="Laura Torres"
              role="Madre de alumno TEA"
              initials="LT"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-10 bg-brand-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Empezá hoy mismo.</h2>
          <p className="text-white/60 text-[15px] mb-8">
            Configuralo en 3 minutos. Tu equipo lo va a agradecer.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/registro" className="px-7 py-3.5 bg-accent text-white rounded-full text-[14px] font-semibold hover:bg-accent-dark transition">
              Crear cuenta gratis
            </Link>
            <Link href="/auth/login" className="px-7 py-3.5 bg-white/10 text-white rounded-full text-[14px] font-semibold border border-white/20 hover:bg-white/20 transition">
              Agendar demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-dark rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-gray-900">TEAGest</span>
          </div>
          <div className="flex gap-6 text-[13px] text-gray-400">
            <a href="#features" className="hover:text-gray-600 transition">Soluciones</a>
            <a href="#pricing" className="hover:text-gray-600 transition">Planes</a>
            <a href="mailto:contacto@teagest.com" className="hover:text-gray-600 transition">Contacto</a>
          </div>
          <p className="text-[12px] text-gray-300">© 2026 TEAGest. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Float animation via CSS class */}
    </div>
  );
}

function FeatureCard({ color, iconColor, title, desc }: { color: string; iconColor: string; title: string; desc: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card transition group">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-900 text-[15px] mb-2">{title}</h3>
      <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({ name, price, desc, features, cta, highlighted }: { name: string; price: string; desc: string; features: string[]; cta: string; highlighted: boolean }) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col ${highlighted ? "bg-brand-dark text-white ring-2 ring-brand-light shadow-elevated scale-[1.02]" : "bg-white border border-gray-200"}`}>
      {highlighted && <span className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-2">Más popular</span>}
      <h3 className={`text-[15px] font-semibold ${highlighted ? "text-white" : "text-gray-900"}`}>{name}</h3>
      <p className={`text-[12px] mt-0.5 ${highlighted ? "text-white/50" : "text-gray-400"}`}>{desc}</p>
      <div className="mt-4 mb-5">
        <span className={`text-3xl font-bold ${highlighted ? "text-white" : "text-gray-900"}`}>${price}</span>
        <span className={`text-[12px] ml-1 ${highlighted ? "text-white/50" : "text-gray-400"}`}>USD/mes</span>
      </div>
      <ul className="space-y-2.5 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-2 text-[13px] ${highlighted ? "text-white/80" : "text-gray-600"}`}>
            <svg className={`w-4 h-4 flex-shrink-0 ${highlighted ? "text-accent" : "text-brand-light"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/auth/registro"
        className={`w-full py-2.5 rounded-full text-[13px] font-semibold text-center transition block ${
          highlighted ? "bg-accent text-white hover:bg-accent-dark" : "bg-brand-dark text-white hover:bg-brand-medium"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function TestimonialCard({ quote, name, role, initials }: { quote: string; name: string; role: string; initials: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[13px] text-gray-600 leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{initials}</span>
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-900">{name}</p>
          <p className="text-[11px] text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}
