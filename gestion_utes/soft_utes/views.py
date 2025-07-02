
import json
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404, redirect
from .models import (
    ActaSalida, Area, AsignacionEquipo, Cargo, Establecimiento, Formato, Lote, Personal, SubArea, TipoEquipo, Marca, Modelo, EquiposInformatico, 
    Componentes, Caracteristicas, ComponenteCaracteristica, TipoComponente
)
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from datetime import datetime


@login_required
def logout_view(request):
    logout(request)
    messages.success(request, "Sesión cerrada correctamente.")
    return redirect('login')


def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Buscar usuario por email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'No existe un usuario con este correo electrónico.')
            return render(request, 'login.html')
        
        # Autenticar al usuario
        user = authenticate(request, username=user.username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Redirigir según tipo de usuario
            if user.is_superuser:
                return redirect('dashboard_admin')
            else:
                return redirect('dashboard_gestor')
        else:
            messages.error(request, 'Contraseña incorrecta')
    
    return render(request, 'login.html')

@login_required
def dashboard_admin(request):
    if not request.user.is_superuser:
        messages.error(request, 'Acceso no autorizado')
        return redirect('login')
    
    context = {
        'equipos_count': EquiposInformatico.objects.count(),
        'componentes_count': Componentes.objects.count(),
        'asignaciones_count': AsignacionEquipo.objects.count(),
        'equipos': EquiposInformatico.objects.all().order_by('-idEquipoInformatico')[:10],
        'componentes': Componentes.objects.all().order_by('-idComponente')[:10],
        'asignaciones': AsignacionEquipo.objects.select_related('idEquipoInformatico', 'idActaSalida').order_by('-fechaAsignacion')[:10]
    }
    return render(request, 'admin_dashboard.html', context)

@login_required
def dashboard_gestor(request):
    if request.user.is_superuser:
        return redirect('dashboard_admin')
    
    
    context = {
            'equipos_count': EquiposInformatico.objects.count(),
            'componentes_count': Componentes.objects.count(),
            'asignaciones_count': AsignacionEquipo.objects.count(),
            'equipos': EquiposInformatico.objects.all().order_by('-idEquipoInformatico')[:10],
            'componentes': Componentes.objects.all().order_by('-idComponente')[:10],
            'asignaciones': AsignacionEquipo.objects.select_related('idEquipoInformatico', 'idActaSalida').order_by('-fechaAsignacion')[:10]
    }

    return render(request, 'gestor_dashboard.html', context)

# ---------------------- TIPO EQUIPO ----------------------
def tipoequipo_list(request):
    tipos = TipoEquipo.objects.all()
    return render(request, 'tipoequipo_list.html', {'tipos': tipos})

def tipoequipo_create(request):
    if request.method == 'POST':
        nombre = request.POST['nombre']
        estado = request.POST.get('estado', 'ACTIVO')
        TipoEquipo.objects.create(nombre=nombre, estado=estado)
        return redirect('tipoequipo_list')
    return render(request, 'tipoequipo_list.html')

def tipoequipo_update(request, idTipoEquipo):
    tipo = get_object_or_404(TipoEquipo, idTipoEquipo=idTipoEquipo)
    if request.method == 'POST':
        tipo.nombre = request.POST['nombre']
        tipo.estado = request.POST.get('estado', 'ACTIVO')
        tipo.save()
        return redirect('tipoequipo_list')
    return render(request, 'tipoequipo_list.html', {'tipo': tipo})

def tipoequipo_delete(request, idTipoEquipo):
    tipo = get_object_or_404(TipoEquipo, idTipoEquipo=idTipoEquipo)
    tipo.delete()
    return redirect('tipoequipo_list')

# ---------------------- MARCA ----------------------
def marca_list(request):
    marcas = Marca.objects.all()
    return render(request, 'marca_list.html', {'marcas': marcas})

def marca_create(request):
    if request.method == 'POST':
        nombre = request.POST['nombreMarca']
        Marca.objects.create(nombreMarca=nombre)
        return redirect('marca_list')
    return render(request, 'marca_list.html')

def marca_update(request, idMarca):
    marca = get_object_or_404(Marca, idMarca=idMarca)
    if request.method == 'POST':
        marca.nombreMarca = request.POST['nombreMarca']
        marca.save()
        return redirect('marca_list')
    return render(request, 'marca_list.html', {'marca': marca})

def marca_delete(request, idMarca):
    marca = get_object_or_404(Marca, idMarca=idMarca)
    marca.delete()
    return redirect('marca_list')

# ---------------------- MODELO ----------------------
def modelo_list(request):
    modelos = Modelo.objects.select_related('idMarca').all()
    marcas = Marca.objects.all()
    return render(request, 'modelo_list.html', {
        'modelos': modelos,
        'marcas': marcas
    })

def modelo_create(request):
    if request.method == 'POST':
        marca = get_object_or_404(Marca, idMarca=request.POST['idMarca'])
        modelo = Modelo(
            idMarca=marca,
            nombreModelo=request.POST['nombreModelo'],
            descripcionModelo=request.POST.get('descripcionModelo', '')
        )
        if 'Imagen' in request.FILES:
            modelo.Imagen = request.FILES['Imagen']
        modelo.save()
        return redirect('modelo_list')
    
    marcas = Marca.objects.all()
    return render(request, 'modelo_list.html', {'marcas': marcas})

def modelo_update(request, idModelo):
    modelo = get_object_or_404(Modelo, idModelo=idModelo)
    if request.method == 'POST':
        modelo.idMarca = get_object_or_404(Marca, idMarca=request.POST['idMarca'])
        modelo.nombreModelo = request.POST['nombreModelo']
        modelo.descripcionModelo = request.POST.get('descripcionModelo', '')
        if 'Imagen' in request.FILES:
            modelo.Imagen = request.FILES['Imagen']
        modelo.save()
        return redirect('modelo_list')
    
    marcas = Marca.objects.all()
    return render(request, 'modelo_list.html', {
        'modelo': modelo,
        'marcas': marcas
    })

def modelo_delete(request, idModelo):
    modelo = get_object_or_404(Modelo, idModelo=idModelo)
    modelo.delete()
    return redirect('modelo_list')

# ---------------------- EQUIPOS INFORMATICOS ----------------------
def equipo_list(request):
    equipos = EquiposInformatico.objects.select_related('idTipoEquipo', 'idModelo').all()
    tipos = TipoEquipo.objects.all()
    modelos = Modelo.objects.all()
    return render(request, 'equipo_list.html', {
        'equipos': equipos,
        'tipos': tipos,
        'modelos': modelos
    })

def equipo_detalle(request, idEquipoInformatico):
    equipo = get_object_or_404(EquiposInformatico, idEquipoInformatico=idEquipoInformatico)
    componentes = Componentes.objects.filter(idEquipoInformatico=equipo)
    return render(request, 'detalle_equipo.html', {
        'equipo': equipo,
        'componentes': componentes
    })

def asignar_componentes(request, idEquipoInformatico):
    equipo = get_object_or_404(EquiposInformatico, idEquipoInformatico=idEquipoInformatico)
    
    if request.method == 'POST':
        componente_id = request.POST.get('componente_id')
        accion = request.POST.get('accion')
        
        if componente_id and accion:
            componente = get_object_or_404(Componentes, idComponente=componente_id)
            
            if accion == 'asignar':
                componente.idEquipoInformatico = equipo
                componente.estado = 'ASIGNADO'
            elif accion == 'quitar':
                componente.idEquipoInformatico = None
                componente.estado = 'ACTIVO'
                
            componente.save()
    
    # Obtener componentes disponibles 
    componentes_disponibles = Componentes.objects.filter(
        estado='ACTIVO'
    )
    
    # Obtener componentes ya asignados a este equipo
    componentes_asignados = Componentes.objects.filter(
        idEquipoInformatico=equipo,
        estado='ASIGNADO'
    )
    
    return render(request, 'asignacion_componentes.html', {
        'equipo': equipo,
        'componentes_disponibles': componentes_disponibles,
        'componentes_asignados': componentes_asignados
    })


def equipo_create(request):
    if request.method == 'POST':
        try:
            tipo_id = request.POST.get('idTipoEquipo')
            if not tipo_id:
                messages.error(request, "Seleccione un tipo de equipo.")
                return redirect('equipo_list')
            tipo = get_object_or_404(TipoEquipo, idTipoEquipo=tipo_id)
            modelo = get_object_or_404(Modelo, idModelo=request.POST['idModelo']) if request.POST.get('idModelo') else None

            equipo = EquiposInformatico(
                nombreEquipoInformatico=request.POST['nombreEquipoInformatico'],
                idTipoEquipo=tipo,
                idModelo=modelo,
                codigoPatrimonial=request.POST.get('codigoPatrimonial'),
                numeroSerie=request.POST.get('numeroSerie'),
                observacionEquipo=request.POST.get('observacionEquipo', ''),
                descripcionEquipo=request.POST.get('descripcionEquipo'),
                añoGarantia=request.POST.get('añoGarantia'),
                estado='ACTIVO'
            )
            equipo.save()
            messages.success(request, 'Equipo creado exitosamente')
            return redirect('equipo_list')

        except IntegrityError:
            messages.error(request, 'Código patrimonial o número de serie ya registrado.')
        except Exception as e:
            messages.error(request, f'Error al crear equipo: {str(e)}')

    tipos = TipoEquipo.objects.all()
    modelos = Modelo.objects.all()
    return render(request, 'equipo_list.html', {
        'tipos': tipos,
        'modelos': modelos,
        'descripciones': EquiposInformatico.Tipo_descripcion
    })

def equipo_update(request, idEquipoInformatico):
    equipo = get_object_or_404(EquiposInformatico, idEquipoInformatico=idEquipoInformatico)

    if request.method == 'POST':
        try:
            equipo.nombreEquipoInformatico = request.POST['nombreEquipoInformatico']
            equipo.idTipoEquipo = get_object_or_404(TipoEquipo, idTipoEquipo=request.POST['idTipoEquipo'])
            equipo.idModelo = get_object_or_404(Modelo, idModelo=request.POST['idModelo']) if request.POST.get('idModelo') else None
            equipo.codigoPatrimonial = request.POST.get('codigoPatrimonial')
            equipo.numeroSerie = request.POST.get('numeroSerie')
            equipo.observacionEquipo = request.POST.get('observacionEquipo', '')
            equipo.descripcionEquipo = request.POST.get('descripcionEquipo')
            equipo.añoGarantia = request.POST.get('añoGarantia') or None
            equipo.estado = request.POST.get('estado', equipo.estado)

            equipo.save()
            messages.success(request, 'Equipo actualizado exitosamente')
            return redirect('equipo_list')

        except Exception as e:
            messages.error(request, f'Error al actualizar equipo: {str(e)}')

    tipos = TipoEquipo.objects.all()
    modelos = Modelo.objects.all()
    return render(request, 'equipo_list.html', {
        'equipo': equipo,
        'tipos': tipos,
        'modelos': modelos,
        'descripciones': EquiposInformatico.Tipo_descripcion
    })

def equipo_delete(request, idEquipoInformatico):
    equipo = get_object_or_404(EquiposInformatico, idEquipoInformatico=idEquipoInformatico)
    equipo.estado = 'INACTIVO'
    equipo.save()
    return redirect('equipo_list')

# ---------------------- TIPO COMPONENTE ----------------------
def tipocomponente_list(request):
    tipos = TipoComponente.objects.all()
    return render(request, 'tipocomponente_list.html', {'tipos': tipos})

def tipocomponente_create(request):
    if request.method == 'POST':
        nombre = request.POST['nombre']
        estado = request.POST.get('estado', 'ACTIVO')
        TipoComponente.objects.create(nombre=nombre, estado=estado)
        return redirect('tipocomponente_list')
    return render(request, 'tipocomponente_list.html')

def tipocomponente_update(request, idTipoComponente):
    tipo = get_object_or_404(TipoComponente, idTipoComponente=idTipoComponente)
    if request.method == 'POST':
        tipo.nombre = request.POST['nombre']
        tipo.estado = request.POST.get('estado', 'ACTIVO')
        tipo.save()
        return redirect('tipocomponente_list')
    return render(request, 'tipocomponente_list.html', {'tipo': tipo})

def tipocomponente_delete(request, idTipoComponente):
    tipo = get_object_or_404(TipoComponente, idTipoComponente=idTipoComponente)
    tipo.delete()
    return redirect('tipocomponente_list')

# ---------------------- CARACTERISTICAS ----------------------
def caracteristica_list(request):
    caracteristicas = Caracteristicas.objects.select_related('idTipoComponente').all()
    tipos = TipoComponente.objects.all()
    return render(request, 'caracteristica_list.html', {
        'caracteristicas': caracteristicas,
        'tipos': tipos
    })

def caracteristica_create(request):
    if request.method == 'POST':
        try:
            tipo = get_object_or_404(TipoComponente, idTipoComponente=request.POST['idTipoComponente'])
            Caracteristicas.objects.create(
                descripcionCaracteristica=request.POST['descripcionCaracteristica'],
                idTipoComponente=tipo
            )
            messages.success(request, 'Característica creada exitosamente')
            return redirect('caracteristica_list')
        except Exception as e:
            messages.error(request, f'Error al crear característica: {str(e)}')
    
    tipos = TipoComponente.objects.all()
    return render(request, 'caracteristica_list.html', {'tipos': tipos})

def caracteristica_update(request, idCaracteristica):
    caracteristica = get_object_or_404(Caracteristicas, idCaracteristica=idCaracteristica)
    if request.method == 'POST':
        try:
            tipo = get_object_or_404(TipoComponente, idTipoComponente=request.POST['idTipoComponente'])
            caracteristica.descripcionCaracteristica = request.POST['descripcionCaracteristica']
            caracteristica.idTipoComponente = tipo
            caracteristica.save()
            messages.success(request, 'Característica actualizada exitosamente')
            return redirect('caracteristica_list')
        except Exception as e:
            messages.error(request, f'Error al actualizar característica: {str(e)}')
    
    tipos = TipoComponente.objects.all()
    return render(request, 'caracteristica_list.html', {
        'caracteristica': caracteristica,
        'tipos': tipos
    })

def caracteristica_delete(request, idCaracteristica):
    caracteristica = get_object_or_404(Caracteristicas, idCaracteristica=idCaracteristica)
    caracteristica.delete()
    messages.success(request, 'Característica eliminada exitosamente')
    return redirect('caracteristica_list')

# ---------------------- COMPONENTES ----------------------
def componente_list(request):
    tipos = TipoComponente.objects.all()
    modelos = Modelo.objects.all()

    id_tipo = request.GET.get('idTipoComponente')
    
    # Consulta base filtrada por estado DISPONIBLE
    componentes = Componentes.objects.select_related('idModelo', 'idTipoComponente')

    if id_tipo:
        componentes = componentes.filter(idTipoComponente_id=id_tipo)

    # Agregar características como JSON a cada componente
    for comp in componentes:
        caracteristicas = ComponenteCaracteristica.objects.filter(idComponente=comp)
        comp.caracteristicas_json = json.dumps({
            f"caracteristica_{c.idCaracteristica.idCaracteristica}": c.valor for c in caracteristicas
        })

    return render(request, 'componente_list.html', {
        'componentes': componentes,
        'modelos': modelos,
        'tipos': tipos,
        'filtro_tipo': id_tipo,
        'descripciones': Componentes.Tipo_descripcion
    })


def componente_create(request):
    if request.method == 'POST':
        try:
            # Validación más estricta
            if not request.POST.get('idModelo'):
                raise ValueError("El campo modelo es requerido")
                
            if not request.POST.get('idTipoComponente'):
                raise ValueError("El tipo de componente es requerido")
            
            modelo = get_object_or_404(Modelo, idModelo=request.POST['idModelo'])
            tipo = get_object_or_404(TipoComponente, idTipoComponente=request.POST['idTipoComponente'])
            
            # Crear componente con estado por defecto
            componente = Componentes(
                idModelo=modelo,
                idTipoComponente=tipo,
                numeroSerie=request.POST.get('numeroSerie', '').strip(),
                descripcionComponente=request.POST.get('descripcionComponente', 'De Marca'),
                estado='ACTIVO'  # Asegurar estado por defecto
            )
              
            componente.save()
            
            # Procesar características con mejor manejo de errores
            for key, value in request.POST.items():
                if key.startswith('caracteristica_'):
                    try:
                        carac_id = key.split('_')[1]
                        caracteristica = get_object_or_404(Caracteristicas, idCaracteristica=carac_id)
                        ComponenteCaracteristica.objects.update_or_create(
                            idComponente=componente,
                            idCaracteristica=caracteristica,
                            defaults={'valor': value.strip()}
                        )
                    except Exception as e:
                        print(f"Error al procesar característica {key}: {str(e)}")
                        continue

            messages.success(request, 'Componente creado exitosamente')
            return redirect('componente_list')
            
        except Exception as e:
            messages.error(request, f'Error al crear componente: {str(e)}')
            # Para depuración
            print("Error en componente_create:", str(e))
            print("Datos recibidos:", request.POST)
    
    modelos = Modelo.objects.all().select_related('idMarca')
    tipos = TipoComponente.objects.all()
    return render(request, 'componente_list.html', {
        'modelos': modelos,
        'tipos': tipos,
        'descripciones': Componentes.Tipo_descripcion
    })

def componente_update(request, idComponente):
    componente = get_object_or_404(Componentes, idComponente=idComponente)

    if request.method == 'POST':
        try:
            modelo = get_object_or_404(Modelo, idModelo=request.POST['idModelo'])
            tipo = get_object_or_404(TipoComponente, idTipoComponente=request.POST['idTipoComponente'])
            
            componente.idModelo = modelo
            componente.idTipoComponente = tipo
            componente.numeroSerie = request.POST.get('numeroSerie', '')
            componente.descripcionComponente = request.POST.get('descripcionComponente', 'De Marca')
         
            componente.save()

            # Actualizar o crear características
            for key, value in request.POST.items():
                if key.startswith('caracteristica_'):
                    carac_id = key.split('_')[1]
                    caracteristica = get_object_or_404(Caracteristicas, idCaracteristica=carac_id)
                    ComponenteCaracteristica.objects.update_or_create(
                        idComponente=componente,
                        idCaracteristica=caracteristica,
                        defaults={'valor': value}
                    )

            messages.success(request, 'Componente actualizado exitosamente')
            return redirect('componente_list')

        except Exception as e:
            messages.error(request, f'Error al actualizar componente: {str(e)}')

    modelos = Modelo.objects.all()
    tipos = TipoComponente.objects.all()

    return render(request, 'componente_list.html', {
        'modelos': modelos,
        'tipos': tipos,
        'descripciones': Componentes.Tipo_descripcion,
        'editando': True,
        'componente': componente,
    })

def componente_delete(request, idComponente):
    componente = get_object_or_404(Componentes, idComponente=idComponente)
    componente.estado = 'INACTIVO'
    componente.save()
    messages.success(request, 'Componente dado de baja exitosamente')
    return redirect('componente_list')

# ---------------------- COMPONENTE-CARACTERISTICA ----------------------
def comp_carac_list(request):
    relaciones = ComponenteCaracteristica.objects.select_related(
        'idComponente', 'idCaracteristica'
    ).all()
    return render(request, 'compcarac_list.html', {'relaciones': relaciones})

def comp_carac_create(request):
    if request.method == 'POST':
        try:
            componente = get_object_or_404(Componentes, idComponente=request.POST.get('idComponente'))
            caracteristica = get_object_or_404(Caracteristicas, idCaracteristica=request.POST.get('idCaracteristica'))
            
            ComponenteCaracteristica.objects.create(
                idComponente=componente,
                idCaracteristica=caracteristica,
                valor=request.POST.get('valor', '')
            )
            messages.success(request, 'Relación componente-característica creada exitosamente')
            return redirect('comp_carac_list')
        except Exception as e:
            messages.error(request, f'Error al crear la relación: {str(e)}')
    
    componentes = Componentes.objects.all()
    caracteristicas = Caracteristicas.objects.all()
    return render(request, 'compcarac_list.html', {
        'componentes': componentes,
        'caracteristicas': caracteristicas
    })

def comp_carac_update(request, idComponenteCaracteristica):
    relacion = get_object_or_404(ComponenteCaracteristica, idComponenteCaracteristica=idComponenteCaracteristica)
    if request.method == 'POST':
        relacion.valor = request.POST['valor']
        relacion.save()
        messages.success(request, 'Valor actualizado exitosamente')
        return redirect('comp_carac_list')
    
    return render(request, 'compcarac_list.html', {'relacion': relacion})

def comp_carac_delete(request, idComponenteCaracteristica):
    relacion = get_object_or_404(ComponenteCaracteristica, idComponenteCaracteristica=idComponenteCaracteristica)
    relacion.delete()
    messages.success(request, 'Relación eliminada exitosamente')
    return redirect('comp_carac_list')

def componente_detalle(request, idComponente):
    componente = get_object_or_404(Componentes, pk=idComponente)
    caracteristicas = ComponenteCaracteristica.objects.filter(idComponente=componente)
    context = {
        'componente': componente,
        'caracteristicas': caracteristicas,
    }
    return render(request, 'detalle_componente.html', context)
# ---------------------- AJAX ----------------------
def caracteristicas_por_tipo(request, tipo_id):
    caracteristicas = Caracteristicas.objects.filter(
        idTipoComponente=tipo_id
    ).values('idCaracteristica', 'descripcionCaracteristica')
    return JsonResponse(list(caracteristicas), safe=False)

# ---------------------- ESTABLECIMIENTO ----------------------
# CREATE
def crear_establecimiento(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        Establecimiento.objects.create(NombreEstablecimiento=nombre)
        return redirect('listar_establecimientos')
    return render(request, 'establecimiento_list.html')

# READ
def listar_establecimientos(request):
    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'establecimiento_list.html', {'establecimientos': establecimientos})

# UPDATE
def editar_establecimiento(request, id):
    establecimiento = get_object_or_404(Establecimiento, idEstablecimiento=id)
    if request.method == 'POST':
        establecimiento.NombreEstablecimiento = request.POST.get('nombre')
        establecimiento.save()
        return redirect('listar_establecimientos')
    return render(request, 'establecimiento_list.html', {'establecimiento': establecimiento})

# DELETE LÓGICO
def eliminar_establecimiento(request, id):
    establecimiento = get_object_or_404(Establecimiento, idEstablecimiento=id)
    establecimiento.Estado = "False"
    establecimiento.save()
    return redirect('listar_establecimientos')

# ---------------------- AREA ----------------------

# CREATE
def crear_area(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        id_establecimiento = request.POST.get('establecimiento')

        establecimiento = Establecimiento.objects.get(idEstablecimiento=id_establecimiento)
        Area.objects.create(areaNombre=nombre, idEstablecimiento=establecimiento)

        return redirect('listar_areas')

    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'area_list.html', {'establecimientos': establecimientos})


# READ
def listar_areas(request):
    areas = Area.objects.filter(Estado=True)
    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'area_list.html', {'areas': areas, 'establecimientos': establecimientos})

