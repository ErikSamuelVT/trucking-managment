# Spec: Trucking Managment

## Metadatos

- **Proyecto:** Trucking Managment
- **Tipo:** Aplicación Web
- **Version:** 1.0.0
- **Estado:** Borrador
- **Stack Tecnológico:** Next.js (Router), Tailwind CSS, Supabase
- **Soporte de Dispositivo:** Desktop y Mobile

---

## Visión General del Sistema

### 1. Descripción

Aplicación web enfocada en la administración de flotillas de transporte con autenticación y base de datos. El sistema facílita la administración mediante 6 secciones dedicadas al manejo de:

- Operadores
- Unidades
- Destinos
- Bitácora de viajes
- Nóminas
- Estadísticas

Con un diseño moderno adaptado para versiones desktop y mobile.

### 2. Requisitos Generales

- **RG-01 (Autenticación):** El sistema debe contar con un módulo de autenticación de usuarios.
- **RG-02 (Catálogos fundamentales):** El sistema debe administrar de forma centralizada y asíncrona los catálogos fundamentales: **Operadores**, **Unidades** y **Destinos**.
- **RG-03 (Catálogos dinámicos):** El sistema debe administrar de forma centralizada y asíncrona los catálogos dinámicos: **Bitácora de viaje**, **Nóminas** y **Estadísticas**
- **RG-04 (Interfaz):** El diseño debe ser responsive para pantallas desktop y mobile utilizando Tailwind CSS.
- **RG-05 (Persistencia):** El sistema debe contar con una base de datos realtime en Supabase que permita la persistencia de datos de los siguientes catálogos: **Operadores**, **Unidades**,**Destinos** y **Bitácora de viajes**.
- **RG-06 (Información dinámica):** El sistema debe ser capas de generar la información de los catálogos: **Nóminas** y **Estadísticas** de forma dinámica mediante los datos registrados previamente en los catálogos anteriores.

---

# Módulo 1 - Autenticación

## 1. Descripción

Permite la autenticación sin uso de roles o privilegios, mediante el registro de una cuenta que requiere un usuario y una contraseña para el ingreso a los catálogos disponibles. Esta cuenta persiste en Supabase.

## 2 Requisitos Funcionales (RF)

- **RF-1.1 (Registro de usuario):** El usuario debe poder registrar una cuenta mediante un usuario y una contraseña (debe ser trátada mediante un hash para que no se guarde en crudo en la base de datos) y mendiante una notificación de ser avisado que fue registrado con exito.
- **RF-1.2 (Ingreso a los catálogoas):** El usuario debe poder acceder a los catálogos disponibles una vez que su usuario y contraseña hayan sido validados.
- **RF-1.3 (Recuperación de contraseña ):** El usuario debe porder recuperar su contraseña en caso de que la haya olvidado. Simplemente con el usuario y solicitando una contraseña nueva.
- **RF-1.4 (Usuario duplicado):** El usuario debe recibir una notificación en caso de que ingrese un usuario ya regristrado.

## 3. Estructura del Formulario/Tabla `cuentas`

Representa las cuentas registradas en la base de datos.

| Columna      | Tipo de Dato              | Nulable | Clave              | Descripción                                                                                                                                           |
| :----------- | :------------------------ | :------ | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | Auto-incrementable / UUID | NO      | PK                 | Identificador único autogenerado por PostgreSQL (`gen_random_uuid()`).                                                                                |
| `usuario`    | `text`                    | NO      | UNIQUE/Obligatorio | El nombre(s) de usuario debe ser normalizado a minúsculas con posibilidad de usar numeros y sin caracteres especiales, con un minímo de 6 carácteres. |
| `contraseña` | `text`                    | NO      | Obligatorio        | La contraseña de usuario debe ser normalizada a minúsculas con posibilidad de usar numeros y caracteres especiales y con un minímo de 6 carácteres.   |

## 4 Contrato JSON de Ejemplo

```json
{
  "id": "1",
  "usuario": "rogelio",
  "contraseña": "roger123"
}
```

## 5. Reglas de Validación y Negocio (RN)

