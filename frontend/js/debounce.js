export function debounce(callback, delay) {
  let timeoutId; //variável que guarda o timer

  return function (...args) {
    //retorne uma função que recebe argumentos
    clearTimeout(timeoutId); // se existir um timer anterior, cancele ele
    timeoutId = setTimeout(() => {
      //crie um novo timer
      callback(...args); //quando tempo terminar, execute a função callback com os argumentos passados
    }, delay);
  };
}

//callback: a função que eu quero que rode depois da pausa
//delay: tempo da pausa, milissegundos
//args...: argumentos
