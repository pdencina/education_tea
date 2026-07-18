import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-tea-pink rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-tea-pink bg-clip-text text-transparent">TEAGest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-primary-600 transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-primary-600 transition">Precios</a>
            <a href="#testimonials" className="hover:text-primary-600 transition">Testimonios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-primary-600 transition font-medium">Iniciar Sesión</Link>
            <Link href="/auth/registro" className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition shadow-md shadow-primary-200/50">
              Prueba Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pastel-purple rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-pastel-teal rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pastel-pink rounded-full opacity-15 blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pastel-purple rounded-full text-xs font-medium text-primary-700 mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Plataforma para centros educativos TEA
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Gestiona tu centro educativo con{" "}
            <span className="bg-gradient-to-r from-primary-600 via-tea-pink to-primary-500 bg-clip-text text-transparent">
              claridad y calidez
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma integral para centros que atienden niños con Trastorno del Espectro Autista.
            Planes educativos, seguimiento de progreso, comunicación con familias — todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/registro"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium text-base hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50"
            >
              Comenzar Gratis — 14 días
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-base hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Ver funcionalidades
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito. Cancela cuando quieras.</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400 mb-4">Diseñado para profesionales de la educación especial</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="text-lg">🎯</span> Plan Educativo (PEI)</span>
            <span className="flex items-center gap-2"><span className="text-lg">📊</span> Seguimiento medible</span>
            <span className="flex items-center gap-2"><span className="text-lg">👨‍👩‍👦</span> Portal familias</span>
            <span className="flex items-center gap-2"><span className="text-lg">🗣️</span> Pictogramas ARASAAC</span>
            <span className="flex items-center gap-2"><span className="text-lg">📱</span> Funciona en tablet</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Todo lo que tu centro necesita</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Reemplaza las hojas de Excel, los grupos de WhatsApp y los archivos en papel por una plataforma profesional</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="📋"
              color="bg-pastel-purple"
              title="Plan Educativo (PEI)"
              description="Crea planes individualizados con objetivos por área de desarrollo. Registra progreso con un clic y visualiza la evolución."
            />
            <FeatureCard
              icon="📅"
              color="bg-pastel-teal"
              title="Registro de Sesiones"
              description="Documenta cada sesión: actividades, conductas, estado emocional y participación. Historial completo por alumno."
            />
            <FeatureCard
              icon="💬"
              color="bg-pastel-pink"
              title="Comunicación con Familias"
              description="Chat por alumno visible para todo el equipo. Reportes diarios con emojis que las familias entienden al instante."
            />
            <FeatureCard
              icon="🖼️"
              color="bg-pastel-yellow"
              title="Agenda Visual"
              description="Crea secuencias con pictogramas ARASAAC para anticipar actividades. Búsqueda integrada en español."
            />
            <FeatureCard
              icon="👥"
              color="bg-pastel-blue"
              title="Equipo Multidisciplinario"
              description="Gestiona docentes, terapeutas y especialistas. Asigna profesionales a alumnos y visualiza la carga de trabajo."
            />
            <FeatureCard
              icon="📊"
              color="bg-pastel-green"
              title="Reportes e Indicadores"
              description="Dashboard con KPIs del centro. Genera reportes PDF de progreso por alumno para entregar a familias o autoridades."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-pastel-lavender/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Empieza en 3 minutos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Registra tu centro" description="Crea tu cuenta, nombra tu centro y configura los grupos y áreas de desarrollo." />
            <StepCard number="2" title="Agrega alumnos y equipo" description="Registra a tus alumnos con su diagnóstico y nivel de apoyo. Invita a tu equipo profesional." />
            <StepCard number="3" title="Comienza a documentar" description="Crea PEIs, registra sesiones, envía reportes a familias. Todo queda medido y organizado." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planes simples y transparentes</h2>
            <p className="text-gray-500">Elige el plan que se adapta a tu centro. Todos incluyen 14 días de prueba gratis.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Básico</h3>
                <p className="text-sm text-gray-400 mt-1">Para centros pequeños</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-400 text-sm"> USD/mes</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 flex-1">
                <PricingItem text="Hasta 10 alumnos" />
                <PricingItem text="1 grupo" />
                <PricingItem text="3 usuarios (equipo)" />
                <PricingItem text="PEI y seguimiento" />
                <PricingItem text="Registro de sesiones" />
                <PricingItem text="Comunicación con familias" />
              </ul>
              <Link href="/auth/registro" className="mt-6 w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition text-center block">
                Comenzar Gratis
              </Link>
            </div>

            {/* Professional - Highlighted */}
            <div className="bg-gradient-to-b from-primary-500 to-primary-600 rounded-2xl p-6 shadow-xl shadow-primary-200/50 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-tea-yellow text-yellow-900 rounded-full text-xs font-semibold">
                Más popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Profesional</h3>
                <p className="text-sm text-primary-200 mt-1">Para centros en crecimiento</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-primary-200 text-sm"> USD/mes</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-primary-100 flex-1">
                <PricingItem text="Hasta 30 alumnos" light />
                <PricingItem text="3 grupos" light />
                <PricingItem text="10 usuarios (equipo)" light />
                <PricingItem text="Todo del plan Básico" light />
                <PricingItem text="Agenda Visual (ARASAAC)" light />
                <PricingItem text="Reportes PDF" light />
                <PricingItem text="Dashboard avanzado" light />
              </ul>
              <Link href="/auth/registro" className="mt-6 w-full py-3 bg-white text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-50 transition text-center block">
                Comenzar Gratis
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Premium</h3>
                <p className="text-sm text-gray-400 mt-1">Para centros grandes</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="text-gray-400 text-sm"> USD/mes</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 flex-1">
                <PricingItem text="Alumnos ilimitados" />
                <PricingItem text="Grupos ilimitados" />
                <PricingItem text="Usuarios ilimitados" />
                <PricingItem text="Todo del plan Profesional" />
                <PricingItem text="Soporte prioritario" />
                <PricingItem text="Personalización de marca" />
                <PricingItem text="API de integración" />
              </ul>
              <Link href="/auth/registro" className="mt-6 w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition text-center block">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-pastel-lavender/20 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que dicen los profesionales</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Por fin puedo mostrarle a las familias el progreso real de sus hijos con gráficos claros. Antes era todo en papel y se perdía."
              name="Ana García"
              role="Docente de Educación Especial"
            />
            <TestimonialCard
              quote="La agenda visual con pictogramas nos ahorró horas de trabajo. Los niños responden mejor cuando anticipan las actividades."
              name="Carlos Méndez"
              role="Terapeuta Ocupacional"
            />
            <TestimonialCard
              quote="Como madre, al fin entiendo qué está pasando en el centro. Los reportes diarios me dan tranquilidad."
              name="Laura Torres"
              role="Madre de alumno TEA"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-12 shadow-xl shadow-primary-200/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Transforma la gestión de tu centro hoy</h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Únete a los centros que ya dejaron el papel y WhatsApp. Prueba gratis 14 días, sin compromiso.
            </p>
            <Link
              href="/auth/registro"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-base hover:bg-primary-50 transition shadow-lg"
            >
              Crear mi Cuenta Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-tea-pink rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-gray-800">TEAGest</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-gray-600 transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-gray-600 transition">Precios</a>
            <a href="mailto:contacto@teagest.com" className="hover:text-gray-600 transition">Contacto</a>
          </div>
          <p className="text-xs text-gray-300">© 2026 TEAGest. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, color, title, description }: { icon: string; color: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition group">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-tea-pink rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-md shadow-primary-200/50">
        {number}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function PricingItem({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <svg className={`w-4 h-4 flex-shrink-0 ${light ? "text-primary-200" : "text-primary-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>
    </div>
  );
}
