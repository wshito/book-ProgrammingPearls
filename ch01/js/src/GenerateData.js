'use strict';

const d3 = require('d3');

const sevenDigitInt = d3.shuffle(d3.range(10 ** 7));

sevenDigitInt.map(num => console.log(String(num).padStart(7, "0")));