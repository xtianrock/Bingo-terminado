/*********************************
 Autor: Cristian Vizcaino
 Fecha creación: 12/01/2015
 Última modificación: 06/02/2015
 Versión: 1.00
 ***********************************/
var arrayNumeros=[];
var zonaJuego;
var bolasSacadas=[];
var jugadores;
var valor;
window.onload=function()
{
    zonaJuego=$('#zonaJuego').get(0);

    var comenzar=document.getElementById('comenzar');
    comenzar.addEventListener("click",comenzarJuego);
}
function comenzarJuego() {
    prepararBingo();
    getNumeroBombo();
    intervalo = setInterval(getNumeroBombo, 200);
}
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
    }).appendTo(zonaJuego);

    $( "#botonBingo" ).bind( "click", function() {
        comprobarBingo();
    });

}

function getNumeroBombo(numero) {
    if (numero == undefined) {
        $.ajax({
            type: "POST",
            dataType: "html",
            contentType: "application/x-www-form-urlencoded",
            url: "numeroAleatorio.php",
            success: getNumeroBombo,
            timeout: 4000
        });
    } else {
        if (bolasSacadas.indexOf(numero) == -1) {
            $("#bombo").text(numero);
            bolasSacadas.push(numero);
        } else {
            return getNumeroBombo();
        }
    }
}

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

function Bombo()
{
    var bombo=document.createElement('div');
    bombo.setAttribute('id','bombo');
    bombo.appendChild(document.createTextNode('0'));
    return bombo;
}


function comprobarBingo()
{
    var casillas=$('.marcado');
    bingo=true;
    for (var i=0;i<casillas.get().length;i++)
    {
        if( bolasSacadas.indexOf(casillas.eq(i).text())==-1||casillas.get().length<15)
        {
            bingo=false;
            break;
        }
    }
    if(bingo&&casillas.get().length)
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


function marcarCasilla(casilla)
{
    if(casilla.attr('class')!='marcado')
        casilla.attr('class','marcado');
    else
        casilla.attr('class','casilla');

}

function puntuacion()
{
    return jugadores*valor*0.8;
}








