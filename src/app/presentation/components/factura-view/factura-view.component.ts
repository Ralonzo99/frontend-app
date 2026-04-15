import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // CORREGIDO: de @angular/core
import { CommonModule, isPlatformBrowser } from '@angular/common'; // CORREGIDO: de @angular/common
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

  facturaData: any = {
    numero: '---',
    estado: 'Sincronizando',
    emisor: { nombre: 'Cargando emisor...', ruc: '---' },
    receptor: { nombre: 'Cargando receptor...' },
    fechaEmision: null
  };

  pdfUrl: SafeResourceUrl;
  isLoading: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private facturaService: FacturaApplicationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Inicialización segura para evitar NG0904
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatosDesdeBackend();
    }
  }

  async cargarDatosDesdeBackend() {
    this.isLoading = true;
    try {
      const facturas = await this.facturaService.obtenerTodas();

      if (facturas && facturas.length > 0) {
        const f = facturas[0] as any;

        this.facturaData = {
          numero: f.noComprobante || f.numero || '---',
          fechaEmision: f.fechaEmision,
          estado: f.estadoComprobante || 'AUTORIZADO',
          emisor: { nombre: f.emisor || 'No disponible', ruc: f.ruc || '---' },
          receptor: { nombre: f.receptor || 'No disponible' },
          pdfBase64: f.pdfBase64
        };

        if (this.facturaData.pdfBase64) {
          const blobUrl = `data:application/pdf;base64,${this.facturaData.pdfBase64}`;
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        }
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      this.isLoading = false; 
    }
  }

  descargarPDF() {
    if (this.facturaData?.pdfBase64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${this.facturaData.pdfBase64}`;
      link.download = `Factura-${this.facturaData.numero}.pdf`;
      link.click();
    }
  }

  descargarXML() {
    const xmlContent = `<factura><numero>${this.facturaData?.numero}</numero></factura>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Factura-${this.facturaData?.numero}.xml`;
    link.click();
  }
}