# Sistema de Gestión de Beneficios

  This is a code bundle for Sistema de Gestión de Beneficios. The original project is available at https://www.figma.com/design/ALnZy0G9D9JQ4kx1A4S60i/Sistema-de-Gesti%C3%B3n-de-Beneficios.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

# Carga de Nómina

Formatos soportados:
- .xlsx
- .xls
- .csv

Columnas esperadas (los nombres son flexibles y no sensibles a mayúsculas; se aceptan estos alias):
- Nombre: "Nombre", "Nombre Completo", "nombre"
- RUT: "RUT", "Rut", "rut"
- TipoContrato: "TipoContrato", "Tipo de Contrato", "contrato"
- Rol: "Rol", "Rol/Departamento", "Departamento", "Departamento/Rol", "rol"
- Localidad: "Localidad", "Sede", "Planta", "Ubicacion"
- Beneficio: "Beneficio", "Beneficio Asignado", "beneficio"
- Estado: "Estado", "Estado Beneficio", "estado" (valores: "Pendiente" o "Retirado")
- FechaRetiro: "FechaRetiro", "Fecha Retiro", "Fecha de Retiro"

Normalización automática:
- Tipo de contrato: cualquier valor que contenga "plazo" se mapea a "Plazo Fijo"; si no, "Planta".
- Rol: se detecta por palabras clave ("guard" → "Guardia", "oficin" → "Oficina", "superv" → "Supervisión", "admin" → "Administración"; resto → "Personal de Base").
- Estado: si inicia con "ret" → "Retirado"; si no → "Pendiente".

Ejemplo CSV mínimo:
```csv
Nombre,RUT,TipoContrato,Rol,Localidad,Beneficio,Estado,FechaRetiro
María Fernanda González,16.234.567-8,Planta,Personal de Base,Valparaíso,Caja Navidad 2024,Pendiente,
Carlos Alberto Muñoz,18.345.678-9,Plazo Fijo,Guardia,Casablanca,Caja Navidad 2024,Retirado,15/12/2024
```

Cómo cargar:
1. Ir a Panel de Administrador → Empleados → “Cargar Nómina”.
2. Seleccionar un archivo en los formatos soportados.
3. Ver la vista previa y la tabla actualizada con los registros cargados.
