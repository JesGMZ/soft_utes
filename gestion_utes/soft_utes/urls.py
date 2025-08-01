from django.urls import path
from . import views

urlpatterns = [

    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('admin-dashboard/', views.dashboard_admin, name='dashboard_admin'),
    path('gestor-dashboard/', views.dashboard_gestor, name='dashboard_gestor'),

   # URLs para Marcas
    path('marcas/', views.marca_list, name='marca_list'),
    path('marcas/nueva/', views.marca_create, name='marca_create'),
    path('marcas/editar/<int:idMarca>/', views.marca_update, name='marca_update'),
    path('marcas/eliminar/<int:idMarca>/', views.marca_delete, name='marca_delete'),
    
    # URLs para Tipos de Equipo
    path('tipo-equipo/', views.tipoequipo_list, name='tipoequipo_list'),
    path('tipo-equipo/nuevo/', views.tipoequipo_create, name='tipoequipo_create'),
    path('tipo-equipo/editar/<int:idTipoEquipo>/', views.tipoequipo_update, name='tipoequipo_update'),
    path('tipo-equipo/eliminar/<int:idTipoEquipo>/', views.tipoequipo_delete, name='tipoequipo_delete'),
    
    # URLs para Modelos
    path('modelos/', views.modelo_list, name='modelo_list'),
    path('modelos/nuevo/', views.modelo_create, name='modelo_create'),
    path('modelos/editar/<int:idModelo>/', views.modelo_update, name='modelo_update'),
    path('modelos/eliminar/<int:idModelo>/', views.modelo_delete, name='modelo_delete'),
    
    # URLs para Equipos Informáticos
    path('equipos-informaticos/', views.equipo_list, name='equipo_list'),
    path('equipos-informaticos/nuevo/', views.equipo_create, name='equipo_create'),
    path('equipos-informaticos/editar/<int:idEquipoInformatico>/', views.equipo_update, name='equipo_update'),
    path('equipos-informaticos/eliminar/<int:idEquipoInformatico>/', views.equipo_delete, name='equipo_delete'),
    path('equipos-informaticos/<int:idEquipoInformatico>/asignar-componentes/', views.asignar_componentes, name='asignar_componentes'),
    path('equipos-informaticos/<int:idEquipoInformatico>/detalle/', views.equipo_detalle, name='equipo_detalle'),
    
    path('caracteristicas/', views.caracteristica_list, name='caracteristica_list'),
    path('caracteristicas/crear/', views.caracteristica_create, name='caracteristica_create'),
    path('caracteristicas/editar/<int:idCaracteristica>/', views.caracteristica_update, name='caracteristica_update'),
    path('caracteristicas/eliminar/<int:idCaracteristica>/', views.caracteristica_delete, name='caracteristica_delete'),

    path('componentes/', views.componente_list, name='componente_list'),
    path('componentes/crear/', views.componente_create, name='componente_create'),
    path('componentes/editar/<int:idComponente>/', views.componente_update, name='componente_update'),
    path('componentes/eliminar/<int:idComponente>/', views.componente_delete, name='componente_delete'),
    path('componentes/<int:idComponente>/detalle/', views.componente_detalle, name='componente_detalle'),
    
    # URLs para Componente-Característica
    path('componente-caracteristicas/', views.comp_carac_list, name='comp_carac_list'),
    path('componente-caracteristicas/crear/', views.comp_carac_create, name='comp_carac_create'),
    path('componente-caracteristicas/editar/<int:idComponenteCaracteristica>/', views.comp_carac_update, name='comp_carac_update'),
    path('componente-caracteristicas/eliminar/<int:idComponenteCaracteristica>/', views.comp_carac_delete, name='comp_carac_delete'),

    path('tipo-componente/', views.tipocomponente_list, name='tipocomponente_list'),
    path('tipo-componente/nuevo/', views.tipocomponente_create, name='tipocomponente_create'),
    path('tipo-componente/editar/<int:idTipoComponente>/', views.tipocomponente_update, name='tipocomponente_update'),
    path('tipo-componente/eliminar/<int:idTipoComponente>/', views.tipocomponente_delete, name='tipocomponente_delete'),
    path('api/caracteristicas-por-tipo/<int:tipo_id>/', views.caracteristicas_por_tipo, name='caracteristicas_por_tipo'),

    # URLs para Establecimientos
    path('establecimientos/', views.listar_establecimientos, name='listar_establecimientos'),
    path('establecimientos/crear/', views.crear_establecimiento, name='crear_establecimiento'),
    path('establecimientos/editar/<int:id>/', views.editar_establecimiento, name='editar_establecimiento'),
    path('establecimientos/eliminar/<int:id>/', views.eliminar_establecimiento, name='eliminar_establecimiento'),

    # URLs para Áreas
    path('areas/', views.listar_areas, name='listar_areas'),
    path('areas/crear/', views.crear_area, name='crear_area'),
    path('areas/editar/<int:id>/', views.editar_area, name='editar_area'),
    path('areas/eliminar/<int:id>/', views.eliminar_area, name='eliminar_area'),

    # ---------------------- SUB-AREAS ----------------------
    path('subareas/', views.listar_subareas, name='listar_subareas'),
    path('subareas/crear/', views.crear_subarea, name='crear_subarea'),
    path('subareas/editar/<int:id>/', views.editar_subarea, name='editar_subarea'),
    path('subareas/eliminar/<int:id>/', views.eliminar_subarea, name='eliminar_subarea'),

    # ---------------------- CARGOS ----------------------
    path('cargos/', views.listar_cargos, name='listar_cargos'),
    path('cargos/crear/', views.crear_cargo, name='crear_cargo'),
    path('cargos/editar/<int:id>/', views.editar_cargo, name='editar_cargo'),
    path('cargos/eliminar/<int:id>/', views.eliminar_cargo, name='eliminar_cargo'),

    # ---------------------- PERSONAL ----------------------
    path('personal/', views.listar_personal, name='listar_personal'),
    path('personal/crear/', views.crear_personal, name='crear_personal'),
    path('personal/editar/<int:id>/', views.editar_personal, name='editar_personal'),
    path('personal/eliminar/<int:id>/', views.eliminar_personal, name='eliminar_personal'),

    # ---------------------- FORMATOS ----------------------
    path('formatos/', views.listar_formatos, name='listar_formatos'),
    path('formatos/crear/', views.crear_formato, name='crear_formato'),
    path('formatos/editar/<int:id>/', views.editar_formato, name='editar_formato'),
    path('formatos/eliminar/<int:id>/', views.eliminar_formato, name='eliminar_formato'),

    # ---------------------- ACTAS SALIDA ----------------------
    path('actas-salida/', views.listar_actasalida, name='listar_actasalida'),
    path('actas-salida/crear/', views.crear_actasalida, name='crear_actasalida'),
    path('actas-salida/editar/<int:id>/', views.editar_actasalida, name='editar_actasalida'),
    path('actas-salida/eliminar/<int:id>/', views.eliminar_actasalida, name='eliminar_actasalida'),
    path('acta/<int:id>/asignar-equipo/', views.asignar_equipos, name='asignar_equipo_acta'),
    path('acta/<int:id_acta>/liberar/<int:id_asignacion>/', views.liberar_equipo_acta, name='liberar_equipo_acta'),
    path('acta/<int:id>/detalle/', views.detalle_acta_salida, name='detalle_acta_salida'),

    # ---------------------- LOTES ----------------------
    path('lotes/', views.listar_lotes, name='listar_lotes'),
    path('lotes/crear/', views.crear_lote, name='crear_lote'),
    path('lotes/editar/<int:id>/', views.editar_lote, name='editar_lote'),
    path('lotes/eliminar/<int:id>/', views.eliminar_lote, name='eliminar_lote'),
    
    # ---------------------- USUARIOS ----------------------
    path('usuarios/', views.listar_usuarios, name='listar_usuarios'),
    path('historial-equipos/', views.historial_equipos, name='historial_equipos'),
    path('historial-componentes/', views.historial_componentes, name='historial_componentes'),
    path('equipo/<int:id>/detalle-pdf/', views.detalle_equipo_pdf, name='detalle_equipo_pdf'),
]