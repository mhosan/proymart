import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { HandleError } from '../services/service-helper.ts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskUrl = 'api/tasks';
  constructor(private http: HttpClient) { }

  get(): Promise<Task[]> {
    return firstValueFrom(this.http.get(this.taskUrl))
      .then(data => {
        console.log('TaskService.get() data:', data);
        return data;
      })
      .catch(HandleError);
  }

  insert(task: Task): Promise<Task> {
    return firstValueFrom(this.http.post(this.taskUrl, task))
      .catch(HandleError);
  }

  update(task: Task): Promise<void> {
    return firstValueFrom(this.http.put(`${this.taskUrl}/${task.id}`, task))
      .catch(HandleError);
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete(`${this.taskUrl}/${id}`))
      .catch(HandleError);
  }
  
}
