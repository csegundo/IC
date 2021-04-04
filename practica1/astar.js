$(function(){
    let tablero = [],
        itemStatus = {
            START       : 1,
            FINISH      : 2,
            OBSTACLE    : 3,
            PENAL       : 4
        },
        status = 0,
        defaultSettings = {
            rows    : 5,
            cols    : 4,
            colSize : 12 / 4
        };

    $('.set-rows-cols').click(function(){
        var _rows = $('input[data-action="rows"]').val(),
            _cols = $('input[data-action="cols"]').val();
        
        // Construir el tablero y la matriz para el algoritmo
        var special = [ 5, 7, 8, 9, 10, 11 ];

        _rows = parseInt(_rows);
        _cols = parseInt(_cols);
        var _canvas = $('.astar-canvas'),
            tamCol = 12 / _cols;

        if(special.includes(_cols)){
            tamCol = _cols;
        }

        _canvas.html('');
        for(var i = 0; i < _rows; i++){
            tablero[i] = [];
            for(var j = 0; j < _cols; j++){
                _canvas.append(`<div class="col-${tamCol} dice" data-row="${i}" data-col="${j}"></div>`);
                tablero[i][j] = {
                    antecesor   : '',
                    dAcumulada  : 0,
                    valorAcumAristas : 0,
                    dMeta       : 0,
                    coord       : { 'x' : i, 'y' : j },
                    penalizacion: 0
                };
            }
        }

        $('.control-panel .execute .start').attr('disabled', false);
    });

    // Boton de INICIAR EL ALGORITMO
    $('.control-panel .execute .start').click(function(){
        var _canvas = $('.astar-canvas');
        var inicio = $('.astar-canvas .dice .start'),
            fin = $('.astar-canvas .dice .end'),
            obstaculos = $('.astar-canvas .dice .obstacle'),
            penals = $('.astar-canvas .dice .penal');
        
        inicio = inicio.parents('.dice').data();
        inicio = { 'x' : inicio.row, 'y' : inicio.col };
        fin = fin.parents('.dice').data();
        fin = { 'x' : fin.row, 'y' : fin.col };
        var obs = [], pens = [];

        $.each(obstaculos, function(i, obstaculo){
            obstaculo = $(obstaculo).parents('.dice').data();
            obs.push({ 'x' : obstaculo.row, 'y' : obstaculo.col });
        });
        $.each(penals, function(i, penal){
            penal = $(penal).parents('.dice').data();
            pens.push({ 'x' : penal.row, 'y' : penal.col });
        });

        let penalCost = parseInt($('.penal-num').val()) || 0;

        let MEJOR_CAMINO = astarSearch(tablero, inicio, fin, obs, pens, penalCost);

        // Borrar solucion anterior si habia ya una
        $.each($('.dice.sol'), function(i, celda){
            $(celda).removeClass('sol').html('');
        });

        $.each(MEJOR_CAMINO, function(i, item){
            _canvas.find('.dice[data-row="' + item.x + '"][data-col="' + item.y + '"]').html('<i class="fa fa-map-marker"></i>').addClass('sol');
        });
    });

    // Añadir elementos al tablero
    $('.control-panel .elements button').click(function(){
        var action = $(this).data().action;

        switch(action){
            case 1: status = itemStatus.START; break;
            case 2: status = itemStatus.FINISH; break;
            case 3: status = itemStatus.OBSTACLE; break;
            case 4: status = itemStatus.PENAL; break;
            default: break;
        }
    });
    $('.astar-canvas').on('click', '.dice', function(){
        var item = '';

        switch(status){
            case 1: item = 'car start'; break;
            case 2: item = 'flag-checkered end'; break;
            case 3: item = 'tree obstacle'; break;
            case 4: item = 'tint penal'; break;
            default: break;
        }

        if(item){
            $(this).html(`<i class="fa fa-${item}"></i>`);
        }

        // Deshabilitamos los botones de inicio o fin si ya se han colocado
        if(status == itemStatus.START || status == itemStatus.FINISH){
            $(`button[data-action="${status}"]`).attr('disabled', true);
        }

        // Reseteamos el status general: si es obstaculo no lo reseteamos para que sea mas sencillo de colocar
        if(status != itemStatus.OBSTACLE && status != itemStatus.PENAL)
            status = 0;
        
        if($(this).hasClass('sol')){
            $(this).removeClass('sol')
        }
    });

    // Boton reset all
    $('.control-panel .execute .reset').click(function(){
        $('.control-panel .elements button').attr('disabled', false);
        $('input[data-action="rows"]').val(defaultSettings.rows);
        $('input[data-action="cols"]').val(defaultSettings.cols);
        $('.astar-canvas').html('');

        for(var i = 0; i < defaultSettings.rows; i++){
            tablero[i] = [];
            for(var j = 0; j < defaultSettings.cols; j++){
                $('.astar-canvas').append(`<div class="col-${defaultSettings.colSize} dice" data-row="${i}" data-col="${j}"></div>`);
                tablero[i][j] = {
                    antecesor   : '',
                    dAcumulada  : 0,
                    valorAcumAristas : 0,
                    dMeta       : 0,
                    coord       : { 'x' : i, 'y' : j },
                    penalizacion : 0
                };
            }
        }
    });

    // Boton de ayuda
    $('.control-panel .tutorial .info').click(function(){
        var popup_main = `<div class="popup"></div>`,
            popup_content = `<div class="popup-content"></div>`,
            popup_header =
            `<div class="popup-header">
                <span class="title">Cómo usar la herramienta <i class="fa fa-question"></i></span>
                <span class="popup-close"><i class="fa fa-times"></i></span>
            </div>`,
            popup_body =
            `<div class="popup-body">
                <ul>
                <li>Para establecer el número de filas y columnas basta con ajustar el nº de filas y columnas de darle al boton "Establecer <i class="fa fa-check-circle-o"></i>".</li>
                <li>Para colocar elementos basta con hacer click en el botón "Colocar" y pinchar en una celda para colocarlo. Para el inicio y la meta solo se podrá colocar UNA vez, mientras que los obtáculos
                se pueden colocar múltiples veces.</li>
                <li>Para los obstáculos puedes pinchar una sola vez en el botón y empezar a colocar sin tener que volver a darle, igual que con las penalizaciones.</li>
                <li>Además, para las penalizaciones, debes indicar el coste de la misma.</li>
                <li>Para iniciar el algoritmo basta con pulsar el botón de "Iniciar <i class="fa fa-play"></i>".</li>
                <li>Para reiniciar la aplicación a su estado inicial basta con pulsar el botón "Resetear <i class="fa fa-refresh fa-spin"></i>" o bien pulsar <kbd>F5</kbd>.</li>
                <li>El resultado del algoritmo se mostrará sombreado y con un icono correspondiente al recorrido mostrado en la leyenda de iconos.</li>
                </ul>
            </div>`,
            popup_footer =
            `<div class="popup-actions">
                <button class="btn btn-primary btn-sm popup-close"><i class="fa fa-times"></i> Cerrar</button>
            </div>`;

        $('body').removeClass('set-overflow').addClass('rem-overflow');
        $('body').append(popup_main);
        $('.popup').html(popup_content);
        $('.popup-content').html(popup_header);
        $('.popup-content').append(popup_body);
        $('.popup-content').append(popup_footer);
        $('.popup .popup-close').click(function(){
            $('body').css('overflow-x', 'auto');
            $('body').removeClass('rem-overflow').addClass('set-overflow');
            $(this).parents('.popup').remove();
        });
    });

    ///////////////////////////////////////////////

    /**
     * @param {Array[Array]} tablero - Matriz donde estan colocados los elementos
     * @param {coord} inicio - Coordenada del punto de inicio: { x, y }
     * @param {coord} fin - Coordenada del punto final: { x, y }
     * @param {Array[coord]} obstaculos - Coordenadas de los obstaculos: { x, y }
     * @param {Array[coord]} penalizaciones - Coordenadas de las penalizaciones: { x, y }
     */
    function astarSearch(tablero, inicio, fin, obstaculos, penalizaciones, penalCost){
        let SOLUCION    = [ ];
        let ABIERTA     = [ ];
        let CERRADA     = [ ];

        // 1. COLOCAR OBSTACULOS EN LA LISTA CERRADA
        $.each(obstaculos, function(i, obstaculo){
            CERRADA.push({
                coord : { 'x' : obstaculo.x, 'y' : obstaculo.y }
            }); // push de un objeto similar a los del tablero: minimo las coordenadas
        });

        // para calcular la distancia desde cada uno de los nodos que no sean obstáculos al nodo final
        calculateFinish(tablero, fin, CERRADA);

        // 2. COLOCAR EL INICIO EN LA LISTA ABIERTA
        ABIERTA.push({
            antecesor   : '',
            dAcumulada  : 0,
            valorAcumAristas : 0,
            dMeta       : 0,
            coord       : { 'x' : inicio.x, 'y' : inicio.y }, 
            penalizacion : 0
        });

        // 3. EMPEZAR EL ALGORITMO
        while(ABIERTA.length > 0){
            var X = ABIERTA.shift();
            CERRADA.push(X);

            // X es el nodo META
            if(X.coord.x == fin.x && X.coord.y == fin.y){
                // sacar los antecesores y calcular la solucion
                var _actual = X.antecesor; // antecesor actual
                while(true){
                    if(_actual && (_actual.coord.x != inicio.x || _actual.coord.y != inicio.y)){
                        SOLUCION.push(_actual.coord);
                        _actual = _actual.antecesor;
                    } else{
                        break;
                    }
                }
                break;
            } else{
                // Sucesores de X (vertical y diagonal)
                for(let i = -1; i <= 1; ++i){
                    for (let j = -1; j <= 1; ++j){
                        // Sucesor Y
                        let Y = {
                            coord: { 'x' : X.coord.x + i, 'y' : X.coord.y + j }
                        };

                        // Se comprueba si Y está en una posición válida y que no sea el nodo actual
                        if (isValid(tablero, Y) && ((Y.coord.x != X.coord.x) || (Y.coord.y != X.coord.y))){
                            // Datos del nodo
                            Y.antecesor = X;
                            Y.dMeta = tablero[Y.coord.x][Y.coord.y].dMeta;
                            
                            // Para calcular si la casilla actual se encuentra dentro de las casillas que son penalizacioones en el tablero
                            $.each(penalizaciones, function(i, p){
                                if(p.x == Y.coord.x && p.y == Y.coord.y){
                                    Y.penalizacion = penalCost;
                                    return false;
                                }
                            });
                            calculateAggregateDistance(X, Y); // valorAcumAristas, dAcumulada

                            // Si el nodo Y no está en CERRADA
                            if (!isInList(Y.coord, CERRADA)){
                                if (!isInList(Y.coord, ABIERTA)){ // Si no está en ABIERTA ni en CERRADA --> nodo nuevo
                                    ABIERTA.push(Y); 

                                } else{ // Ya está en ABIERTA --> comparar la nueva dAcumulada con la anterior
                                    let YAnterior = ABIERTA.filter(n => n.coord.x == Y.coord.x && n.coord.y == Y.coord.y)[0];

                                    if (Y.dAcumulada < YAnterior.dAcumulada){ // Es mejor el nuevo camino
                                        // Se actualiza el nodo con los nuevos datos
                                        ABIERTA[ABIERTA.indexOf(YAnterior)] = Y;
                                    }
                                }
 
                                // Ordenar ABIERTA por menor dAcumulada
                                ABIERTA.sort(function (a, b) {
                                    if (a.dAcumulada > b.dAcumulada) {
                                      return 1;
                                    }
                                    if (a.dAcumulada < b.dAcumulada) {
                                      return -1;
                                    }
                                    return 0;
                                });
                            }
                        }
                    }
                }
            }
        }

        return SOLUCION;
    }

    // Comprueba si la casilla es valida, que no se salga del tablero
    function isValid(tablero, nodo){
        var ok = true;

        if(nodo.coord.x < 0){
            ok = false;
        } else if(nodo.coord.y < 0){
            ok = false;
        } else if(nodo.coord.x > (tablero.length - 1)){
            ok = false;
        } else if(nodo.coord.y > (tablero[0].length - 1)){
            ok = false;
        }
        return ok;
    }

    // Comprueba si la coordenada/nodo se encuentra en la lista pasada por parametro
    function isInList(coordenada, lista){
        var _in = false;

        $.each(lista, function(i, item){
            if(coordenada.x == item.coord.x && coordenada.y == item.coord.y){
                _in = true;
                return false;
            }
        });

        return _in;
    }

    // Calcula la distancia desde cada nodo del tablero hasta la meta, que siempre sera fija
    function calculateFinish(tablero, final, listaCerrada){
        $.each(tablero, function(i, row){
            $.each(row, function(j, col){
                // sqrt((meta.x - nodoActual.x)^2 + (meta.y - nodoActual.y)^2)
                col.dMeta = Math.sqrt(Math.pow(final.x - col.coord.x, 2) + Math.pow(final.y - col.coord.y, 2));
            });
        });
    }

    function calculateAggregateDistance(nodoPadre, nodoHijo){
        nodoHijo.valorAcumAristas = nodoPadre.valorAcumAristas;

        // calcular la distancia desde el nodo padre al nodo hijo sumandole la que ya tenia anteriormente
        // si estan en diagonal la distancia es raiz de dos, si no es 1
        var ok = false;
        ok = ok || (nodoHijo.coord.x == nodoPadre.coord.x-1 && nodoHijo.coord.y == nodoPadre.coord.y-1);
        ok = ok || (nodoHijo.coord.x == nodoPadre.coord.x-1 && nodoHijo.coord.y == nodoPadre.coord.y+1);
        ok = ok || (nodoHijo.coord.x == nodoPadre.coord.x+1 && nodoHijo.coord.y == nodoPadre.coord.y-1);
        ok = ok || (nodoHijo.coord.x == nodoPadre.coord.x+1 && nodoHijo.coord.y == nodoPadre.coord.y+1);

        if(ok){
            nodoHijo.valorAcumAristas += Math.sqrt(2);
        }
        else{
            nodoHijo.valorAcumAristas += 1;
        }
        
        nodoHijo.dAcumulada = nodoHijo.valorAcumAristas + nodoHijo.dMeta;

        // PARA CALCULAR LA SUMA SI ERES UNA CASILLA QUE PROVOCA PENALIZACION
        if(nodoHijo.penalizacion && nodoHijo.penalizacion != 0){ // si tengo penalizacion
            nodoHijo.dAcumulada += nodoHijo.penalizacion;
        }
    }
});