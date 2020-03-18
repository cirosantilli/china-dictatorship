#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
https://github.com/cirosantilli/china-dictatorship#mirrors
'''

import json

from setuptools import setup, find_packages

with open('package.json') as f:
    package_json = json.load(f)
version = package_json['version']

setup(
    name='china-dictatorship',
    version=version,
    description='2018新疆改造中心，1989六四事件，1999法轮功 ，2019 996.ICU, 2018包子露宪，2015 710律师劫，2015巴拿马文件 邓家贵，2017低端人口，2008西藏骚乱',
    # Fails with: "The description failed to render in the default format of reStructuredText."
    #long_description=readme(),
    long_description='2018新疆改造中心，1989六四事件，1999法轮功 ，2019 996.ICU, 2018包子露宪，2015 710律师劫，2015巴拿马文件 邓家贵，2017低端人口，2008西藏骚乱',
    url='https://github.com/cirosantilli/china-dictatorship',
    author='Ciro Santilli',
    author_email='ciro.santilli.contact@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    scripts=['china-dictatorship.py'],
    data_files=[
        'README.adoc',
        'README.html',
    ],
)
