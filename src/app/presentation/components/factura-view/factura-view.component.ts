import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FacturaHttpAdapter } from '../../../infrastructure/adapters/factura-http.adapter';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-view.component.html',
  styleUrls: ['./factura-view.component.css']
})
export class FacturaViewComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;
  isLoading: boolean = true;
  tokenActual: string = '';

  facturaData: any = {
    numero: '---',
    estado: '---',
    emisor: { nombre: 'Cargando...', ruc: '---', nombreComercial: '---' },
    receptor: { nombre: '---', correo: '---' },
    fechaEmision: ''
  };

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private facturaAdapter: FacturaHttpAdapter,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe(params => {
        const token = params['tokenRequest'] || params['token'];
        if (token) {
          this.tokenActual = String(token);
          this.cargarData(this.tokenActual);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  async cargarData(token: string) {
    try {
      this.isLoading = true;
      this.cdr.detectChanges();

      // 1. Datos de la factura
      const info = await this.facturaAdapter.getInfoComprobante({ tokenRequest: token });
      if (info) {
        this.facturaData = {
          numero: info.noComprobante || '---',
          estado: info.estadoComprobante || '---',
          emisor: { 
            nombre: info.emisor || '---', 
            ruc: info.ruc || '---',
            nombreComercial: info.razonSocial || info.emisor || '---' 
          },
          receptor: { nombre: info.receptor || '---', correo: info.correo || '' },
          fechaEmision: info.fechaEmision || ''
        };
        this.cdr.detectChanges();
      }

      // 2. Visualización del PDF (El backend envía Base64 directo)
      const base64Content = await this.facturaAdapter.getPDFComprobante({ tokenRequest: token });
      
      if (base64Content) {
        // Quitamos comillas si el backend las envía en el string
        const cleanBase64 = base64Content.replace(/['"]+/g, '');
        const dataUrl = `data:application/pdf;base64,${cleanBase64}`;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        this.cdr.detectChanges();
      }

    } catch (e) {
      console.error("Error al cargar factura:", e);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async descargarPDF() {
    try {
      const base64 = await this.facturaAdapter.getPDFComprobante({ tokenRequest: this.tokenActual });
      const cleanBase64 = base64.replace(/['"]+/g, '');
      
      // Convertir Base64 a Blob para descarga física
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.pdf`);
    } catch (err) { console.error(err); }
  }

  async descargarXML() {
    try {
      const xmlData = await this.facturaAdapter.getXMLComprobante({ tokenRequest: this.tokenActual });
      const cleanXml = xmlData.replace(/['"]+/g, '');
      const blob = new Blob([cleanXml], { type: 'application/xml' });
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.xml`);
    } catch (err) { console.error(err); }
  }

  private descargarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}