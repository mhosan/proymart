import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { LinkService } from '../../services/link.service';
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
  proyectos: { id: string, nombre: string }[] = [
    { id: '1', nombre: 'Proyecto Demo 1' },
    { id: '2', nombre: 'Proyecto Demo 2' },
    { id: '3', nombre: 'Proyecto Demo 3' }
  ];
  newTask = { name: '', start: '', duration: 1 };
  showModal = false;

  constructor(
    private taskService: TaskService,
    private linkService: LinkService
  ) {}

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
