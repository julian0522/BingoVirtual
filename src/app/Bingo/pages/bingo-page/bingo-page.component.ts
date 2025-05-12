import { Component, computed, inject, signal } from '@angular/core';
import { BingoService } from '../../services/bingo.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-bingo-page',
  imports: [CommonModule],
  templateUrl: './bingo-page.component.html',
  styles: `

  `,
})
export class BingoPageComponent {

  bingoService = inject(BingoService);

  // Creamos un array con los números del 1 al 75
  numerosBingo: number[] = Array.from({ length: 75 }, (_, i) => i + 1);

  modoJuego = this.bingoService.modoJuego;
}
