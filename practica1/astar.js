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

        // para calcular la distancia desde cada uno de los nodos que no sean obstáculos al nodo final
        // OJO ==> influye para el nodo inicial ???
        calculateFinish(tablero);

        // 2. COLOCAR EL INICIO EN LA LISTA ABIERTA
        ABIERTA.push({
            antecesor   : '',
            dAcumulada  : 0,
            valorAcumAristas : 0,
            dMeta       : 0,
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
            } else{
                // actualizar su coste
                
                // SEGUIR AQUI
            }
        }

        return SOLUCION;
    }

    // Comprueba si la casilla es valida
    function isValid(tablero, nodo){
        return nodo.x < 0 || nodo.y < 0 || row > (tablero.length - 1) || col > (tablero[0].length - 1);
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
    function calculateFinish(tablero, final){
        var cerrada_aux = Set(CERRADA);

        $.each(tablero, function(i, row){
            $.each(row, function(j, col){
                // si no es obstaculo
                if(!cerrada_aux.has({ 'x' : col.coord.x, 'y' : col.coord.y })){
                    // sqrt((meta.x - nodoActual.x)^2 + (meta.y - nodoActual.y)^2)
                    col.dMeta = Math.sqrt(Math.pow(final.x - col.coord.x, 2) + Math.pow(final.y - col.coord.y, 2));
                }
            });
        });
    }

    // 
    function calculateAggregateDistance(nodoPadre, nodoHijo){
        nodoHijo.valorAcumAristas = nodoPadre.valorAcumAristas;

        // calcular la distancia desde el nodo padre al nodo hijo sumandole la que ya tenia anteriormente
        // si estan en diagonal la distancia es raiz de dos , si no es 1
        if((nodoHijo.coord.x == nodoPadre.coord.x-1 && nodoHijo.coord.y == nodoHijo.coord.y-1) || 
            (nodoHijo.coord.x == nodoPadre.coord.x-1 && nodoHijo.coord.y == nodoHijo.coord.y+1) || 
            (nodoHijo.coord.x == nodoPadre.coord.x+1 && nodoHijo.coord.y == nodoHijo.coord.y-1) || 
            (nodoHijo.coord.x == nodoPadre.coord.x+1 && nodoHijo.coord.y == nodoHijo.coord.y+1)){

            nodoHijo.valorAcumAristas += Math.sqrt(2);
        }
        else{
            nodoHijo.valorAcumAristas += 1;
        }
       
        nodoHijo.dAcumulada = nodoHijo.valorAcumAristas + nodoHijo.dMeta;
        // meter en la lista
    }
});