# UPDATE
def editar_area(request, id):
    area = get_object_or_404(Area, idArea=id)
    if request.method == 'POST':
        area.areaNombre = request.POST.get('nombre')
        area.idEstablecimiento_id = request.POST.get('establecimiento')
        area.save()
        return redirect('listar_areas')
    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'area_list.html', {'area': area, 'establecimientos': establecimientos})

# DELETE LÓGICO
def eliminar_area(request, id):
    area = get_object_or_404(Area, idArea=id)
    area.Estado = False
    area.save()
    return redirect('listar_areas')

# ---------------------- SUB-AREA ----------------------

# CREATE
def crear_subarea(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        id_area = request.POST.get('area')
        SubArea.objects.create(subareaNombre=nombre, idArea_id=id_area)
        return redirect('listar_subareas')
    areas = Area.objects.filter(Estado=True)
    return render(request, 'subarea_list.html', {'areas': areas})

# READ
def listar_subareas(request):
    subareas = SubArea.objects.filter(Estado=True)
    areas = Area.objects.filter(Estado=True)
    return render(request, 'subarea_list.html', {
        'subareas': subareas,
        'areas': areas
    })

# UPDATE
def editar_subarea(request, id):
    subarea = get_object_or_404(SubArea, idSubarea=id)
    if request.method == 'POST':
        subarea.subareaNombre = request.POST.get('nombre')
        subarea.idArea_id = request.POST.get('area')
        subarea.save()
        return redirect('listar_subareas')
    areas = Area.objects.filter(Estado=True)
    return render(request, 'subarea_list.html', {'subarea': subarea, 'areas': areas})

# DELETE LÓGICO
def eliminar_subarea(request, id):
    subarea = get_object_or_404(SubArea, idSubarea=id)
    subarea.Estado = False
    subarea.save()
    return redirect('listar_subareas')

# ---------------------- CARGO ----------------------
# CREATE
def crear_cargo(request):
    if request.method == 'POST':
        descripcion = request.POST.get('descripcion')
        Cargo.objects.create(Descripcion=descripcion)
        return redirect('listar_cargos')
    return render(request, 'cargo_list.html')

# READ
def listar_cargos(request):
    cargos = Cargo.objects.all()
    return render(request, 'cargo_list.html', {'cargos': cargos})

# UPDATE
def editar_cargo(request, id):
    cargo = get_object_or_404(Cargo, idCargo=id)
    if request.method == 'POST':
        cargo.Descripcion = request.POST.get('descripcion')
        cargo.save()
        return redirect('listar_cargos')
    return render(request, 'cargo_list.html', {'cargo': cargo})

# DELETE 
def eliminar_cargo(request, id):
    cargo = get_object_or_404(Cargo, idCargo=id)
    cargo.delete()
    return redirect('listar_cargos')


# ---------------------- PERSONAL ----------------------

# CREATE
def crear_personal(request):
    if request.method == 'POST':
        dni = request.POST.get('dni')
        id_cargo = request.POST.get('cargo')
        id_establecimiento = request.POST.get('establecimiento')
        apellidos = request.POST.get('apellidos')
        nombres = request.POST.get('nombres')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')
        password = request.POST.get('password')
        username = request.POST.get('username')

        user = User.objects.create(
            username=username,
            first_name=nombres,
            last_name=apellidos,
            email=correo,
            is_superuser=False,
            is_staff=False,
            is_active=True,
            password=make_password(password)
        )

        Personal.objects.create(
            dni=dni,
            idCargo_id=id_cargo,
            idEstablecimiento_id=id_establecimiento,
            Apellidos=apellidos,
            Nombres=nombres,
            Telefono=telefono,
            Correo=correo,
            user=user
        )

        return redirect('listar_personal')

    cargos = Cargo.objects.all()
    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'personal_list.html', {'cargos': cargos, 'establecimientos': establecimientos})

