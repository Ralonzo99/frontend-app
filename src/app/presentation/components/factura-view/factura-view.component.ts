import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router'; // Importante para leer la URL

// Ruta corregida según tu estructura de carpetas
import { FacturaHttpAdapter } from '../../../infrastructure/adapters/factura-http.adapter';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-view.component.html',
  styleUrls: ['./factura-view.component.css']
})
export class FacturaViewComponent implements OnInit {
  pdfUrl!: SafeResourceUrl;
  isLoading: boolean = true;
  tokenActual: string = '';

  facturaData: any = {
    numero: '---',
    emisor: { nombre: 'Cargando...', ruc: '' },
    receptor: { nombre: 'Cargando...' }
  };

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute, // Inyectamos la ruta activa
    private facturaAdapter: FacturaHttpAdapter,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit(): void {
    // Verificamos que estamos en el navegador para evitar errores en SSR
    if (isPlatformBrowser(this.platformId)) {
      // CAPTURAMOS EL TOKEN DE LA URL
      // Ejemplo: factura-view?tokenRequest=abc123...
      this.route.queryParams.subscribe(params => {
        this.tokenActual = params['tokenRequest'];
        
        if (this.tokenActual) {
          this.cargarData(this.tokenActual);
        } else {
          console.error("No se encontró el tokenRequest en la URL");
          this.isLoading = false;
        }
      });
    }
  }

  async cargarData(token: string) {
    try {
      this.isLoading = true;
      const payload = { tokenRequest: token };

      // 1. Obtenemos los datos de la factura (JSON)
      const info = await this.facturaAdapter.getInfoComprobante(payload);
      if (info) {
        this.facturaData = info;
      }

      // 2. Obtenemos el archivo PDF (Blob)
      const pdfBlob = await this.facturaAdapter.getPDFComprobante(payload);
      if (pdfBlob && pdfBlob.size > 0) {
        const url = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    } catch (e) {
      console.error("Error al conectar con el servidor", e);
    } finally {
      this.isLoading = false;
    }
  }

  // --- MÉTODOS PARA LOS BOTONES DEL HTML ---

  async descargarPDF() {
    if (!this.tokenActual) return;
    try {
      const blob = await this.facturaAdapter.getPDFComprobante({ tokenRequest: this.tokenActual });
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero || 'comprobante'}.pdf`);
    } catch (error) {
      console.error("Error descargando PDF", error);
    }
  }

  async descargarXML() {
    if (!this.tokenActual) return;
    try {
      const blob = await this.facturaAdapter.getXMLComprobante({ tokenRequest: this.tokenActual });
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero || 'comprobante'}.xml`);
    } catch (error) {
      console.error("Error descargando XML", error);
    }
  }

  private descargarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}