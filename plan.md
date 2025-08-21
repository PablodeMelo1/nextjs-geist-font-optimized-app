Below is the detailed implementation plan for the full-stack “Gestión de Turnos” application. In this plan we assume using MongoDB Atlas, a generic JWT secret (configured via environment variables), and no real email credentials (simulated email functions). We will use the existing Next.js project (Option A) as the frontend while building a separate Express-based backend under a new folder (/server).

---

## Backend Implementation (Folder: /server)

- **index.js**  
  - Initialize the Express app.  
  - Load environment variables (JWT secret, MongoDB URI).  
  - Import and use middleware (CORS, JSON parser, error handler).  
  - Connect to MongoDB via Mongoose (using a separate config file).  
  - Mount API routes from the routes folder.  
  - Start server on a dedicated port (e.g., 5000).

- **config/db.js**  
  - Create a module that uses Mongoose to connect to MongoDB Atlas using a connection string from env variables.  
  - Handle connection events and errors.

- **config/jwt.js**  
  - Define and export the JWT secret (reading from process.env.JWT_SECRET with a default generic fallback).

- **models/User.js**  
  - Build a Mongoose schema for usuarios/clientes with fields: name, email, password (hashed), and an array to keep history of turnos.  
  - Add pre-save hooks for password hashing.

- **models/Service.js**  
  - Define a schema for servicios with fields: nombre, descripción, duración (minutes) y precio.

- **models/Employee.js**  
  - Create a schema for empleados/profesionales with fields for name, contact info, available working hours, and a reference list to servicios que brinda el profesional.

- **models/Appointment.js**  
  - Set up a schema for turnos including references to usuario, servicio, and optional empleado; include fields for fecha y hora, estado (confirmado, cancelado), y detalles de pago (para simulación).

- **controllers/authController.js**  
  - Implement endpoints for registro y login:  
    - Use bcrypt for password hashing/comparison.  
    - Return JWT tokens when login is successful.  
    - Validate inputs and send proper HTTP error codes.

- **controllers/userController.js**  
  - Create controller for retrieving profile details and historial de turnos del usuario.  
  - Use authentication middleware to secure routes.

- **controllers/serviceController.js**  
  - Implement CRUD operations for servicios.  
  - Validate input and handle error conditions.

- **controllers/employeeController.js**  
  - Implement CRUD for empleados.  
  - Include functionality to asignar servicios a cada empleado.

- **controllers/appointmentController.js**  
  - Create endpoints to reservar, actualizar, cancelar y consultar turnos.  
  - Validate disponibilidad del profesional basado en su agenda; si el profesional no está disponible, retornar error.  
  - Opcional: invocar funciones dummy para recordatorios de email o simulación de pago.

