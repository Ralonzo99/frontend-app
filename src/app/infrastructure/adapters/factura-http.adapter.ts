import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { Factura } from '../../core/domain/entities/factura.entity';
import { FacturaRepositoryPort } from '../../core/domain/ports/factura-repository.port';

@Injectable({
  providedIn: 'root'
})
export class FacturaHttpAdapter implements FacturaRepositoryPort {
  private readonly API_URL = `${environment.apiUrl}/facturas`; 

  constructor(private http: HttpClient) {}

  async findById(id: string): Promise<Factura | null> {
    try {
      return await lastValueFrom(this.http.get<Factura>(`${this.API_URL}/${id}`));
    } catch { return null; }
  }

  async findAll(): Promise<Factura[]> {
    try {
      return await lastValueFrom(this.http.get<Factura[]>(this.API_URL));
    } catch { return []; }
  }

  async save(factura: Factura): Promise<Factura> {
    return await lastValueFrom(this.http.post<Factura>(this.API_URL, factura));
  }

  async update(id: string, factura: Factura): Promise<Factura> {
    return await lastValueFrom(this.http.put<Factura>(`${this.API_URL}/${id}`, factura));
  }

  async delete(id: string): Promise<boolean> {
    try {
      const res = await lastValueFrom(this.http.delete<boolean>(`${this.API_URL}/${id}`));
      return !!res;
    } catch { return false; }
  }
}