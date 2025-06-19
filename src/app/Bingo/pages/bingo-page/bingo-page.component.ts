import { Component, computed, effect, inject, signal } from '@angular/core';
import { BingoService } from '../../services/bingo.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-bingo-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bingo-page.component.html',
  styles: `

  `,
})
export class BingoPageComponent {
  bingoService = inject(BingoService);

  // Creamos un array con los números del 1 al 75
  numerosBingo: number[] = Array.from({ length: 75 }, (_, i) => i + 1);

  modoJuego = this.bingoService.modoJuego;
  numeroActual = signal<number>(
    JSON.parse(localStorage.getItem('numeroActual') ?? '0')
  );
  letraActual = computed(() => {
    const numero = this.numeroActual();
    if (!numero) return '';

    switch (true) {
      case numero <= 15:
        return 'B';
      case numero <= 30:
        return 'I';
      case numero <= 45:
        return 'N';
      case numero <= 60:
        return 'G';
      case numero <= 75:
        return 'O';
      default:
        return '';
    }
  });

  //*----------- IMPLEMENTACION DE LOS FORMULARIOS PARA EL BINGO ----------------------------
  fb = inject(FormBuilder);
  erroresAgregar = signal<string | null>('');
  juegoReiniciado = signal<boolean>(false);

  bingoForm = this.fb.group({
    modoJuego: [this.modoJuego(), Validators.required],
  });

  bingoNumForm = this.fb.group({
    numero: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
  });

  // IniciarJuego() {
  //   if (this.bingoForm.invalid) {
  //     this.bingoForm.markAllAsTouched();
  //     return;
  //   }

  //   this.bingoService.modoJuego.set(
  //     this.bingoForm.get('modoJuego')?.value ?? ''
  //   );
  //   this.bingoForm.reset({ modoJuego: '' });
  //   this.reiniciarJuego();
  //   // window.open('/bingo', '_blank');
  //   return;
  // }

  CambiarModoJuego() {
    if (this.bingoForm.invalid) {
      this.bingoForm.markAllAsTouched();
      return;
    }

    this.bingoService.modoJuego.set(
      this.bingoForm.get('modoJuego')?.value ?? ''
    );
    // this.bingoForm.reset({ modoJuego: '' });
    this.reiniciarJuego();
  }

  AgregarNumero() {
    if (this.modoJuego() === '') {
      this.erroresAgregar.set(
        'Para Iniciar con el Juego debe seleccionar el modo de juego Primero'
      );
      return;
    }

    if (!this.bingoNumForm.valid) {
      this.erroresAgregar.set('En este campo solo se permiten numeros y no puede enviarse vacio');
      this.bingoNumForm.reset({ numero: '' });
      return;
    }

    // Se convierte el numero ingresado por el usuario a un tipo de dato numerico para enviarlo al servicio y actualizar la señal de numewro actual
    const numeroIngresado = this.bingoNumForm.get('numero')?.value ?? '0';
    const conversionNumero = parseInt(numeroIngresado, 10);
    const result = this.bingoService.agregarNumero(conversionNumero);

    if (!result) {
      this.actualizarNumeroActual(conversionNumero);
    }
    this.erroresAgregar.set(result);
    this.bingoNumForm.reset({ numero: '' });
  }

  reiniciarJuego() {
    this.bingoService.reiniciarJuego();
    this.juegoReiniciado.set(true);
    this.actualizarNumeroActual(0);

    // Lo hacemos para que la alerta deje de mostrarse
    setTimeout(() => {
      this.juegoReiniciado.set(false);
    }, 3000);
  }

  isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  actualizarNumeroActual(numero: number) {
    this.numeroActual.set(numero);
    localStorage.setItem('numeroActual', JSON.stringify(this.numeroActual()));
  }

  eliminarNumero(numero: number) {
    if (!this.bingoService.numerosBingo().includes(numero)) return;

    this.bingoService.eliminarNumero(numero);
  }
}
