import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// Interceptor y Adaptadores
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';
import { FacturaHttpAdapter } from './infrastructure/adapters/factura-http.adapter';
import { PdfHtmlAdapter } from './infrastructure/adapters/pdf-html.adapter';

// EXPORTACIÓN CRÍTICA DE TOKENS
export const FACTURA_REPOSITORY_TOKEN = 'FacturaRepositoryPort';
export const PDF_GENERATOR_TOKEN = 'PdfGeneratorPort'; // Esto soluciona tu error TS2305

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Inyección de dependencias
    { provide: FACTURA_REPOSITORY_TOKEN, useClass: FacturaHttpAdapter },
    { provide: PDF_GENERATOR_TOKEN, useClass: PdfHtmlAdapter }
  ]
};