- **RN-1.1 (Caracteres Permitidos):**
  - El campo usuario es de texto y únicamente aceptan letras de la `A` a la `Z` (mayúsculas y minúsculas), letras con acentos y números.
  - No se permiten caracteres especiales.
  - El campo contraseña es de tipo texto y únicamente aceptan letras de la `A` a la `Z` (mayúsculas y minúsculas), letras con acentos, números y caracteres especiales.
  - Cada campo debe tener 6 caracteres como mińimo.
- **RN-1.2 (Campos Obligatorios):**
  - Ninguno de los dos campos del formulario (`usuario`, `contraseña`) puede estar vacío.
- **RN-1.3 (Limpieza de Espacios):**
  - Se deben eliminar automáticamente los espacios en blanco al inicio y al final de cada campo (`trim`) antes de procesar o guardar.
- **RN-1.4 (Normalización en Base de Datos):**
  - Al hacer clic en el botón de registrar/guardar, toda la información ingresada debe convertirse y almacenarse **en minúsculas** en la base de datos de Supabase.

## 6 Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Registro exitoso de una cuenta

- **Dado** que el usuario se encuentra en la sección de Registro de cuenta y el formulario está limpio
- **Cuando** ingresa "rogelio" en el campo Usuario
- **Y** ingresa "rogelio123" en el campo Contraseña
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema elimina los espacios al inicio y final, además de hashear la contraseña para guardarla en la base de datos
- **Y** convierte el texto a minúsculas ("rogelio", "rogelio123")
- **Y** guarda el registro en Supabase
- **Y** notifiacamos al usuario el registro exitoso

### Escenario 2: Intentar registrar con campos vacíos

- **Dado** que el usuario deja uno o más campos obligatorios vacíos
- **Cuando** presiona el botón "Registrar"
- **Entonces** el sistema no permite el envío
- **Y** muestra un mensaje indicando que los campos son obligatorios

### Escenario 3: Intentar registrar con menos de 6 caracteres

- **Dado** que el usuario se encuentra en la sección de Registro de cuenta y el formulario está limpio
- **Cuando** ingresa "rog" en el campo Usuario
- **Y** ingresa "rog12" en el campo Contraseña
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema no permite el envío
- **Y** muestra un mensaje indicando que deben ser 6 caracteres en ambos campos

### Escenario 4: Acceso exitoso de una cuenta

- **Dado** que el usuario se encuentra en la sección de Inicio de sesion y el formulario está limpio
- **Cuando** ingresa "rogelio" en el campo Usuario
- **Y** ingresa "rogelio123" en el campo Contraseña
- **Y** presiona el botón "Ingresar"
- **Entonces** el sistema elimina los espacios al inicio y final, además de validar la contraseña mediante el hash
- **Y** si todos los datos son correctos
- **Entonces** se da acceso al catálogo del sistema

---

# Módulo 2 - Operadores

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de los operadores activos en la flotilla.

## 2. Requisitos Funcionales (RF)

- **RF-2.1 (CRUD de Operadores):** El usuario debe poder registrar, listar, editar y eliminar operadores de la flotilla.
- **RF-2.2 (Acciones de Registro):** Cada fila de la tabla debe contar con botones de acción para:
  - **Editar:** Carga los datos del operador en el formulario para su modificación y debe actualizar la tabla con el registro modificado.
  - **Eliminar:** Muestra un modal de confirmación antes de borrar el registro y una vez eliminado debe actualizar la tabla con el registro eliminado.

## 3. Estructura del Formulario/Tabla (`operadores`)

| Campo              | Tipo de Dato              | Generación / Requisito | Descripción                      |
| :----------------- | :------------------------ | :--------------------- | :------------------------------- |
| `id`               | Auto-incrementable / UUID | Automático             | Identificador único del registro |
| `nombre`           | Texto                     | Obligatorio            | Nombre(s) del operador           |
| `apellido_paterno` | Texto                     | Obligatorio            | Apellido paterno                 |
| `apellido_materno` | Texto                     | Obligatorio            | Apellido materno                 |

## 4 Contrato JSON de Ejemplo

```json
{
  "id": "1",
  "nombre": "rogelio",
  "apellido_paterno": "chavez",
  "apellido_materno": "lopez"
}
```

