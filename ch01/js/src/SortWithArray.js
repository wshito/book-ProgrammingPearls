'use strict';

/**
 * The alternative implementation of Problem 3 of Column 1
 * from "Programming Pearls" by John Bentley.
 * 
 * This sorts the 1,000,000 of 7-digit integer string
 * in `7digits.txt` file and writes out the result to
 * `7digits-sorted.txt` by using the regular JavaScript
 * array that holds true/false value in order to judge
 * the inclusion of the number.
 */

const fs = require('fs');
const readline = require('readline');

const digits = 10 ** 7
const filename = "7digits.txt";

function readLine(fname) {
  // uses regular array
  const arry = new Array(Math.ceil(digits)).fill(false);

  const rl = readline.createInterface({
    input: fs.createReadStream(fname),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    arry[parseInt(line)] = true;
  }).on('close', () => {
    const ws = fs.createWriteStream(fname.slice(0, -4) + "-sorted2.txt");
    arry.forEach((val, idx) => {
      if (val) {
        ws.write(String(idx).padStart(7, "0"));
        ws.write('\n');
      }
    });
    ws.end();
    printHeapUsage();
  });

}

function printHeapUsage() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log("Heap used: %d MB", Math.round(used * 100) / 100);
}

readLine(filename);