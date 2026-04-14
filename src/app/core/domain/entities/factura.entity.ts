export interface Factura {
  id: string;
  numero: string;
  fechaEmision: Date;
  estado: string;

  emisor: {
    ruc: string;
    nombre: string;
  };

  receptor: {
    nombre: string;
  };

  claveAcceso?: string;
}