import { Injectable } from '@angular/core';
import { Link } from '../models/link';
import { HttpClient } from '@angular/common/http';
import { HandleError } from '../services/service-helper.ts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private linkUrl = 'api/links';
  constructor(private http: HttpClient) { }

  get(): Promise<Link[]> {
    return firstValueFrom(this.http.get(this.linkUrl))
      .catch(HandleError);
  }


  insert(link: Link): Promise<Link> {
    return firstValueFrom(this.http.post(this.linkUrl, link))
      .catch(HandleError);
  }


  update(link: Link): Promise<void> {
    return firstValueFrom(this.http.put(`${this.linkUrl}/${link.id}`, link))
      .catch(HandleError);
  }


  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete(`${this.linkUrl}/${id}`))
      .catch(HandleError);
  }

}