## 5 Reglas de Validación y Negocio (RN)

- **RN-2.1 (Caracteres Permitidos):**
  -Los campos de texto únicamente aceptan letras de la `A` a la `Z` (mayúsculas y minúsculas) y letras con acentos.
  - No se permiten números ni caracteres especiales.
- **RN-2.2 (Campos Obligatorios):**
  -Ninguno de los tres campos del formulario (`nombre`, `apellido_paterno`, `apellido_materno`) puede estar vacío.
- **RN-2.3 (Limpieza de Espacios):**
  - Se deben eliminar automáticamente los espacios en blanco al inicio y al final de cada campo (`trim`) antes de procesar o guardar.
- **RN-2.4 (Normalización en Base de Datos):**
  - Al hacer clic en el botón de registrar/guardar, toda la información ingresada debe convertirse y almacenarse **en minúsculas** en la base de datos de Supabase.

## 6 Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Registro exitoso de un operador

- **Dado** que el usuario se encuentra en la sección de Operadores y el formulario está limpio
- **Cuando** ingresa " rogelio " en el campo Nombre(s)
- **Y** ingresa "chavez" en el campo Apellido Paterno
- **Y** ingresa "lopez" en el campo Apellido Materno
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema elimina los espacios al inicio y final
- **Y** convierte el texto a minúsculas ("rogelio", "chavez", "lopez")
- **Y** guarda el registro en Supabase
- **Y** actualiza la tabla mostrando el nuevo operador y notifica al usuario que el registro fue exitoso

### Escenario 2: Intentar registrar con campos vacíos

- **Dado** que el usuario deja uno o más campos obligatorios vacíos
- **Cuando** presiona el botón "Registrar"
- **Entonces** el sistema no permite el envío
- **Y** muestra un mensaje indicando que los campos son obligatorios

### Escenario 3: Edición de un operador

- **Dado** que el usuario visualiza la tabla de operadores
- **Cuando** hace clic en el ícono de "Editar" en una fila
- **Entonces** el formulario se carga con los datos actuales del operador
- **Y cuando** modifica la información y presiona "Guardar"
- **Entonces** el sistema valida y normaliza los nuevos datos
- **Y** actualiza el registro en la base de datos y en la tabla

### Escenario 4: Confirmación y eliminación de registro

- **Dado** que el usuario visualiza la tabla de operadores
- **Cuando** hace clic en el ícono de "Eliminar" en una fila
- **Entonces** el sistema despliega un modal pidiendo confirmación
- **Y cuando** el usuario confirma la eliminación
- **Entonces** el sistema elimina el registro de Supabase
- **Y** actualiza la tabla removiendo la fila correspondiente

---

# Módulo 3 - Unidades

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de las unidades que se encuentran activas en la flotilla.

## 2. Requisitos Funcionales (RF)

- **RF-3.1 (CRUD de Unidades):** El usuario debe poder registrar, listar, editar y eliminar unidades de la flotilla.
- **RF-3.2 (Acciones de Registro):** Cada fila de la tabla debe contar con botones de acción para:
  - **Editar:** Carga los datos del operador en el formulario para su modificación y debe actualizar la tabla con el registro modificado.
  - **Eliminar:** Muestra un modal de confirmación antes de borrar el registro y una vez eliminado debe actualizar la tabla con el registro eliminado.

## 3. Estructura del Formulario/Tabla (`unidades`)

| Campo      | Tipo de Dato              | Generación / Requisito      | Descripción                              |
| :--------- | :------------------------ | :-------------------------- | :--------------------------------------- |
| `id`       | Auto-incrementable / UUID | Automático                  | Identificador único del registro         |
| `placas`   | Texto alfanumérico        | Obligatorio / Único         | Placas de identificación de la unidad    |
| `marca`    | Text                      | Obligatorio                 | Marca de la unidad                       |
| `modelo`   | Numérico                  | Obligatorio                 | Año del modelo de la unidad              |
| `no_motor` | Texto alfanumérico        | Obligatorio                 | Número de motor de la unidad             |
| `niv`      | Texto alfanumérico        | Obligatorio (17 caracteres) | Número de Identificación Vehicular (VIN) |

