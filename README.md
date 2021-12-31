# Práctica de Gestión del Conocimiento en las Organizaciones

## Sistemas de recomendación: Modelos Basados en el Contenido

## Autor: Dayana Armas Alonso (alu0101228020)

<p align="center">
  <br>
  Programa del sistema de recomendación: <ahref="https://alu0101228020.github.io/MBC-RecommenderSystem/">https://alu0101228020.github.io/MBC-RecommenderSystem/</a>
  <br>
</p>            

- - -

## 1. Introducción

En este repositorio se encuentra la práctica de Sistemas de recomendación que tiene como propósito realizar un sistema recomendador que implemente un modelo basado en el contenido cuyo objetivo se centra en aprender las preferencias del usuario para localizar y recomendar ítems que sean similares a dichas preferencias.

Para desarrollar esta práctica se ha utilizado el lenguaje de **JavaScript**, **CSS** y **HTML**. También se ha empleado el uso del framework de **Materialize** para darle mejor estilo al código HTML.

## 2. Estructura de directorios

Dentro de la carpeta **docs** contamos con los siguientes directorios y ficheros:

* **examples:** Es un directorio que incluye diferentes ejemplos de textos que contienen varios documentos con los que se puede comprobar el correcto funcionamiento del programa.

* **src:** Es un directorio que almacena los siguientes ficheros en **JavaScript**:

  * **form.js:** Es el fichero donde se almacenan los datos del formulario colocados por el usuario y permite realizar la llamada a las funciones necesarias de la clase Recommender para mostrar los resultados por pantalla.
  * **recommender.js:** Es el fichero que define la clase **Recommender** que implementa el sistema de recomendación. En esta clase se lleva a cabo la realización de los cálculos de los valores TF, IDF y TFIDF de cada término para cada documento. Además, se realiza el cálculo de la normalización del TF para posteriormente usarlo en la operación de Similitud de Coseno entre cada par de documentos.

* **index.html:** Es el fichero en **HTML** que permite crear la página web donde se le pide al usuario introducir los parámetros necesarios a través de un formulario para realizar la recomendación.

* **style.css:** Es la hoja de estilo de **CSS** que define el estilo de presentación del documento HTML.

## 3. Descripción del código desarrollado

A continuación, se llevará a cabo la explicación del contenido de cada uno de los ficheros que componen la práctica.

### 3.1. Fichero index.html

En primer lugar, el fichero **index.html** es el fichero que contiene el formulario donde se le pide al usuario que deba completar el campo necesario de la introducción de ficheros para poder llevar a cabo la recomendación. Además, al pulsar el botón **"Mostrar resultados"**, se podrá observar como aparecen los resultados en pantalla a través de los id's correspondientes colocados en el código:

```html
          <!--id's donde se muestran los resultados-->
          <div id="similarityTable" class="col s12 center"></div>
          <div id="documentsTable" class="col s12 center"></div>
```

### 3.2. Fichero form.js

A continuación, en este fichero **form.js** es donde se lleva a cabo la obtención del archivo introducido por el usuario en el formulario de HTML para posteriormente almacenarlo en la clase. Además, en este fichero se lleva a cabo las llamadas a las funciones provenientes de la clase Recommender para calcular los valores necesarios y mostrar los resultados obtenidos por pantalla.

Para ello, se realiza el evento **change** que permite llamar a la función de lectura de fichero cuando se cargue un nuevo fichero, es decir, cuando el usuario cambie el fichero que ha introducido en el programa.

```js
const fileInput = document.getElementById('text');
fileInput.addEventListener('change', fileToMatrix);
```

En la llamada a la función `fileToMatrix()` se lee el fichero cargado y se obtienen los valores para almacenarlos en el atributo de la clase correspondiente. Para ello, se coge el fichero que esté en la primera posición del array de ficheros, dado que solo se puede introducir un fichero, y posteriormente lo lee a través de la llamada a la función `readAsText()` del objeto `FileReader` creado.

```js
    const file = fileInput.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
```