# READ
def listar_personal(request):
    personal = Personal.objects.all()
    cargos = Cargo.objects.all()
    establecimientos = Establecimiento.objects.filter(Estado=True)
    return render(request, 'personal_list.html', {
        'personal': personal,
        'cargos': cargos,
        'establecimientos': establecimientos
    })


# UPDATE
def editar_personal(request, id):
    persona = get_object_or_404(Personal, idPersonal=id)

    if request.method == 'POST':
        dni = request.POST.get('dni')
        id_cargo = request.POST.get('cargo')
        id_establecimiento = request.POST.get('establecimiento')
        apellidos = request.POST.get('apellidos')
        nombres = request.POST.get('nombres')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')
        username = request.POST.get('username')
        password = request.POST.get('password')

        persona.dni = dni
        persona.idCargo_id = id_cargo
        persona.idEstablecimiento_id = id_establecimiento
        persona.Apellidos = apellidos
        persona.Nombres = nombres
        persona.Telefono = telefono
        persona.Correo = correo
        persona.save()

        user = persona.user
        user.username = username
        user.first_name = nombres
        user.last_name = apellidos
        user.email = correo

        if password:
            user.password = make_password(password)

        user.save()

        return redirect('listar_personal')

    cargos = Cargo.objects.all()
    establecimientos = Establecimiento.objects.filter(Estado=True)

    return render(request, 'personal_list.html', {
        'persona': persona,
        'cargos': cargos,
        'establecimientos': establecimientos
    })

