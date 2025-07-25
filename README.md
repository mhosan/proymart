# Dato urbano:

Este proyecto fué generado con Angular CLI versión 20.

---
## Frappe Gantt
- Instalación  
```bash
npm install frappe-gantt
```
- Incluir en HTML:
```html
  <script src="frappe-gantt.umd.js"></script>
  <link rel="stylesheet" href="frappe-gantt.css">
```
- Usar vía CDN:
```typescript
  <script src="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css">
```
- Ejemplo de uso:
```typescript
let tasks = [
  {
    id: '1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20
  },
  ...
]
let gantt = new Gantt("#gantt", tasks);
```

---
## Supabase desde el frontend
- Instalación de la biblioteca supabase-js:
```bash
  npm install @supabase/supabase-js
```
- Inicialización del cliente:
Configurar el cliente de Supabase con la URL del proyecto en Supabase y la clave pública (anon key) que puedes obtener desde el panel de control de Supabase:
```typescript 
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://tu-proyecto.supabase.co';
    const supabaseKey = 'tu-clave-pública';
    const supabase = createClient(supabaseUrl, supabaseKey);
```
- Interacciones con la API:
Base de datos: Se puede realizar consultas RESTful para leer, insertar, actualizar o eliminar datos directamente desde el frontend. Por ejemplo:
```javascript

// Obtener datos
const { data, error } = await supabase
  .from('usuarios')
  .select('*');

// Insertar datos
const { data, error } = await supabase
  .from('usuarios')
  .insert([{ nombre: 'Juan', email: 'juan@example.com' }]);
```

- Autenticación: Supabase ofrece funciones para registro, inicio de sesión y gestión de usuarios:
```javascript
// Registro
const { user, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'contraseña'
});

// Inicio de sesión
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@example.com',
  password: 'contraseña'
});
```

- Almacenamiento: Se puede subir y descargar archivos:
```javascript

// Subir un archivo
const { data, error } = await supabase.storage
  .from('avatares')
  .upload('avatar.png', archivo);
```

- Realtime: Es posible suscribirte a cambios en la base de datos en tiempo real:
```javascript

supabase
  .from('usuarios')
  .on('INSERT', payload => {
    console.log('Nuevo usuario:', payload.new);
  })
  .subscribe();
```