Luego, se carga dicha lectura y en ella, se obtiene el resultado que es separado por líneas siendo cada línea un documento. Este es almacenado en un vector que separa el contenido por líneas a través de `content.split('\n')`. Se recorre cada línea, es decir, cada documento y se comprueba que no existen líneas vacias, y finalmente, se colocan todos los términos en minúscula dada la función `toLowerCase()` y se quitan aquellos signos de puntuación a través de dos expresiones regulares. Una vez hecho esto, se separa por espacios cada una de las palabras y se almacenan en un array auxiliar que hace referencia al documento de palabras o términos que es introducido en la matriz de documentos originales del atributo de la clase. 

```js
    reader.onload = function() {
        const content = reader.result;
        let docs = content.split('\n');
        let originalMatrix = [];
        for (let i = 0; i < docs.length; i++) {
            if (docs[i] != '') {
                docs[i] = docs[i].toLowerCase();
                let puntuation = docs[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                let puntuation2 = puntuation.replace(/\s{2,}/g," ");
                let arrayAux = puntuation2.split(" ");
                originalMatrix.push(arrayAux);
            }
        }
        recommender.docsOriginals(originalMatrix);
```

Por otro lado, tenemos el evento **click** que permite ejecutar los cálculos de la recomendación y además, mostrarlos en pantalla a través de los id's.

```js
const result = document.getElementById('button');
    result.addEventListener('click', function(e) {
```

Al pulsar el botón se lleva a cabo la ejecución de la función `calculateDocuments()` que se encarga de llamar a las funciones que calculan las matrices de los valores TF, IDF y TFIDF de los términos de cada documento, luego se recorre cada uno de los documentos, es decir, las filas de las matrices y con la llamada a la función `getTableDocument()` se obtiene la tabla en HTML de dicho documento con los valores calculados. Las distintas tablas de los documentos se van almacenando en una cadena que devuelve.

Por último, también se lleva a cabo la llamada de la función `getTableSimilarity()` que permite devolver la tabla de documentos en HTML con los valores de Similitud de Coseno.

### 3.3. Fichero recommender.js

El fichero **recommender.js** contiene la clase **Recommender** que implementa un sistema recomendador que lleva a cabo un modelo basado en el contenido. En esta clase se lleva a cabo la realización de los cálculos de los valores TF, IDF y TFIDF de cada término para cada documento. Además, se realiza el cálculo de la normalización del TF para posteriormente usarlo en la operación de Similitud de Coseno entre cada par de documentos.

### Constructor

El constructor de la clase es el siguiente que se muestra:

```js
    constructor(originalMatrix) {
       this.originalMatrix = originalMatrix;
       this.uniqueWordsMatrix = [];
       this.TFMatrix = [];
       this.IDFMatrix = [];
       this.TFIDFMatrix = [];
       this.similarityMatrix = [];
    }
```

Podemos observar los siguientes atributos:

* **this.originalMatrix:** Este atributo contiene la matriz original de documentos con palabras duplicadas. Cada una de las filas se trata de un documento y cada documento está compuesto por términos que pueden repetirse.
* **this.uniqueWordsMatrix:** Este atributo contiene la matriz original de documentos sin palabras duplicadas. Es la misma matriz que la anterior pero cada documento tiene términos únicos, es decir, que no hay términos repetidos en cada documento.
* **this.TFMatrix:** Este atributo contiene la matriz con los valores TF de los términos de cada documento. Es la matriz que almacena la frecuencia de los términos en cada uno de los documentos.
* **this.IDFMatrix:** Este atributo contiene la matriz con los valores IDF de los términos de cada documento. Es la matriz que almacena la frecuencia inversa de los términos en cada uno de los documentos.
* **this.TFIDFMatrix:** Este atributo contiene la matriz con los valores TFID de los términos de cada documento. Es la matriz que almacena la multiplicación de las dos anteriores.
* **this.similarityMatrix:** Este atributo contiene la matriz con los valores de Similitud de Coseno entre cada par de documentos.

