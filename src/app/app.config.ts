import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Adaptadores
import { FacturaStorageAdapter } from './infrastructure/adapters/factura-storage.adapter';
import { PdfHtmlAdapter } from './infrastructure/adapters/pdf-html.adapter';

// Tokens de inyección (estos son valores, no tipos)
export const FACTURA_REPOSITORY_TOKEN = 'FacturaRepositoryPort';
export const PDF_GENERATOR_TOKEN = 'PdfGeneratorPort';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: FACTURA_REPOSITORY_TOKEN, useClass: FacturaStorageAdapter },
    { provide: PDF_GENERATOR_TOKEN, useClass: PdfHtmlAdapter }
  ]
};