# DELETE 
def eliminar_personal(request, id):
    persona = get_object_or_404(Personal, idPersonal=id)
    user = persona.user 
    persona.delete()
    user.delete() 
    return redirect('listar_personal')

# ---------------------- FORMATO ----------------------

# CREATE
def crear_formato(request):
    if request.method == 'POST':
        codigo = request.POST.get('codigoFormato')
        version = request.POST.get('versionFormato')
        fecha_str = request.POST.get('fechaFormato') 
        fecha = datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M')
        estado = "ACTIVO"
        Formato.objects.create(
            codigoFormato=codigo,
            versionFormato=version,
            fechaFormato=fecha,
            estadoFormato=estado
        )
        return redirect('listar_formatos')
    return render(request, 'formato_list.html')

# READ
def listar_formatos(request):
    formatos = Formato.objects.filter(estadoFormato__iexact='ACTIVO')
    return render(request, 'formato_list.html', {'formatos': formatos})

# UPDATE
def editar_formato(request, id):
    formato = get_object_or_404(Formato, idFormato=id)
    if request.method == 'POST':
        formato.codigoFormato = request.POST.get('codigoFormato')
        formato.versionFormato = request.POST.get('versionFormato')
        fecha_str = request.POST.get('fechaFormato')
        formato.fechaFormato = datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M')
        formato.save()
        return redirect('listar_formatos')
    return render(request, 'formato_list.html', {'formato': formato})