### docsOriginals(originalMatrix)

Este método permite almacenar la matriz original en la clase a modo de setter.

### docsUniqueWords()

Este método permite quitar las palabras duplicadas que existen en cada documento de la matriz original de documentos para luego almacenarla en el atributo de la clase.

```js
docsUniqueWords() {
        let uniqueWordsMatrix = [];
        for (let i = 0; i < this.originalMatrix.length; i++) {
            uniqueWordsMatrix.push([]);
            for (let j = 0; j < this.originalMatrix[i].length; j++) {
                if(!uniqueWordsMatrix[i].includes(this.originalMatrix[i][j])) uniqueWordsMatrix[i].push(this.originalMatrix[i][j]);
            }
        }
        this.uniqueWordsMatrix = uniqueWordsMatrix;
        return this.uniqueWordsMatrix;
    }
```

Para ello, creamos la variable **uniqueWordsMatrix** que almacenará la matriz original pero sin términos duplicados por documento. Seguidamente, recorremos cada término de cada documento de la matriz original (this.originalMatrix) y a través de la función `include()` decimos que si el término que se está analizando en ese momento, no está incluido en el mismo documento que se está iterando de la matriz uniqueWordsMatrix, pues se introduce. De esta manera, aquella palabra que se esté analizando y ya se encuentre en el documento que se está iterando de la matriz uniqueWordsMatrix, se descartará y no se almacenará en esta última.

### calculateTF()

Este método permite calcular los valores TF de los términos de cada documento, es decir, que indica la frecuencia de los términos en cada uno de los documentos.

```js
    calculateTF() {
        let TFMatrix = [];
        const TFDoc = (doc, value) => doc.reduce((count, currentValue) => (currentValue === value ? count + 1 : count), 0);
        for (let i = 0; i < this.originalMatrix.length; i++) {
            TFMatrix.push([]);
            let vectorAux = [];
            for (let j = 0; j < this.originalMatrix[i].length; j++) {
                if (!vectorAux.includes(this.originalMatrix[i][j])) {
                    TFMatrix[i].push(TFDoc(this.originalMatrix[i], this.originalMatrix[i][j]));
                    vectorAux.push(this.originalMatrix[i][j]);
                }
            }
        }
        this.TFMatrix = TFMatrix;
        return this.TFMatrix;
    }
```

En primer lugar, se crea una variable que contendrá la matriz de los valores TF llamada **TFMatrix** y también la constante **TFDoc** que mediante el método `reduce()`, permite contar el número de veces que aparece el valor (value) pasado dentro del vector del documento (doc). Por lo que, se recorre el array doc comprando si el elemento que se está analizando en ese momento es igual al valor (value). En caso de que así sea, se incrementa la variable count y en otro caso, no se modifica dicha variable. El valor que devolverá será el que acumule el contador. Al final se especifica con un '0' el estado inicial del contador.

En este caso recorremos cada uno de los términos de cada documento de la matriz original que contiene duplicados (this.originalMatrix) y si el vector auxiliar (vectorAux), que se inicia nuevamente en cada documento, no incluye el término que se está analizando, entonces se llamará a la función TFDoc y se le pasará el array del documento y el término que se está iterando. El valor que devolverá la función se introducirá en la variable TFMatrix en el array que se está iterando. Además, se introducirá dicho término en el vector auxiliar y de esta manera, en caso de que ese término vuelva a aparecer en ese bucle pero manteniendo el mismo documento iterado, se descatará dado que ya hemos analizado su valor de frecuencia.

Por lo que, se obtendrá una matriz con valores TF de los términos de cada documento sin palabras duplicadas.

### calculateIDF()

Este método permite calcular los valores IDF de los términos de cada documento, es decir, que indica la frecuencia inversa de los términos en cada uno de los documentos.

