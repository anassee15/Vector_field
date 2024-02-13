/**
 * @description Projet - Mathématiques spécifiques II
 * @author El boudiri Anasse, Steiner Jan, Crevoiserat David
 * @date 16/06/2022
 */

// canva
let canvasSize = 600;
let gridSize;
let lines = [];
let slider;
let showUserVector;
let clearButton;
let calculButton;
let addPointCheckbox;
let closestVectorCheckbox;
let intensitySlider;
let removePointButton;
let runButton;
let stopButton;

// vector field
let userList = [];
let centers = [];
let vectorField = [];
let beginPoint = [];

let listPointAround = []; // keep the closest vector for a point
let allPointsAround = []; // save alle the closest vector for all point

let boolRun = false;

/**
 * Execute once
 */
function setup() {
    slider = createSlider(5, 25, 10);
    slider.position(407, 620);
    slider.style('width', '200px');

    showUserVector = createCheckbox('Show user\'s vectors', true);
    showUserVector.position(10, 650);

    clearButton = createButton('Clear');
    clearButton.position(10, 620);
    clearButton.mousePressed(clearAll);

    calculButton = createButton('Calcul');
    calculButton.mousePressed(computeVectors);
    calculButton.position(63, 620);

    addPointCheckbox = createCheckbox('Add points', false);
    addPointCheckbox.position(120, 620);
    addPointCheckbox.mousePressed(runAnimation);
    addPointCheckbox.hide();

    closestVectorCheckbox = createCheckbox('Show closest vector', false);
    closestVectorCheckbox.position(160, 650);
    closestVectorCheckbox.hide();

    intensitySlider = createSlider(0.001, 0.250, 0.0125, 0.0125);
    intensitySlider.position(407, 650);
    intensitySlider.style('width', '200px');
    intensitySlider.hide();

    removePointButton = createButton('Delete points');
    removePointButton.position(215, 620);
    removePointButton.mousePressed(function() { beginPoint = []; });
    removePointButton.hide();

    runButton = createButton('Run');
    runButton.position(315, 620);

    runButton.mousePressed(function() {
        boolRun = true;
        closestVectorCheckbox.show();
        intensitySlider.show();
    });
    runButton.hide();

    stopButton = createButton('Stop');
    stopButton.position(362, 620);
    stopButton.mousePressed(function() { boolRun = false; });
    stopButton.hide();

    createCanvas(canvasSize, canvasSize);
}

/**
 * Fire when mouse is pressed
 */
function mousePressed() {
    if (addPointCheckbox.checked()) {
        if (mouseX < canvasSize && mouseY < canvasSize) {
            beginPoint.push(new Point(mouseX, mouseY));
        }
    } else {
        if (mouseX < canvasSize && mouseY < canvasSize) {
            if (!this.xy) {
                this.xy = [mouseX, mouseY]; // save point
                slider.attribute('disabled', ''); // disable slider
            }
        }
    }
}

/**
 * Fire when the mouse is released
 */
function mouseReleased() {
    if (this.xy && mouseX < canvasSize && mouseY < canvasSize) {
        if (this.xy[0] !== mouseX && this.xy[1] !== mouseY) {
            lines.push([this.xy, [mouseX, mouseY]]); // save current line
            delete this.xy;
        }
    }
}

/**
 * Repeats infinite times
 */
function draw() {
    background(255, 255, 255); // grey background

    if (gridSize !== slider.value()) {
        gridSize = slider.value();
    }

    stroke(0);
    text(`M: ${gridSize}x${gridSize}`, 545, 580);

    squareGrid(canvasSize, gridSize);
    stroke(0); // draw color black

    if (showUserVector.checked()) {
        plotLines();
    }

    if (this.xy) {
        vector(this.xy, [pmouseX, pmouseY]); // guess line to draw
    }

    if (vectorField.length > 0) {
        stroke(255, 0, 0);
        plotVectorField();
    }

    if (boolRun) {
        try {
            runAnimation();
        } catch (e) {
            boolRun = false;
        }
    }

    if (allPointsAround.length > 0 && closestVectorCheckbox.checked()) {
        stroke(0, 255, 0);
        strokeWeight(5);
        for (const p of listPointAround) {
            point(p.x, p.y);
        }
        strokeWeight(1);
        stroke(0);
    }

    if (beginPoint.length > 0) {
        stroke(0);

        strokeWeight(15);
        let pointCounter = 0;

        // draw animate point
        for (const p of beginPoint) {

            // draw closest vector for each point
            if (allPointsAround.length > 0 && closestVectorCheckbox.checked() && boolRun) {
                stroke(0, 255, 0);
                strokeWeight(7);
                for (const p2 of allPointsAround[pointCounter]) {
                    point(p2.x, p2.y);
                }
                pointCounter++;
                strokeWeight(15);
                stroke(0);
            }
            point(p.x, p.y);
        }
        strokeWeight(1);

        runButton.show();
        stopButton.show();
    }
}

