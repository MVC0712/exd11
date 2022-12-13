#!C:\python\python3.9\python.exe
# -*- coding: utf-8 -*-
import cgitb
import cgi
import os
import json
import sys
import io
import urllib.parse  # url encode/decode
import openpyxl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
cgitb.enable()
data = sys.stdin.read()
params = json.loads(data)

response = {"res": params["n"]}

print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
print("\n\n")
print(json.JSONEncoder().encode(response))
print('\n')

wb = openpyxl.load_workbook('EtchingReport.xlsx')
if params["n"] == 1:
    sheet = wb.get_sheet_by_name('1Bn')
elif params["n"] == 2:
    sheet = wb.get_sheet_by_name('2B1')
elif params["n"] == 3:
    sheet = wb.get_sheet_by_name('3B1')
else:
    sheet = wb.get_sheet_by_name('4B1')

sheet['d6'] = params["die_number"]
sheet['d7'] = params["production_number"]
sheet['d8'] = params["plan_date_at"]
sheet['d20'] = params["billet_input_quantity"]
sheet['d21'] = params["billet_length"]
sheet['d22'] = params["discard_thickness"]
sheet['d23'] = params["ram_speed"]


img = openpyxl.drawing.image.Image('test.jpg')
img.anchor = 'A1'
ws.add_image(img)

wb.save("../../Etching/" + params["press_date"] + "_" +
        params["a"] + "_" + params["die_number"] + ".xlsx")
