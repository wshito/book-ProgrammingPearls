'use strict';

/**
 * The implementation of Problem 1 of Column 1
 * from "Programming Pearls" by John Bentley.
 *
 * Uses the in-memory default sort function provided
 * by JS.
 */

const fs = require('fs');
const readline = require('readline');

const filename = "7digits.txt";

function sortWithLibrary(fname) {
  // regular array holds all the numbers and uses Array.sort()
  const arry = new Array();

  const rl = readline.createInterface({
    input: fs.createReadStream(fname),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    arry.push(parseInt(line));
  }).on('close', () => {
    arry.sort();
    const ws = fs.createWriteStream(fname.slice(0, -4) + "-lib-sorted.txt");
    arry.forEach((val, idx) => {
      if (val) {
        ws.write(String(idx).padStart(7, "0"));
        ws.write('\n');
      }
    });
    printHeapUsage();
  });

}

function printHeapUsage() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log("Heap used: %d MB", Math.round(used * 100) / 100);
}

sortWithLibrary(filename);