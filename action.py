#!/usr/bin/env python3

import random
import re

image_re = re.compile('^image::{china-dictatorship-media-base}/([^/[]+)')

images = []
with open('README.adoc', 'r') as f:
    for line in f:
        line = line.rstrip()
        match = image_re.match(line)
        if match:
            images.append(match.group(1))

images = random.sample(images, 10)
for image in images:
    print('https://raw.githubusercontent.com/cirosantilli/china-dictatorship-media/master/' + image)
