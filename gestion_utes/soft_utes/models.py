from django.db import models
from django.contrib.auth.models import User
from django.http import JsonResponse

class Establecimiento(models.Model):
    idEstablecimiento = models.AutoField(primary_key=True)
    NombreEstablecimiento = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')

class Area(models.Model):
    idArea = models.AutoField(primary_key=True)
    areaNombre = models.CharField(max_length=100)
    idEstablecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    estado = models.CharField(max_length=100, default='ACTIVO')

class SubArea(models.Model):
    idSubarea = models.AutoField(primary_key=True)
    subareaNombre = models.CharField(max_length=100)
    idArea = models.ForeignKey(Area, on_delete=models.CASCADE)
    estado = models.CharField(max_length=100, default='ACTIVO')

class Cargo(models.Model):
    idCargo = models.AutoField(primary_key=True)
    Descripcion = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')

class Personal(models.Model):
    idPersonal = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    dni = models.CharField('DNI', max_length=8, unique=True)
    idCargo = models.ForeignKey(Cargo, on_delete=models.CASCADE)
    idArea = models.ForeignKey(Area, on_delete=models.CASCADE)
    Apellidos = models.CharField(max_length=100)
    Nombres = models.CharField(max_length=100)
    Telefono = models.CharField(max_length=100)
    Correo = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')

# Tabla: TipoEquipo
class TipoEquipo(models.Model):
    idTipoEquipo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')
    def __str__(self):
        return self.nombre

# Tabla: Marca
class Marca(models.Model):
    idMarca = models.AutoField(primary_key=True)
    nombreMarca = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')
    def __str__(self):
        return self.nombreMarca

# Tabla: Modelo
class Modelo(models.Model):
    idModelo = models.AutoField(primary_key=True)
    idMarca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    nombreModelo = models.CharField(max_length=100)
    descripcionModelo = models.CharField(max_length=400)
    Imagen = models.ImageField(upload_to='modelos/', null=True, blank=True)
    estado = models.CharField(max_length=100, default='ACTIVO')
    
    def __str__(self):
        return self.nombreModelo

# Tabla: EquiposInformatico
class EquiposInformatico(models.Model):
    Tipo_descripcion = [
        ('De Marca', 'de marca'),
        ('Compatible', 'compatible'),
        ('Otros', 'otros'),
    ]
    ESTADO_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('MANTENIMIENTO', 'En Mantenimiento'),
        ('BAJA', 'Dado de Baja'),
    ]
    idLote = models.ForeignKey('Lote', on_delete=models.SET_NULL, null=True, blank=True)
    idEquipoInformatico = models.AutoField(primary_key=True)
    idTipoEquipo = models.ForeignKey(TipoEquipo, on_delete=models.CASCADE)
    idModelo = models.ForeignKey(Modelo, on_delete=models.SET_NULL, null=True, blank=True)
    nombreEquipoInformatico = models.CharField(max_length=100)
    codigoPatrimonial = models.CharField(max_length=200, unique=True, null=True, blank=True)
    numeroSerie = models.CharField(max_length=200, unique=True, null=True, blank=True)
    observacionEquipo = models.CharField(max_length=400)
    descripcionEquipo = models.CharField(max_length=100, choices=Tipo_descripcion)
    añoGarantia = models.PositiveIntegerField(null=True, blank=True)  
    fechaRegistro = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=100, choices=ESTADO_CHOICES, default='ACTIVO')

    def __str__(self):
        return self.nombreEquipoInformatico

# Tabla: TipoComponente
class TipoComponente(models.Model):
    idTipoComponente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=100, default='ACTIVO')

    def __str__(self):
        return self.nombre

class Caracteristicas(models.Model):
    idCaracteristica = models.AutoField(primary_key=True)
    descripcionCaracteristica = models.CharField(max_length=100)
    idTipoComponente = models.ForeignKey(TipoComponente, related_name='caracteristicas', on_delete=models.CASCADE)
    estado = models.CharField(max_length=100, default='ACTIVO')

    def __str__(self):
        return f"{self.nombreCaracteristica} ({self.idTipoComponente.nombre})"



class Componentes(models.Model):
    ESTADO_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('ASIGNADO', 'Asignado'),
        ('MANTENIMIENTO', 'En Mantenimiento'),
        ('BAJA', 'Dado de Baja'),
    ]
    
    Tipo_descripcion = [
        ('De Marca', 'de marca'),
        ('Compatible', 'compatible'),
        ('Otros', 'otros'),
    ]
    idLote = models.ForeignKey('Lote', on_delete=models.SET_NULL, null=True, blank=True)
    idComponente = models.AutoField(primary_key=True)
    idModelo = models.ForeignKey('Modelo', on_delete=models.CASCADE)
    idTipoComponente = models.ForeignKey(TipoComponente, on_delete=models.CASCADE)
    idEquipoInformatico = models.ForeignKey('EquiposInformatico', on_delete=models.SET_NULL, null=True, blank=True)
    nombreComponente = models.CharField(max_length=100)
    numeroSerie = models.CharField(max_length=50, blank=True, null=True, unique=True)
    descripcionComponente = models.CharField(max_length=100, choices=Tipo_descripcion)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='DISPONIBLE')

    def __str__(self):
        return self.nombreComponente

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        for caracteristica in self.idTipoComponente.caracteristicas.all():
            ComponenteCaracteristica.objects.get_or_create(
                idComponente=self,
                idCaracteristica=caracteristica
            )

class ComponenteCaracteristica(models.Model):
    idComponenteCaracteristica = models.AutoField(primary_key=True)  
    valor = models.CharField(max_length=255)  
    idCaracteristica = models.ForeignKey(Caracteristicas, on_delete=models.CASCADE)
    idComponente = models.ForeignKey(Componentes, on_delete=models.CASCADE)

    class Meta:
        db_table = 'ComponenteCaracteristica'


class Formato(models.Model):
    idFormato = models.AutoField(primary_key=True)
    codigoFormato = models.CharField(max_length=100)
    versionFormato = models.CharField(max_length=100)
    fechaFormato = models.DateTimeField(auto_now_add=True)
    estadoFormato = models.CharField(max_length=100)

class ActaSalida(models.Model):
    idActaSalida = models.AutoField(primary_key=True)
    codReq = models.CharField(max_length=50)
    idFormato = models.ForeignKey(Formato, on_delete=models.CASCADE)
    idEstablecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)
    idPersonal = models.ForeignKey(Personal, on_delete=models.CASCADE)
    idEquipoInformatico = models.ForeignKey(EquiposInformatico, on_delete=models.SET_NULL, null=True, blank=True)
    fechaRegistro = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=100, default='ACTIVO')

class Lote(models.Model):
    idLote = models.AutoField(primary_key=True)
    cantidad = models.IntegerField()
    idModelo = models.ForeignKey(Modelo, on_delete=models.CASCADE)
    fechaAdquisicion= models.DateField()
    estado = models.CharField(max_length=100, default='ACTIVO')

class AsignacionEquipo(models.Model):
    idActaSalida = models.ForeignKey(ActaSalida, on_delete=models.CASCADE)
    idEquipoInformatico = models.ForeignKey(EquiposInformatico, on_delete=models.CASCADE)
    fechaAsignacion = models.DateTimeField(auto_now_add=True)
