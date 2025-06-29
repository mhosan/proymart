import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { LinkService } from '../../services/link.service';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { Link } from '../../models/link';
import Gantt from 'frappe-gantt';
import { FormsModule } from '@angular/forms';
import { NgIf, NgStyle, NgFor } from '@angular/common';

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

  gantt: any;
  frappeTasks: any[] = [];
  newTask = { name: '', start: '', duration: 1 };
  showNewProjectModal = false;
  newProject = { name: '', start: '', end: '' };
  showModal = false;
  showEditTaskModal = false;
  showEditProjectModal = false;
  showSelectProjectModal = false;
  editProject = { id: '', start: '', end: '' };
  selectedProjectId: string = '';
  proyectos: { id: string, nombre: string }[] = [
    { id: '1', nombre: 'Proyecto Demo 1' },
    { id: '2', nombre: 'Proyecto Demo 2' },
    { id: '3', nombre: 'Proyecto Demo 3' }
  ];

  constructor(
    private taskService: TaskService,
    private linkService: LinkService,
    private projectService: ProjectService
  ) { }

  async ngOnInit() {
    const tasks = await this.taskService.get();
    const links = await this.linkService.get();
    this.frappeTasks = tasks.map(task => ({
      id: String(task.id),
      name: task.text,
      start: task.start_date.split(' ')[0],
      end: this.calculateEndDate(task.start_date, task.duration), 
      progress: Math.round((task.progress || 0) * 100),
      dependencies: this.getDependencies(task.id, links)
    }));
    // Llenar el array de proyectos para el select (descomentar para usar datos reales)
    //this.proyectos = this.frappeTasks.map(t => ({ id: t.id, nombre: t.name }));
    this.renderGantt();
  }

  onDeleteTask() {
    if (!this.editTask.id) return;
    const idx = this.frappeTasks.findIndex(t => String(t.id) === String(this.editTask.id));
    if (idx !== -1) {
      this.frappeTasks.splice(idx, 1);
      this.renderGantt();
    }
    this.editTask = { id: '', name: '', start: '', duration: 1 };
    this.showEditTaskModal = false;
  }
  editTask = { id: '', name: '', start: '', duration: 1 };

  onSelectEditTask() {
    // Busca la tarea seleccionada y carga sus datos en el formulario
    const t = this.frappeTasks.find(task => String(task.id) === String(this.editTask.id));
    if (t) {
      this.editTask.name = t.name;
      this.editTask.start = t.start;
      // Calcula duración a partir de start y end si existe
      if (t.start && t.end) {
        const startDate = new Date(t.start);
        const endDate = new Date(t.end);
        const diff = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        this.editTask.duration = diff;
      } else {
        this.editTask.duration = 1;
      }
    } else {
      this.editTask.name = '';
      this.editTask.start = '';
      this.editTask.duration = 1;
    }
  }

  onEditTask() {
    // Aquí deberías agregar la lógica para editar la tarea seleccionada
    // Por ejemplo, buscar la tarea por id y actualizar sus datos
    // const idx = this.frappeTasks.findIndex(t => t.id === this.editTask.id);
    // if (idx !== -1) {
    //   this.frappeTasks[idx] = { ...this.frappeTasks[idx], ...this.editTask };
    // }
    // Limpia el formulario
    this.editTask = { id: '', name: '', start: '', duration: 1 };
  }

  onSelectProject(): void {
    // Aquí puedes agregar la lógica para manejar el cambio de proyecto activo
    // Por ejemplo, podrías filtrar tareas por proyecto, etc.
    // console.log('Proyecto seleccionado:', this.selectedProjectId);
  }

  onEditProject(): void {
    if (!this.editProject.id || !this.editProject.start || !this.editProject.end) return;
    // Aquí puedes agregar la lógica para modificar el proyecto en el array o backend
    const idx = this.proyectos.findIndex((p: { id: string }) => p.id === this.editProject.id);
    if (idx !== -1) {
      // Solo actualiza fechas, el nombre se mantiene
      // Si quieres actualizar el nombre, agrega un campo y lógica aquí
      // this.proyectos[idx].nombre = this.editProject.nombre;
    }
    // Limpia el formulario
    this.editProject = { id: '', start: '', end: '' };
  }

  /*********************************************************************
   * Crea un nuevo proyecto y lo guarda usando ProjectService.
   * Si el proyecto tiene nombre, fecha de inicio y fin, lo guarda en la base de datos
   * y lo agrega al array de proyectos locales.
   ********************************************************************/
  async onCreateProject() {
    if (!this.newProject.name || !this.newProject.start || !this.newProject.end) return;
    const project: Project = {
      name: this.newProject.name,
      start_date: this.newProject.start,
      end_date: this.newProject.end
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

  addTask(name: string, start: string, duration: number) {
    const newId = (Math.max(0, ...this.frappeTasks.map(t => +t.id)) + 1).toString();
    const newTask = {
      id: newId,
      name,
      start,
      end: this.calculateEndDate(start, duration),
      progress: 0,
      dependencies: ''
    };
    this.frappeTasks.push(newTask);
    this.renderGantt();
  }

  onSubmit() {
    if (!this.newTask.name || !this.newTask.start || !this.newTask.duration) return;
    this.addTask(this.newTask.name, this.newTask.start, Number(this.newTask.duration));
    this.newTask = { name: '', start: '', duration: 1 };
  }

  renderGantt() {
    // Limpia el contenedor antes de renderizar para evitar duplicados
    this.ganttContainer.nativeElement.innerHTML = '';
    this.gantt = new Gantt(this.ganttContainer.nativeElement, this.frappeTasks, {
      view_mode: 'Day',
      language: 'es',
      on_click: (task: any) => {
        // No hacer nada en click simple
      },
      on_date_change: () => { },
      on_progress_change: () => { },
      on_view_change: () => { }
    });
  }

  calculateEndDate(start: string, duration: number): string {
    const date = new Date(start);
    date.setDate(date.getDate() + duration);
    return date.toISOString().split('T')[0];
  }

  getDependencies(taskId: number, links: Link[]): string {
    return links.filter(l => l.target === taskId).map(l => String(l.source)).join(',');
  }
}