/**
 * Plot lines
 */
function plotLines() {
    for (const points of lines) {
        vector(points[0], points[1]);
    }
}

/**
 * plot vector field
 */
function plotVectorField() {
    for (const v of vectorField) {
        vector([v.start.x, v.start.y], [v.start.x + v.vectorComponent.x, v.start.y + v.vectorComponent.y]);
        stroke(0, 0, 255);
        strokeWeight(3);
        point(v.start.x + v.vectorComponent.x, v.start.y + v.vectorComponent.y);
        strokeWeight(1);
        stroke(255, 0, 0);
    }
}

/**
 * Remove all element of the grid
 */
function clearAll() {
    slider.removeAttribute('disabled');
    lines = [];
    vectorField = [];
    centers = []
    userList = [];
    beginPoint = [];
    listPointAround = [];

    addPointCheckbox.hide();
    addPointCheckbox.checked(false);
    closestVectorCheckbox.hide();
    closestVectorCheckbox.checked(false);
    removePointButton.hide();
    runButton.hide();
    stopButton.hide();
    intensitySlider.hide();
    intensitySlider.value(0.0125);
    boolRun = false;
}

/**
 * Generate vector
 */
function computeVectors() {
    createGenerateVectorStartPoint(canvasSize, gridSize);
    convertLinesToVectors();

    if (userList.length > 0) {
        vectorField = generateVectorField();
        userList = [] // clear to avoid duplicate
        addPointCheckbox.show();
        removePointButton.show();
    }
}

/**
 * convert lines to vectors
 */
function convertLinesToVectors() {
    let count = 1;

    for (const line of lines) {
        const [x, y] = line[0];
        const [x1, y1] = line[1];
        userList.push(new Vector(x1 - x, y1 - y, new Point(x, y)));
        count++;
    }
}

/**
 * Generate start point for vector (middle of each box case)
 * @param size
 * @param radius
 */
function createGenerateVectorStartPoint(size, radius) {
    for (let x = (size / (2 * radius)); x <= size; x += size / radius) {
        for (let y = (size / (2 * radius)); y <= size; y += size / radius) {
            centers.push(new Point(x, y));
        }
    }
}

/**
 * generate vector field for the grid
 * @returns {Vector[]} Vector field
 */
function generateVectorField() {
    let vectorField = [];

    for (const center of centers) {
        vectorField.push(computeTranslateVector(center, userList, userList));
    }
    return vectorField;
}

/**
 * compute a translation vector for a given point
 * @param {Point} pointToTranslate point to translate
 * @param {Vector[]} influentVectors tab of vector have "influence" on the point
 * @param {Vector[]} listRealVector tab to get the real vector from vectorField / userList
 * @param {boolean} runPoint if true we make a translation vector to animate a point
 * @returns the translation vector for the point
 */
function computeTranslateVector(pointToTranslate, influentVectors, listRealVector, runPoint = false) {
    let distance = {};

    // Calculate distance between each vector and the point
    for (const v of influentVectors) {
        distance[v.distance(pointToTranslate)] = v;
    }

    // sort all distance (ascending)
    let items = Object.keys(distance).map(function(key) {
        return [key, distance[key]];
    });

    items.sort(function(first, second) {
        return first[0] - second[0];
    });

    // // to have the 4 closest vectors (to animate point)
    // if (runPoint && influentVectors.length > 4) {
    //     distance = new Map(items.slice(0, 4));
    // } else {
    //
    // }
    distance = new Map(items);
    /**
     * Switch the first distance with the last distance
     * after switch the seconde distance with the before last distance
     * etc...
     * make this to have the "scale" value for each vector in terms of distance of the point
     * more the vector is far more the scale is low (have less influence on point)
     */
    let newDistance = new Map();
    let i = distance.size - 1;

    for (const x of distance.entries()) {
        newDistance.set(x[0], items[i][1]);
        i--;
    }

    // Calculate sum of distance to have our denominator
    let sum = 0;

    for (const entry of newDistance.entries()) {
        sum += parseFloat(entry[0]);
    }

    /**
     * calculate the vector value of the vector of this box
     * formula : Vb = sum((DistanceVi / total) * Vi)
     */
    let vectorTab = []
    listPointAround = [];
    for (const x of newDistance.entries()) {
        let vector = x[1];

        // to display used vector to translate the point
        if (runPoint) {
            listPointAround.push(vector.start);
        }

        let scale = parseFloat(x[0]) / sum;
        vector = Vector.multByScalar(vector, scale);
        vectorTab.push(vector);
    }
    return Vector.addVectors(vectorTab, pointToTranslate);
}

