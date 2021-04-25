// Para probar la carga y lectura de archivos
var ATRIBUTOS = [];
var DATASET = [];
var DATASETAUX = [];
var ATRIBUTOSAUX = [];

$(function(){
    $('.load').click(function(){
        var attrs = $('input[name="attrs"]').get(0).files;
        var examples = $('input[name="content"]').get(0).files;

        if(attrs.length > 0 && examples.length > 0){
            attrs = attrs[0];
            examples = examples[0];

            $('.info .file.attrs-file').html(attrs.name);
            $('.info .file.dataset-file').html(examples.name);

            $.each([ attrs, examples ], function(i, file){
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function(event){
                    if(i == 0){
                        ATRIBUTOS = event.target.result.split(',');
                        ATRIBUTOSAUX = event.target.result.split(',');
                        console.log('$ATRIBUTOS', ATRIBUTOS);
                    } else{
                        DATASET = event.target.result.split('\n');
                        DATASETAUX = event.target.result.split('\n');
                        console.log('$DATASET', DATASET);
                    }
                };
            });

            $('button.execute').prop('disabled', false);
        } else{
            alert('IMPORTANTE. Es obligatorio cargar los dos archivos.');
        }
    });

    $('.execute').click(function(){
        console.warn('--------------------------');
        recursivo(ATRIBUTOS, DATASET);
    });
});

//////////////////////////////////////////////////

function recursivo(atributos, dataset){
    var datos = algoritmo(atributos, dataset);
    
    // sacamos el MENOR merito
    var level = {}, _merito = 99999999999, _key = "";
    $.each(datos, function(attrKey, attr){
        if(attr.merito < _merito){
            _key = attrKey;
            _merito = attr.merito;
            level = attr;
            console.debug('NIVEL', level);
            delete(level.merito);
        }
    });

    $.each(level, function(rama, valor){
        DATASETAUX = filtrar(rama, DATASETAUX);
        console.debug('ESTAMOS EN LA RAMA', rama);

        if(valor.positivo === 0 || valor.negativo === 0){
            console.warn('FINALIZADO', (valor.negativo === 0 ? "si" : "no") + " se puede salir a jugar");
        } else{
            var _attrs = ATRIBUTOSAUX;
            _attrs.splice(_attrs.indexOf(_key), 1);
            ATRIBUTOSAUX = _attrs;
            recursivo(_attrs, DATASETAUX);
        }

        // volver a cargar la variable DATASET
        DATASETAUX = DATASET;
        ATRIBUTOSAUX = ATRIBUTOS;
    });
}

function filtrar(nombreRama, datos){
    var _filter = [];

    $.each(datos, function(i, item){
        var idx = item.split(',').indexOf(nombreRama);
        if(idx >= 0){
            var aux = item.split(',');
            aux.splice(idx, 1);
            _filter.push(aux.join(','));
        }
    });

    return _filter;
}

function algoritmo(atributos, dataset){
    var datos = {};

    // preparamos el objeto poniendo en las claves cada uno de los atributos
    for(var i = 0; i < atributos.length - 1; i++){
        datos[atributos[i]] = {};
    }

    $.each(dataset, function(i, fila){
        fila = fila.replace('\r', '').split(',');
        var sol = fila[fila.length - 1]; // si o no

        for(var i = fila.length - 2; i >= 0; i--){
            if(!datos[atributos[i]][fila[i]]){
                datos[atributos[i]][fila[i]] = {
                    positivo    : sol === "si" ? 1 : 0,
                    negativo    : sol === "no" ? 1 : 0,
                    total       : 1
                };
            } else{
                if(sol === "si"){
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

function infor(p, n){
    return (p == 0 || n == 0) ? 0 : -p * Math.log2(p) -n * Math.log2(n);
}