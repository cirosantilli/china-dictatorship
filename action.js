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
for (const image of images) {
  console.log(`<img src="https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/${image}" width="600">`);
}

//const token = core.getInput("token");
//const context = github.context;
//if (context.payload.pull_request == null) {
//    core.setFailed('No pull request found.');
//    return;
//}
//const pull_request_number = context.payload.pull_request.number;
//const pull_request_number = 237;
//const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
//const new_comment = octokit.issues.createComment({
//  ...context.repo,
//  issue_number: pull_request_number,
//  body: 'asdf'
//});

console.log(github.context);
const token = core.getInput("token");
const pull_request_number = 237;
const octokit = new github.getOctokit(token);
const new_comment = octokit.issues.createComment({
  owner: 'cirosantilli',
  repo: 'china-dictatorship',
  issue_number: pull_request_number,
  body: 'asdf'
});

//const pull_request_number = 237;
//console.error(github);
//const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
//const new_comment = octokit.issues.createComment({
//  owner: 'cirosantilli',
//  repo: 'china-dictatorship',
//  issue_number: pull_request_number,
//  body: 'asdf'
//});

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