/**
 * run begin point animation
 */
function runAnimation() {
    let newBeginPoint = [];
    allPointsAround = [];

    for (const p of beginPoint) {
        // to avoid problem when point go out of the canvas
        if (p.x > 0 && p.x < canvasSize && p.y > 0 && p.y < canvasSize) {
            // find grid case where the point is
            let x = Math.floor(p.x / (canvasSize / gridSize));
            let y = Math.floor(p.y / (canvasSize / gridSize));
            let actualCase = new Point(x, y);

            // find neigbourhood of the grid case
            let neighbourCase = [];
            neighbourCase = findNeighbourCase(p, actualCase);
            neighbourCase.push(actualCase);

            // find center of each neighbourhood center
            let neighbourCenters = [];

            for (const point of neighbourCase) {
                let neighbourCaseCenter = findCaseCenter(point);
                neighbourCenters.push(neighbourCaseCenter);
            }

            // find vector corresponding to the neighbour center in vectorField
            let neighbourVectors = [];

            for (const c of neighbourCenters) {
                let vectorFromVectorField;

                // search the vector in vectorField associate to c
                for (const v of vectorField) {
                    if (Math.round(v.start.x) === Math.round(c.x) && Math.round(v.start.y) === Math.round(c.y)) {
                        vectorFromVectorField = v;
                        break;
                    }
                }
                neighbourVectors.push(vectorFromVectorField);
            }
            // compute translate vector
            let translateVector = computeTranslateVector(p, neighbourVectors, vectorField, true);
            let scale = intensitySlider.value(); // coefficient of the translation to have more precision in animation

            newBeginPoint.push(new Point(p.x + scale * translateVector.vectorComponent.x, p.y + scale * translateVector.vectorComponent.y));
            allPointsAround.push(listPointAround);
        }
    }
    beginPoint = [];
    beginPoint = newBeginPoint;
}

/**
 * find all case around a given point
 * @param p point to find the case around
 * @param actualCase actual case where the point is
 * @returns {Point[]} tab of Point contains a point who is contained in neighbour's case
 */
function findNeighbourCase(p, actualCase) {

    let actualCaseCenter = new Point(actualCase.x * (canvasSize / gridSize) + (canvasSize / gridSize) / 2, actualCase.y * (canvasSize / gridSize) + (canvasSize / gridSize) / 2);
    let positionX = p.x - actualCaseCenter.x;
    let positionY = p.y - actualCaseCenter.y;

    let neighbourCase = [];

    // top left of the case
    if (positionX < 0 && positionY < 0) {

        if (actualCase.x !== 0) {
            neighbourCase.push(new Point(actualCase.x - 1, actualCase.y));
        }
        if (actualCase.y !== 0) {
            neighbourCase.push(new Point(actualCase.x, actualCase.y - 1));
        }
        if (actualCase.x !== 0 && actualCase.y !== 0) {
            neighbourCase.push(new Point(actualCase.x - 1, actualCase.y - 1));
        }
    } else if (positionX < 0 && positionY > 0) { // bottom left of the case
        if (actualCase.y !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x, actualCase.y + 1));
        }
        if (actualCase.x !== 0) {
            neighbourCase.push(new Point(actualCase.x - 1, actualCase.y));
        }
        if (actualCase.x !== 0 && actualCase.y !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x - 1, actualCase.y + 1));
        }
    } else if (positionX > 0 && positionY < 0) { // top right of the case
        if (actualCase.y !== 0) {
            neighbourCase.push(new Point(actualCase.x, actualCase.y - 1));
        }
        if (actualCase.x !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x + 1, actualCase.y));
        }
        if (actualCase.x !== gridSize - 1 && actualCase.y !== 0) {
            neighbourCase.push(new Point(actualCase.x + 1, actualCase.y - 1));
        }
    } else if (positionX >= 0 && positionY >= 0) { // bottom right of the case and if we are in center this is selected by default
        if (actualCase.y !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x, actualCase.y + 1));
        }
        if (actualCase.x !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x + 1, actualCase.y));
        }
        if (actualCase.x !== gridSize - 1 && actualCase.y !== gridSize - 1) {
            neighbourCase.push(new Point(actualCase.x + 1, actualCase.y + 1));
        }
    }
    return neighbourCase;
}

/**
 * find center of the actual grid case
 * @param {Point} p point who's in grid case
 * @returns center of the grid
 */
function findCaseCenter(p) {
    let caseGridSize = (canvasSize / gridSize);
    let x = p.x * caseGridSize + (caseGridSize / 2);
    let y = p.y * (canvasSize / gridSize) + (caseGridSize / 2);
    return new Point(x, y);
}