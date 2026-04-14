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
  numeroAutorizacion?: string;
  pdfBase64?: string; // Campo vital para el visor
}