#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const core = require('@actions/core');
const github = require('@actions/github');

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
full_images = []
for (const image of images) {
  full_images.push(`<img src="https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/${image}" width="600">`);
}
console.error(full_images.join('\n\n'));
try {
  console.log(github.context);
  const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
  const new_comment = octokit.issues.createComment({
    owner: 'cirosantilli',
    repo: context.payload.repository.name,
    issue_number: context.payload.pull_request.number,
    body: 'asdf'
  });
} catch (error) {
  core.setFailed(error.message);
}
})()
