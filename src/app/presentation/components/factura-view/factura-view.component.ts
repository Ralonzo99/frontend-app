import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-view.component.html',
  styleUrls: ['./factura-view.component.css']
})
export class FacturaViewComponent implements OnInit {

  facturaData: any = {};

  pdfUrl!: SafeResourceUrl;

  zoom = 1;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    // 🔥 MOCK FACTURA
    this.facturaData = {
      numero: '001-180-000000001',
      fechaEmision: new Date(),
      emisor: {
        nombre: 'Mi Empresa S.A.',
        ruc: '1793206667001'
      },
      receptor: {
        nombre: 'Cliente Demo'
      }
    };

    // 📄 PDF desde public/
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/Semana-2-Pasantias.pdf'
    );
  }

  // =========================
  // 🔍 ZOOM
  // =========================
  zoomIn() {
    this.zoom += 0.1;
  }

  zoomOut() {
    if (this.zoom > 0.5) this.zoom -= 0.1;
  }

  resetZoom() {
    this.zoom = 1;
  }

  // =========================
  // ⬇ DESCARGAS
  // =========================
  descargarPDF() {
    const link = document.createElement('a');
    link.href = '/Semana-2-Pasantias.pdf';
    link.download = 'factura.pdf';
    link.click();
  }

  descargarXML() {
    // 🔥 MOCK XML
    const xmlContent = `
      <factura>
        <numero>${this.facturaData.numero}</numero>
        <emisor>${this.facturaData.emisor.nombre}</emisor>
      </factura>
    `;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'factura.xml';
    link.click();
  }
}