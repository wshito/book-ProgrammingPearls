'use strict';

const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

/** The sorting value = [0, maxBound) */
const MAX_BOUND = 10 ** 7;
/** Data filename */
const DATA_FILE = "7digits.txt";
/** Output filename */
const OUT_FILE = "7digits-2pass-sorted.txt";

async function twoPassSort (infile, outfile, maxbound) {

  // num of bits in need
  const midpoint = Math.ceil(maxbound / 2);
  // byte array
  const arry = new Uint8Array(Math.ceil(midpoint / 8));

  // writable stream is open for two passes
  const ws = fs.createWriteStream(outfile);

  // single pass sorts numbers between [from, to)
  async function singlePass (from, to) {
    let num, byte, base;

    // initialize the bit array with zero after the second pass
    if (from > 0) arry.fill(0);

    const rl = readline.createInterface({
      input: fs.createReadStream(infile),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      num = parseInt(line);
      if (from <= num && num < to) {
        num -= from;
        byte = num >> 3; // num / 8 = num/(2^3) = num >> 3
        arry[byte] |= (1 << (num & 7)); // num % 8 = num & 7
      }
    });

    // synchronize here
    await once(rl, 'close');
    arry.forEach((ele, idx) => {
      base = idx << 3; // base = idx * 8 = idx * 2^3
      for (let i = 0; i < 8; i++) {
        if (ele & (1 << (i & 7))) {
          ws.write(String(base + from + i).padStart(7, "0"));
          ws.write('\n');
        }
      }
    });
  } // end of singlePass()

  await singlePass(0, midpoint);
  await singlePass(midpoint, maxbound);
  ws.end();
  printHeapUsage();
}

function printHeapUsage () {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log("Heap used: %d MB", Math.round(used * 100) / 100);
}

twoPassSort(DATA_FILE, OUT_FILE, MAX_BOUND);
