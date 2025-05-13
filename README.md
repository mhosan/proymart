# Dato urbano:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Cómo usar Supabase desde el frontend
Instalación de la biblioteca:
Instala supabase-js en tu proyecto frontend (por ejemplo, con React, Vue, Next.js, etc.):
bash

npm install @supabase/supabase-js

Inicialización del cliente:
Configura el cliente de Supabase con la URL de tu proyecto y la clave pública (anon key), que puedes obtener desde el panel de control de Supabase:
javascript

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-clave-pública';
const supabase = createClient(supabaseUrl, supabaseKey);

Interacciones con la API:
Base de datos: Puedes realizar consultas RESTful para leer, insertar, actualizar o eliminar datos directamente desde el frontend. Por ejemplo:
javascript

// Obtener datos
const { data, error } = await supabase
  .from('usuarios')
  .select('*');

// Insertar datos
const { data, error } = await supabase
  .from('usuarios')
  .insert([{ nombre: 'Juan', email: 'juan@example.com' }]);

Autenticación: Supabase ofrece funciones para registro, inicio de sesión y gestión de usuarios:
javascript

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

Almacenamiento: Puedes subir y descargar archivos:
javascript

// Subir un archivo
const { data, error } = await supabase.storage
  .from('avatares')
  .upload('avatar.png', archivo);

Realtime: Puedes suscribirte a cambios en la base de datos en tiempo real:
javascript

supabase
  .from('usuarios')
  .on('INSERT', payload => {
    console.log('Nuevo usuario:', payload.new);
  })
  .subscribe();

Integraciones específicas:
Supabase proporciona integraciones optimizadas para frameworks como React, Next.js, Vue y otros. Por ejemplo, con React, puedes usar el widget Supabase Auth UI para implementar autenticación rápidamente.

También hay tutoriales y plantillas para conectar Supabase con frontend frameworks.


