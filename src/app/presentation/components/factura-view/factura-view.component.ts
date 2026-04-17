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

  facturaData: any = {
    numero: '---',
    estado: '---',
    emisor: { nombre: '---', ruc: '---', nombreComercial: '---' },
    receptor: { nombre: '---', correo: '' },
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
          this.tokenActual = token;
          this.cargarData(token);
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  async cargarData(token: string) {
    try {
      this.isLoading = true;

      const info = await this.facturaAdapter.getInfoComprobante({ tokenRequest: token });

      if (info) {
        this.facturaData = {
          numero: info.noComprobante || '---',
          estado: info.estadoComprobante || 'Autorizado',
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
      }

      const pdf = await this.facturaAdapter.getPDFComprobante({ tokenRequest: token });

      if (pdf) {
        const clean = this.cleanBase64(pdf);
        const blob = this.base64ToBlob(clean);
        const url = URL.createObjectURL(blob);

        // navpanes=0 oculta el panel lateral de miniaturas
        const viewerUrl = `${url}#toolbar=1&navpanes=0&scrollbar=1&pagemode=none`;

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
      }

    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private cleanBase64(data: any): string {
    let str = String(data || '').trim();
    if (str.startsWith('"')) {
      try { str = JSON.parse(str); } catch {}
    }
    return str.replace(/['"]+/g, '');
  }

  private base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
  }

  async descargarPDF() {
    const base64 = await this.facturaAdapter.getPDFComprobante({ tokenRequest: this.tokenActual });
    const clean = this.cleanBase64(base64);
    const blob = this.base64ToBlob(clean);
    this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.pdf`);
  }

  async descargarXML() {
    let xml = await this.facturaAdapter.getXMLComprobante({ tokenRequest: this.tokenActual });
    xml = String(xml || '')
      .replace(/\\n/g, '')
      .replace(/\\"/g, '"')
      .trim();
    const blob = new Blob([xml], { type: 'application/xml' });
    this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.xml`);
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