- _NOTA_: El campo marca en la interfaz debe tener pre-cargadas las siguiente opciones: Freightliner, International, Chevrolet.

## 4 Contrato JSON de Ejemplo

```JSON
{
"id": "1",
"placas": "839de1",
"marca": "International",
"modelo": 2021,
"no_motor": "accsscscsc2f323f3",
"niv": "vvsssdvsvdsvw43v3"
}
```

## 5. Reglas de Validación y Negocio (RN)

- **RN-3.1 (Tipos de Datos):**
  - El formulario debe permitir ingresar información estrictamente de acuerdo con el tipo de dato definido para cada campo (alfanumérico, selección, numérico).
- **RN-3.2 (Longitud del NIV):**
  - El campo NIV debe validar de manera estricta que se ingresen exactamente 17 caracteres.
- **RN-3.3 (Campos Obligatorios y Espacios):**
  - Ninguno de los campos puede estar vacío.
  - Se deben eliminar automáticamente los espacios al inicio y al final de los textos (`trim`).
- **RN-3.4 (Placas Únicas):**
  - Validar que no se agreguen placas duplicadas o previamente registradas, tanto al momento de dar de alta como al editar un registro.
- **RN-3.5 (Normalización en Base de Datos):**
  - Al hacer clic en el botón de registrar o guardar, toda la información ingresada debe convertirse y almacenarse **en minúsculas** en la base de datos de Supabase.

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Registro exitoso de una unidad

- **Dado** que el usuario se encuentra en la sección de Unidades y el formulario está limpio
- **Cuando** ingresa una placa alfanumérica única, selecciona una marca, ingresa un modelo numérico, número de motor y un NIV de exactamente 17 caracteres
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema valida que no existan placas duplicadas
- **Y** elimina espacios sobrantes al inicio y final del dato ingresado y normaliza los textos a minúsculas
- **Y** guarda el registro en Supabase
- **Y** actualiza la tabla mostrando la nueva unidad y notifica al usuario que el registro fue exitoso

### Escenario 2: Intento de registro con placa duplicada o NIV inválido

- **Dado** que el usuario ingresa una placa que ya se encuentra registrada en el sistema
- **Cuando** intenta presionar el botón "Registrar"
- **Entonces** el sistema bloquea el registro
- **Y** muestra un mensaje de error indicando la duplicidad de la placa

### Escenario 3: Edición de una unidad

- **Dado** que el usuario visualiza la tabla de unidades
- **Cuando** hace clic en el ícono de "Editar" en una fila
- **Entonces** el formulario se carga con los datos de dicha unidad
- **Y cuando** modifica los datos (asegurando no repetir placas existentes) y presiona "Guardar"
- **Entonces** el sistema valida las reglas de negocio y actualiza el registro en la base de datos y en la tabla

### Escenario 4: Confirmación y eliminación de unidad

- **Dado** que el usuario visualiza la tabla de unidades
- **Cuando** hace clic en el ícono de "Eliminar" en una fila
- **Entonces** el sistema muestra un modal pidiendo confirmación de la eliminación
- **Y cuando** el usuario confirma la acción
- **Entonces** el sistema elimina el registro de Supabase y actualiza la tabla

---

# Módulo 4 - Destinos

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de los destinos que se encuentran activos en la flotilla.

## 2. Requisitos Funcionales (RF)

- **RF-4.1 (CRUD de Destinos):**
  - El usuario debe poder registrar, listar, editar y eliminar destinos mediante un formulario.
- **RF-4.2 (Acciones de Fila):** Cada registro de la tabla debe contar con botones para:
  - **Editar:** Carga los datos del destino en el formulario para su modificación.
  - **Eliminar:** Despliega un modal pidiendo confirmación antes de borrar el registro.

## 3. Estructura del Formulario/Tabla (`destinos`)

| Campo     | Tipo de Dato              | Generación / Requisito | Descripción                              |
| :-------- | :------------------------ | :--------------------- | :--------------------------------------- |
| `id`      | Auto-incrementable / UUID | Automático             | Identificador único del registro         |
| `destino` | Texto                     | Obligatorio / Único    | Nombre del destino                       |
| `km`      | Numérico                  | Obligatorio            | Distancia en kilómetros hacia el destino |

