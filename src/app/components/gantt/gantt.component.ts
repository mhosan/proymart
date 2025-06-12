import { Component, ElementRef, OnInit, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import { gantt } from 'dhtmlx-gantt';

@Component({
  //encapsulation: ViewEncapsulation.None,
  selector: 'gantt',
  standalone: true,
  imports: [],
  templateUrl: './gantt.component.html',
  styleUrl: './gantt.component.css'
})
export class GanttComponent implements OnInit {
  @ViewChild('gantt_here',{static: true}) ganttContainer!: ElementRef;

  ngOnInit() {
    gantt.init(this.ganttContainer.nativeElement);
  }

}
