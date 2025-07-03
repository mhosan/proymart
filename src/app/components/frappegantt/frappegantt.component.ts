import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ResponsibleService } from '../../services/responsible.service'; // Importar ResponsibleService
import { LinkService } from '../../services/link.service';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';
import Gantt from 'frappe-gantt';
import { FormsModule } from '@angular/forms';
import { NgIf, NgStyle, NgFor } from '@angular/common';
import { Link } from '../../models/link'; // Import the Link type

/**
 * Definir un tipo para la visualización del Gantt
 */
type ViewModeType = 'Day' | 'Week' | 'Month' | 'Year';

// Definir un tipo personalizado para las tareas de Frappe Gantt que incluya la propiedad 'responsible'
interface FrappeTask extends Gantt.Task {
  responsible?: string;
}

@Component({
  selector: 'app-frappegantt',
  standalone: true,
  imports: [FormsModule, NgIf, NgStyle, NgFor],
  templateUrl: './frappegantt.component.html',
  styleUrl: './frappegantt.component.css',
  providers: [TaskService, LinkService]
})

export class FrappeganttComponent implements OnInit {
  @ViewChild('frappe_gantt_here', { static: true }) ganttContainer!: ElementRef;

  gantt!: Gantt;
  frappeTasks: FrappeTask[] = [];
  newTask = { name: '', start: '', duration: 1, progress: 0, responsible: null as number | null };
  showNewProjectModal = false;
  newProject = { name: '', start: '', end: '' };
  showModal = false;
  showEditTaskModal = false;
  showEditProjectModal = false;
  showSelectProjectModal = false;
  editProject = { id: '', nombre: '', start: '', end: '' };
  selectedProjectId: string = '';
  proyectos: { id: string, nombre: string, start?: string, end?: string }[] = [];
  editTask = { id: '', name: '', start: '', duration: 1, progress: 0, responsible: null as number | null };
  responsibles: { id: number, nombre: string, apellido: string, email: string, telefono: string }[] = [];
  tiempoUnidades: ViewModeType = 'Month'; // Change the type to ViewModeType
  today_button = false;


  constructor(
    private taskService: TaskService,
    private linkService: LinkService,
    private projectService: ProjectService,
    private responsibleService: ResponsibleService
  ) { }

  async ngOnInit() {
    try {
      // Cargar responsables desde la tabla responsible
      this.responsibles = await this.responsibleService.getAll();
      const proyectosBD = await this.projectService.getAll();
      this.proyectos = proyectosBD.map(p => ({ id: String(p.id), nombre: p.name, start: p.start_date, end: p.end_date }));
    } catch (error) {
      console.error('Error al cargar proyectos o responsables:', error);
    }

    // Cargar tareas cuando hay un proyecto activo
    if (this.selectedProjectId) {
      const tasks = await this.taskService.get();
      const links = await this.linkService.get();
      this.frappeTasks = tasks.filter(task => String(task.project_id) === String(this.selectedProjectId)).map(task => {
        const responsibleObj = this.responsibles.find(r => r.id === task.idResponsible);
        return {
          id: String(task.id),
          name: task.text,
          start: typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '',
          end: this.calculateEndDate(typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '', task.duration),
          progress: (Number(task.progress) || 0) * 100,
          dependencies: this.getDependencies(task.id, links),
          responsible: responsibleObj ? `${responsibleObj.nombre} ${responsibleObj.apellido || ''}`.trim() : ''
        };
      });
    } else {
      this.frappeTasks = [];
    }
    this.renderGantt();
  }

  /*********************************************************************
   * 
   * Renderiza el Gantt en el contenedor especificado.
   * Limpia el contenedor antes de renderizar para evitar duplicados.
   ********************************************************************/
  renderGantt() {
    // Limpia el contenedor antes de renderizar para evitar duplicados
    this.ganttContainer.nativeElement.innerHTML = '';
    this.gantt = new Gantt(this.ganttContainer.nativeElement, this.frappeTasks, {
      view_mode: this.tiempoUnidades,
      language: 'es',
      on_click: (task: FrappeTask) => {
        // No hacer nada en click simple
      },
      on_date_change: () => { },
      on_progress_change: () => { },
      on_view_change: () => { }
    });
  }

  /**************************************************************
   * setear unidades de tiempo del gantt en dias, semanas o meses
   *************************************************************/
  setTimeGantt() {
    this.renderGantt();
  }

  /**************************************************************
   * Saltar hasta el dia de hoy en el Gantt
   *************************************************************/  
  setToday() {
    console.log('Botón "Hoy" pulsado');
    if (this.gantt) {
      console.log('Objeto Gantt:', this.gantt);
      (this.gantt as any).scroll_current();
    }
  }