## 4. Contrato JSON de Ejemplo

```JSON
{
"id": "1",
"destino": "seco",
"km": 100
}

```

## 5. Reglas de Validación y Negocio (RN)

- **RN-4.1 (Tipos de Datos Permitidos):**
  - El campo `destino` únicamente acepta letras de la `A` a la `Z` (mayúsculas y minúsculas) y acentos, no acepta caracteres especiales ni números.
  - El campo `km` únicamente acepta valores numéricos.
- **RN-4.2 (Campos Obligatorios):**
  - Ninguno de los dos campos (`destino`, `km`) puede estar vacío.
- **RN-4.3 (Limpieza de Espacios):**
  - Se deben eliminar automáticamente los espacios en blanco al inicio y al final del texto (`trim`) en los campos.
- **RN-4.4 (Destinos Unicos):**
  - Validar que no se agreguen destinos duplicados o previamente registrados, tanto al momento de dar de alta como al editar un registro.
- **RN-4.5 (Normalización en Base de Datos):**
  - Al hacer clic en el botón de registrar o guardar, la información del texto ingresado debe convertirse y almacenarse **en minúsculas** en la base de datos de Supabase.

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Registro exitoso de un destino

- **Dado** que el usuario se encuentra en la sección de Destinos y el formulario está limpio
- **Cuando** ingresa " Seco " en el campo Destino
- **Y** ingresa "100" en el campo Km
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema valida que no sea un destino duplicado
- **Y** elimina espacios sobrantes al inicio y final del nombre
- **Y** convierte el texto a minúsculas ("seco")
- **Y** guarda el registro en Supabase
- **Y** actualiza la tabla mostrando el nuevo destino y notifica al usuario que el registro fue exitoso

### Escenario 2: Intento de registro con destino duplicado o campos vacíos

- **Dado** que el usuario ingresa un nombre de destino que ya existe en la base de datos o deja algún campo vacío
- **Cuando** intenta presionar el botón "Registrar"
- **Entonces** el sistema no permite el envío
- **Y** muestra un mensaje de error indicando la restricción correspondiente

### Escenario 3: Edición de un destino

- **Dado** que el usuario visualiza la tabla de destinos
- **Cuando** hace clic en el ícono de "Editar" en una fila
- **Entonces** el formulario se carga automáticamente con los datos actuales del destino seleccionado
- **Y cuando** modifica los datos (asegurando no duplicar un destino existente) y presiona "Guardar"
- **Entonces** el sistema valida y normaliza la información
- **Y** actualiza el registro en la base de datos y en la tabla

### Escenario 4: Confirmación y eliminación de destino

- **Dado** que el usuario visualiza la tabla de destinos
- **Cuando** hace clic en el ícono de "Eliminar" en una fila
- **Entonces** el sistema despliega un modal pidiendo confirmación para la eliminación
- **Y cuando** el usuario confirma la acción
- **Entonces** el sistema elimina el registro de Supabase
- **Y** actualiza la tabla removiendo la fila correspondiente

---

# Módulo 5 - Bitácora de viajes

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de los viajes realizados en la flotilla, vinculando la información registrada previamente en las secciones de Operadores, Unidades y Destinos.

## 2. Requisitos Funcionales (RF)

- **RF-5.1 (CRUD de Bitácora de Viajes):**
  - El usuario debe poder registrar, consultar, editar y eliminar viajes mediante un formulario interactivo y una tabla de registros.
- **RF-5.2 (Precarga de Datos Referenciados):**
  - Los select del formulario para Operador, Unidad y Destino deben alimentarse dinámicamente de las secciones correspondientes:
  - **Operador:** Muestra primer nombre y primer apellido de los operadores registrados.
  - **Unidad:** Muestra las placas registradas en la sección Unidades.
  - **Destino:** Muestra los destinos registrados en la sección Destinos.
