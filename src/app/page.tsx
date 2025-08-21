import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Gestión de Turnos - Inicio',
  description: 'Sistema de gestión de turnos para barberías, peluquerías y spas',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TurnosApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Gestiona tus turnos
            <span className="block text-blue-600">de forma inteligente</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sistema completo para la gestión de citas y turnos. Perfecto para barberías, peluquerías, spas y centros de belleza.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/registro">
                <Button size="lg" className="w-full sm:w-auto">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/servicios">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Todo lo que necesitas para gestionar tu negocio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Herramientas profesionales para optimizar tu tiempo y mejorar la experiencia de tus clientes
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Reserva de Turnos</CardTitle>
                <CardDescription>
                  Los clientes pueden reservar turnos fácilmente seleccionando servicio, profesional y horario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Calendario interactivo</li>
                  <li>• Selección de profesional</li>
                  <li>• Confirmación automática</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Servicios</CardTitle>
                <CardDescription>
                  Administra tu catálogo de servicios con precios, duración y descripciones detalladas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Catálogo personalizable</li>
                  <li>• Precios y duraciones</li>
                  <li>• Categorías organizadas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Panel Administrativo</CardTitle>
                <CardDescription>
                  Control total sobre turnos, empleados y estadísticas de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Vista de calendario</li>
                  <li>• Gestión de empleados</li>
                  <li>• Reportes y estadísticas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block text-blue-200">Crea tu cuenta gratuita hoy.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/registro">
                <Button size="lg" variant="secondary">
                  Registrarse Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 TurnosApp. Sistema de gestión de turnos profesional.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
