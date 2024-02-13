/**
 * @description Project - Mathématiques spécifiques II
 * @author El boudiri Anasse, Steiner Jan, Crevoiserat David
 * @date 07/06/2022
 */

/**
 * @description Implementation of a vector specified for this project.
 */
class Vector {
    /**
     * construct a vector structure from two points
     * @param {Number} x equals to endPoint.x - startPoint.x
     * @param {Number} y equals to endPoint.y - startPoint.y
     * @param {Point} startPoint the start point of the vector
     */
    constructor(x, y, startPoint) {
        this.start = startPoint;
        this.vectorComponent = new Point(x, y);
    }

    /**
     * calcul distance between two point (startPoint of the vector and the point given)
     * @param {Point} point  the point
     * @returns {number} distance between the point and the vector
     */
    distance(point) {
        return Math.sqrt(Math.pow(point.x - this.start.x, 2) + Math.pow(point.y - this.start.y, 2));
    }

    /**
     * add two vectors
     * @param {Vector} v1 vector 1
     * @param {Vector} v2 vector 2
     * @param {Point} startPoint the start point of the vector (middle of grid case)
     * @returns {Vector} the result of the addition
     */
    static add(v1, v2, startPoint) {
        return new Vector(v1.vectorComponent.x + v2.vectorComponent.x, v1.vectorComponent.y + v2.vectorComponent.y, startPoint);
    }

    /**
     * add many vectors
     * @param {Vector[]} vectorTab an array of vectors
     * @param {Point} startPoint the start point of the vector (middle of grid case)
     * @returns {Vector} the result of the addition
     */
    static addVectors(vectorTab, startPoint) {
        console.assert(vectorTab.length > 0, "vectorTab is empty");

        let result = new Vector(vectorTab[0].vectorComponent.x, vectorTab[0].vectorComponent.y, startPoint);
        for (let i = 1; i < vectorTab.length; i++) {
            result = Vector.add(result, vectorTab[i], startPoint);
        }

        return result;
    }

    /**
     * multiple a vector by a scale
     * @param {Vector} vector vector
     * @param {Number} scale the scale
     * @returns {Vector} the scaled vector
     */
    static multByScalar(vector, scale)
    {
        return new Vector(scale * vector.vectorComponent.x, scale * vector.vectorComponent.y, vector.start);
    }
}