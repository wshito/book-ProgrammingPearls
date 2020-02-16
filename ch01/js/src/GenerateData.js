'use strict';

/**
 * Usage:
 *   node GenerateData.js > 7digits.txt
 *
 * Generates 1 million records of 7 digits integer string per line.
 * This is the implementation of Column 1, Problem 4 from Programming
 * Pearls by John Bentley.
 */

const d3 = require('d3');

// slice makes a shallow copied array
const sevenDigitInt = d3.shuffle(d3.range(10 ** 7)).slice(0, 10 ** 6);

sevenDigitInt.map(num => console.log(String(num).padStart(7, "0")));