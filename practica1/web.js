/**
 * web.js es unicamente para dar funcionalidad a la aplicacion
 */

$(function(){
    let tablero = [],
        itemStatus = {
            START       : 1,
            FINISH      : 2,
            OBSTACLE    : 3
        },
        status = 0,
        defaultSettings = {
            rows    : 5,
            cols    : 3,
            colSize : 12 / 3
        };

    $('.set-rows-cols').click(function(){
        var _rows = $('input[data-action="rows"]').val(),
            _cols = $('input[data-action="cols"]').val();
        
        // Construir el tablero y la matriz para el algoritmo
        _rows = parseInt(_rows);
        _cols = parseInt(_cols);
        var _canvas = $('.astar-canvas'),
            tamCol = 12 / _cols;

        _canvas.html('');
        for(var i = 0; i < _rows; i++){
            tablero[i] = [];
            for(var j = 0; j < _cols; j++){
                _canvas.append(`<div class="col-${tamCol} dice" data-row="${i}" data-col="${j}"></div>`);
                tablero[i][j] = {
                    antecesor   : '',
                    dAcumulada  : 0,
                    dEstimada   : 0,
                    coord       : { 'x' : i, 'y' : j }
                };
            }
        }

        // console.log('TABLERO:', tablero);
    });

    // Boton de INICIAR EL ALGORITMO
    $('.control-panel .execute .start').click(function(){
        var _canvas = $('.astar-canvas');
        /*var inicio = $('.astar-canvas .dice .start'),
            fin = $('.astar-canvas .dice .end'),
            obstaculos = $('.astar-canvas .dice .obstacle');
        
        inicio = inicio.parents('.dice').data();
        inicio = { 'x' : inicio.row, 'y' : inicio.col };
        fin = fin.parents('.dice').data();
        fin = { 'x' : fin.row, 'y' : fin.col };
        var obs = [];

        $.each(obstaculos, function(i, obstaculo){
            obstaculo = $(obstaculo).parents('.dice').data();
            obs.push({ 'x' : obstaculo.row, 'y' : obstaculo.col });
        });

        let MEJOR_CAMINO = astarSearch(tablero, inicio, fin, obs);*/
        let MEJOR_CAMINO = [{ 'x' : 0, 'y' : 1 }, { 'x' : 1, 'y' : 2 }, { 'x' : 2, 'y' : 0 }]; // prueba

        $.each(MEJOR_CAMINO, function(i, item){
            _canvas.find('.dice[data-row="' + item.x + '"][data-col="' + item.y + '"]').html('<i class="fa fa-map-marker"></i>');
        });
    });

    // Añadir elementos al tablero
    $('.control-panel .elements button').click(function(){
        var action = $(this).data().action;

        switch(action){
            case 1: status = itemStatus.START; break;
            case 2: status = itemStatus.FINISH; break;
            case 3: status = itemStatus.OBSTACLE; break;
            default: break;
        }
    });
    $('.astar-canvas').on('click', '.dice', function(){
        var item = '';

        switch(status){
            case 1: item = 'car start'; break;
            case 2: item = 'flag-checkered end'; break;
            case 3: item = 'tree obstacle'; break;
            default: break;
        }

        if(item){
            $(this).html(`<i class="fa fa-${item}"></i>`);
        }

        // Deshabiolitamos los botones de inicio o fin si ya se han colocado
        if(status == itemStatus.START || status == itemStatus.FINISH){
            $(`button[data-action="${status}"]`).attr('disabled', true);
        }

        // Reseteamos el status general: si es obstaculo no lo reseteamos para que sea mas sencillo de colocar
        if(status != itemStatus.OBSTACLE)
            status = 0;
        
    });

    // Boton reset all
    $('.control-panel .execute .reset').click(function(){
        $('.control-panel .elements button').attr('disabled', false);
        $('input[data-action="rows"]').val(5);
        $('input[data-action="cols"]').val(3);
        $('.astar-canvas').html('');

        for(var i = 0; i < defaultSettings.rows; i++){
            tablero[i] = [];
            for(var j = 0; j < defaultSettings.cols; j++){
                $('.astar-canvas').append(`<div class="col-${defaultSettings.colSize} dice" data-row="${i}" data-col="${j}"></div>`);
                tablero[i][j] = {
                    antecesor   : '',
                    dAcumulada  : 0,
                    dEstimada   : 0,
                    coord       : { 'x' : i, 'y' : j }
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
                se pueden colocar múltiples veces</li>
                <il>Para los obstáculos puedes pinchar una sola vez en el botón y empezar a colocar sin tener que volver a darle.</li>
                <li>Para iniciar el algoritmo basta con pulsar el botón de "Iniciar <i class="fa fa-play"></i>".</li>
                <li>Para reiniciar la aplicación a su estado inicial basta con pulsas el botón de "Resetear <i class="fa fa-refresh fa-spin"></i>" o bien pulsar <kbd>F5</kbd>.</li>
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
});