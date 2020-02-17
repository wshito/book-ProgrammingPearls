'use strict';

/**
 * Problem 3 of Column 1 from "Programming Pearls" by
 * John Bentley.
 *
 * This sorts the 1,000,000 of 7-digit integer string
 * in `7digits.txt` file and writes out the result to
 * `7digits-sorted.txt` by using the bit array to
 * save memories.
 */

const fs = require('fs');
const readline = require('readline');

const digits = 10 ** 7;
const filename = "7digits.txt";

function readLine(fname) {
  // uses the array of bits to save memories
  const arry = new Uint8Array(Math.ceil(digits / 8));
  let num, byte, base;

  const rl = readline.createInterface({
    input: fs.createReadStream(fname),
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    num = parseInt(line);
    byte = num >> 3; // num/8 = num/(2^3) = num >> 3 
    arry[byte] |= (1 << (num & 7)); // num % 8 = num&7
  }).on('close', () => {
    const ws = fs.createWriteStream(fname.slice(0, -4) + "-sorted.txt");
    arry.forEach((ele, idx) => { // each `ele` is a byte chunk
      base = idx << 3; // base = idx * 8 = idx * 2^3
      for (let i = 0; i < 8; i++) {
        if (ele & (1 << (i & 7))) {
          ws.write(String(base + i).padStart(7, "0"));
          ws.write('\n');
        }
      }
    });
    printHeapUsage();
  });
}

function printHeapUsage() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log("Heap used: %d MB", Math.round(used * 100) / 100);
}

readLine(filename);