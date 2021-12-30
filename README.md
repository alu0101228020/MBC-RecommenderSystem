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

En primer lugar, el fichero **index.html** es el fichero que contiene el formulario donde se le pide al usuario que deba completar el campo necesario de la introducción de ficheros para poder llevar a cabo la recomendación. Además, al pulsar el botón "Mostrar resultados", se podrá observar como aparecen los resultados en pantalla a través de los id's correspondientes colocados en el código:

```html
          <!--id's donde se muestran los resultados-->
          <div id="similarityTable" class="col s12 center"></div>
          <div id="documentsTable" class="col s12 center"></div>
```

