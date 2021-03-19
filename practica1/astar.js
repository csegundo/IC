/**
 * astar.js es el script que contiene el algoritmo de busuqeda A*
 */

"use strict"

$(function(){
    let ABIERTA = [ ];
    let CERRADA = [ ];

    /**
     * @param {Array[Array]} tablero - Matriz donde estan colocados los elementos
     * @param {coord} inicio - Coordenada del punto de inicio: { x, y }
     * @param {coord} fin - Coordenada del punto final: { x, y }
     * @param {Array[coord]} fin - Coordenadas de los obstaculos: { x, y }
     */
    function astarSearch(tablero, inicio, fin, obstaculos){
        let SOLUCION = [];

        // 1. COLOCAR OBSTACULOS EN LA LISTA CERRADA
        $.each(obstaculos, function(i, obstaculo){
            CERRADA.push({
                coord : { 'x' : obstaculo.x, 'y' : obstaculo.y }
            }); // push de un objeto similar a los del tablero: minimo las coordenadas
        });

        // 2. COLOCAR EL INICIO EN LA LISTA ABIERTA
        ABIERTA.push({
            antecesor   : '',
            dAcumulada  : 0,
            dEstimada   : 0,
            coord       : { 'x' : inicio.x, 'y' : inicio.y }
        });

        // 3. EMPEZAR EL ALGORITMO
        while(ABIERTA.length > 0){
            var X = ABIERTA.shift();
            CERRADA.push(X);

            // X es el nodo META
            if(X.coord.x == fin.x && X.coord.y == fin.y){
                // sacar los antecesores y calcular la solucion
                break;
            }
            else{
                // actualizar su coste
                
                // SEGUIR AQUI
            }
        }

        return SOLUCION;
    }

    // Comprueba si la casilla es valida
    function isValid(row, col){
        return false;
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
});