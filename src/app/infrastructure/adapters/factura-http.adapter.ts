import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// Importamos el environment (Angular usará el .development si corres npm run dev)
import { environment } from '../../../environments/environment';

// Rutas de dominio
import { Factura } from '../../core/domain/entities/factura.entity';
import { FacturaRepositoryPort } from '../../core/domain/ports/factura-repository.port';

@Injectable({
  providedIn: 'root'
})
export class FacturaHttpAdapter implements FacturaRepositoryPort {
  
  // Usamos la URL del environment. Si termina en /comprobantes, aquí queda perfecto.
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la información básica del comprobante
   */
  async getInfoComprobante(payload: { tokenRequest: string }): Promise<any> {
    try {
      const url = `${this.BASE_URL}/info`;
      return await lastValueFrom(this.http.post<any>(url, payload));
    } catch (error) {
      console.error('Error en getInfoComprobante:', error);
      throw error;
    }
  }

  /**
   * Obtiene el archivo PDF como un Blob
   */
  async getPDFComprobante(payload: { tokenRequest: string }): Promise<Blob> {
    try {
      const url = `${this.BASE_URL}/pdf`;
      return await lastValueFrom(
        this.http.post(url, payload, { responseType: 'blob' })
      );
    } catch (error) {
      console.error('Error en getPDFComprobante:', error);
      throw error;
    }
  }

  /**
   * Obtiene el archivo XML como un Blob
   */
  async getXMLComprobante(payload: { tokenRequest: string }): Promise<Blob> {
    try {
      const url = `${this.BASE_URL}/xml`;
      return await lastValueFrom(
        this.http.post(url, payload, { responseType: 'blob' })
      );
    } catch (error) {
      console.error('Error en getXMLComprobante:', error);
      throw error;
    }
  }

  // --- Implementación obligatoria del puerto FacturaRepositoryPort ---
  async save(f: Factura): Promise<Factura> { return f; }
  async findById(id: string): Promise<Factura | null> { return null; }
  async findAll(): Promise<Factura[]> { return []; }
  async update(id: string, f: Factura): Promise<Factura> { return f; }
  async delete(id: string): Promise<boolean> { return true; }
}