- **routes/**  
  - Crear archivos separados:  
    - authRoutes.js (para /api/auth: registrar y login)  
    - userRoutes.js (para consultar perfil)  
    - serviceRoutes.js (para servicios CRUD)  
    - employeeRoutes.js (para empleados CRUD y asignación de servicios)  
    - appointmentRoutes.js (para turnos: reserva, modificación, cancelación)  
  - Cada archivo usará los controladores respectivos y se montará en index.js.

- **middleware/**  
  - authMiddleware.js: Verifica el JWT en las cabeceras y protege las rutas sensibles.  
  - errorHandler.js: Middleware global para capturar errores y enviar respuestas consistentes.

---

## Frontend Implementation (Dentro de /src del proyecto Next.js)

- **Páginas principales en /src/app**  
  - **login/page.tsx**  
    - Formulario de inicio de sesión con campos (correo y contraseña).  
    - Se conectará a la API `/api/auth/login` mediante Axios.  
    - Muestra mensajes de error y notificaciones de éxito sin iconos externos, utilizando tipografía y espaciados modernos.
  - **registro/page.tsx**  
    - Formulario de registro con validaciones en el cliente.  
    - Llama a `/api/auth/register` para crear el usuario.
  - **home/page.tsx**  
    - Página de bienvenida con un diseño limpio y minimalista usando espacios, fondos claros y comentarios textuales.
  - **servicios/page.tsx**  
    - Listado de servicios disponibles, usando el componente ListaServicios para mostrar tarjetas estilizadas con nombre, descripción, duración y precio.
  - **agenda/page.tsx**  
    - Formulario para reservar turno (FormularioTurno) que permita seleccionar servicio, empleado (opcional), fecha y hora.  
    - Valida disponibilidad de agenda y simula pasos de pago (checkbox o botón que simule la integración premium).
  - **perfil-cliente/page.tsx**  
    - Muestra datos del usuario e historial de turnos en un formato de lista o tarjeta.
  - **panel-admin/page.tsx**  
    - Interfaz de administración para ver todos los turnos en formato de calendario o lista.  
    - Permite gestionar empleados, servicios y turnos (cancelar o reasignar).  
    - Opcional: sección de estadísticas con datos resumidos (conteos de turnos, servicios más pedidos).

- **Componentes reutilizables en /src/components**  
  - **NavBar.tsx**  
    - Barra de navegación con enlaces de texto y diseño responsive sin iconos externos.
  - **Footer.tsx**  
    - Pie de página simple, limpio y minimalista.
  - **FormularioTurno.tsx**  
    - Componente de formulario para la reserva de turnos con controles de selección, inputs para fecha/hora y validación de campos.  
    - Muestra mensajes de error de validación.
  - **ListaServicios.tsx**  
    - Renderiza tarjetas de servicios utilizando tipografía clara, bordes y espaciado para un look moderno.
  - **TurnoCard.tsx**  
    - Muestra los detalles de un turno en formato de tarjeta (incluye información de servicio, profesional y estado).
  - **CalendarView.tsx**  
    - Vista en cuadrícula o lista para el panel de administración que muestra turnos organizados por fecha.  
    - Utiliza CSS Grid/Flexbox para una distribución limpia.
  - **axiosClient.ts**  
    - Instancia centralizada de Axios con la URL base (por ejemplo, `http://localhost:5000/api`) y manejo de respuestas y errores mediante interceptores.

- **Integración y UX Considerations**  
  - Cada formulario ayudará con validación en el navegador y manejo de errores con mensajes claros (usando colores y tipografía).  
  - Los datos se obtendrán mediante Axios, actualizando la UI de forma dinámica.  
  - Todo el diseño es responsive, utilizando espaciados, márgenes y tipografía consistente.  
  - Se usarán modales simples (por ejemplo, usando el componente Dialog de shadcn/ui) para confirmar cancelaciones o reasignaciones en el panel de admin.

---

## Testing y Buenas Prácticas

- En el backend, cada endpoint se estructura con try/catch; el middleware errorHandler envía respuestas con mensajes claros y códigos HTTP correctos.  
- Se realizarán pruebas con curl (por ejemplo, para registro, login y reserva de turno) validando los códigos de estado y tiempos de respuesta.  
- En el frontend, las respuestas de error de Axios se capturan y se muestran en la UI, asegurando que la experiencia sea clara y moderna.  
- Se documenta el README para detalles de API y se asegura que las rutas y modelos mantengan consistencia.

---

## Summary

- The backend is built under /server with Express, separated controllers, Mongoose models, and robust error handling.  
- Key models (User, Service, Employee, Appointment) are defined and linked with validations.  
- JWT authentication is implemented via authMiddleware and a generic secret read from env variables.  
- The Next.js frontend (using the current project) includes modern, responsive pages (login, registro, home, servicios, agenda, perfil, panel-admin).  
- Reusable components (NavBar, Footer, FormularioTurno, ListaServicios, CalendarView, axiosClient) ensure consistency.  
- Simulated email and payment options are integrated as dummy functions.  
- All API calls use Axios with clear error messages and responsive UI updates.  
- The plan details testing via curl commands and client-side error handling for a robust implementation.