- **RF-5.3 (Acciones de la Tabla):**
  - Cada fila debe incluir botones para:
  - **Editar:** Carga los datos del viaje seleccionado en el formulario para su modificación.
  - **Eliminar:** Muestra un modal de confirmación antes de borrar el registro.

## 3. Estructura del Formulario/Tabla (`bitacora_viajes`)

| Campo          | Tipo de Dato              | Generación / Requisito           | Descripción                                                     |
| :------------- | :------------------------ | :------------------------------- | :-------------------------------------------------------------- |
| `id`           | Auto-incrementable / UUID | Automático                       | Identificador único del viaje                                   |
| `fecha`        | Date                      | Obligatorio                      | Fecha en que se realizó el viaje                                |
| `operador_id`  | Text                      | Obligatorio                      | Identificador del operador (primer nombre y primer apellido)    |
| `unidad_id`    | Text                      | Obligatorio                      | Identificador de la unidad (placas)                             |
| `destino_id`   | Text                      | Obligatorio                      | Identificador del destino                                       |
| `numero_tiros` | Numérico                  | Condicional / Oculto por defecto | Requerido solo si el destino es "Refrigerado" o "Refrigerado C" |

## 4. Contrato JSON de Ejemplo

```JSON
{
"id": "1",
"fecha": "2026-10-27",
"operador_id": "rogelio_chavez",
"unidad_id": "73bg2m",
"destino_id": "celaya",
"numero_tiros": null
}
```

## 5. Reglas de Validación y Negocio (RN)

- **RN-5.1 (Opción Por Defecto en Listas Desplegables):**
  - Todos los componentes de selección (`select`) de Operador, Unidad y Destino deben mostrar como primera opción estática el texto `"Seleccionar opción"`.
- **RN-5.2 (Campos Obligatorios):**
  - Todos los campos visibles del formulario son obligatorios. El formulario no debe permitir el envío si alguna opción permanece en `"Seleccionar opción"` o si la fecha no ha sido seleccionada.
- **RN-5.3 (Visibilidad Dinámica de Número de Tiros):**
  - El campo `Número de tiros` debe iniciar oculto (`hidden`).
  - Debe mostrarse únicamente cuando la opción seleccionada en el campo Destino corresponda a `"Refrigerado"` o `"Refrigerado C"`.
  - Si se cambia el destino a uno distinto de estos dos, el campo debe volver a ocultarse y limpiar su valor.

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Registro exitoso de un viaje estándar

- **Dado** que el usuario está en la sección de Bitácora de viajes y el formulario está limpio con la opción `"Seleccionar opción"` en las listas desplegables
- **Y** el campo "Número de tiros" se encuentra oculto
- **Cuando** selecciona una Fecha
- **Y** selecciona un Operador válido
- **Y** selecciona una Unidad por su placa
- **Y** selecciona un Destino estándar (por ejemplo: "Celaya")
- **Y** presiona el botón "Registrar"
- **Entonces** el sistema valida que todos los campos requeridos estén completos
- **Y** guarda el viaje en Supabase
- **Y** actualiza la tabla de bitácora mostrando el nuevo registro y notifica al usuario que el registro fue exitoso

### Escenario 2: Registro de viaje con destino Refrigerado o Refrigerado C

- **Dado** que el usuario está completando el formulario de registro de viaje
- **Y** en el campo Destino selecciona `"Refrigerado"` o `"Refrigerado C"`
- **Entonces** el sistema hace visible el campo "Número de tiros"
- **Y cuando** ingresa un valor numérico en dicho campo y presiona "Registrar"
- **Entonces** el sistema guarda el registro incluyendo el número de tiros y actualiza la tabla y notifica al usuario que el registro fue exitoso

### Escenario 3: Intento de registro con campos sin seleccionar

- **Dado** que el usuario no selecciona opción en Operador, Unidad o Destino (permanece en `"Seleccionar opción"`)
- **Cuando** intenta presionar el botón "Registrar"
- **Entonces** el sistema impide el registro
- **Y** muestra un mensaje de validación indicando que todos los campos son obligatorios

### Escenario 4: Edición de un registro de viaje

