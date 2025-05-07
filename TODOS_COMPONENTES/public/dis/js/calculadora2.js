alert("hola");

var boton=document.getElementById("boton");
boton.addEventListener("click",borrar);
var valor1= null;
var valor2= null;
var resultado= null;
var operador=null;
var resultadoMostrado = false;
function capturar(arg) {
    
    var valor=arg.dataset.valor;
    var caja_texto=document.getElementById("caja-resultado");

    if (resultadoMostrado && !isNaN(valor)) {
        caja_texto.value = ""; 
        resultadoMostrado = false; 
    }
    if(valor=="+" || valor=="-" || valor=="*" || valor=="/"){
    
        valor1=parseFloat(caja_texto.value);
        operador=valor;
        caja_texto.value="";
    }else{
        caja_texto.value += valor;
    }

}
function calcular(){
    var caja_texto=document.getElementById("caja-resultado");
    valor2=parseFloat(caja_texto.value);
    if(valor1 !== null && valor2 !==null && operador !== null){
    switch(operador){
        case "+":
            resultado=valor1+valor2;
            break;
        case "-":
            resultado=valor1-valor2;
            break;
        case "*":
            resultado=valor1*valor2;
            break;
        case "/":
            if(valor2==0){
                alert("no se puede dividir por cero");
                borrar();
                return;
            }
            resultado=valor1/valor2;
            break;
    }
    caja_texto.value=resultado;
    resultadoMostrado=true;
    valor1=null;
    valor2=null;
    operador=null;
    

}else{
    alert("no se puede hacer la operacion");

}

   

}

function borrar(){
    var caja_texto=document.getElementById("caja-resultado");
    valor1=null;
    valor2=null;
    operador=null;
    resultadoMostrado=false;
    caja_texto.value="";
}