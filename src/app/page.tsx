import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'TurnosApp - Sistema de Gestión de Turnos',
  description: 'Solución completa para digitalizar tu negocio. Sistema de gestión de turnos para barberías, peluquerías, spas y centros de belleza.',
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
              <span className="ml-2 text-sm text-gray-500">Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Demo</Button>
              </Link>
              <Link href="/registro">
                <Button>Solicitar Cotización</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Digitaliza tu negocio
            <span className="block text-blue-600">con el mejor sistema de turnos</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Transforma la gestión de tu barbería, peluquería o spa con nuestra plataforma profesional. 
            Aumenta tus ventas, reduce cancelaciones y mejora la experiencia de tus clientes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                Ver Demo Gratuito
              </Button>
            </Link>
            <Link href="/registro">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                Solicitar Información
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ✓ Sin permanencia ✓ Soporte 24/7 ✓ Implementación gratuita
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Negocios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Turnos Gestionados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600">Satisfacción Cliente</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que tu negocio necesita
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una solución integral diseñada específicamente para negocios de servicios personales
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Reservas Online 24/7</CardTitle>
                <CardDescription>
                  Tus clientes pueden reservar turnos desde cualquier dispositivo, a cualquier hora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Calendario en tiempo real</li>
                  <li>• Confirmación automática</li>
                  <li>• Recordatorios por WhatsApp/Email</li>
                  <li>• Reducción de no-shows del 70%</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Gestión Inteligente</CardTitle>
                <CardDescription>
                  Panel de control completo para administrar tu negocio desde un solo lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Dashboard con métricas clave</li>
                  <li>• Gestión de empleados y horarios</li>
                  <li>• Catálogo de servicios personalizable</li>
                  <li>• Reportes de ventas y rendimiento</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Aumenta tus Ventas</CardTitle>
                <CardDescription>
                  Herramientas diseñadas para maximizar tus ingresos y fidelizar clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Sistema de promociones y descuentos</li>
                  <li>• Programa de fidelización</li>
                  <li>• Upselling automático</li>
                  <li>• Análisis de clientes frecuentes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Pagos Integrados</CardTitle>
                <CardDescription>
                  Cobra de forma segura con múltiples métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• MercadoPago y Stripe integrados</li>
                  <li>• Pagos con tarjeta y transferencia</li>
                  <li>• Facturación automática</li>
                  <li>• Control de caja diario</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Multi-sucursal</CardTitle>
                <CardDescription>
                  Perfecto para cadenas y negocios con múltiples ubicaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Gestión centralizada</li>
                  <li>• Reportes consolidados</li>
                  <li>• Empleados por sucursal</li>
                  <li>• Configuración independiente</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Soporte Premium</CardTitle>
                <CardDescription>
                  Acompañamiento completo para el éxito de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Implementación gratuita</li>
                  <li>• Capacitación del equipo</li>
                  <li>• Soporte técnico 24/7</li>
                  <li>• Actualizaciones automáticas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ideal para tu tipo de negocio
            </h2>
            <p className="text-xl text-gray-600">
              Adaptado a las necesidades específicas de cada industria
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-4xl mb-4">💇‍♂️</div>
              <h3 className="font-semibold text-gray-900">Barberías</h3>
              <p className="text-sm text-gray-600 mt-2">Gestión especializada para servicios masculinos</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-4xl mb-4">💅</div>
              <h3 className="font-semibold text-gray-900">Peluquerías</h3>
              <p className="text-sm text-gray-600 mt-2">Servicios de corte, color y tratamientos</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-4xl mb-4">🧖‍♀️</div>
              <h3 className="font-semibold text-gray-900">Centros de Belleza</h3>
              <p className="text-sm text-gray-600 mt-2">Tratamientos faciales y corporales</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-4xl mb-4">🧘‍♀️</div>
              <h3 className="font-semibold text-gray-900">Spas & Wellness</h3>
              <p className="text-sm text-gray-600 mt-2">Masajes y terapias de relajación</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Únete a cientos de negocios que ya aumentaron sus ventas y mejoraron su gestión con TurnosApp
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Probar Demo Gratis
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  Hablar con un Especialista
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-blue-100">
              📞 +54 11 1234-5678 | 📧 ventas@turnosapp.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">TurnosApp</h3>
              <p className="text-gray-400 mb-4">
                La solución más completa para digitalizar tu negocio de servicios personales. 
                Aumenta tus ventas, optimiza tu tiempo y mejora la experiencia de tus clientes.
              </p>
              <p className="text-gray-400">
                Desarrollado por expertos en tecnología y gestión empresarial.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Precios</li>
                <li>Demo</li>
                <li>Integraciones</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Contacto</li>
                <li>Capacitación</li>
                <li>Estado del Sistema</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TurnosApp. Todos los derechos reservados. | Términos y Condiciones | Política de Privacidad</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
