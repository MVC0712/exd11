#!C:\python\python3.9\python.exe
# -*- coding: utf-8 -*-

import sys

recieve = sys.stdin.readline()
recieve = recieve + "OK!"

print('Content-type: text/html\n')
print(recieve)