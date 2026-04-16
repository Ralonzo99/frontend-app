import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// RUTAS CORREGIDAS: Sube a 'app' y entra en 'core'
import { Factura } from '../../core/domain/entities/factura.entity';
import { FacturaRepositoryPort } from '../../core/domain/ports/factura-repository.port';

@Injectable({
  providedIn: 'root'
})
export class FacturaHttpAdapter implements FacturaRepositoryPort {
  private readonly COMPROBANTES_URL = 'https://p4hkhvmf-7132.use.devtunnels.ms/api/v1/comprobantes';

  constructor(private http: HttpClient) {}

  async getInfoComprobante(payload: { tokenRequest: string }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.COMPROBANTES_URL}/info`, payload));
  }

  async getPDFComprobante(payload: { tokenRequest: string }): Promise<Blob> {
    return await lastValueFrom(
      this.http.post(`${this.COMPROBANTES_URL}/pdf`, payload, { responseType: 'blob' })
    );
  }

  async getXMLComprobante(payload: { tokenRequest: string }): Promise<Blob> {
    return await lastValueFrom(
      this.http.post(`${this.COMPROBANTES_URL}/xml`, payload, { responseType: 'blob' })
    );
  }

  async save(f: Factura): Promise<Factura> { return f; }
  async findById(id: string): Promise<Factura | null> { return null; }
  async findAll(): Promise<Factura[]> { return []; }
  async update(id: string, f: Factura): Promise<Factura> { return f; }
  async delete(id: string): Promise<boolean> { return true; }
}