# Documentación de Frappe Gantt

## Características Principales

*   **Vistas personalizables**: Personaliza la línea de tiempo según varios períodos de tiempo: día, hora o año. También puedes crear tus propias vistas.
*   **Ignorar Períodos**: Excluye fines de semana y otros días festivos del cálculo del progreso de tus tareas.
*   **Configura cualquier cosa**: Espaciado, acceso de edición, etiquetas, puedes controlarlo todo. Cambia tanto el estilo como la funcionalidad para satisfacer tus necesidades.
*   **Soporte multilingüe**: Adecuado para empresas con una base internacional.

### Uso

**Instalación:**

```bash
npm install frappe-gantt
```

**Inclusión en HTML:**

Puedes incluir los archivos desde tu instalación local:

```html
<script src="frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="frappe-gantt.css">
```

O usar un CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css">
```

**Inicialización:**

```javascript
let tasks = [
  {
    id: '1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20
  },
  // ... más tareas
];

let gantt = new Gantt("#gantt", tasks);
```

### Configuración

Frappe Gantt ofrece una amplia gama de opciones para personalizar tu gráfico.

| Opción | Descripción | Valores Posibles | Por Defecto |
| :--- | :--- | :--- | :--- |
| `arrow_curve` | Radio de la curva de las flechas que conectan dependencias. | Cualquier entero positivo. | `5` |
| `auto_move_label` | Mueve las etiquetas de las tareas cuando el usuario se desplaza horizontalmente. | `true`, `false` | `false` |
| `bar_corner_radius` | Radio de las esquinas de la barra de tareas (en píxeles). | Cualquier entero positivo. | `3` |
| `bar_height` | Altura de las barras de tareas (en píxeles). | Cualquier entero positivo. | `30` |
| `container_height` | Altura del contenedor. | `auto` (altura dinámica) o cualquier entero positivo (píxeles). | `auto` |
| `column_width` | Ancho de cada columna en la línea de tiempo. | Cualquier entero positivo. | `45` |
| `date_format` | Formato para mostrar fechas. | Cualquier cadena de formato de fecha de JS válida. | `YYYY-MM-DD` |
| `upper_header_height` | Altura del encabezado superior en la línea de tiempo (en píxeles). | Cualquier entero positivo. | `45` |
| `lower_header_height` | Altura del encabezado inferior en la línea de tiempo (en píxeles). | Cualquier entero positivo. | `30` |
| `snap_at` | Ajusta las tareas a un intervalo particular al cambiar de tamaño o arrastrar. | Cualquier intervalo (ver más abajo). | `1d` |
| `infinite_padding` | Extiende la línea de tiempo infinitamente cuando el usuario se desplaza. | `true`, `false` | `true` |
| `holidays` | Días festivos resaltados en la línea de tiempo. | Objeto que mapea colores CSS a tipos de festivos. | `{ 'var(--g-weekend-highlight-color)': 'weekend' }` |
| `ignore` | Áreas ignoradas en el renderizado. | `weekend` o un array de cadenas o fechas. | `[]` |
| `language` | Idioma para la localización. | Códigos ISO 639-1 como `en`, `fr`, `es`. | `en` |
| `lines` | Determina qué líneas de la cuadrícula mostrar. | `none`, `vertical`, `horizontal`, `both`. | `both` |
| `move_dependencies` | Mover una tarea mueve automáticamente sus dependencias. | `true`, `false` | `true` |
| `padding` | Relleno alrededor de las barras de tareas (en píxeles). | Cualquier entero positivo. | `18` |
| `popup_on` | Evento para activar la visualización del popup. | `click` o `hover` | `click` |
| `readonly_progress` | Deshabilita la edición del progreso de la tarea. | `true`, `false` | `false` |
| `readonly_dates` | Deshabilita la edición de las fechas de la tarea. | `true`, `false` | `false` |
| `readonly` | Deshabilita todas las funciones de edición. | `true`, `false` | `false` |
| `scroll_to` | Determina el punto de inicio cuando se renderiza el gráfico. | `today`, `start`, `end`, o una cadena de fecha. | `today` |
| `show_expected_progress` | Muestra el progreso esperado para las tareas. | `true`, `false` | `false` |
| `today_button` | Agrega un botón para navegar a la fecha de hoy. | `true`, `false` | `true` |
| `view_mode` | El modo de vista inicial del gráfico de Gantt. | `Day`, `Week`, `Month`, `Year`. | `Day` |
| `view_mode_select` | Permite seleccionar el modo de vista desde un menú desplegable. | `true`, `false` | `false` |

### API

Frappe Gantt expone algunos métodos útiles para interactuar con el gráfico:

| Nombre | Descripción | Parámetros |
| :--- | :--- | :--- |
| `.update_options` | Vuelve a renderizar el gráfico después de actualizar opciones específicas. | `new_options` - objeto que contiene las nuevas opciones. |
| `.change_view_mode` | Actualiza el modo de vista. | `view_mode` - Nombre del modo de vista u objeto de modo de vista y `maintain_pos` - si se debe volver a la posición de desplazamiento actual después de renderizar, por defecto es `false`. |
| `.scroll_current` | Se desplaza a la fecha actual. | Sin parámetros. |
| `.update_task` | Vuelve a renderizar solo una barra de tarea específica. | `task_id` - id de la tarea y `new_details` - objeto que contiene las propiedades de la tarea a actualizar. |

### Entorno de Desarrollo

Si quieres contribuir con mejoras o correcciones:

1.  Clona el repositorio.
2.  Entra en el directorio del proyecto con `cd`.
3.  Ejecuta `pnpm i` para instalar las dependencias.
4.  Ejecuta `pnpm run build` para construir los archivos, o `pnpm run build-dev` para construir y observar los cambios.
5.  Abre `index.html` en tu navegador.
6.  Realiza tus cambios en el código y pruébalos.
