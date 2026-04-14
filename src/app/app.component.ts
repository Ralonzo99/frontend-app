import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h2>Factura APPDEUNA</h2>
      <p><strong>Emisor:</strong> APPDEUNA S.A. | RUC: 1793206667001</p>
      <p><strong>Receptor:</strong> TIENDAS WEPA S.A.S.</p>
      <p><strong>Fecha:</strong> 06/04/2026</p>
      
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>30000003352</td>
            <td>REEMBOLSOS VARIOS</td>
            <td>1</td>
            <td>$200.00</td>
            <td>$200.00</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Total: $200.00</h3>
      
      <button (click)="generarPDF()" style="background: blue; color: white; padding: 10px;">
        Generar PDF
      </button>
    </div>
  `
})
export class AppComponent {
  generarPDF() {
    alert('PDF generado (demo)');
    console.log('Aquí iría el PDF en Base64');
  }
}