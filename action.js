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
let imageRe = /^image::{china-dictatorship-media-base}\/([^/[]+)/;
let images = [];
const fileStream = fs.createReadStream('README.adoc');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});
for await (const line of rl) {
  let match = imageRe.exec(line);
  if (match !== null) {
    images.push(match[1]);
  }
}
images = getRandom(images, 10);
for (const image of images) {
  console.log(`<img src="https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/${image}" width="600">`);
}
})()

//import random
//import re
//
//image_re = re.compile()
//
//images = []
//with open('README.adoc', 'r') as f:
//    for line in f:
//        line = line.rstrip()
//        match = image_re.match(line)
//        if match:
//            images.append(match.group(1))
//
//images = random.sample(images, 10)
//for image in images:
//    print('<img src="https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/{}" width="600">'.format(image))
