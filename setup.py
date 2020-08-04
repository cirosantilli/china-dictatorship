#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
https://github.com/cirosantilli/china-dictatorship#mirrors
'''

import json

from setuptools import setup, find_packages

from os import path
this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.adoc')) as f:
    long_description = f.read()

setup(
    name='china-dictatorship',
    version='0.0.64',
    description='2018新疆改造中心，1989六四事件，1999法轮功 ，2019 996.ICU, 2018包子露宪，2015 710律师劫，2015巴拿马文件 邓家贵，2017低端人口，2008西藏骚乱',
    long_description=long_description,
    # Otherwise upload fails with: "The description failed to render in the default format of reStructuredText."
    long_description_content_type='text/plain',
    url='https://github.com/cirosantilli/china-dictatorship',
    author='Ciro Santilli',
    author_email='ciro.santilli.contact@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    scripts=['china-dictatorship.py'],
)
