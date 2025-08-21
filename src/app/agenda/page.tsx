'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AgendaPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    serviceId: '',
    employeeId: '',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Datos demo
  const services = [
    { id: '1', name: 'Corte de Cabello', price: 2500, duration: 30 },
    { id: '2', name: 'Coloración', price: 8000, duration: 120 },
    { id: '3', name: 'Manicura', price: 3500, duration: 45 },
    { id: '4', name: 'Masaje Relajante', price: 6000, duration: 60 }
  ]

  const employees = [
    { id: '1', name: 'Juan Pérez', specialization: 'Barbero' },
    { id: '2', name: 'María García', specialization: 'Colorista' },
    { id: '3', name: 'Ana López', specialization: 'Manicurista' }
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ]

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validaciones
    if (!formData.serviceId || !formData.date || !formData.time) {
      setError('Por favor completa todos los campos obligatorios')
      setLoading(false)
      return
    }

    // Simular reserva exitosa
    setTimeout(() => {
      setSuccess('¡Turno reservado exitosamente! Te enviaremos un recordatorio por email.')
      setFormData({ serviceId: '', employeeId: '', date: '', time: '' })
      setLoading(false)
      
      // Redirigir al perfil después de 3 segundos
      setTimeout(() => {
        router.push('/perfil-cliente')
      }, 3000)
    }, 1500)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const selectedService = services.find(s => s.id === formData.serviceId)
  const selectedEmployee = employees.find(e => e.id === formData.employeeId)

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
              <Link href="/perfil-cliente">
                <Button variant="outline">Mi Perfil</Button>
              </Link>
              <span className="text-gray-700">{user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservar Turno</h1>
          <p className="text-gray-600 mt-2">Selecciona el servicio, profesional y horario de tu preferencia</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Reserva */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Turno</CardTitle>
              <CardDescription>Completa la información para tu reserva</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="service">Servicio *</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => setFormData({...formData, serviceId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee">Profesional (Opcional)</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier profesional disponible" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horario *</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Reservando...' : 'Confirmar Reserva'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumen de la Reserva */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de tu Reserva</CardTitle>
              <CardDescription>Verifica los datos antes de confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p>{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {selectedService && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Servicio</h3>
                  <p>{selectedService.name}</p>
                  <p className="text-sm text-gray-600">Duración: {selectedService.duration} minutos</p>
                  <p className="text-lg font-bold text-blue-600">${selectedService.price}</p>
                </div>
              )}

              {selectedEmployee && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Profesional</h3>
                  <p>{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-600">{selectedEmployee.specialization}</p>
                </div>
              )}

              {formData.date && formData.time && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Fecha y Hora</h3>
                  <p>{new Date(formData.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="text-lg font-bold">{formData.time}</p>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                * Te enviaremos un recordatorio 24 horas antes de tu cita
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
