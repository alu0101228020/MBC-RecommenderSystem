/**
 * Objeto de la clase Recomendador
 */
let recommender = new Recommender([]);

/**
 * Evento que permite llamar a la función de lectura de fichero cuando se cargue un nuevo fichero
 */
const fileInput = document.getElementById('text');
fileInput.addEventListener('change', fileToMatrix);

/**
 * Evento que permite ejecutar el programa y mostrar los resultados en el HTML al hacer clic en el botón
 */
const result = document.getElementById('button');
    result.addEventListener('click', function(e) {
        document.getElementById('documentsTable').innerHTML = calculateDocuments();
        document.getElementById('similarityTable').innerHTML = '<div class="col s12"><h5>Similitud Coseno</h5></div><div>' + getTableSimilarity(recommender.calculateCosineSimilarity()) + '</div>';
});

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

/**
 * Método que permite llamar a las funciones que calculan las matrices de los valores TF, IDF y TFIDF de los términos de cada documento y almacena las distintas tablas de los documentos en una cadena
 * @returns Cadena con las tablas de los valores calculados de los distintos documentos que se imprimirán por HTML
 */
function calculateDocuments() {
    let result = '';
    let uniqueWordsMatrix = recommender.docsUniqueWords();
    let TFMatrix = recommender.calculateTF();
    let IDFMatrix = recommender.calculateIDF();
    let TFIDFMatrix = recommender.calculateTFIDF();
    for (let i = 0; i < uniqueWordsMatrix.length; i++) {
        result += '<div class="col s12"><h5>Documento ' + (i+1) + '</h5></div><div>' + getTableDocument(uniqueWordsMatrix[i], TFMatrix[i], IDFMatrix[i], TFIDFMatrix[i]) + '</div>';
    }
    return result;
}

/**
 * Método que permite imprimir las tablas de documentos con los valores TF, IDF y TFIDF
 * @param {*} docUniqueWords Vector del documento con palabras no duplicadas
 * @param {*} docTF Vector del documento con los valores TF
 * @param {*} docIDF Vector del documento con los valores IDF
 * @param {*} docTFIDF Vector del documento con los valores TFIDF
 * @returns Tabla del documento con los valores TF, IDF y TFIDF calculados
 */
function getTableDocument(docUniqueWords, docTF, docIDF, docTFIDF) {
    let table = '<div class="col s12" id="scrollTable"><table class="stripped"><thead><tr>';

    table += '<th>Índice</th><th>Término</th><th>TF</th><th>IDF</th><th>TFIDF</th>';

    table += '</tr></thead><tbody>';

    for (let i = 0; i < docUniqueWords.length; i++) {
        table += '<tr>';
        table += '<td>' + (i + 1) + '</td>';
        table += '<td>' + docUniqueWords[i] + '</td>';
        table += '<td>' + docTF[i] + '</td>';
        table += '<td>' + Math.round((docIDF[i] + Number.EPSILON) * 1000) / 1000 + '</td>';
        table += '<td>' + Math.round((docTFIDF[i] + Number.EPSILON) * 1000) / 1000 + '</td>';
        table += '</tr>';
    }
    table += '</tbody></table></div>';
    return table;
}

/**
 * Método que permite imprimir la tabla de documentos con los valores de Similitud de Coseno
 * @param {*} similarityMatrix Matriz con los valores de Similitud de Coseno
 * @returns Tabla de documentos con los valores de Similitud de Coseno
 */
function getTableSimilarity(similarityMatrix) {
    let table = '<div class="col s12" id="scrollTable"><table class="stripped"><thead><tr><th> </th>';

    for (let i = 0; i < similarityMatrix.length; i++) {
        table += '<th>Documento ' + (i+1) + '</th>';
    }

    table += '</tr></thead><tbody>';

    for (let i = 0; i < similarityMatrix.length; i++) {
        table += '<tr><th> Documento ' + (i + 1) + '</th>';
        for (let j = 0; j < similarityMatrix[i].length; j++) {
            table += '<td>' + Math.round((similarityMatrix[i][j] + Number.EPSILON) * 1000) / 1000 + '</td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table></div>';
    return table;
}