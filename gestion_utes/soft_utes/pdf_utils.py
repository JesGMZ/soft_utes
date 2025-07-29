# pdf_utils.py
import os
from io import BytesIO
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa


def link_callback(uri, rel):
    # Soporte para archivos en MEDIA y STATIC
    if uri.startswith(settings.MEDIA_URL):
        path = os.path.join(settings.MEDIA_ROOT, uri.replace(settings.MEDIA_URL, ""))
    elif uri.startswith(settings.STATIC_URL):
        path = os.path.join(settings.STATIC_ROOT, uri.replace(settings.STATIC_URL, ""))
    else:
        return uri

    if not os.path.isfile(path):
        raise Exception(f"El archivo {path} no existe")
    return path


def generar_pdf(nombre_template, contexto={}, nombre_archivo="documento.pdf"):
    template = get_template(nombre_template)
    html = template.render(contexto)
    result = BytesIO()

    # Convertir HTML a PDF
    pdf = pisa.pisaDocument(
        BytesIO(html.encode("UTF-8")), dest=result, link_callback=link_callback
    )

    if not pdf.err:
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        return response
    return HttpResponse('Error al generar el PDF', status=500)
