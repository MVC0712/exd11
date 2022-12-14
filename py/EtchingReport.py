#!C:\python\python3.9\python.exe
# -*- coding: utf-8 -*-
import cgitb
import cgi
import os
import json
import sys
import io
import urllib.parse
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

sheet['f3'] = params["press_date_at"]
sheet['o3'] = params["die_number"]
sheet['v4'] = params["actual_billet_quantities"]

picDir = "../../EtchingPicture/favicon.ico"
# picDir = "../../EtchingPicture/" + params["etcing_file_url"]

img = openpyxl.drawing.image.Image(picDir)
img.anchor = 'P59'
ws.add_image(img)

wb.save("../../Etching/" + params["press_date_at"] + "_" +
        params["a"] + "_" + params["die_number"] + ".xlsx")
