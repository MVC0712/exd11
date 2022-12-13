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

para_4 = urllib.parse.unquote(params["pressing_type"])

response = {"res": para_4}
staffName = urllib.parse.unquote(params["staff_name"])
previousNote = urllib.parse.unquote(params["previous_press_note"])

print('Content-type: text/html\nAccess-Control-Allow-Origin: *\n')
print("\n\n")
print(json.JSONEncoder().encode(response))
print('\n')

# if urllib.parse.unquote(params["pressing_type"]) =="〇":
#     wb=openpyxl.load_workbook('direction_test.xlsx')
#     sheet = wb.get_sheet_by_name('input')
# elif urllib.parse.unquote(params["pressing_type"]) =="◎":
#     wb=openpyxl.load_workbook('direction_test.xlsx')
#     sheet = wb.get_sheet_by_name('input')
# else:
#     wb=openpyxl.load_workbook('direction_mass.xlsx')
#     sheet = wb.get_sheet_by_name('input')
wb = openpyxl.load_workbook('EtchingReport.xlsx')
sheet = wb.get_sheet_by_name('input')

sheet['d6'] = params["die_number"]
sheet['d7'] = params["production_number"]
sheet['d8'] = params["plan_date_at"]  # 押出計画日
# sheet['d9'] = urllib.parse.unquote(params["pressing_type"])
sheet['d9'] = urllib.parse.unquote(params["pressing_type"])
sheet['d10'] = params["press_length"]
sheet['d11'] = params["production_length"]
sheet['d12'] = params["material"]
sheet['d13'] = params["specific_weight"]
sheet['d14'] = params["ratio"]
sheet['d15'] = params["nbn"]  # nBn
sheet['d16'] = previousNote.replace('+', ' ')  # previous pressing note
sheet['d17'] = staffName.replace('+', ' ')  # incharge person
sheet['d18'] = params["issue_date"]  # issue date
sheet['d19'] = ""  # plan pressing time
sheet['d20'] = params["billet_input_quantity"]  # plan input billet qty
sheet['d21'] = params["billet_length"]  # plan billet length
sheet['d22'] = params["discard_thickness"]  # Discard thickness
sheet['d23'] = params["ram_speed"]  # Ram speed
sheet['d24'] = params["work_speed"]  # work speed
sheet['d25'] = params["billet_temperature"]  # billet temp
sheet['d26'] = params["billet_taper_heating"]  # billet heating type
sheet['d27'] = params["die_temperature"]  # die temp
sheet['d28'] = params["die_heating_time"]  # die heating time
sheet['d29'] = params["stretch_ratio"]  # stretch ratio
sheet['d30'] = params["cooling_type"]  # "" #cooling type
sheet['d31'] = params["billet_size"]  # billet size
sheet['d32'] = params["bolster_name"]  # bolstar
sheet['d33'] = params["aging"]  # aging type
sheet['d34'] = ""  # die ring

sheet['d35'] = params["value_l"]
sheet['d36'] = params["value_m"]
sheet['d37'] = params["value_n"]

# sheet['d9'] = para_4
import openpyxl

wb = openpyxl.Workbook()
ws = wb.worksheets[0]
img = openpyxl.drawing.image.Image('test.jpg')
img.anchor = 'A1'
ws.add_image(img)
# wb.save('out.xlsx')


##############################################################################
#
# An example of inserting images into a worksheet using the XlsxWriter
# Python module.
#
# SPDX-License-Identifier: BSD-2-Clause
# Copyright 2013-2022, John McNamara, jmcnamara@cpan.org
#
import xlsxwriter


# Create an new Excel file and add a worksheet.
workbook = xlsxwriter.Workbook('images.xlsx')
worksheet = workbook.add_worksheet()

# Widen the first column to make the text clearer.
worksheet.set_column('A:A', 30)

# Insert an image.
worksheet.write('A2', 'Insert an image in a cell:')
worksheet.insert_image('B2', 'python.png')

# Insert an image offset in the cell.
worksheet.write('A12', 'Insert an image with an offset:')
worksheet.insert_image('B12', 'python.png', {'x_offset': 15, 'y_offset': 10})

# Insert an image with scaling.
worksheet.write('A23', 'Insert a scaled image:')
worksheet.insert_image('B23', 'python.png', {'x_scale': 0.5, 'y_scale': 0.5})

workbook.close()



wb.save("../../PressDirectiveFile/" +
        params["plan_date_at"] + "_" + params["die_number"] + ".xlsx")
