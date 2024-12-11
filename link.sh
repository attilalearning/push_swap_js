#!/bin/bash

# set up so programs from terminal can set (copy to) and get
# (paste from) from the clipboard
alias pbcopy='xsel --clipboard --input'
alias pbpaste='xsel --clipboard --output'

shopt -s expand_aliases
readlink -f test.html | pbcopy
