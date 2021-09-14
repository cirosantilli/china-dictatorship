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
images = getRandom(Array.from(images), 30);
full_images = []
for (const image of images) {
  const url = `https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/${image}`;
  full_images.push(image.replace(/[_.]/g, ' '));
  full_images.push(`<img src="${url}" width="600">`);
}

// Prepare reply body.
const payload = github.context.payload;
const isComment = payload.comment !== undefined;
let titleAndBody;
let author;
if (isComment) {
  titleAndBody = payload.comment.body;
  author = payload.comment.user.login;
} else {
  titleAndBody = payload.issue.title + '\n\n' + payload.issue.body;
  author = payload.issue.user.login;
}
const quoteArray = [];
for (const line of titleAndBody.split('\n')) {
  // Remove some speical chars to remove at mention spam possibilities.
  quoteArray.push('> ' + line.replace(/[@#]/g, ""));
}
const replyBody = `Hi ${author},

${quoteArray.join('\n').substring(0,40000)}

${full_images.join('\n\n')}
`;

// Label handling.
let labels;
let newLabels;
if (!isComment) {
  labels = new Set(payload.issue.labels.map(label => label.name));
  newLabels = new Set();
  const shabiWords = [
    'shabi',
    'shadiao',
    '傻',
    '沙雕',
    '智障',
    '垃圾',
    '啥b',
    'stupid',
  ];
  for (const word of shabiWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('you-are-stupid-argument');
      break;
    }
  }
  const maWords = '(马|吗|妈|m)'
  const fuckMotherWords = [
    'cnm',
    'fuck.*\\b(mom|mum|mother)\\b',
    '尼玛',
    '去你吗',
    '(日|操|草)(你|泥|拟)' + maWords,
  ]
  for (const word of fuckMotherWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('fuck-your-mother-argument');
      break;
    }
  }
  const motherDiedWords = [
    'nmsl',
    '你' + maWords + '死',
    '司马',
  ]
  for (const word of motherDiedWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('your-mother-died-argument');
      break;
    }
  }
  const meantToBeUsedWords = [
    '技术',
  ]
  for (const word of meantToBeUsedWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('meant-to-be-used');
      break;
    }
  }
  const shitpostWords = [
    'fuck',
    'shit',
    'bitch',
    '垃圾',
    '婊子',
    '恶心',
    '操你',
    '丑',
  ];
  for (const word of shitpostWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('shitpost');
      break;
    }
  }
  if (newLabels.size > 0) {
    newLabels.add('shitpost');
    if (labels.has('not-shitpost')) {
      labels.delete('not-shitpost');
      newLabels.add('op-does-not-know-what-shit-is');
    }
  }
}

// Make the request.
try {
  console.log(github.context);
  const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
  const new_comment = octokit.issues.createComment({
    owner: 'cirosantilli',
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: replyBody,
  });
  if (!isComment) {
    // Update labels.
    await octokit.issues.update({
      owner: 'cirosantilli',
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      labels: Array.from([...labels, ...newLabels])
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
})()
