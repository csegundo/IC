# ALGORITMO DE BAYES
numAtributos = 4 # see: http://archive.ics.uci.edu/ml/datasets/Iris
numClases = 2

# Funciones
def media(suma, N):
    retSuma = [0.0] * len(suma)
    it = 0

    for col in suma:
        retSuma[it] = col / N
        it += 1

    return retSuma


# punto -> 5.1,3.5,1.4,0.2
# media -> de cada clase
def aproximacion(punto, media):
    return 0
    
    
    
# Leer el fichero general
IrisClases = open('Iris2Clases.txt', 'r')
lines = IrisClases.readlines()

# Preparamos el conjunto de datos
data = []
for line in lines:
    data.append(line.replace('\n', '').split(','))

# diccionario <clase, [a,b...]>
dataset = dict()
for i in range(len(data)):
    vector = data[i]
    className = vector[-1]
    className = className.replace('\n', '')
    if (className not in dataset):
        dataset[className] = list()
    dataset[className].append(vector)


# print(dataset)

sumas = [0.0] * 4 # siempre hay 4 valores -> almacenar en cada posicion la suma de cada columna

# diccionario <clase, mediaClase>
mediasClases = dict()
for clase in dataset:
    for fila in dataset[clase]:
        for i in range(numAtributos):
            sumas[i] += float(fila[i])
    
    # media de cada clase
    mediasClase = media(sumas, len(dataset[clase]))
    mediasClases[dataset[clase][0][-1]] = mediasClase



files = [ 'TestIris02.txt']#, 'TestIris02.txt', 'TestIris03.txt' ]

print(mediasClases)
print("---------")

for filename in files:
    dictRestas = dict()

    file = open(filename, 'r')
    muestra = file.readline().replace('\n', '').split(',')

    # START (1) recorrer ambas clases para sacar los valores de las medias
    for nombreClase in mediasClases: 
        if (nombreClase not in dictRestas):
            dictRestas[nombreClase] = [0.0] * numAtributos
        
        # START (2) sumar todas las medias
        for i in range(len(mediasClases[nombreClase])):
            dictRestas[nombreClase][i] = float(muestra[i]) - mediasClases[nombreClase][i]
        # END (2)
    # END (1)
    print(dictRestas)

    sumaTotal = 0.0
    sumaMin = 999999.0
    solClase = ''
    # START (3) de la diferencia entre muestra/media de cada clase nos quedamos con la MENOR -> Majanouris
    for nombreClase in dictRestas:
        lista = dictRestas[nombreClase]
        for it in range(len(lista)):
            sumaTotal += pow(lista[it], 2)
        
        print("Esta es la suma:",sumaTotal)
        
        if(sumaTotal < sumaMin):
            sumaMin = sumaTotal
            solClase = nombreClase
        
        sumaTotal = 0.0
    # END (3)

    print("La solucion para " + filename + " es: " + solClase)

