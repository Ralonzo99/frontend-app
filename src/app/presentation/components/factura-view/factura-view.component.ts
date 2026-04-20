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
  isLoading = true;
  tokenActual = '';
  isDarkMode = false;
  errorMessage: string | null = null;

  facturaData: any = {
    numero: '',
    estado: '',
    emisor: { nombre: '', ruc: '', nombreComercial: '' },
    receptor: { nombre: '', correo: '' },
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
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkMode = mediaQuery.matches;

      mediaQuery.addEventListener('change', e => {
        this.isDarkMode = e.matches;
        this.cdr.detectChanges();
      });

      this.route.queryParams.subscribe(params => {
        const token = params['tokenRequest'] || params['token'];
        if (token) {
          this.tokenActual = token;
          this.cargarData(token);
        } else {
          this.isLoading = false;
          this.errorMessage = 'No se ha proporcionado un token válido.';
        }
      });
    }
  }

  async cargarData(token: string) {
    try {
      this.isLoading = true;
      this.errorMessage = null;

      const info = await this.facturaAdapter.getInfoComprobante({ tokenRequest: token });

      if (!info || !info.noComprobante) {
        this.errorMessage = 'El enlace es incorrecto o ha expirado.';
        return;
      }

      this.facturaData = {
        numero: info.noComprobante || '---',
        estado: info.estadoComprobante || '',
        emisor: {
          nombre: info.emisor || '---',
          ruc: info.ruc || '---',
          nombreComercial: info.razonSocial || info.emisor || '---'
        },
        receptor: {
          nombre: info.receptor || '---',
          correo: info.correo || ''
        },
        fechaEmision: info.fechaEmision || ''
      };

      const pdf = await this.facturaAdapter.getPDFComprobante({ tokenRequest: token });
      if (pdf) {
        const clean = this.cleanBase64(pdf);
        const blob = this.base64ToBlob(clean, 'application/pdf');
        const url = URL.createObjectURL(blob);
        const viewerUrl = `${url}#toolbar=1&navpanes=0&scrollbar=1`;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
      }
    } catch (error) {
      console.error("Error al cargar comprobante:", error);
      this.errorMessage = 'Error de conexión. No pudimos recuperar el documento.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getEstadoClass(estado: string): string {
    const e = estado?.toUpperCase().trim() || '';
    if (['AUTORIZADO', 'REGISTRADO'].includes(e)) return 'status-exito';
    if (['ANULADO'].includes(e)) return 'status-preventivo';
    if (['ERROR', 'NO_AUTORIZADO', 'NO_ENCONTRADO', 'ERROR_AL_FIRMAR'].includes(e)) return 'status-error';
    if (['GENERADO', 'FIRMADO', 'DEVUELTO', 'PROCESANDO', 'RECIBIDO'].includes(e)) return 'status-informativo';
    return 'status-informativo';
  }

  private cleanBase64(data: any): string {
    let str = String(data || '').trim();
    // Eliminar posibles comillas dobles si vienen del JSON
    if (str.startsWith('"') && str.endsWith('"')) {
      str = str.substring(1, str.length - 1);
    }
    return str.replace(/['"]+/g, '');
  }

  private base64ToBlob(base64: string, type: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: type });
  }

  async descargarPDF() {
    try {
      const base64 = await this.facturaAdapter.getPDFComprobante({ tokenRequest: this.tokenActual });
      const blob = this.base64ToBlob(this.cleanBase64(base64), 'application/pdf');
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.pdf`);
    } catch (e) {
      console.error("Error al descargar PDF:", e);
    }
  }

  async descargarXML() {
    try {
      let xmlBase64 = await this.facturaAdapter.getXMLComprobante({ tokenRequest: this.tokenActual });
      // Limpiamos el base64 de posibles escapes o comillas del backend
      const cleanXmlBase64 = this.cleanBase64(xmlBase64);
      // Decodificamos el Base64 a un Blob XML
      const blob = this.base64ToBlob(cleanXmlBase64, 'application/xml');
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.xml`);
    } catch (e) {
      console.error("Error al descargar XML:", e);
    }
  }

  private descargarArchivo(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}