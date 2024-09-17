#!/bin/bash

DIR="./"

chmod o+x .
chmod 644 .htaccess
find dist -type f -exec chmod o+r {} +
