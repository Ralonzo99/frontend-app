export interface PdfGeneratorPort {
  generarPDFDesdeHTML(elementId: string): Promise<string>;
}