import { Factura } from '../entities/factura.entity';

export interface FacturaRepositoryPort {

  // Guardar nueva factura
  save(factura: Factura): Promise<Factura>;

  // Buscar por ID
  findById(id: string): Promise<Factura | null>;

  // Obtener todas
  findAll(): Promise<Factura[]>;

  // Actualizar factura existente
  update(id: string, factura: Factura): Promise<Factura>;

  // Eliminar factura
  delete(id: string): Promise<boolean>;
}