```js
    calculateIDF() {
        let IDFMatrix = [];
        for (let i = 0; i < this.uniqueWordsMatrix.length; i++) {
            IDFMatrix.push([]);
            for (let j = 0; j < this.uniqueWordsMatrix[i].length; j++) {
                let count = 0;
                for (let z = 0; z < this.uniqueWordsMatrix.length; z++) {
                    if(this.uniqueWordsMatrix[z].includes(this.uniqueWordsMatrix[i][j])) count++;
                }
                IDFMatrix[i].push(Math.log10(this.uniqueWordsMatrix.length / count));
            }
        }
        this.IDFMatrix = IDFMatrix;
        return this.IDFMatrix;
    }
```

En este caso para hallar los valores IDF tenemos que emplear la **fórmula IDF(x) = log10( N / dfx)**. Siendo **N** el número de todos los documentos que pueden ser recomendados y **dfx** el número de documentos en N en los que la palabra clave x aparece.

Por lo que, en primer lugar creamos la variable que contendrá los valores IDF llamada `IDFMatrix` y a través de dos `for()` se recorrerá cada término de la matriz sin duplicados this.uniqueWordsMatrix y en el último `for()` se recorren las filas de dicha matriz, es decir, los documentos. Para ello, decimos que si el término que se está iterando en ese momento del bucle, está incluido en el documento que está iterando la z, pues el contador (count) aumentará. De esta forma se sabrá en cuántos documentos aparece el término que se está iterando. Una vez se acaba el bucle de la z y por lo tanto, se ha mirado si existe dicho término en cada uno de los documentos, se pasará a realizar la fórmula IDF que es el logarítmo en base 10 del número de documentos (this.uniqueWordsMatrix.length) entre la cuenta (count) y finalmente, el valor calculado se introducirá en la variable IDFMatrix del documento i que se está iterando.

### calculateTFIDF()

Método que permite calcular los valores TF-IDF de los términos de cada documento.

```js
    calculateTFIDF() {
        let TFIDFMatrix = [];
        for (let i = 0; i < this.TFMatrix.length; i++) {
            TFIDFMatrix.push([]);
            for (let j = 0; j < this.TFMatrix[i].length; j++) {
                TFIDFMatrix[i].push(this.TFMatrix[i][j] * this.IDFMatrix[i][j]);
            }
        }
        this.TFIDFMatrix = TFIDFMatrix;
        return this.TFIDFMatrix;
    }
```

En este método se crea la variable donde se almacenan los valores TF-IDF llamada `TFIDFMatrix` y se calculan los valores TF-IDF que consiste en la multiplicación de los valores de la matriz TF (this.TFMatrix) por la matriz IDF (IDFMatrix). Simplemente, se recorre cada valor TF de la matriz TF y se multiplica por el valor IDF que hay en esa misma posición de la matriz IDF. Cada valor se introduce en el documento que se está iterando de la variable TFIDFMatrix.

### normalizeTF()

Método que permite calcular los valores de la normalización del TF de los términos de cada documento.

```js
    normalizeTF() {
        let normalizeMatrix = [];
        let TFCount = [];
        const TFDoc = (doc) => doc.reduce((count, currentValue) => (count + currentValue * currentValue), 0);
        for (let i = 0; i < this.TFMatrix.length; i++) {
            TFCount.push(Math.sqrt(TFDoc(this.TFMatrix[i])));
        }
        for (let i = 0; i < this.TFMatrix.length; i++) {
            normalizeMatrix.push([]);
            for (let j = 0; j < this.TFMatrix[i].length; j++) {
                normalizeMatrix[i].push(this.TFMatrix[i][j] / TFCount[i]);
            }
        }
        return normalizeMatrix;
    }
 ```
 
En primer lugar, para hallar la normalización de los valores TF, partimos de la matriz TF original. Por cada documento, tenemos que coger cada valor TF, multiplicarlo por sí mismo y hacer el sumatorio de todos ellos. Una vez se obtiene el sumatorio, se hace la raíz cuadrada de dicho valor y finalmente, se divide cada término de ese documento entre el valor de la raíz cuadrada.