def eliminar_formato(request, id):
    formato = get_object_or_404(Formato, idFormato=id)
    formato.estadoFormato = 'INACTIVO'
    formato.save()
    return redirect('listar_formatos')

# ---------------------- ACTAS SALIDAS ----------------------

def crear_actasalida(request):
    if request.method == 'POST':
        codreq = request.POST.get('codReq')
        formato_id = request.POST.get('idFormato')
        establecimiento_id = request.POST.get('idEstablecimiento')
        personal_id = request.POST.get('idPersonal')

        ActaSalida.objects.create(
            codReq=codreq,
            idFormato_id=formato_id,
            idEstablecimiento_id=establecimiento_id,
            idPersonal_id=personal_id
        )
        return redirect('listar_actasalida')

    formatos = Formato.objects.filter(estadoFormato='ACTIVO').first()
    establecimientos = Establecimiento.objects.filter(Estado=True)
    personal = Personal.objects.all()

    context = {
        'formatos': formatos,
        'establecimientos': establecimientos,
        'personal': personal,
    }
    return render(request, 'acta_list.html', context)

# READ
def listar_actasalida(request):
    actas = ActaSalida.objects.all()
    formatos = Formato.objects.filter(estadoFormato='ACTIVO').first()
    establecimientos = Establecimiento.objects.filter(Estado=True)
    personal = Personal.objects.all()
    equipos = EquiposInformatico.objects.all()
    return render(request, 'acta_list.html', {'actas': actas, 'formatos': formatos,
        'establecimientos': establecimientos,
        'personal': personal,
        'equipos': equipos })

