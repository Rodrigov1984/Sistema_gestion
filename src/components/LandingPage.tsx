import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LandingPageProps {
  onNavigateToBeneficios: () => void;
}

export default function LandingPage({ onNavigateToBeneficios }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header>
        {/* Top Green Bar with Search */}
        <div className="bg-[#008C45] py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end gap-4">
              {/* Links */}
              <div className="hidden md:flex items-center gap-6 text-white">
                <a href="#" className="hover:underline transition-all">
                  Línea Ética y DDHH
                </a>
                <a href="#" className="hover:underline transition-all">
                  Contacto
                </a>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-4 pr-10 py-1 w-48 md:w-64 bg-white border-none rounded-md"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:opacity-80">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Benefits Button */}
              <Button
                onClick={onNavigateToBeneficios}
                className="bg-white hover:bg-gray-100 text-[#008C45] px-4 py-1 transition-colors shadow-sm"
              >
                Beneficios Empleados
              </Button>

              
            </div>
          </div>
        </div>

        {/* Red Bar with Logo and Navigation */}
        <div className="bg-[#D32027]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo - Usando texto en lugar de imagen */}
              <div className="flex items-center">
                <div className="text-white font-bold text-2xl">
                  Tresmontes Lucchetti
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Tresmontes Lucchetti
                </a>
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Nuestras Marcas
                </a>
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Sostenibilidad
                </a>
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Noticias
                </a>
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Prensa
                </a>
                <a href="#" className="text-white hover:text-yellow-300 transition-colors">
                  Únete a nuestro equipo
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="lg:hidden bg-[#D32027] border-t border-white/20">
          <div className="px-4 py-3 space-y-1">
            <a href="#" className="block text-white hover:text-yellow-300 py-2">
              Tresmontes Lucchetti
            </a>
            <a href="#" className="block text-white hover:text-yellow-300 py-2">
              Nuestras Marcas
            </a>
            <a href="#" className="block text-white hover:text-yellow-300 py-2">
              Sostenibilidad
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D32027] via-[#E84343] to-[#D32027] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-yellow-300">Desde 1905</p>
              </div>
              
              <h1 className="text-white leading-tight">
                Cumplimos<br />
                <span className="text-yellow-300">120 años</span><br />
                contigo
              </h1>
              
              <p className="text-white/90 max-w-md">
                Celebramos 120 años de tradición, calidad y sabor que han acompañado a las familias chilenas generación tras generación.
              </p>

              <div className="flex gap-4">
                <Button 
                  className="bg-white text-[#D32027] hover:bg-gray-100 px-8 py-3"
                >
                  Conoce Nuestra Historia
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-3"
                >
                  Nuestros Productos
                </Button>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/20 to-transparent rounded-full blur-3xl"></div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1723906012573-6513af5a986c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHByb2R1Y3RzJTIwZm9vZHxlbnwxfHx8fDE3NjIyNjA4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Productos Lucchetti"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#D32027] mb-4">Nuestro Compromiso</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calidad, tradición e innovación en cada uno de nuestros productos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D32027]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#D32027]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[#D32027] mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                120 años de experiencia respaldando cada producto que llega a tu mesa
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-[#D32027] mb-2">Tradición Familiar</h3>
              <p className="text-gray-600">
                Recetas que han pasado de generación en generación
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[#D32027] mb-2">Sostenibilidad</h3>
              <p className="text-gray-600">
                Comprometidos con el medio ambiente y las comunidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4">Sobre Nosotros</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Nuestra Historia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Misión y Visión</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabaja con Nosotros</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Productos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Pastas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salsas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bebidas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Servicio al Cliente</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ubicaciones</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D32027] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D32027] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2024 Tresmontes Lucchetti. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
