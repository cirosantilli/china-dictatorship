#!/usr/bin/python3

try:
  import importlib.resources as importlib_resources
except ImportError:
  # In PY<3.7 fall-back to backported `importlib_resources`.
  import importlib_resources

with importlib_resources.path('china_dictatorship', 'README.html') as readme_html_path:
    with open(readme_html_path) as f:
        print(f.read())
