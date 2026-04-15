import { Component } from '@angular/core';
import { FacturaListComponent } from './presentation/components/factura-list/factura-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FacturaListComponent], // Importamos tu componente real
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <header style="background: #004691; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0;">Sistema de Facturación APPDEUNA</h1>
        <p style="margin: 5px 0 0; opacity: 0.8;">Panel de Pasante: Ronny Alonzo</p>
      </header>

      <app-factura-list></app-factura-list>
    </div>
  `
})
export class AppComponent {
  // Ya no necesitas la lógica de prueba aquí, 
  // todo está dentro de FacturaListComponent
}