# 🚀 Sistema de Gestión de Turnos

Aplicación web completa para gestionar turnos de negocios como barberías, peluquerías, spas, etc.

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express + MongoDB + JWT
- **Base de datos:** MongoDB Atlas (configurado)

## 📋 Funcionalidades

- ✅ Sistema de autenticación (Login/Registro)
- ✅ Gestión de servicios (CRUD)
- ✅ Gestión de empleados/profesionales
- ✅ Sistema de reserva de turnos
- ✅ Panel de administración
- ✅ Perfil de cliente con historial
- ✅ Diseño responsive y moderno

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### 2. Ejecutar la aplicación

**IMPORTANTE:** Necesitas abrir 2 terminales/consolas

#### Terminal 1 - Backend (Puerto 3001):
```bash
cd server
npm start
```

#### Terminal 2 - Frontend (Puerto 8000):

**Para Windows:**
```bash
npm run dev
```

**Para Linux/Mac:**
```bash
npm run dev:unix
```

### 3. Acceder a la aplicación

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:3001

## 👤 Credenciales de Prueba

### Administrador:
- **Email:** admin@turnos.com
- **Contraseña:** admin123

### Cliente:
- **Email:** cliente@turnos.com  
- **Contraseña:** cliente123

## 📱 Páginas Disponibles

1. **Página Principal** (`/`) - Landing page
2. **Login** (`/login`) - Iniciar sesión
3. **Registro** (`/registro`) - Crear cuenta
4. **Servicios** (`/servicios`) - Catálogo de servicios
5. **Perfil Cliente** (`/perfil-cliente`) - Historial de turnos
6. **Reservar Turno** (`/agenda`) - Sistema de reservas
7. **Panel Admin** (`/panel-admin`) - Administración completa

## 🔧 Estructura del Proyecto

```
├── src/                    # Frontend (Next.js)
│   ├── app/               # Páginas de la aplicación
│   ├── components/ui/     # Componentes reutilizables
│   └── lib/              # Utilidades y configuración
├── server/                # Backend (Express)
│   ├── controllers/       # Lógica de negocio
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middleware personalizado
│   └── config/           # Configuración (DB, JWT)
└── public/               # Archivos estáticos
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil

### Servicios
- `GET /api/services` - Listar servicios
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

### Empleados
- `GET /api/employees` - Listar empleados
- `POST /api/employees` - Crear empleado
- `PUT /api/employees/:id` - Actualizar empleado
- `DELETE /api/employees/:id` - Eliminar empleado

### Turnos
- `GET /api/appointments` - Listar turnos
- `POST /api/appointments` - Crear turno
- `PUT /api/appointments/:id` - Actualizar turno
- `DELETE /api/appointments/:id` - Cancelar turno

## 🔒 Seguridad

- Autenticación JWT
- Validación de datos
- Middleware de protección de rutas
- Encriptación de contraseñas con bcrypt

## 📝 Notas Importantes

- La aplicación funciona con datos demo sin necesidad de configurar MongoDB
- Para producción, configura las variables de entorno en `.env`
- El sistema está preparado para escalabilidad y nuevas funcionalidades

## 🆘 Solución de Problemas

### Error "PORT is not recognized" en Windows:
Usa: `npm run dev` (ya configurado para Windows)

### Puerto ocupado:
Cambia el puerto en `package.json` o mata el proceso:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac  
lsof -ti:8000 | xargs kill -9
```

## 🚀 ¡Listo para usar!

La aplicación está completamente funcional y lista para personalizar según tus necesidades específicas.
