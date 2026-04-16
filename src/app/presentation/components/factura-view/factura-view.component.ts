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
  pdfUrl!: SafeResourceUrl;
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
    private cdr: ChangeDetectorRef, // Inyectado para forzar el renderizado
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

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
      this.cdr.detectChanges(); // Mostrar spinner
      
      const payload = { tokenRequest: token };

      // 1. Obtener Info
      const info = await this.facturaAdapter.getInfoComprobante(payload);
      
      if (info) {
        // Mapeo creando una nueva referencia de objeto
        this.facturaData = {
          numero: info.noComprobante || '---',
          estado: info.estadoComprobante || '---',
          emisor: { 
            nombre: info.emisor || '---', 
            ruc: info.ruc || '---',
            nombreComercial: info.razonSocial || info.emisor || '---' 
          },
          receptor: { 
            nombre: info.receptor || '---',
            correo: info.correo || '---'
          },
          fechaEmision: info.fechaEmision || ''
        };
        
        // FORZAR RENDERIZADO DE DATOS
        this.cdr.detectChanges();
      }

      // 2. Obtener PDF
      const pdfBlob = await this.facturaAdapter.getPDFComprobante(payload);
      if (pdfBlob && pdfBlob.size > 0) {
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.cdr.detectChanges();
      }

    } catch (e: any) {
      console.error("Error en la carga:", e);
      this.facturaData.emisor.nombre = 'Error al conectar con el servidor';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Ocultar spinner y mostrar card final
    }
  }

  async descargarPDF() {
    if (!this.tokenActual) return;
    try {
      const blob = await this.facturaAdapter.getPDFComprobante({ tokenRequest: this.tokenActual });
      this.descargarArchivo(blob, `Factura_${this.facturaData.numero}.pdf`);
    } catch (err) { console.error(err); }
  }

  async descargarXML() {
    if (!this.tokenActual) return;
    try {
      const blob = await this.facturaAdapter.getXMLComprobante({ tokenRequest: this.tokenActual });
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