- **Dado** que el usuario visualiza la tabla de bitácora de viajes
- **Cuando** hace clic en el ícono de "Editar" en una fila de la tabla
- **Entonces** el formulario carga automáticamente todos los datos del viaje seleccionado
- **Y si** el destino es "Refrigerado" o "Refrigerado C", muestra el campo "Número de tiros" con su valor actual
- **Y cuando** modifica la información deseada y presiona "Guardar"
- **Entonces** el sistema actualiza el registro en Supabase y refleja los cambios en la tabla

### Escenario 5: Confirmación y eliminación de un registro

- **Dado** que el usuario visualiza la tabla de bitácora de viajes
- **Cuando** hace clic en el ícono de "Eliminar" en una fila
- **Entonces** el sistema despliega un modal pidiendo la confirmación de la eliminación
- **Y cuando** el usuario confirma la acción
- **Entonces** el sistema elimina el registro de Supabase
- **Y** actualiza la tabla removiendo la fila correspondiente

---

# Módulo 6 - Nóminas

## 1. Descripción

Permite generar resúmenes o mensajes de nómina basados en un rango de fechas, filtrando los viajes registrados en la sección Bitácora de viajes.

## 2. Requisitos Funcionales (RF)

- **RF-6.1 (Generación de Nómina por Rango de Fechas):**
  - El usuario debe poder ingresar un rango de fechas (Fecha de inicio y Fecha final) mediante un formulario para consultar y filtrar los viajes realizados en dicho periodo.
- **RF-6.2 (Vista Previa en Textarea):**
  - El resultado del filtrado debe mostrarse en un campo de texto (`textarea`) formateado como un mensaje estructurado (ej. desglose por operador, destino y total de viajes en el periodo) optimizado para WhatsApp.
- **RF-6.3 (Acción de Copiado):**
  -El usuario debe contar con un botón o mecanismo (ej. "Copiar al portapapeles") para copiar de forma rápida el texto generado en el `textarea`.

## 3. Estructura de Datos y Formulario (Filtro)

| Campo          | Tipo de Dato | Generación / Requisito | Descripción                         |
| :------------- | :----------- | :--------------------- | :---------------------------------- |
| `fecha_inicio` | Date         | Obligatorio            | Fecha de inicio del rango a filtrar |
| `fecha_final`  | Date         | Obligatorio            | Fecha final del rango a filtrar     |

## 4. Contrato JSON de Ejemplo (Salida en Textarea)

```
Buen día, esta es la nómina de la semana
Del 10 al 19 de octubre del 2026.

Gerardo Santiago: 1 Celaya
- Lunes Celaya

Julio Soriano: 1 Tlapa
- Lunes Tlapa

Virgilio Gijon: 1 Tlapa
- Lunes Tlapa

Total de viajes en el periodo: 3"
```

## 5. Reglas de Validación y Negocio (RN)

- **RN-6.1 (Campos Obligatorios):**
  - Ninguno de los campos de fecha (`fecha_inicio`, `fecha_final`) puede estar vacío al momento de generar la nómina.
- **RN-6.2 (Estado Inicial del Textarea):**
  - Si el usuario no ha seleccionado un rango de fechas válido, el campo `textarea` debe mostrar por defecto el texto: `"No se ha seleccionado un rango de fechas"`.
- **RN-6.3 (Acción de Copiar):**
  - Al activar la acción de copiado, el contenido actual del `textarea` debe transferirse al portapapeles del dispositivo.

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Estado por defecto sin rango de fechas seleccionado

- **Dado** que el usuario ingresa a la sección de Nóminas y aún no ha seleccionado un rango de fechas
- **Entonces** el campo `textarea` muestra el texto por defecto: `"No se ha seleccionado un rango de fechas"`

### Escenario 2: Generación exitosa de nómina por rango de fechas

- **Dado** que el usuario se encuentra en la sección de Nóminas
- **Cuando** selecciona una Fecha de inicio y una Fecha final válidas
- **Y** el sistema procesa los registros de la Bitácora de viajes que coinciden con el periodo
- **Entonces** el sistema genera y muestra en el `textarea` el mensaje estructurado con el desglose de operadores, destinos y el total de viajes correspondientes
- **Y** habilita la opción de copiar el texto al portapapeles

