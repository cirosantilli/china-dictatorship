#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array/19270021#19270021
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

(async () => {

// Get images.
let imageRe = /^image::{china-dictatorship-media-base}\/([^/[]+)/;
let images = new Set();
const fileStream = fs.createReadStream('README.adoc');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});
for await (const line of rl) {
  let match = imageRe.exec(line);
  if (match !== null) {
    images.add(match[1]);
  }
}
images = Array.from(images);
if (process.argv.length > 2) {
  images = getRandom(images, parseInt(process.argv[2]));
} else {
  images.sort();
}
full_images = []
for (const image of images) {
  const url = `https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/${image}`;
  full_images.push(image.replace(/[_.]/g, ' '));
  full_images.push(`<img src="${url}" width="600">`);
}
console.log(full_images.join('\n\n'));
})()
