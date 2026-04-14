import { Injectable } from '@angular/core';
import { PdfGeneratorPort } from '../../core/domain/ports/pdf-generator.port';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfHtmlAdapter implements PdfGeneratorPort {

  async generarPDFDesdeHTML(elementoId: string): Promise<string> {
    const element = document.getElementById(elementoId);
    if (!element) throw new Error('Elemento no encontrado');

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    return pdf.output('datauristring').split(',')[1];
  }

  async enviarAWebTool(pdfBase64: string, url: string): Promise<any> {
    console.log(`📤 Enviando PDF a Web Tool: ${url}`);
    console.log(`📄 Longitud Base64: ${pdfBase64.length}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'PDF recibido por WT',
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  }
}