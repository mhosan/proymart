import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { LinkService } from '../../services/link.service';
import { Task } from '../../models/task';
import { Link } from '../../models/link';
import Gantt from 'frappe-gantt';

@Component({
  selector: 'app-frappegantt',
  standalone: true,
  templateUrl: './frappegantt.component.html',
  styleUrl: './frappegantt.component.css',
  providers: [TaskService, LinkService]
})
export class FrappeganttComponent implements OnInit {
  @ViewChild('frappe_gantt_here', { static: true }) ganttContainer!: ElementRef;
  gantt: any;
  frappeTasks: any[] = [];

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
    this.renderGantt();
  }

  addTask() {
    const newId = (Math.max(0, ...this.frappeTasks.map(t => +t.id)) + 1).toString();
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      id: newId,
      name: 'Nueva tarea',
      start: today,
      end: today,
      progress: 0,
      dependencies: ''
    };
    this.frappeTasks.push(newTask);
    this.renderGantt();
    
  }

  renderGantt() {
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
