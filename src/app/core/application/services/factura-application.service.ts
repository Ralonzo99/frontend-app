import { Injectable, Inject } from '@angular/core';
import { Factura } from '../../domain/entities/factura.entity';
import { FacturaRepositoryPort } from '../../domain/ports/factura-repository.port';
import { PdfGeneratorPort } from '../../domain/ports/pdf-generator.port';

// 👇 IMPORTA LOS TOKENS
import { FACTURA_REPOSITORY_TOKEN, PDF_GENERATOR_TOKEN } from '../../../app.config';

@Injectable({ providedIn: 'root' })
export class FacturaApplicationService {

  constructor(
    @Inject(FACTURA_REPOSITORY_TOKEN) private facturaRepo: FacturaRepositoryPort,
    @Inject(PDF_GENERATOR_TOKEN) private pdfGenerator: PdfGeneratorPort
  ) {}

  async generarYEnviarPDF(facturaId: string, elementoId: string): Promise<string> {
    const factura = await this.facturaRepo.findById(facturaId);
    if (!factura) throw new Error('Factura no encontrada');

    const pdfBase64 = await this.pdfGenerator.generarPDFDesdeHTML(elementoId);

    factura.estado = 'ENVIADO';
    await this.facturaRepo.update(facturaId, factura);

    return pdfBase64;
  }
}