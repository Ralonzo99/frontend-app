export interface PdfGeneratorPort {
  generarPDFDesdeHTML(elementoId: string): Promise<string>;
  enviarAWebTool(pdfBase64: string, url: string): Promise<any>;
}