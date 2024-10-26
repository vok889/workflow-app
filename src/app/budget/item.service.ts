// item.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateItem, EditItem, Item, ItemStatus } from './models/item';
import { ENV_CONFIG } from '../env.config';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // change to use envConfig
  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/items`;

  private httpClient = inject(HttpClient);

  constructor() {}

  list() {
    return this.httpClient.get<Item[]>(this.URL);
  }

  get(id: number) {
    return this.httpClient.get<Item>(`${this.URL}/${id}`)
  }

  add(item: CreateItem) {
    return this.httpClient.post<Item>(this.URL, item);
  }

  edit(id: number, item: EditItem) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}`, item);
  }

  delete(id: number) {
    return this.httpClient.delete<void>(`${this.URL}/${id}`);
  }

  approve(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}/approve`, null);
  }

  reject(id: number) {
    return this.httpClient.patch<Item>(`${this.URL}/${id}/reject`, null);
  }
}
