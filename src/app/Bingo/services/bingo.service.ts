
import { effect, Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class BingoService {

  modoJuego = signal<string>(localStorage.getItem('modojuego') ?? '');

  // Inicializar el signal 'numerosBingo' con datos de 'localStorage'
  numerosBingo = signal<number[]>(
    JSON.parse(localStorage.getItem('numerosBingo') ?? '[]')
  );

  constructor() {
    // Actualiza localStorage al cambiar la señal
    effect((): void => {
      const datos = this.numerosBingo();
      localStorage.setItem('numerosBingo', JSON.stringify(datos));
    });

    //Actualiza la variable de modo de juego en el localstorage
    effect((): void => {
      const modojuego = this.modoJuego();
      localStorage.setItem('modojuego', (modojuego));
    });

    // Escucha cambios en localStorage hechos desde otra pestaña
    window.addEventListener('storage', (event) => {
      if (event.key === 'numerosBingo') {
        const nuevosNumeros = JSON.parse(event.newValue ?? '[]');
        this.numerosBingo.set(nuevosNumeros);
      }

      if (event.key === 'modojuego') {
        const nuevoModo = event.newValue ?? '';
        this.modoJuego.set(nuevoModo); // ✅ ¡ACTUALIZA la señal en la otra pestaña!
      }
    });
  }

  // Método para agregar un número a la lista de 'numerosBingo'
  agregarNumero(numero: number): string | null {
    if (numero < 1 || numero > 75)
      return 'El numero ingresado no corresponde a un numero existente en el panel del bingo';

    if (this.numerosBingo().includes(numero))
      return 'El numero ingresado ya fue seleccionado anteriormente por favor verificar';

    // Actualizar el signal con el nuevo número
    this.numerosBingo.update((valor) => [...valor, numero]);

    return null;
  }

  // Método para reiniciar el juego (limpiar la lista de números)
  reiniciarJuego() {
    this.numerosBingo.set([]);
  }

  // Metodo para eliminar un numero que ya haya salido en el panel, por si se equivocaron en agregarlo
  eliminarNumero(numero: number){
    const listaNueva = this.numerosBingo().filter(x => x !== numero); // numero que se eleminara de la lista
    this.numerosBingo.set(listaNueva); // Actualizamos la señal para que se guarde la nueva lista sin el numero a eliminar
  }
}
