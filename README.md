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

En este repositorio se encuentra la práctica de Sistemas de recomendación que tiene como propósito realizar un sistema recomendador que implemente modelos basados en el contenido cuyo objetivo se centra en aprender las preferencias del usuario para localizar y recomendar ítems que sean similares a dichas preferencias.

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

## 3.1. Fichero index.html

En primer lugar, el fichero **index.html** es el fichero que contiene el formulario donde se le pide al usuario que deba completar el campo necesario de la introducción de ficheros para poder llevar a cabo la recomendación. Además, al pulsar el botón **"Mostrar resultados"**, se podrá observar como aparecen los resultados en pantalla a través de los id's correspondientes colocados en el código:

```html
          <!--id's donde se muestran los resultados-->
          <div id="similarityTable" class="col s12 center"></div>
          <div id="documentsTable" class="col s12 center"></div>
```

## 3.2. Fichero form.js

A continuación, en este fichero **form.js** es donde se lleva a cabo la obtención del archivo introducido por el usuario en el formulario de HTML para posteriormente almacenarlo en la clase. Además, en este fichero se lleva a cabo las llamadas a las funciones provenientes de la clase Recommender para calcular los valores necesarios y mostrar los resultados obtenidos por pantalla.

Para ello, se realiza el evento **change** que permite llamar a la función de lectura de fichero cuando se cargue un nuevo fichero, es decir, cuando el usuario cambie el fichero que ha introducido en el programa.

```js
/**
 * Evento que permite llamar a la función de lectura de fichero cuando se cargue un nuevo fichero
 */
const fileInput = document.getElementById('text');
fileInput.addEventListener('change', fileToMatrix);
```

En la llamada a la función `fileToMatrix()` se lee el fichero cargado y se obtienen los valores para almacenarlos en el atributo de la clase correspondiente. Para ello, se coge el fichero que esté en la primera posición del array de ficheros, dado que solo se puede introducir un fichero, y posteriormente lo lee a través de la llamada a la función `readAsText` del objeto `FileReader` creado. 

Luego, se carga dicha lectura y en ella, se obtiene el resultado que es separado por líneas siendo cada línea un documento y es almacenado en un vector a través de `let docs = content.split('\n')`. Se recorre cada línea, es decir, cada documento y se comprueba que no existen líneas vacias, y finalmente, se colocan todos los términos en minúscula dada la función `toLowerCase()` y se quitan aquellos signos de puntuación a través de dos expresiones regulares. Una vez hecho esto, se separa por espacios cada una de las palabras y se almacenan en un array auxiliar que hace referencia al documento de palabras o términos que es introducido en la matriz de documentos originales del atributo de la clase. 

```js
/**
 * Método que permite leer el fichero cargado y obtener los valores para almacenarlos en el atributo de la clase
 * @param {*} e Ficheros cargados
 * @returns texto
 */
function fileToMatrix(e) {
    if (e.target.files.length < 1) {
      alert("Tienes que subir un fichero de contenido");
    }
    const file = fileInput.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

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
    }
    return text;
}
```

Por otro lado, tenemos el evento **click** que permite ejecutar los cálculos de la recomendación y además, mostrarlos en pantalla a través de los id's.

```js
/**
 * Evento que permite ejecutar el programa y mostrar los resultados en el HTML al hacer clic en el botón
 */
const result = document.getElementById('button');
    result.addEventListener('click', function(e) {
```

Al pulsar el botón se lleva a cabo la ejecución de la función `calculateDocuments()` que se encarga de llamar a las funciones que calculan las matrices de los valores TF, IDF y TFIDF de los términos de cada documento, luego se recorre cada uno de los documentos, es decir, las filas de las matrices y con la llamada a la función `getTableDocument()` se obtiene la tabla en HTML de dicho documento con los valores calculados. Las distintas tablas de los documentos se van almacenando en una cadena que devuelve.

Por último, la función `getTableSimilarity()` permite imprimir la tabla de documentos en HTML con los valores de Similitud de Coseno.
