import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaApplicationService } from '../../../core/application/services/factura-application.service';
import { Factura } from '../../../core/domain/entities/factura.entity';

@Component({
  selector: 'app-factura-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-view.component.html',
  styleUrls: ['./factura-view.component.css']
})
export class FacturaViewComponent implements OnInit {

  facturaData: Factura | null = null;
  loading = false;

  constructor(
    private facturaAppService: FacturaApplicationService
  ) {}

  ngOnInit(): void {

    this.facturaData = {
      id: '1',
      numero: '001-180-000000001',
      fechaEmision: new Date(),
      estado: 'PENDIENTE',

      emisor: {
        nombre: 'Mi Empresa S.A.',
        ruc: '1793206667001'
      },

      receptor: {
        nombre: 'Cliente Demo'
      }

    } as Factura;
  }

  async generarPDF() {
    if (!this.facturaData) return;

    try {
      this.loading = true;

      await this.facturaAppService.generarYEnviarPDF(
        this.facturaData.id,
        'factura-html'
      );

    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  descargarXML() {
    console.log('Descargando XML...');
  }
}