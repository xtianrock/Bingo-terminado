/**
 * Created by 2DAWT on 27/01/2015.
 */

window.onload=function()
{
    var carton=new Carton();
    carton.create();
    var numeros=[];
    var zonaJuego=document.getElementById('zonaJuego');
    var carton=document.createElement('div');
    carton.setAttribute('id','carton');
    var cabecera=document.createElement('div');
    cabecera.setAttribute('id','cabecera');
    cabecera.innerHTML='Cabecera';
    carton.appendChild(cabecera);
    var cuerpo=document.createElement('div');
    cuerpo.setAttribute('id','cuerpo');
    for(var i=0;i<9;i++)
    {
        var numeros=aleatorio(i);
        var columna=document.createElement('div');
        columna.setAttribute('class','columna');
        for (var j=0;j<3;j++)
        {
            $('<div/>', {
                class: 'casilla',
                text: numeros[j]
            }).appendTo(columna);
        }
        cuerpo.appendChild(columna);

    }
    carton.appendChild(cuerpo);
    zonaJuego.appendChild(carton);
}


function aleatorio(numero) {
    if (numero==0)
        var min=1;
    else
        var min=numero*10;
    if(numero==8)
        max=min+10;
    else
        var max=min+9;
    var arrayNumeros=[];
    for(var i=0;i<3;i++)
    {
        do
        {
            var aleatorio=Math.round(Math.random()*(max-min)+parseInt(min));
        }
        while (arrayNumeros.indexOf(aleatorio)!=-1)

        arrayNumeros[i]=aleatorio;
    }
    arrayNumeros.sort();
    return arrayNumeros
}

function Carton()
{
    alert ("Hola, Soy " + this.primerNombre);
}

Carton.prototype.create = function() {



};













