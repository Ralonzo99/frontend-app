import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FacturaApplicationService } from '../../../core/application/services/factura-application.service';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portal-wrapper">
      <header class="navbar-3d">
        <div class="header-content">
          <div class="brand">
            <img src="assets/logo.png" alt="Intuito S.A." (error)="img.src='https://via.placeholder.com/150x50?text=Intuito+SA'" #img>
          </div>
          <a href="https://www.facturasintuitosa.com/" target="_blank" class="btn-login-3d">
            Iniciar Sesión
          </a>
        </div>
      </header>

      <main class="portal-main">
        <div class="contenedor-documento">
          
          <ng-container *ngIf="facturaData; else cargando">
            
            <div class="fila-unida border-b header-row-left">
              <div class="factura-titulo-container">
                <h1 class="fuente-arial-black">
                  Factura {{ facturaData.noComprobante }}
                </h1>
                <span class="autorizado-vivid">✔ {{ facturaData.estadoComprobante }}</span>
              </div>
            </div>

            <div class="fila-unida border-b bg-gris-tenue fuente-datos">
              <p>
                <strong class="arial-bold">Emisor:</strong>
                {{ facturaData.emisor }} |
                <span class="arial-narrow">RUC: {{ facturaData.ruc }}</span>
              </p>
              <p>
                <strong class="arial-bold">Receptor:</strong>
                {{ facturaData.receptor }} |
                Fecha: {{ facturaData.fechaEmision | date:'dd/MM/yyyy' }}
              </p>
            </div>

            <div class="fila-unida">
              <div class="botones-container">
                <button class="btn-action" (click)="descargarArchivo('pdf')">
                  <span class="icon-box pdf-icon">PDF</span> Descargar PDF
                </button>
                <button class="btn-action" (click)="descargarArchivo('xml')">
                  <span class="icon-box xml-icon">XML</span> Descargar XML
                </button>
              </div>
            </div>

            <div class="visor-container">
              <div class="pdf-card">
                <iframe *ngIf="pdfUrlSeguro; else sinPdf" [src]="pdfUrlSeguro" class="pdf-frame"></iframe>
                <ng-template #sinPdf>
                  <div class="no-pdf-placeholder">
                    <p>Cargando vista previa desde el servidor...</p>
                  </div>
                </ng-template>
              </div>
            </div>

            <div class="fila-unida banner-final-unido">
              <div class="grupo-izquierdo">
                <div class="portal-left">
                  <img src="assets/logo-inf.jfif" class="portal-logo framed" alt="logo inf">
                </div>
                <div class="portal-center">
                  <p class="portal-text arial-bold">Accede al historial de tus comprobantes recibidos</p>
                  <p class="portal-subtext">
                    <span class="check-verde-box">✔</span> Filtra y descarga PDF / XML en un clic
                  </p>
                </div>
              </div>
              <div class="portal-right">
                <a href="https://www.facturasintuitosa.com/" target="_blank" class="portal-btn">
                  Acceder al Portal
                </a>
              </div>
            </div>

          </ng-container>

          <ng-template #cargando>
            <div class="loading-state">
              <p>Buscando comprobante en el sistema...</p>
            </div>
          </ng-template>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .portal-wrapper { background: #f4f7f9; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif; }
    .navbar-3d { background: #004691; padding: 15px 0; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .header-content { max-width: 1000px; margin: auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
    .btn-login-3d { color: white; border: 1px solid white; padding: 8px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; }
    
    .contenedor-documento { max-width: 950px; margin: 30px auto; background: white; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.05); overflow: hidden; }
    .fila-unida { padding: 20px 40px; }
    .border-b { border-bottom: 1px solid #edf2f7; }
    .bg-gris-tenue { background: #f8fafc; font-size: 14px; color: #4a5568; }
    
    .factura-titulo-container { display: flex; align-items: center; }
    .fuente-arial-black { font-size: 22px; margin: 0; color: #1a202c; }
    .autorizado-vivid { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-weight: bold; margin-left: 15px; font-size: 13px; }
    
    .botones-container { display: flex; gap: 15px; }
    .btn-action { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: 1px solid #e2e8f0; background: white; cursor: pointer; border-radius: 8px; font-weight: 600; }
    .icon-box { padding: 2px 6px; border-radius: 4px; color: white; font-size: 11px; }
    .pdf-icon { background: #e11d48; }
    .xml-icon { background: #f59e0b; }

    .pdf-frame { width: 100%; height: 750px; border: none; border-radius: 4px; }
    .no-pdf-placeholder { height: 300px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; color: #64748b; }

    .banner-final-unido { background: #f1f5f9; display: flex; justify-content: space-between; align-items: center; border-top: 4px solid #004691; }
    .grupo-izquierdo { display: flex; align-items: center; gap: 20px; }
    .portal-logo { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid #fff; }
    .portal-btn { background: #004691; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .loading-state { padding: 100px; text-align: center; color: #718096; }
  `]
})
export class FacturaListComponent implements OnInit {
  facturaData: any = null; // Guardará el JSON que recibas
  pdfUrlSeguro: SafeResourceUrl | null = null;

  constructor(
    private facturaService: FacturaApplicationService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      const facturas = await this.facturaService.obtenerTodas();
      if (facturas && facturas.length > 0) {
        // Tomamos la primera factura para mostrar en el portal
        this.facturaData = facturas[0];
        
        // Si el backend envió el PDF en Base64, lo preparamos para el visor
        if (this.facturaData.pdfBase64) {
          this.prepararVisor(this.facturaData.pdfBase64);
        }
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  }

  prepararVisor(base64: string) {
    const blobUrl = `data:application/pdf;base64,${base64}`;
    // Marcamos como seguro para que Angular permita mostrarlo en el iframe
    this.pdfUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  }

  descargarArchivo(tipo: string) {
    if (!this.facturaData?.pdfBase64) return;
    
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${this.facturaData.pdfBase64}`;
    link.download = `Comprobante-${this.facturaData.noComprobante}.${tipo}`;
    link.click();
  }
}