  /************************************************************
   * 
   * Borra la tarea seleccionada y actualiza el Gantt.
   * @returns 
   ***********************************************************/
  onDeleteTask() {
    if (!this.editTask.id) return;
    this.taskService.remove(Number(this.editTask.id))
      .then(async () => {
        const tasks = await this.taskService.get();
        const links = await this.linkService.get();
        this.frappeTasks = tasks.filter(task => String(task.project_id) === String(this.selectedProjectId)).map(task => {
          const responsibleObj = this.responsibles.find(r => r.id === task.idResponsible);
          return {
            id: String(task.id),
            name: task.text,
            start: typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '',
            end: this.calculateEndDate(typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '', task.duration),
            progress: (Number(task.progress) || 0) * 100,
            dependencies: this.getDependencies(task.id, links),
            responsible: responsibleObj ? `${responsibleObj.nombre} ${responsibleObj.apellido || ''}`.trim() : ''
          };
        });
        this.renderGantt();
      })
      .catch(error => {
        console.error('Error al eliminar la tarea:', error);
        alert('Error al eliminar la tarea. Ver consola para más detalles.');
      })
      .finally(() => {
        this.editTask = { id: '', name: '', start: '', duration: 1, progress: 0, responsible: null };
        this.showEditTaskModal = false;
      });
  }

  /************************************************************
   * 
   * Abre el modal para editar la tarea seleccionada.
   * Carga los datos de la tarea en el formulario de edición.
   ***********************************************************/
  async onSelectEditTask() {
    // Busca la tarea seleccionada y carga sus datos en el formulario
    const t = this.frappeTasks.find(task => String(task.id) === String(this.editTask.id));
    if (t) {
      this.editTask.name = t.name;
      // Obtener el responsable real desde la base de datos (array de IDs)
      if (t && t.id) {
        const originalTask = await this.taskService.get();
        const dbTask = originalTask.find((task: any) => String(task.id) === String(t.id));
        if (dbTask && dbTask.idResponsible) {
          this.editTask.responsible = dbTask.idResponsible;
        } else {
          this.editTask.responsible = null;
        }
        if (dbTask && dbTask.start_date) {
          let dateStr = String(dbTask.start_date);
          dateStr = dateStr.split('T')[0].split(' ')[0];
          this.editTask.start = /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : '';
        } else {
          this.editTask.start = '';
        }
      } else {
        this.editTask.start = '';
        this.editTask.responsible = null;
      }
      // Calcula duración a partir de start y end si existe, solo usando strings para evitar desfases de zona horaria
      if (t.start && t.end) {
        const startStr = String(t.start).split('T')[0].split(' ')[0];
        const endStr = String(t.end).split('T')[0].split(' ')[0];
        const [sy, sm, sd] = startStr.split('-').map(Number);
        const [ey, em, ed] = endStr.split('-').map(Number);
        const startUTC = Date.UTC(sy, sm - 1, sd);
        const endUTC = Date.UTC(ey, em - 1, ed);
        const diff = Math.max(1, Math.round((endUTC - startUTC) / (1000 * 60 * 60 * 24)) + 1);
        this.editTask.duration = diff;
      } else {
        this.editTask.duration = 1;
      }
      this.editTask.progress = t.progress != null ? Math.round(Number(t.progress)) : 0;
    } else {
      this.editTask.name = '';
      this.editTask.start = '';
      this.editTask.duration = 1;
      this.editTask.progress = 0;
      this.editTask.responsible = null;
    }
  }

  /************************************************************************
   * 
   * Actualiza la tarea seleccionada en la base de datos y recarga el Gantt.
   * Si no hay tarea seleccionada, no hace nada.
   ***********************************************************************/
  onEditTask() {
    if (!this.editTask.id) return;
    let formattedStart = this.editTask.start;
    if (/^\d{4}-\d{2}-\d{2}/.test(this.editTask.start)) {
      formattedStart = this.editTask.start.split('T')[0].split(' ')[0];
    }
    const updatedTask: any = {
      id: this.editTask.id,
      text: this.editTask.name,
      start_date: formattedStart,
      duration: this.editTask.duration,
      progress: Number(this.editTask.progress) / 100,
      idProject: this.selectedProjectId,
      idResponsible: this.editTask.responsible != null ? Number(this.editTask.responsible) : null
    };
    this.taskService.update(updatedTask)
      .then(async () => {
        const tasks = await this.taskService.get();
        const links = await this.linkService.get();
        this.frappeTasks = tasks.filter(task => String(task.project_id) === String(this.selectedProjectId)).map(task => {
          const responsibleObj = this.responsibles.find(r => r.id === task.idResponsible);
          return {
            id: String(task.id),
            name: task.text,
            start: typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '',
            end: this.calculateEndDate(typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '', task.duration),
            progress: (Number(task.progress) || 0) * 100,
            dependencies: this.getDependencies(task.id, links),
            responsible: responsibleObj ? `${responsibleObj.nombre} ${responsibleObj.apellido || ''}`.trim() : ''
          };
        });
        this.renderGantt();
      })
      .catch(error => {
        console.error('Error al actualizar la tarea:', error);
        alert('Error al actualizar la tarea. Ver consola para más detalles.');
      })
      .finally(() => {
        this.editTask = { ...this.editTask, responsible: null };
      });
  }