# UPDATE
def editar_actasalida(request, id):
    acta = get_object_or_404(ActaSalida, idActaSalida=id)
    if request.method == 'POST':
        acta.codReq = request.POST.get('codReq')
        acta.idFormato_id = request.POST.get('idFormato')
        acta.idEstablecimiento_id = request.POST.get('idEstablecimiento')
        acta.idPersonal_id = request.POST.get('idPersonal')
        acta.idEquipoInformatico_id = request.POST.get('idEquipoInformatico')
        acta.save()
        return redirect('listar_actasalida')
    formatos = Formato.objects.filter(estadoFormato__iexact='activo')
    establecimientos = Establecimiento.objects.filter(Estado=True)
    personal = Personal.objects.all()
    equipos = EquiposInformatico.objects.all()
    context = {
        'acta': acta,
        'formatos': formatos,
        'establecimientos': establecimientos,
        'personal': personal,
        'equipos': equipos
    }
    return render(request, 'acta_list.html', context)

# DELETE
def eliminar_actasalida(request, id):
    acta = get_object_or_404(ActaSalida, idActaSalida=id)
    acta.delete()
    return redirect('listar_actasalida')

def asignar_equipos(request, id):
    acta = get_object_or_404(ActaSalida, idActaSalida=id)

    if request.method == 'POST':
        equipo_id = request.POST.get('idEquipoInformatico')

        if not equipo_id:
            messages.error(request, "Debe seleccionar un equipo.")
            return redirect('asignar_equipo_acta', id=acta.idActaSalida)

        equipo = get_object_or_404(EquiposInformatico, pk=equipo_id)

        if AsignacionEquipo.objects.filter(idEquipoInformatico=equipo).exists():
            messages.error(request, "Este equipo ya está asignado.")
            return redirect('asignar_equipo_acta', id=acta.idActaSalida)

        # Crear relación
        AsignacionEquipo.objects.create(idActaSalida=acta, idEquipoInformatico=equipo)

        equipo.estado = 'ASIGNADO'
        equipo.save()

        messages.success(request, "✅ Equipo asignado correctamente.")
        return redirect('asignar_equipo_acta', id=acta.idActaSalida)

    equipos = EquiposInformatico.objects.filter(estado='ACTIVO')
    equipos_asignados = AsignacionEquipo.objects.filter(idActaSalida=acta)

    return render(request, 'asignacion_equipos.html', {
        'acta': acta,
        'equipos': equipos,
        'equipos_asignados': equipos_asignados
    })


