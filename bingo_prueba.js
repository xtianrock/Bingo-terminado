/*********************************
 Autor: Cristian Vizcaino
 Fecha creación: 12/01/2015
 Última modificación: 06/02/2015
 Versión: 1.00
 ***********************************/
//Array que relleno de numeros desde el 1 al 90.
var bolas=[];
// A la funcion ajax le paso su tamaño para que me devuelva
// un aleatorio que usare como indice para sacar los numeros de este array,
//de esta forma evito los bucles while con los indexOf, que funcionan bien
// en los primeros numeros pero muy mal cuando quedan pocas opciones.
var arrayNumeros=[];
var zonaJuego;
var bolasSacadas=[];
var numerosCarton=[];
var jugadores;
var valor;


window.onload=function()
{
    zonaJuego=$('#zonaJuego').get(0);

    var comenzar=document.getElementById('comenzar');
    comenzar.addEventListener("click",comenzarJuego);

    for (var i=1;i<91;i++)
    bolas.push(i);
}
/**
 * Limpia los arrays (necesaria para una segunda partida),
 * preapara el carton, e inicia el intervalo.
 */
function comenzarJuego() {
    arrayNumeros=[];
    bolasSacadas=[];
    numerosCarton=[];
    prepararBingo();
    solicitarNumeroAjax();
    intervalo = setInterval(solicitarNumeroAjax, 5000);
}

/**
 * Crea el bombo, carton y boton, ademas añade enventos
 * onclick a las casillas y al boton de cantar bingo
 */
function prepararBingo()
{
    jugadores=$('#jugadores').val();
    valor=$('#valor').val();

    var carton=$('#carton').get(0);
    if(carton)
    carton.remove();
    var bombo=$('#bombo').get(0);
    if(bombo)
        bombo.remove();
    var botonBingo=$('#botonBingo').get(0);
    if(botonBingo)
        botonBingo.remove();

    bombo=new Bombo();
    zonaJuego.appendChild(bombo);
    carton=new Carton();
    zonaJuego.appendChild(carton);

    $(".casilla").bind( "click", function() {
        marcarCasilla($(this))
    });
    $('<button/>', {
        id: 'botonBingo',
        class: 'btn btn-default',
        text: 'Bingo!'
    }).appendTo($('#menu'));

    $( "#botonBingo" ).bind( "click", function() {
        comprobarBingo();
    });

}


function solicitarNumeroAjax()
{
    $.ajax({
        type: "POST",
        dataType: "html",
        data:{maximo:bolas.length},
        contentType: "application/x-www-form-urlencoded",
        url: "numeroAleatorio.php",
        success: procesarAjax,
        timeout: 4000
    });
}


function procesarAjax(numero)
{
    var numeroBombo= bolas.splice(numero, 1);
    $("#bombo").text(numeroBombo);
    bolasSacadas.push(numeroBombo[0]);
    if(!bolas.length)
        clearInterval(intervalo);
}


/**
 * Funcion a la que le pasamos el numero de columna y nos devuelve
 * un aleatorio cuyo valor este entre los permitidos por dicha columna
 * @param numero columna
 * @returns {number} aleatorio valido para la columna dada
 */
function aleatorio(numero) {
    if (numero==0)
    {
        var min=1;
        var max=9;
    }
    else
        var min=numero*10;
    if(numero==8)
        max=min+10;
    else
        var max=min+9;
    do
    {
        var aleatorio=Math.round(Math.random()*(max-min)+parseInt(min));
    }
    while (arrayNumeros.indexOf(aleatorio)!=-1);
    arrayNumeros.push(aleatorio);
    arrayNumeros.sort();
    return aleatorio;
}

/**
 * Devuelve un array aleatorio con los indices de elementos que se deben tapar
 * @returns {Array|*}
 */
function numerosTapados()
{
    tapados=[];
    for (var i=0;i<4;i++)
    {
        do
        {
            var aleatorio=Math.round(Math.random()*(9-1)+parseInt(1));
        }
        while (tapados.indexOf(aleatorio)!=-1)
        tapados.push(aleatorio);
    }
    return tapados;
}

/**
 * Objeto carton
 * @returns {HTMLElement}
 * @constructor
 */
function Carton()
{
    var carton=document.createElement('div');
    carton.setAttribute('id','carton');
    var cabecera=document.createElement('div');
    cabecera.setAttribute('id','cabecera');
    cabecera.innerHTML='Cabecera';
    var cuerpo=document.createElement('div');
    cuerpo.setAttribute('id','cuerpo');
    for(var i=0;i<3;i++)
    {
        var fila=document.createElement('div');
        fila.setAttribute('class','fila');
        var tapados=numerosTapados();
        for (var j=0;j<9;j++)
        {
            if(tapados.indexOf(j+1)==-1)
            {
                numerosCarton.push(aleatorio(j));
                $('<div/>', {
                    class: 'casilla',
                    text: aleatorio(j)
                }).appendTo(fila);
            }
            else
            {
                $('<div/>', {
                    class: 'tapado'
                }).appendTo(fila);
            }
        }
        cuerpo.appendChild(fila);
    }
    carton.appendChild(cuerpo);
    return carton;
}


/**
 * Objeto bombo
 * @returns {HTMLElement}
 * @constructor
 */
function Bombo()
{
    var bombo=document.createElement('div');
    bombo.setAttribute('id','bombo');
    bombo.appendChild(document.createTextNode('0'));
    return bombo;
}


/**
 * Se encarga de comprobar si el bingo es valido y muestra
 * ventanas emergentes indicandolo
 */
function comprobarBingo()
{
    var casillasMarcadas=$('.marcado');
    bingo=true;
    for (var i=0;i<numerosCarton.length;i++)
    {
        if( bolasSacadas.indexOf(numerosCarton[i])==-1||casillasMarcadas.size()<15)
        {
            bingo=false;
            break;
        }
    }
    if(bingo)
    {
        var ventana = window.open("bingoCorrecto.html", "_blank", "width=700,height=400");
        ventana.onload = function () {
            ventana.document.getElementById('premio').innerHTML = puntuacion();
        };
    }
    else
    {
        window.open("bingoIncorrecto.html", "_blank", "width=550,height=250");
    }
}

/**
 * Funcion que marca y desmarca casillas
 * @param casilla indica la casilla sobre la que actuar
 */
function marcarCasilla(casilla)
{
    if(casilla.attr('class')!='marcado')
        casilla.attr('class','marcado');
    else
        casilla.attr('class','casilla');

}


/**
 * Calcula la puntuacion
 * @returns {number} puntuacion
 */
function puntuacion()
{
    return jugadores*valor*0.8;
}








