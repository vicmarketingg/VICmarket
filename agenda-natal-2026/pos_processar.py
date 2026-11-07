"""Pós-processamento do PDF: links internos com referência direta à página
(mais compatível com visualizadores de celular), metadados e abertura na página 1."""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, NameObject, NumberObject, TextStringObject, DictionaryObject

src = sys.argv[1]
reader = PdfReader(src)
writer = PdfWriter(clone_from=reader)
pages = writer.pages
nomes = {f"/p{i + 1}": pages[i].indirect_reference for i in range(len(pages))}

for page in pages:
    for ref in page.get("/Annots") or []:
        a = ref.get_object()
        dest = a.get("/Dest")
        if dest is not None and str(dest) in nomes:
            a[NameObject("/Dest")] = ArrayObject([nomes[str(dest)], NameObject("/Fit")])

writer.add_metadata({
    "/Title": "Agenda de Dezembro 2026 — Mayara Dias | Studio Beauty",
    "/Author": "Mayara Dias | Studio Beauty",
    "/Subject": "Agenda de dezembro 2026: calendário, horários, regras e valores",
})
writer._root_object[NameObject("/OpenAction")] = ArrayObject([pages[0].indirect_reference, NameObject("/Fit")])
writer._root_object[NameObject("/PageLayout")] = NameObject("/SinglePage")
vp = DictionaryObject({NameObject("/DisplayDocTitle"): __import__("pypdf").generic.BooleanObject(True)})
writer._root_object[NameObject("/ViewerPreferences")] = vp
with open(src, "wb") as fh:
    writer.write(fh)
print("Pós-processado:", src, "-", len(pages), "páginas")
