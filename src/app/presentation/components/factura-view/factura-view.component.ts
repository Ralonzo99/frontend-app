import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FacturaApplicationService } from '../../../core/application/services/factura-application.service';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-view.component.html',
  styleUrls: ['./factura-view.component.css']
})
export class FacturaViewComponent implements OnInit {
  
  fechaActual: Date = new Date(); // Captura la fecha real actual
  pdfUrl!: SafeResourceUrl;
  isLoading: boolean = true;

  facturaData: any = {
    numero: '---',
    estado: 'PROCESANDO',
    emisor: { nombre: 'Buscando emisor...', ruc: '0000000000001' },
    receptor: { nombre: 'Cargando receptor...' },
    pdfBase64: null,
    fechaEmision: null
  };

  constructor(
    private sanitizer: DomSanitizer,
    private facturaService: FacturaApplicationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatos();
    }
  }

  async cargarDatos() {
    try {
      const data = await this.facturaService.obtenerTodas();
      if (data && data.length > 0) {
        const f = data[0] as any;
        this.facturaData = {
          numero: f.noComprobante || f.numero || '---',
          estado: 'AUTORIZADO',
          emisor: { nombre: f.emisor, ruc: f.ruc },
          receptor: { nombre: f.receptor },
          pdfBase64: f.pdfBase64,
          fechaEmision: f.fechaEmision
        };
        if (f.pdfBase64) {
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${f.pdfBase64}`);
        }
      }
    } catch (e) {
      console.error("Error al conectar con puerto 7001");
    } finally {
      this.isLoading = false;
    }
  }

  descargarPDF() {
    if (this.facturaData.pdfBase64) {
      const byteCharacters = atob(this.facturaData.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_${this.facturaData.numero}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  descargarXML() {
    alert("El archivo XML estará disponible cuando el SRI autorice el comprobante.");
  }
}