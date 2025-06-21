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
  
  constructor(
    private taskService: TaskService, 
    private linkService: LinkService,
  ) { }


  ngOnInit() {
    gantt['config']['date_format'] = '%Y-%m-%d %H:%i';
    gantt['config']['scales'] = [
      { unit: 'month', step: 1, format: '%F %Y' }, // Escala principal en meses
      { unit: 'week', step: 1, format: 'Semana %W' }, // Subescala: semana
      { unit: 'day', step: 1, format: '%j' } // Subescala: día
    ];
    gantt['config']['scale_height'] = 60; // Altura total de la escala
    gantt['config']['duration_step'] = 1;
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 12, 15);
    // Configuraciones básicas del Gantt
    gantt.config.start_date = start;
    gantt.config.end_date = end;
    gantt.config.show_progress = true;
    gantt.config.drag_progress = true;

    /*********************************************
     * 
     * Configuración del lightbox
     * 
     ********************************************/
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

    gantt.templates.progress_text = function (start, end, task) {
      return Math.round((task.progress ?? 0) * 100) + "%";
    };

    /******************************************
     * 
     * Traducción de textos de la interfaz
     * 
    ******************************************/
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

    /************************************************
     * 
     * Configuración de las columnas
     * 
    ************************************************/
    if (window.innerWidth < 768) {
      // Configuración para dispositivos pequeños
      gantt.config.columns = [
        { name: "add", width: 40 }
      ];
      // Opcional: ajustar el ancho total de la grilla si es necesario
      gantt.config.grid_width = 300;
    } else {
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
      gantt.config.grid_width = 400;
    }


    gantt.locale.labels['section_priority'] = "Prioridad";
    gantt.locale.labels['section_assigned'] = "Asignado a";

    /**************************************************
     * 
     * Estilos
     * 
    **************************************************/
    //gantt.setSkin("meadow");
    //gantt.setSkin("terrace");
    //gantt.setSkin("dark");
    //gantt.setSkin("material");
    //gantt.setSkin("contrast-white");
    //gantt.setSkin("contrast-black");
    //gantt.setSkin("meadow");
    //gantt.setSkin("skyblue");
    gantt.setSkin("broadway");

    gantt.templates.rightside_text = function (start, end, task) {
      return task.text || "";
    };

    gantt.templates.leftside_text = function (start, end, task) {
      return task.duration + " days";
    };

    /*********************************************
     * 
     * Inicialización del Gant
     * 
     *********************************************/
    gantt.init(this.ganttContainer.nativeElement);
    if (!(gantt as any).$_initOnce) {
      (gantt as any).$_initOnce = true;
    }

    /*********************************************
     * 
     * Atajar eventos del usuario
     * 
     *********************************************/
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

// Mock de usuarios para getUserList
function getUserList() {
  return [
    { key: 1, label: 'Juan Pérez' },
    { key: 2, label: 'María García' },
    { key: 3, label: 'Carlos López' },
    { key: 4, label: 'Ana Torres' },
    { key: 5, label: 'Pedro Ramírez' },
    { key: 6, label: 'Laura Martínez' },
    { key: 7, label: 'Luis Alberto Spinetta' }
  ];
}