### Escenario 3: Intento de generar nómina con campos de fecha vacíos

- **Dado** que el usuario deja vacía alguna de las fechas del formulario
- **Cuando** intenta generar el reporte de nómina
- **Entonces** el sistema impide la generación y muestra un aviso de validación indicando que los campos son obligatorios

### Escenario 4: Copiar el texto de la nómina generada

- **Dado** que el `textarea` muestra un resumen de nómina generado correctamente a partir de un rango de fechas
- **Cuando** el usuario hace clic en el botón de copiar (ej. "Copiar al portapapeles")
- **Entonces** el contenido del mensaje se copia exitosamente al portapapeles del usuario para su uso en WhatsApp

---

# Módulo 7 - Estadísticas

## 1. Descripción

Permite visualizar las estadísticas generales y métricas consolidadas de cada sección del sistema mediante tarjetas de resumen y tablas analíticas detalladas.

## 2. Requisitos Funcionales (RF)

- **RF-7.1 (Tarjetas de Resumen General):**
  - El sistema debe mostrar tarjetas superiores con los indicadores globales del sistema: Total de Viajes, Destinos, Operadores y Unidades.
- **RF-7.2 (Tablas de Estadísticas Detalladas):**
  - El usuario debe poder consultar tablas desglosadas por categoría:
  - **Viajes por Destino:** Muestra por destino la cantidad de viajes y porcentaje de participación.
  - **Viajes por Operador:** Muestra por operador la cantidad de viajes y porcentaje.
  - **Viajes por Unidad:** Muestra por placas de la unidad la cantidad de viajes y porcentaje.
  - **Viajes por Número de Tiros:** Muestra por clasificación por número de tiros la cantidad de viajes y porcentaje.

## 3. Estructura de Datos y Métricas (KPI Cards)

| Métrica            | Tipo de Dato | Origen / Cálculo                                     |
| :----------------- | :----------- | :--------------------------------------------------- |
| `total_viajes`     | Numérico     | Conteo total de registros en `bitacora_viajes`       |
| `total_destinos`   | Numérico     | Conteo total de registros en la sección `destinos`   |
| `total_operadores` | Numérico     | Conteo total de registros en la sección `operadores` |
| `total_unidades`   | Numérico     | Conteo total de registros en la sección `unidades`   |

## 4. Contrato JSON de Ejemplo (Estructura analítica)

```json
{
  "kpis": {
    "total_viajes": 1304,
    "destinos": 8,
    "operadores": 14,
    "unidades": 13
  },
  "viajes_por_destino": [
    {
      "id": 1,
      "destino": "refrigerado",
      "viajes": 613,
      "porcentaje": "47.0%"
    },
    {
      "id": 2,
      "destino": "refrigerado c",
      "viajes": 124,
      "porcentaje": "35.0%"
    }
  ]
}
```

## 5. Reglas de Validación y Negocio (RN)

- **RN-7.1 (Cálculo Automático):** Los contadores de las tarjetas de resumen y los valores de las tablas estadísticas deben calcularse de forma dinámica y automática a partir de los datos persistidos en Supabase.
- **RN-7.2 (Cálculo de Porcentajes):** Las tablas analíticas deben calcular y mostrar el porcentaje proporcional que representa cada categoría respecto al total general de viajes, formateado con un decimal (ej. `47.0%`).

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Visualización correcta de tarjetas de resumen

- **Dado** que el usuario ingresa a la sección de Estadísticas
- **Cuando** el sistema carga la información desde la base de datos
- **Entonces** muestra en la parte superior las tarjetas con los totales globales correspondientes (ej. Total Viajes: X, Destinos: X, Operadores: X, Unidades: X)

### Escenario 2: Visualización y paginación de tablas estadísticas

- **Dado** que el usuario visualiza las tablas analíticas en la sección de Estadísticas
- **Cuando** revisa las tablas de "Viajes por Destino", "Viajes por Operador", "Viajes por Unidad" y "Viajes por Número de Tiros"
- **Entonces** observa el desglose de registros con su respectiva cantidad, porcentaje calculado y controles de paginación funcionales
