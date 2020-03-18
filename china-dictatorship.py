#!/usr/bin/python3

import pkg_resources

readme_html_path = pkg_resources.resource_filename('china_dictatorship', 'README.html')
with open(readme_html_path) as f:
    print(f.read())
