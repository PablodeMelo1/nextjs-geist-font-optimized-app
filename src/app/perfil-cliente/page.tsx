'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface Appointment {
  _id: string
  service: {
    name: string
    price: number
    duration: number
  }
  employee?: {
    name: string
  }
  date: string
  time: string
  status: string
  totalPrice: number
}

export default function PerfilClientePage() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchAppointments()
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  const fetchAppointments = async () => {
    try {
      // Simulamos citas para demo
      const demoAppointments = [
        {
          _id: '1',
          service: { name: 'Corte de Cabello', price: 2500, duration: 30 },
          employee: { name: 'Juan Pérez' },
          date: '2024-01-15',
          time: '10:00',
          status: 'confirmed',
          totalPrice: 2500
        },
        {
          _id: '2',
          service: { name: 'Coloración', price: 8000, duration: 120 },
          employee: { name: 'María García' },
          date: '2024-01-20',
          time: '14:00',
          status: 'pending',
          totalPrice: 8000
        }
      ]
      setAppointments(demoAppointments)
    } catch (error: any) {
      setError(error.message || 'Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || colors['pending']
  }

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                TurnosApp
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Perfil del Usuario */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Información de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-lg">{user?.phone || 'No especificado'}</p>
                </div>
                <div className="pt-4">
                  <Link href="/agenda">
                    <Button className="w-full">
                      Reservar Nuevo Turno
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Citas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mis Turnos</CardTitle>
                <CardDescription>Historial de citas y turnos reservados</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No tienes turnos reservados</p>
                    <Link href="/agenda">
                      <Button>Reservar mi primer turno</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{appointment.service.name}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Fecha:</span> {new Date(appointment.date).toLocaleDateString('es-ES')}
                          </div>
                          <div>
                            <span className="font-medium">Hora:</span> {appointment.time}
                          </div>
                          {appointment.employee && (
                            <div>
                              <span className="font-medium">Profesional:</span> {appointment.employee.name}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Duración:</span> {appointment.service.duration} min
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-blue-600">
                            ${appointment.totalPrice.toLocaleString()}
                          </span>
                          {appointment.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