def liberar_equipo_acta(request, id_acta, id_asignacion):
    asignacion = get_object_or_404(AsignacionEquipo, pk=id_asignacion, idActaSalida__idActaSalida=id_acta)
    equipo = asignacion.idEquipoInformatico

    if request.method == 'POST':
        equipo.estado = "ACTIVO"
        equipo.save()

        asignacion.delete()

        messages.success(request, "✅ Equipo liberado y marcado como DISPONIBLE.")

    return redirect('asignar_equipo_acta', id=id_acta)

def detalle_acta_salida(request, id):
    acta = get_object_or_404(ActaSalida, pk=id)
    equipos_asignados = AsignacionEquipo.objects.filter(idActaSalida=acta)

    contexto = {
        'acta': acta,
        'equipos_asignados': equipos_asignados,
    }
    return render(request, 'acta_reporte.html', contexto)
# ---------------------- LOTE ----------------------
# CREATE
def crear_lote(request):
    if request.method == 'POST':
        cantidad = request.POST.get('cantidad')
        modelo_id = request.POST.get('idModelo')
        tipo_adq = request.POST.get('tipoAdquisicion')
        fecha_compra = request.POST.get('fechaCompra')  
        Lote.objects.create(
            cantidad=cantidad,
            idModelo_id=modelo_id,
            tipoAdquisicion=tipo_adq,
            fechaCompra=fecha_compra
        )
        return redirect('listar_lotes')
    modelos = Modelo.objects.all()
    return render(request, 'lotes/crear.html', {'modelos': modelos})

