import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { gantt } from 'dhtmlx-gantt';
import { TaskService } from '../../services/task.service';
import { LinkService } from '../../services/link.service';
import { Task } from '../../models/task';
import { Link } from '../../models/link';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gantt',
  standalone: true,
  imports: [],
  templateUrl: './gantt.component.html',
  providers: [TaskService, LinkService],
  styleUrl: './gantt.component.css'
})

export class GanttComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  constructor(private taskService: TaskService, private linkService: LinkService) { }

  ngOnInit() {
    gantt['config']['date_format'] = '%Y-%m-%d %H:%i';
    gantt['config']['scale_unit'] = 'month'; // Escala principal en meses
    gantt['config']['date_scale'] = '%F %Y';
    gantt['config']['scale_height'] = 60; // Altura total de la escala
    // Subescalas: semana y día
    gantt['config']['subscales'] = [
      { unit: 'week', step: 1, date: 'Semana %W' },
      { unit: 'day', step: 1, date: '%j' }
    ];
    gantt['config']['duration_step'] = 1;
    gantt['config']['duration_unit'] = 'day'; // Asegura que la duración se exprese en días en el lightbox
    // Forzar el rango visible a 30 días
    const start = new Date(2025, 0, 15);
    const end = new Date(2025, 12, 15);
    // Configuraciones básicas del Gantt
    gantt.config.start_date = start;
    gantt.config.end_date = end;
    gantt.config.show_progress = true;
    gantt.config.drag_progress = true;
    
    // Configuración de los campos que se deben validar antes de guardar
    gantt.config.buttons_left = ["dhx_save_btn", "dhx_cancel_btn"];
    gantt.config.buttons_right = ["dhx_delete_btn"];
    
    // Validación personalizada antes de guardar
    gantt.attachEvent("onLightboxSave", function(id, item) {
        if (!item['text']) {
            gantt.message({type: "error", text: "Ingrese una descripción para la tarea"});
            return false;
        }
        // Asegurar que 'users' sea siempre un array
        if (item['users'] && !Array.isArray(item['users'])) {
            item['users'] = [item['users']];
        }
        // Asegurar que 'priority' sea un número válido
        if (item['priority']) {
            item['priority'] = Number(item['priority']);
        }
        // Asegurar que 'duration' esté presente y sea un número válido
        if (item['duration'] === undefined || item['duration'] === null || isNaN(Number(item['duration']))) {
            // Si no está, intentar calcularlo usando start_date y end_date si existen
            if (item['start_date'] && item['end_date']) {
                var start = new Date(item['start_date']);
                var end = new Date(item['end_date']);
                var diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                item['duration'] = diff > 0 ? diff : 1;
            } else {
                item['duration'] = 1; // Valor por defecto
            }
        } else {
            item['duration'] = Number(item['duration']);
        }
        return true;
    });

    // Configuración del lightbox
    gantt.config.lightbox.sections = [
        { 
            name: "description",
            height: 38,
            map_to: "text",
            type: "textarea",
            focus: true
        },
        {
            name: "time",
            type: "duration",
            map_to: "auto",
            time_format: ["%d", "%m", "%Y"],
            height: 38
        },
        {
            name: "progress",
            height: 38,
            map_to: "progress",
            type: "select",
            options: [
                { key: 0, label: "0%" },
                { key: 0.1, label: "10%" },
                { key: 0.2, label: "20%" },
                { key: 0.3, label: "30%" },
                { key: 0.4, label: "40%" },
                { key: 0.5, label: "50%" },
                { key: 0.6, label: "60%" },
                { key: 0.7, label: "70%" },
                { key: 0.8, label: "80%" },
                { key: 0.9, label: "90%" },
                { key: 1, label: "100%" }
            ]
        },
        {
            name: "priority",
            height: 38,
            map_to: "priority",
            type: "select",
            options: [
                { key: 1, label: "Alta" },
                { key: 2, label: "Normal" },
                { key: 3, label: "Baja" }
            ]
        },
        {
            name: "assigned",
            height: 38,
            type: "select",
            map_to: "users",
            options: getUserList()
        }
    ];

    // Asegurarse de que los valores por defecto estén establecidos
    gantt.attachEvent("onLightbox", function(id) {
        var task = gantt.getTask(id);
        if (!task.progress) task.progress = 0;
        if (!task['priority']) task['priority'] = 2; // Normal por defecto
        return true;
    });

    gantt.templates.progress_text = function (start, end, task) {
      return Math.round((task.progress ?? 0) * 100) + "%";
    };

    // Traducción de textos de la interfaz de Gantt al castellano, extendiendo las etiquetas existentes para evitar warnings
    gantt.locale.labels = {
      ...gantt.locale.labels,
      dhx_cal_today_button: "Hoy",
      day_tab: "Día",
      week_tab: "Semana",
      month_tab: "Mes",
      new_event: "Nueva tarea",
      icon_save: "Guardar",
      icon_cancel: "Cancelar",
      icon_details: "Detalles",
      icon_edit: "Editar",
      icon_delete: "Eliminar",
      confirm_closing: "¿Seguro que quieres cerrar?", // Cambios no guardados se perderán
      confirm_deleting: "La tarea se eliminará permanentemente. ¿Continuar?",
      section_description: "Descripción",
      section_time: "Duración",
      section_progress: "Progreso",
      grid_task: "Tarea",
      grid_start_time: "Inicio",
      grid_duration: "Duración"
    };

    gantt.config.columns = [
      { name: "text", label: "Tarea", tree: true, width: 200, resize: true },
      { name: "start_date", label: "Inicio", align: "center", width: 90 },
      { name: "duration", label: "Duración", align: "center", width: 80 },
      /* { name: "priority", label: "Prioridad", align: "center", width: 80, template: function (item) {
          if (item['priority'] === 1) return "Alta";
          if (item['priority'] === 2) return "Normal";
          if (item['priority'] === 3) return "Baja";
          return "";
        }
      },
      { name: "users", label: "Asignados", template: function (item) {
          if (!item['users']) return "Nadie";
          return item['users'].join(", ");
        }
      }, */
      { name: "add" }
    ];
    gantt.locale.labels['section_priority'] = "Prioridad";
    gantt.locale.labels['section_assigned'] = "Asignado a";
    
    //gantt.setSkin("meadow");
    //gantt.setSkin("terrace");
    //gantt.setSkin("dark");
    gantt.setSkin("material");

    gantt.templates.rightside_text = function (start, end, task) {
      return task.text || "";
    };

    gantt.templates.leftside_text = function (start, end, task) {
      return task.duration + " days";
    };

    gantt.init(this.ganttContainer.nativeElement);
    if (!(gantt as any).$_initOnce) {
      (gantt as any).$_initOnce = true;

      const dp = gantt.createDataProcessor({
        task: {
          update: (data: Task) => this.taskService.update(data),
          create: (data: Task) => this.taskService.insert(data),
          delete: (id: any) => this.taskService.remove(id),
        },
        link: {
          update: (data: Link) => this.linkService.update(data),
          create: (data: Link) => this.linkService.insert(data),
          delete: (id: any) => this.linkService.remove(id),
        },
      });

      Promise.all([this.taskService.get(), this.linkService.get()]).then(
        ([data, links]) => {
          gantt.parse({ data, links });
        }
      );
    }
  }
}

// Mock de usuarios para getUserList
function getUserList() {
  return [
    { key: 1, label: 'Juan Pérez' },
    { key: 2, label: 'María García' },
    { key: 3, label: 'Carlos López' },
    { key: 4, label: 'Ana Torres' }
  ];
}