  /*********************************************************************
   * 
   * Abre el modal para seleccionar un proyecto.
   * Si no hay proyectos, muestra un mensaje.
   ********************************************************************/
  async onSelectProject(): Promise<void> {
    // Si no hay proyecto seleccionado, limpiar selección y tareas
    if (!this.selectedProjectId) {
      this.selectedProjectId = '';
      this.frappeTasks = [];
      this.renderGantt();
      return;
    }
    // Al seleccionar un proyecto, cargar solo las tareas de ese proyecto desde la base de datos
    try {
      const tasks = await this.taskService.get();
      const links = await this.linkService.get();
      this.frappeTasks = tasks.filter(task => String(task.project_id) === String(this.selectedProjectId)).map(task => ({
        id: String(task.id),
        name: task.text,
        start: typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '',
        end: this.calculateEndDate(typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '', task.duration),
        progress: (Number(task.progress) || 0) * 100,
        dependencies: this.getDependencies(task.id, links)
      }));
    } catch (error) {
      console.error('Error al cargar tareas del proyecto:', error);
      this.frappeTasks = [];
    }
    this.renderGantt();
  }

  /*********************************************************************
   * 
   * Abre el modal para crear un nuevo proyecto.
   * Limpia el formulario de creación de proyecto.
   ********************************************************************/
  async onEditProject() {
    if (!this.editProject.id || !this.editProject.start || !this.editProject.end) return;
    // Guardar siempre en formato 'YYYY-MM-DD' puro (sin hora)
    let formattedStart = this.editProject.start;
    let formattedEnd = this.editProject.end;
    if (/^\d{4}-\d{2}-\d{2}/.test(this.editProject.start)) {
      formattedStart = this.editProject.start.split('T')[0].split(' ')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(this.editProject.end)) {
      formattedEnd = this.editProject.end.split('T')[0].split(' ')[0];
    }
    // Buscar el proyecto original para obtener el nombre si no se editó
    const idx = this.proyectos.findIndex((p: { id: string }) => p.id === this.editProject.id);
    if (idx !== -1) {
      const updatedProject = {
        id: Number(this.editProject.id),
        name: this.editProject.nombre,
        start_date: formattedStart,
        end_date: formattedEnd
      };
      try {
        const saved = await this.projectService.update(updatedProject);
        if (saved) {
          // Actualizar el array local
          this.proyectos[idx] = {
            id: String(saved.id),
            nombre: saved.name,
            start: saved.start_date,
            end: saved.end_date
          };
        }
      } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        alert('Error al actualizar el proyecto. Ver consola para más detalles.');
      }
    }
    // Limpia el formulario
    this.editProject = { id: '', nombre: '', start: '', end: '' };
  }

  /*********************************************************************
   * 
   * Crea un nuevo proyecto y lo guarda usando ProjectService.
   * Si el proyecto tiene nombre, fecha de inicio y fin, lo guarda en 
   * la base de datos y lo agrega al array de proyectos locales.
   
  ********************************************************************/
  async onCreateProject() {
    if (!this.newProject.name || !this.newProject.start || !this.newProject.end) return;
    // Guardar siempre en formato 'YYYY-MM-DD' puro (sin hora)
    let formattedStart = this.newProject.start;
    let formattedEnd = this.newProject.end;
    if (/^\d{4}-\d{2}-\d{2}/.test(this.newProject.start)) {
      formattedStart = this.newProject.start.split('T')[0].split(' ')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(this.newProject.end)) {
      formattedEnd = this.newProject.end.split('T')[0].split(' ')[0];
    }
    const project: Project = {
      name: this.newProject.name,
      start_date: formattedStart,
      end_date: formattedEnd
    };
    try {
      const saved = await this.projectService.insert(project);
      if (saved) {
        this.proyectos.push({ id: String(saved.id), nombre: saved.name });
      }
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
    }
    // Limpia el formulario
    this.newProject = { name: '', start: '', end: '' };
  }

  /*********************************************************************
   * 
   * Agrega una nueva tarea al proyecto activo.
   * Si no hay proyecto activo, muestra un mensaje de alerta.
   ********************************************************************/
  async addTask(name: string, start: string, duration: number, progress: number) {
    // No permitir alta de tareas si no hay proyecto activo
    if (!this.selectedProjectId) {
      alert('Debe seleccionar un proyecto activo antes de agregar tareas.');
      return;
    }
    // Evitar desfase de fechas: parsear manualmente la fecha (YYYY-MM-DD)
    // y no usar new Date() para formatear
    // Si el input es YYYY-MM-DD, simplemente agregar la hora fija
    // Guardar siempre en formato 'YYYY-MM-DD' puro (sin hora)
    let formattedStart = start;
    if (/^\d{4}-\d{2}-\d{2}/.test(start)) {
      formattedStart = start.split('T')[0].split(' ')[0];
    }
    const newTask: any = {
      text: name,
      start_date: formattedStart,
      duration: duration,
      progress: Number(progress) / 100,
      parent: 0,
      priority: null,
      type: null,
      project_id: this.selectedProjectId,
      idResponsible: this.newTask.responsible != null ? Number(this.newTask.responsible) : null
    };
    try {
      await this.taskService.insert(newTask);
      // Recargar todas las tareas del proyecto activo desde la base de datos y actualizar el Gantt
      const tasks = await this.taskService.get();
      const links = await this.linkService.get();
      this.frappeTasks = tasks.filter(task => String(task.project_id) === String(this.selectedProjectId)).map(task => {
        const responsibleObj = this.responsibles.find(r => r.id === task.idResponsible);
        return {
          id: String(task.id),
          name: task.text,
          start: typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '',
          end: this.calculateEndDate(typeof task.start_date === 'string' ? task.start_date.split(' ')[0] : '', task.duration),
          progress: (Number(task.progress) || 0) * 100,
          dependencies: this.getDependencies(task.id, links),
          responsible: responsibleObj ? `${responsibleObj.nombre} ${responsibleObj.apellido || ''}`.trim() : ''
        };
      });
      this.renderGantt();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      alert('Error al guardar la tarea. Ver consola para más detalles.');
    }
  }

  /*********************************************************************
   * 
   * Maneja el envío del formulario para agregar una nueva tarea.
   * Valida que haya un proyecto activo y que los campos de la tarea
   * estén completos.
   ********************************************************************/
  onSubmit() {
    if (!this.selectedProjectId) {
      alert('Debe seleccionar un proyecto activo antes de agregar tareas.');
      return;
    }
    // Also check if responsible is selected
    if (!this.newTask.name || !this.newTask.start || !this.newTask.duration || this.newTask.responsible == null) {
      alert('Por favor, complete todos los campos de la tarea, incluyendo el responsable.');
      return;
    }
    this.addTask(this.newTask.name, this.newTask.start, Number(this.newTask.duration), Number(this.newTask.progress));
    // Reset responsible field after submission
    this.newTask = { name: '', start: '', duration: 1, progress: 0, responsible: null };
  }


  /*********************************************************************
   * 
   * Calcula la fecha de finalización a partir de la fecha de inicio 
   * y la duración. Devuelve la fecha en formato ISO (YYYY-MM-DD).
   ********************************************************************/
  calculateEndDate(start: string, duration: number): string {
    // Calcular la fecha de fin solo usando strings (YYYY-MM-DD) y sin objetos Date
    // start: 'YYYY-MM-DD', duration: número de días
    if (!start || !/^\d{4}-\d{2}-\d{2}/.test(start) || !duration) return '';
    const [year, month, day] = start.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day));
    startDate.setUTCDate(startDate.getUTCDate() + Number(duration) - 1); // -1 para que duración 1 sea mismo día
    // Formatear a 'YYYY-MM-DD' puro
    const yyyy = startDate.getUTCFullYear();
    const mm = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(startDate.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /*********************************************************************
   * 
   * Obtiene las dependencias de una tarea a partir de los enlaces.
   * Devuelve un string con los IDs de las tareas dependientes, 
   * separados por comas.
   ********************************************************************/
  getDependencies(taskId: number, links: Link[]): string {
    return links.filter(l => l.target === taskId).map(l => String(l.source)).join(',');
  }

  /*********************************************************************
   * 
   * Abre el modal para editar el proyecto seleccionado.
   * Precarga los datos del proyecto en el formulario de edición.
   ********************************************************************/
  onOpenEditProjectModal() {
    // Buscar el proyecto seleccionado
    const proyecto = this.proyectos.find(p => p.id === this.selectedProjectId);
    if (proyecto) {
      this.editProject = {
        id: proyecto.id,
        nombre: proyecto.nombre,
        start: typeof proyecto.start === 'string' ? proyecto.start.split('T')[0].split(' ')[0] : '',
        end: typeof proyecto.end === 'string' ? proyecto.end.split('T')[0].split(' ')[0] : ''
      };
    } else {
      this.editProject = { id: '', nombre: '', start: '', end: '' };
    }
    this.showEditProjectModal = true;
  }
}
