'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PanelAdminPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/perfil-cliente')
      return
    }
    
    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  // Datos demo
  const appointments = [
    { id: 1, client: 'Juan Pérez', service: 'Corte', date: '2024-01-15', time: '10:00', status: 'confirmed' },
    { id: 2, client: 'María García', service: 'Coloración', date: '2024-01-15', time: '14:00', status: 'pending' }
  ]

  const services = [
    { id: 1, name: 'Corte de Cabello', price: 2500, duration: 30, category: 'corte' },
    { id: 2, name: 'Coloración', price: 8000, duration: 120, category: 'coloracion' }
  ]

  const employees = [
    { id: 1, name: 'Juan Pérez', specialization: 'Barbero', email: 'juan@salon.com' },
    { id: 2, name: 'María García', specialization: 'Colorista', email: 'maria@salon.com' }
  ]

  if (!user) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">TurnosApp</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        <Tabs defaultValue="turnos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="turnos">Turnos</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="empleados">Empleados</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="turnos">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Turnos</CardTitle>
                <CardDescription>Administra todas las citas del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{apt.client}</h3>
                        <p className="text-sm text-gray-600">{apt.service} - {apt.date} {apt.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                          {apt.status}
                        </Badge>
                        <Button size="sm" variant="outline">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicios">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Servicios</CardTitle>
                <CardDescription>Administra el catálogo de servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Agregar Servicio</Button>
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">${service.price} - {service.duration} min</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empleados">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Empleados</CardTitle>
                <CardDescription>Administra el equipo de profesionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Agregar Empleado</Button>
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{emp.name}</h3>
                        <p className="text-sm text-gray-600">{emp.specialization} - {emp.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Turnos Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$45,000</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
