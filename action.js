#!/usr/bin/env node

console.log('Starting action.js')

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
const payload = github.context.payload
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
const noQuoteArray = [];
for (const line of titleAndBody.split('\n')) {
  // Remove some speical chars to remove at mention spam possibilities.
  const l = line.replace(/[@#]/g, "")
  quoteArray.push('> ' + l);
  noQuoteArray.push(l);
}
const replyBody = `Hi @${author},

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
    '(sha|沙|啥|煞)(b|bi|diao|雕|比|笔)',
    '傻',
    '智障',
    '垃圾',
    '脑瘫',
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
    '(叼|去|日|操|草)(你|泥|拟)' + maWords,
  ]
  for (const word of fuckMotherWords) {
    if (new RegExp(word, 'i').test(titleAndBody)) {
      newLabels.add('fuck-your-mother-argument');
      break;
    }
  }
  for (const word of [
    '中国共产党万岁',
    '中华人民共和国万岁',
  ]) {
    if (new RegExp(word, 'i').test()) {
      newLabels.add('i-like-my-dictatorship')
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
    'github',
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
  if (new RegExp('狗', 'i').test(titleAndBody)) {
    newLabels.add('you-are-dog-argument');
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
  const octokit = new github.getOctokit(process.env.GITHUB_TOKEN);
  // https://github.com/cirosantilli/china-dictatorship/issues/1330
  //const new_comment = octokit.rest.issues.createComment({
  //  owner: payload.repository.owner.login,
  //  repo: payload.repository.name,
  //  issue_number: payload.issue.number,
  //  body: replyBody,
  //});
  let html_url
  if (isComment) {
    const title = (`@${author}: ` + noQuoteArray.join('\n').replaceAll('\n', ' ')).substring(0, 255)
    html_url = payload.comment.html_url
    // https://github.com/cirosantilli/china-dictatorship/issues/1330
    //const new_issue = octokit.rest.issues.create({
    //  owner: payload.repository.owner.login,
    //  repo: payload.repository.name,
    //  title,
    //  body: html_url + '\n\n' + replyBody,
    //})
  } else {
    // Update labels.
    console.log('before octokit.rest.issues.update')
    await octokit.rest.issues.update({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      labels: Array.from([...labels, ...newLabels])
    })
    console.log('after octokit.rest.issues.update')
    html_url = payload.issue.html_url
  }
  // Get the latest news from duty-machine.
  {
    const commits = await octokit.rest.repos.listCommits({
      owner: 'duty-machine',
      repo: 'news',
      per_page: 1,
    })
    const sha = commits.data[0].sha
    const commit = await octokit.rest.repos.getCommit({
      owner: 'duty-machine',
      repo: 'news',
      ref: sha,
    })
    let filename
    for (const file of commit.data.files) {
      filename = file.filename
      if (filename.startsWith('articles/')) {
        break
      }
    }
    const content = await octokit.rest.repos.getContent({
      owner: 'duty-machine',
      repo: 'news',
      ref: sha,
      path: filename,
    })
    contentS =  Buffer.from(content.data.content, 'base64').toString('utf-8')
    const lines = contentS.split('\n')
    const titleAndLink = lines[1]
    const match = titleAndLink.match(/\[([^\]]+)\]\(([^)]+)\)/)
    const title = match[1]
    const link = match[2]
    const body = lines[4]
    // https://github.com/cirosantilli/china-dictatorship/issues/1330
    //const new_issue_duty = await octokit.rest.issues.create({
    //  owner: payload.repository.owner.login,
    //  repo: payload.repository.name,
    //  title: title + ' ' + link,
    //  body: content.data.html_url + '\n\n' + link + '\n\n' + html_url + '\n\n' + body,
    //  labels: ['duty-machine'],
    //})
  }
} catch (error) {
  core.setFailed(error.message);
}

console.log('Finishing action.js')
})()
