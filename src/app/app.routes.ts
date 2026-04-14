import { Routes } from '@angular/router';
import { FacturaViewComponent } from './presentation/components/factura-view/factura-view.component';

export const routes: Routes = [
  {
    path: '', // Esto significa la página de inicio
    component: FacturaViewComponent
  },
  {
    path: 'factura', // Opcional: puedes acceder vía localhost:4200/factura
    component: FacturaViewComponent
  },
  {
    path: '**', // Si escriben cualquier otra cosa, redirigir a inicio
    redirectTo: ''
  }
];