Para ello, creamos las variables `normalizeMatrix` que almacenará los valores TF normalizados, `TFCount` que será la que almacene el vector con los valores de las raíces cuadradas de cada documento y la constante `TFDoc` que mediante el método `reduce()`, permite multiplicar el valor que se está iterando, es decir, el valor actual (currentValue) por sí mismo y el resultado se acumula en la variable count. Por lo que, se recorre el array doc y se va almacenando en count la multiplicación de cada uno de los valores por sí mismos. El valor que devolverá será el que acumule el contador. Al final se especifica con un '0' el estado inicial del contador.

En el primer `for()` se iteran los documentos dado que por cada uno de los documentos, se llamará a la función `TFDoc()` que se encargará de multiplicar cada término por sí mismo y lo irá acumulando. A lo que devuelve la función, se realizará la raíz cuadrada y se introducirá en el vector TFCount. Por lo tanto, el vector TFCount contendrá tantos valores como documentos haya.

En los siguientes dos `for()` se itera cada uno de los valores TF por documento y se dividirá dicho valor entre el valor del vector TFCount que le pertenezca a ese término, es decir, el valor que esté iterando la i. Finalmente se introduce en el documento de la variable normalizeMatrix.

### calculateCosineSimilarity()

Método que permite calcular los valores de Similitud de Coseno de cada documento.

```
    calculateCosineSimilarity() {
        let normalizeMatrix = this.normalizeTF();
        let similarityMatrix = [];
        for (let i = 0; i < this.uniqueWordsMatrix.length; i++) {
            similarityMatrix.push([]);
            for (let j = 0; j < this.uniqueWordsMatrix.length; j++) {
                let count = 0;
                for (let z = 0; z < this.uniqueWordsMatrix[i].length; z++) {
                    let wordIndex = this.uniqueWordsMatrix[j].indexOf(this.uniqueWordsMatrix[i][z], 0);
                    if (wordIndex != -1) count += normalizeMatrix[i][z] * normalizeMatrix[j][wordIndex];
                }
                similarityMatrix[i].push(count);
            }
        }
        this.similarityMatrix = similarityMatrix;
        return this.similarityMatrix;
    }
```

En este caso para hallar la Similitud de Coseno entre par de documentos, se escoge un primer documento y un segundo documento y se va analizando cada uno de los términos del primer documento, comprobando si existe dicho término en el segundo documento. En caso de que exista el término en el segundo documento, se debe de multiplicar el valor TF del término en el primer documento por el valor TF del término en el segundo documento. Las multiplicaciones se van acumulando hasta que se termine de analizar cada término del primer documento. Una vez se termina, el acumulador tendrá la similitud entre el primer documento y el segundo.

Para ello, en primer lugar creamos la variable `normalizeMatrix` donde se almacena la llamada al método `this.normalizeTF()` que hemos visto anteriormente. Esta llamada nos devuelve la matriz normalizada de valores TF. Además, se crea la variable `similarityMatrix` que almacenará los valores de Similitud de Coseno.

Por lo que, se realiza un primer `for()` que recorre los documentos que hacen referencia al primer documento, luego se recorre otro `for()` que recorre los documentos que hacen referencia al segundo documento y por último el tercer `for()` que recorre los términos del primer documento, o sea del documento iterado i. Se crea la variable `wordIndex` que a través de la función `indexOf()` comprueba si el término z que se está analizando del primero documento i se encuentra en el segundo documento j. En caso de que se encuentre, se almacenará en la variable la posición del término encontrado en el segundo documento. En caso contrario, devolverá un -1. Por lo tanto, si el valor es distinto del -1, la cuenta (count), que se pone a 0 cuando se inicia un nuevo segundo documento j, almacenará la multiplicación del valor TF del término z en el primer documento i por el valor TF del término en el segundo documento j, que en este caso, la posición del término sería la almacenada en wordIndex. Una vez se termina de analizar cada término del primer documento, la cuenta (count) tendrá la similitud entre el primer documento i y el segundo j que se almacenará en la variable similarityMatrix.

