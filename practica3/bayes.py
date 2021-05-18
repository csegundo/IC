# ALGORITMO DE BAYES
numAtributos = 4 # see: http://archive.ics.uci.edu/ml/datasets/Iris


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


#muestraEntrada - mediaClase

restas = [0.0] *2 #numero de clases

for mediasClase in dataset:
     for fila in dataset[clase]:
        for i in range(numAtributos):
            sumas[i] += float(fila[i])
    
print(mediasClases)