# READ
def listar_lotes(request):
    lotes = Lote.objects.all()
    return render(request, 'lotes/listar.html', {'lotes': lotes})

# UPDATE
def editar_lote(request, id):
    lote = get_object_or_404(Lote, idLote=id)
    if request.method == 'POST':
        lote.cantidad = request.POST.get('cantidad')
        lote.idModelo_id = request.POST.get('idModelo')
        lote.tipoAdquisicion = request.POST.get('tipoAdquisicion')
        lote.fechaCompra = request.POST.get('fechaCompra')
        lote.save()
        return redirect('listar_lotes')
    modelos = Modelo.objects.all()
    return render(request, 'lotes/editar.html', {'lote': lote, 'modelos': modelos})

# DELETE 
def eliminar_lote(request, id):
    lote = get_object_or_404(Lote, idLote=id)
    lote.delete()
    return redirect('listar_lotes')

# ---------------------- USUARIOS ----------------------

def listar_usuarios(request):
    usuarios = User.objects.filter(is_superuser=False).order_by('username')
    return render(request, 'usuario_list.html', {'usuarios': usuarios})

def historial_equipos(request):
    equipos = EquiposInformatico.objects.select_related('idTipoEquipo', 'idModelo').all()
    tipos = TipoEquipo.objects.all()
    modelos = Modelo.objects.all()
    return render(request, 'historial_equipos.html', {
        'historial': equipos,
        'tipos': tipos,
        'modelos': modelos
    })

def historial_componentes(request):
    tipos = TipoComponente.objects.all()
    modelos = Modelo.objects.all()

    componentes = Componentes.objects.select_related('idModelo', 'idTipoComponente').all()

    for comp in componentes:
        caracteristicas = ComponenteCaracteristica.objects.filter(idComponente=comp)
        comp.caracteristicas_json = json.dumps({
            f"caracteristica_{c.idCaracteristica.idCaracteristica}": c.valor for c in caracteristicas
        })

    return render(request, 'historial_componentes.html', {
        'componentes': componentes,
        'tipos': tipos,
        'modelos': modelos
    })

def detalle_equipo_pdf(request, id):
    equipo = get_object_or_404(EquiposInformatico, pk=id)
    componentes = Componentes.objects.filter(idEquipoInformatico=equipo)
    return render(request, 'detalle_equipo_reporte.html', {
        'equipo': equipo,
        'componentes': componentes
    })