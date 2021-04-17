$(function(){
    var atributos   = [ "tamaño", "timbre", "portero", "clase" ];
    var dataset     = [
        "pequeño,uno,no,+",
        "pequeño,varios,si,-",
        "mediano,uno,no,+",
        "grande,varios,no,-",
        "pequeño,uno,si,+",
        "grande,uno,si,-"
    ];

    $('button').click(function(){
        // cuando hagamos la 2ª y 3ª vuelta llamar a algoritmo() para volver a calcular las p, n, meritos..
        var datos = algoritmo(atributos, dataset);
        console.debug('OBJ', datos);
        
        // sacamos el MENOR merito
        var level = {}, _merito = 99999999999;
        $.each(datos, function(i, attr){
            if(attr.merito < _merito){
                _merito = attr.merito;
                level = attr;
                delete(level.merito);
            }
        });

        console.debug('MERITO', _merito);
        console.debug('NIVEL', level);

        // 1. En "level" tenemos las ramas que hay que recorrer ($.each)
        // 2. Para cada rama del $.each ==> sacar las filas que tengan ese "tamaño" (atributo) ==> filtrar
        // 3. Cuando tengamos esas filas, ver si son todas + o - para descartar ==> si son != entonces volver a hacer todo (llamar a algortimo())
    });
});

//////////////////////////////////////////////////

function algoritmo(atributos, dataset){
    var datos = {};

    // preparamos el objeto poniendo en las claves cada uno de los atributos
    for(var i = 0; i < atributos.length - 1; i++){
        datos[atributos[i]] = {};
    }

    $.each(dataset, function(i, fila){
        fila = fila.split(',');
        var sol = fila[fila.length - 1]; // + o -

        for(var i = fila.length - 2; i >= 0; i--){
            if(!datos[atributos[i]][fila[i]]){
                datos[atributos[i]][fila[i]] = {
                    positivo    : sol === "+" ? 1 : 0,
                    negativo    : sol === "-" ? 1 : 0,
                    total       : 1
                };
            } else{
                if(sol === "+"){
                    datos[atributos[i]][fila[i]].positivo++;
                } else{
                    datos[atributos[i]][fila[i]].negativo++;
                }
                datos[atributos[i]][fila[i]].total++;
            }
        }
    });

    // Calculamos el merito
    for(var i = 0; i < atributos.length - 1; i++){
        merito(datos, atributos[i], dataset.length);
    }

    return datos;
}

function merito(data, key, N){
    var merito = 0;

    $.each(data[key], function(k, v){
        var r = v.total / N,
            p = v.positivo / v.total,
            n = v.negativo / v.total;
        merito += r * infor(p, n);
    });

    data[key].merito = merito;
}

// NOTA: ver si p/n == 0 para ver que hacer cuando log2(x) = infinity
// creemos que si p/n == 0 entonces infor(p, n) devuelve 0 <--- BIEN ???
function infor(p, n){
    return (p == 0 || n == 0) ? 0 : -p * Math.log2(p) -n * Math.log2(n);
}