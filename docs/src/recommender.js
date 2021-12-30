/**
 * Clase del Sistema de Recomendación: Modelos Basados en el Contenido
 */
class Recommender {
    /**
     * Constructor de la clase
     * @param {*} originalMatrix Matriz original de documentos con palabras duplicadas
     */
    constructor(originalMatrix) {
       this.originalMatrix = originalMatrix; // Matriz original de documentos con palabras duplicadas
       this.uniqueWordsMatrix = []; // Matriz original de documentos sin palabras duplicadas
       this.TFMatrix = []; // Matriz con los valores TF de los términos de cada documento
       this.IDFMatrix = []; // Matriz con los valores IDF de los términos de cada documento
       this.TFIDFMatrix = []; // Matriz con los valores TFID de los términos de cada documento
       this.similarityMatrix = []; // Matriz con los valores de Similitud de Coseno de cada documento
    }

    /**
     * Método que permite almacenar la matriz original en la clase
     * @param {*} originalMatrix Matriz original de documentos con palabras duplicadas
     */
    docsOriginals(originalMatrix) {
        this.originalMatrix = originalMatrix;
    }

    /**
     * Método que permite quitar las palabras duplicadas por documento de la matriz original de documentos para luego almacenarla en el atributo de la clase
     * @returns Matriz original de documentos sin palabras duplicadas
     */
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

    /**
     * Método que permite calcular los valores TF de los términos de cada documento
     * @returns Matriz con los valores TF de los términos de cada documento
     */
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

    /**
     * Método que permite calcular los valores IDF de los términos de cada documento
     * @returns Matriz con los valores IDF de los términos de cada documento
     */
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

    /**
     * Método que permite calcular los valores TFIDF de los términos de cada documento
     * @returns Matriz con los valores TFID de los términos de cada documento
     */
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

    /**
     * Método que permite calcular los valores de la normalización del TF de los términos de cada documento
     * @returns Matrix con los valores de TF normalizados de los términos de cada documento
     */
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

    /**
     * Método que permite calcular los valores de Similitud de Coseno de cada documento
     * @returns Matriz con los valores de Similitud de Coseno de cada documento
     */
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
}