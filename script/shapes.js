/**
 * @description Projet - Mathématiques spécifiques II
 * @author El boudiri Anasse, Steiner Jan, Crevoiserat David
 * @date 25/05/2022
 */

// @ts-nocheck

/**
 * Draw a simple grid
 * @param {number} width width
 * @param {number} height height
 * @param {number} radius radius
 */
function grid(width, height, radius = 10) {
    for (let x = 0; x <= width; x += width / radius) {
        for (let y = 0; y <= height; y += height / radius) {
            stroke(128);
            strokeWeight(1);
            line(x, 0, x, height);
            line(0, y, width, y);
        }
    }
}

/**
 * Draw a square grid
 * @param {number} side side
 * @param {number} radius radius
 */
function squareGrid(side, radius = 10) {
    grid(side, side, radius);
}