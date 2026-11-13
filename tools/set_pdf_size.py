"""Set every page of a PDF to an exact size in inches (Chromium rounds page sizes).
Usage: python3 tools/set_pdf_size.py file.pdf WIDTH_IN HEIGHT_IN"""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

path, w, h = sys.argv[1], float(sys.argv[2]) * 72, float(sys.argv[3]) * 72
reader = PdfReader(path)
writer = PdfWriter()
for page in reader.pages:
    top = float(page.mediabox.top)
    box = RectangleObject([0, top - h, w, top])
    page.mediabox = box
    page.cropbox = box
    writer.add_page(page)
with open(path, 'wb') as f:
    writer.write(f)
