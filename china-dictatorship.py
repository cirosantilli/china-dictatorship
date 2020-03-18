#!/usr/bin/env python

import pkg_resources

readme_html_path = pkg_resources.resource_string(__name__, 'README.html')
print(readme_html_path)
with open(readme_html_path) as f:
    print(f.read())
