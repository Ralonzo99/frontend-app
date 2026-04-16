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
  // URL para el CRUD (asumiendo que viene de environment)
  private readonly API_URL = `${environment.apiUrl}/facturas`; 
  
  // URL exacta de tu nuevo Backend en DevTunnels
  private readonly COMPROBANTES_URL = 'https://p4hkhvmf-7132.use.devtunnels.ms/api/v1/comprobantes';

  constructor(private http: HttpClient) {}

  // --- IMPLEMENTACIÓN CRUD ---
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

  // --- IMPLEMENTACIÓN PREVISUALIZACIÓN (NUEVO) ---
  async getInfoComprobante(payload: any): Promise<any> {
    try {
      return await lastValueFrom(this.http.post<any>(`${this.COMPROBANTES_URL}/info`, payload));
    } catch { return null; }
  }

  async getPDFComprobante(payload: any): Promise<Blob> {
    // Importante: responseType blob para recibir archivos
    return await lastValueFrom(
      this.http.post(`${this.COMPROBANTES_URL}/pdf`, payload, { responseType: 'blob' })
    );
  }

  async getXMLComprobante(payload: any): Promise<Blob> {
    return await lastValueFrom(
      this.http.post(`${this.COMPROBANTES_URL}/xml`, payload, { responseType: 'blob' })
    );
  }
}