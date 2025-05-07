let valorAnterior = '';
let operador = '';
let resultadoMostrado = false;

function capturar(boton) {
    const valor = boton.dataset.valor;
    const caja = document.getElementById("caja-resultado");

    // Si se acaba de mostrar un resultado y se presiona número o punto, limpiar
    if (resultadoMostrado && /[0-9.]/.test(valor)) {
        caja.value = '';
        resultadoMostrado = false;
    }

    // Evita múltiples puntos
    if (valor === '.' && caja.value.includes('.')) return;

    // Si es operador
    if (/[+\-x/]/.test(valor)) {
        operador = valor;
        valorAnterior = caja.value;
        caja.value = '';
    }
    else if (valor === '=') {
        calcular();
    }
    else {
        caja.value += valor;
    }
}

function calcular() {
    const caja = document.getElementById("caja-resultado");
    const valorActual = caja.value;

    let resultado;
    const num1 = parseFloat(valorAnterior);
    const num2 = parseFloat(valorActual);

    switch (operador) {
        case '+': resultado = num1 + num2; break;
        case '-': resultado = num1 - num2; break;
        case 'x': resultado = num1 * num2; break;
        case '/': resultado = num2 !== 0 ? num1 / num2 : 'Error'; break;
        default: return;
    }

    caja.value = resultado;
    resultadoMostrado = true;
}

function limpiar() {
    document.getElementById("caja-resultado").value = '';
    valorAnterior = '';
    operador = '';
    resultadoMostrado = false;
}
