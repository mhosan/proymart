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
    gantt['config']['scale_unit'] = 'month';
    gantt['config']['date_scale'] = '%F %Y';
    gantt['config']['subscales'] = [
      { unit: 'day', step: 1, date: '%j' }
    ];
    gantt['config']['duration_step'] = 30;
    // Forzar el rango visible a 30 días
    const start = new Date(2025, 0, 15); 
    const end = new Date(2025, 12, 15); 
    gantt['config']['start_date'] = start;
    gantt['config']['end_date'] = end;
    gantt['config']['show_progress'] = true;

    gantt['config']['lightbox'] = gantt['config']['lightbox'] || {};
    gantt['config']['lightbox']['sections'] = [
      { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
      { name: 'progress', height: 38, map_to: 'progress', type: 'select', options: [
        { key: 0, label: '0%' },
        { key: 0.1, label: '10%' },
        { key: 0.2, label: '20%' },
        { key: 0.3, label: '30%' },
        { key: 0.4, label: '40%' },
        { key: 0.5, label: '50%' },
        { key: 0.6, label: '60%' },
        { key: 0.7, label: '70%' },
        { key: 0.8, label: '80%' },
        { key: 0.9, label: '90%' },
        { key: 1, label: '100%' }
      ] },
      { name: 'time', type: 'duration', map_to: 'auto' }
    ];

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
