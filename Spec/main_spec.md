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

# Guía Global de Diseño y Estándares de IU (UI/UX)

## 1. Objetivo y alcance

Esta guía define los estándares visuales e interactivos obligatorios para **todos los módulos del sistema**: Autenticación, Operadores, Unidades, Destinos, Bitácora de viajes, Nóminas y Estadísticas.

Sus reglas son transversales: cualquier componente nuevo o modificado debe cumplirlas, sin importar el módulo al que pertenezca. En caso de conflicto entre una decisión visual puntual y esta guía, prevalece la guía global.

## 2. Comportamiento de botones

- **UI-01 (Cursor interactivo):** Todo elemento accionable que se comporte como botón (`<button>`, enlaces de acción o componentes equivalentes) debe mostrar obligatoriamente `cursor-pointer` al pasar el cursor.
- **UI-01.1 (Excepción de estado deshabilitado):** Cuando el botón esté deshabilitado o en estado de carga, debe mostrar `cursor-not-allowed` y no ejecutar acciones.
- **UI-02 (Hover sutil):** Todo botón interactivo debe tener un efecto de hover perceptible pero sutil, acompañado de una transición suave (por ejemplo, `transition-colors`).
- **UI-02.1 (Hover coherente con la variante):** El hover debe reforzar la función del botón: oscurecer o intensificar ligeramente su color de fondo, borde o texto, sin cambios bruscos ni animaciones excesivas.
- **UI-03 (Foco visible):** Todos los botones deben conservar un indicador de foco visible (`focus-visible`) para navegación por teclado.
- **UI-04 (Consistencia):** Las acciones equivalentes deben usar el mismo componente y la misma variante visual en toda la aplicación.

## 3. Acciones de tabla basadas en íconos

Los botones de acción de las tablas deben ser minimalistas, basados en íconos, con tooltip flotante y hover sutil. No se usan botones con texto ni fondos sólidos permanentes en la columna `Acciones`.

| Acción | Ícono | Color base | Hover |
| :--- | :--- | :--- | :--- |
| **Editar** | Lápiz | Azul (`text-sky-600`) | Fondo azul tenue (`hover:bg-sky-50`) y texto `hover:text-sky-700` |
| **Eliminar** | Bote de basura | Rojo (`text-red-600`) | Fondo rojo tenue (`hover:bg-red-50`) y texto `hover:text-red-700` |
| **Acción principal** | Ícono + texto | Color de marca sólido | Tono de marca más oscuro |
| **Acción neutra/secundaria** | Texto o ícono | Neutro suave o blanco | Fondo neutro ligeramente más oscuro |

- **UI-05 (Semántica del color):** El azul se reserva para acciones constructivas o de edición; el rojo se reserva para eliminación o acciones destructivas. En la tabla, ambos se expresan con el color del ícono y un fondo tenue solo en hover.
- **UI-06 (Contraste):** La combinación de fondo, borde y texto debe mantener contraste suficiente para ser legible, incluso en su estado de hover.
- **UI-07 (Confirmación destructiva):** La eliminación siempre requiere confirmación en un modal. El botón que confirma la eliminación usa rojo sólido para reforzar la advertencia.
- **UI-07.1 (Tooltips):** Los botones de acción basados en íconos deben mostrar un tooltip flotante con el nombre de la acción (`Editar` / `Eliminar`) al pasar el cursor o al recibir foco por teclado.

## 4. Limpieza en modales de formulario

- **UI-08 (Sin texto redundante al pie):** Los modales de formulario deben mantenerse limpios. No deben incluir textos de ayuda, descripciones redundantes ni párrafos explicativos al final del formulario.
- **UI-09 (Información esencial):** La información necesaria debe comunicarse mediante etiquetas claras, marcadores de posición, campos obligatorios y mensajes de validación junto al campo correspondiente.
- **UI-10 (Descripción del modal):** El encabezado del modal puede incluir una descripción breve únicamente cuando aporte contexto indispensable; no debe repetir el título ni explicar reglas ya visibles en el formulario.
- **UI-11 (Excepción de confirmación):** Los modales de confirmación de acciones destructivas sí pueden incluir una advertencia breve sobre la irreversibilidad o el impacto de la acción.
- **UI-11.1 (Encabezado de tarjeta):** El encabezado de una tarjeta de catálogo debe mostrar únicamente el título y, a la derecha, la acción principal. No se permiten subtítulos redundantes que repitan la función evidente de la tabla.

## 5. Estándares complementarios

- **UI-12 (Responsive):** Toda vista debe adaptarse a desktop y mobile. Las tablas de catálogos conservan su estructura en pantallas pequeñas y se envuelven en un contenedor con desplazamiento horizontal (`overflow-x-auto`), preservando la misma información, acciones y altura mínima.
- **UI-13 (Accesibilidad):** Los botones con icono o acciones repetidas deben incluir `aria-label` descriptivo. Los modales deben declarar título accesible.
- **UI-14 (Columnas de tabla):** Las tablas de catálogos deben presentar columnas separadas y explícitas por campo, con un número consecutivo de fila (`N°`) y una columna final de `Acciones`.
- **UI-15 (Reutilización):** Las reglas visuales deben implementarse en los componentes compartidos de UI (`Button`, `Dialog`, toasts, paginación, etc.) para que los módulos las hereden automáticamente.
- **UI-16 (Paginación minimalista):** Las tablas de catálogos muestran un máximo de **5 registros por página**; el resto se distribuye en la paginación. El número de la página activa debe mostrarse como texto plano, sin fondo sólido. La barra de paginación permanece visible también en el estado vacío. El conteo de registros se expresa de forma directa como `Mostrando X de Y operadores`, donde `X` es la cantidad de registros visibles en la página actual e `Y` el total de registros filtrados.
- **UI-17 (Altura mínima de tabla):** El cuerpo de la tabla debe conservar una altura mínima calculada equivalente a 5 filas compactas, con el fin de evitar saltos visuales al cambiar de página o filtrar cuando hay menos registros.
- **UI-18 (Estado vacío):** Cuando no haya registros o la búsqueda no devuelva resultados, la cabecera de la tabla debe permanecer visible. El cuerpo muestra un ícono centrado, el título `No se encontraron operadores` y un subtítulo contextual.
- **UI-19 (Barra de navegación superior modular):** Las pestañas de los módulos (`Operadores`, `Unidades`, `Destinos`, `Bitácora`, `Nómina`, `Estadísticas`) se agrupan dentro de un contenedor general sutil, redondeado y con fondo gris claro (`bg-slate-100`), que delimita visualmente el grupo. La pestaña activa se muestra como un bloque blanco con texto e ícono en azul institucional y una sombra sutil. Las pestañas inactivas muestran su ícono y tipografía en gris obscuro (`text-slate-600`) sobre el fondo gris claro del contenedor, garantizando contraste. Las pestañas de módulos aún no disponibles se muestran deshabilitadas con la leyenda `Próximamente`.
- **UI-20 (Encabezados limpios):** La barra de título de una sección muestra únicamente el nombre del módulo a la izquierda y la acción principal a la derecha. No se permiten subtítulos redundantes.
- **UI-21 (Búsqueda a ancho completo):** El input de búsqueda debe ocupar el 100% del ancho disponible de la tarjeta o contenedor y usar un marcador de posición descriptivo de los campos consultados. No lleva etiqueta flotante visible: únicamente el input y su marcador de posición.
- **UI-22 (Marca en la barra superior):** La barra superior muestra únicamente el nombre `TruckingControl`, con tipografía de mayor presencia visual (`text-xl`). No se muestra texto secundario, subtítulo ni leyenda debajo de la marca.
- **UI-23 (Jerarquía del título de sección):** El título de la sección debe renderizarse como un encabezado propio (`h3`) con exactamente las clases tipográficas `text-2xl leading-none font-bold tracking-tight`, sin clases heredadas de componentes compartidos ni utilidades repetidas o conflictivas de tamaño o peso. Se conserva el color neutro oscuro del texto. Para la adaptabilidad, se añaden únicamente las utilidades de visibilidad responsive `hidden md:block`: oculto en móvil (`< md`) y visible desde `md`.
- **UI-24 (Búsqueda sin etiqueta):** El campo de búsqueda de catálogos no muestra la etiqueta flotante `Buscar` encima del input; su función se comunica mediante el marcador de posición descriptivo.
- **UI-25 (Distribución de la barra superior):** La barra superior se distribuye en tres zonas: la marca a la izquierda, el contenedor de módulos al centro y el botón de sesión a la derecha. Debe existir una separación suficiente entre la marca y el contenedor de módulos (`gap-4` en móvil y `gap-8` en escritorio), el contenedor de módulos se expande (`flex-1`) y centra sus pestañas en el espacio disponible entre ambos extremos, y el botón de sesión conserva un margen derecho (`md:mr-4`) para no quedar pegado al borde de la ventana.
- **UI-26 (Navbar móvil):** En pantallas menores a `md` se oculta la barra horizontal de pestañas. La barra superior móvil muestra un botón de menú hamburguesa alineado a la izquierda y la marca `TruckingControl` centrada. A partir de `md` se conserva intacto el header de escritorio con marca a la izquierda, pestañas horizontales al centro y botón de sesión a la derecha.
- **UI-27 (Menú hamburguesa a pantalla completa):** Al desplegarse, el menú móvil se presenta como un drawer fijo (`fixed inset-0`) que ocupa el 100% del ancho y alto de la pantalla, cubriendo todo el contenido inferior con una capa de navegación independiente. Incluye una barra superior propia con el botón de cierre (`X`) accesible y la marca `TruckingControl` centrada. El cuerpo muestra una lista vertical con todas las secciones (`Operadores`, `Unidades`, `Destinos`, `Bitácora`, `Nómina`, `Estadísticas`), conservando los mismos estilos de la sección activa (bloque blanco con texto e ícono en azul) e inactivas (texto e ícono en gris obscuro sobre fondo gris claro), con desplazamiento interno si el contenido excede la altura. Al fondo del drawer se muestra el botón `Cerrar sesión`, siempre visible. El menú se cierra al pulsar la `X` o al seleccionar una sección disponible, y el scroll del documento de fondo queda bloqueado mientras está abierto.
- **UI-28 (Cuerpo móvil):** En pantallas menores a `md` el título de la sección se oculta y el botón de acción principal y el input de búsqueda se disponen en columna (`flex-col`), ocupando ambos el 100% del ancho del contenedor con un espaciado uniforme (`gap`).
- **UI-29 (Cuerpo de escritorio):** A partir de `md` se conserva la estructura de escritorio: título de la sección a la izquierda, botón de acción principal a la derecha e input de búsqueda a ancho completo debajo.

## 6. Criterios de Aceptación (BDD / Gherkin)

### Escenario 1: Hover y cursor en botones interactivos

- **Dado** que el usuario visualiza cualquier botón interactivo del sistema
- **Cuando** coloca el cursor sobre él
- **Entonces** el cursor cambia a mano (`cursor-pointer`)
- **Y** el botón muestra un cambio de color sutil con transición suave
- **Y** al deshabilitarse, el cursor cambia a `not-allowed`

### Escenario 2: Botones de acción basados en íconos

- **Dado** que el usuario visualiza la columna de acciones de una tabla
- **Cuando** observa el botón "Editar"
- **Entonces** este muestra únicamente un ícono de lápiz en color azul
- **Y** al pasar el cursor muestra el tooltip "Editar" y un fondo azul tenue
- **Y** el botón "Eliminar" muestra un ícono de bote de basura en color rojo
- **Y** al pasar el cursor muestra el tooltip "Eliminar" y un fondo rojo tenue
- **Y** ambos conservan `cursor-pointer` y un hover suave

### Escenario 3: Modal de formulario limpio

- **Dado** que el usuario abre un modal para crear o editar un registro
- **Cuando** el formulario se muestra
- **Entonces** no aparece texto de ayuda ni descripción redundante al pie del formulario
- **Y** la información necesaria se comunica mediante etiquetas, marcadores y validaciones junto a cada campo

### Escenario 4: Navegación superior modular

- **Dado** que el usuario se encuentra en el módulo de Operadores
- **Cuando** observa la barra superior
- **Entonces** las pestañas de los módulos se agrupan en un contenedor general sutil con fondo gris claro
- **Y** la pestaña "Operadores" se muestra activa como un bloque blanco con texto azul e ícono azul
- **Y** las demás pestañas se muestran con ícono y texto en gris obscuro sobre el fondo gris claro del contenedor
- **Y** las pestañas de módulos aún no disponibles aparecen deshabilitadas con la leyenda `Próximamente`
- **Y** el encabezado de la sección muestra únicamente el título "Operadores" y el botón "Nuevo Operador" a la derecha

### Escenario 5: Encabezado, búsqueda y conteo finales

- **Dado** que el usuario se encuentra en el módulo de Operadores
- **Cuando** observa la barra superior
- **Entonces** la marca `TruckingControl` se muestra con mayor presencia visual y sin el texto "Administración de flotilla"
- **Y** el título de la sección "Operadores" se renderiza con exactamente las clases `text-2xl leading-none font-bold tracking-tight`, sin clases conflictivas ni repetidas
- **Y** el campo de búsqueda muestra únicamente el input a ancho completo con el marcador "Buscar por nombres, apellido paterno o materno...", sin la etiqueta "Buscar"
- **Y** el pie de la tarjeta muestra el conteo en formato `Mostrando X de Y operadores`, sin rangos

### Escenario 6: Distribución equilibrada de la barra superior

- **Dado** que el usuario se encuentra en el módulo de Operadores en una pantalla de escritorio
- **Cuando** observa la barra superior
- **Entonces** la marca `TruckingControl` y el contenedor de módulos mantienen una separación visible sin encimarse
- **Y** el contenedor de módulos se muestra centrado en el espacio disponible entre la marca y el botón de sesión
- **Y** el botón "Cerrar sesión" conserva un margen derecho que lo separa del borde de la ventana

### Escenario 7: Navbar responsive y menú hamburguesa

- **Dado** que el usuario accede al sistema desde un dispositivo móvil (`< md`)
- **Cuando** observa la barra superior
- **Entonces** la barra horizontal de pestañas no se muestra
- **Y** se muestra el botón de menú hamburguesa a la izquierda y la marca `TruckingControl` centrada
- **Cuando** el usuario pulsa el botón hamburguesa
- **Entonces** se despliega un drawer fijo a pantalla completa que cubre todo el contenido inferior
- **Y** el drawer muestra una barra superior con el botón de cierre (`X`) accesible y la marca `TruckingControl` centrada
- **Y** se muestra una lista vertical con las secciones `Operadores`, `Unidades`, `Destinos`, `Bitácora`, `Nómina` y `Estadísticas`
- **Y** la sección activa conserva el estilo de bloque blanco con texto e ícono en azul
- **Y** las secciones inactivas conservan el texto y el ícono en gris obscuro sobre el fondo gris claro
- **Y** al fondo del drawer se muestra el botón `Cerrar sesión`
- **Y** al pulsar la `X` el drawer se cierra y el contenido vuelve a ser visible
- **Y** en pantallas de escritorio (`>= md`) el header mantiene su estructura intacta

### Escenario 8: Cuerpo de la página en móvil

- **Dado** que el usuario se encuentra en el módulo de Operadores desde un dispositivo móvil (`< md`)
- **Cuando** observa el cuerpo de la página
- **Entonces** el título "Operadores" no se muestra
- **Y** el botón "Nuevo Operador" y el input de búsqueda se muestran en columna, cada uno al 100% del ancho con espaciado entre ellos
- **Y** la tabla se muestra dentro de un contenedor con desplazamiento horizontal (`overflow-x-auto`), conservando su altura mínima y estructura
- **Y** en pantallas de escritorio (`>= md`) se mantiene el título a la izquierda, el botón a la derecha y el input de búsqueda a ancho completo

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

Permite la gestión (alta, consulta, edición y eliminación) de los operadores de la flotilla. El borrado es físico y definitivo.

## 2. Requisitos Funcionales (RF)

- **RF-2.1 (CRUD de Operadores):** El usuario debe poder registrar, listar, editar y eliminar operadores de la flotilla.
- **RF-2.2 (Acciones de Registro):** Cada fila de la tabla debe contar con botones de acción para:
  - **Editar:** Carga los datos del operador en el formulario para su modificación y debe actualizar la tabla con el registro modificado.
  - **Eliminar:** Muestra un modal de confirmación antes de borrar el registro. Al confirmar, ejecuta un `DELETE` real en Supabase, actualiza la tabla removiendo la fila y conserva intactos los viajes históricos de la bitácora.

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
- **RN-2.5 (Borrado físico):**
  - No existe campo de estatus ni baja lógica para operadores.
  - El botón "Eliminar" ejecuta un `DELETE` real en la tabla `operadores`, previa confirmación en un modal.
  - Los viajes históricos permanecen intactos porque la bitácora guarda un snapshot del operador y no depende de la fila del catálogo.

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
- **Entonces** el sistema ejecuta un `DELETE` real del registro en Supabase
- **Y** actualiza la tabla removiendo la fila correspondiente
- **Y** los viajes históricos de la bitácora permanecen intactos

---

# Módulo 3 - Unidades

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de las unidades registradas en la flotilla.

## 2. Requisitos Funcionales (RF)

- **RF-3.1 (CRUD de Unidades):** El usuario debe poder registrar, listar, editar y eliminar unidades de la flotilla.
- **RF-3.2 (Acciones de Registro):** Cada fila de la tabla debe contar con botones de acción para:
  - **Editar:** Carga los datos de la unidad en el formulario para su modificación y debe actualizar la tabla con el registro modificado.
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

## 6. Interfaz y comportamiento responsive

La sección Unidades hereda estrictamente la plantilla maestra definida en las reglas UI-19 a UI-29 y en el Módulo 2 (Operadores):

- **Controles superiores:** el título `Unidades` se oculta en pantallas menores a `md`. El botón principal `Nueva Unidad` y el campo de búsqueda se apilan en columna al 100% del ancho con espaciado uniforme; desde `md` el título queda a la izquierda y el botón a la derecha.
- **Búsqueda:** input de búsqueda sin etiqueta flotante, a ancho completo, con el marcador de posición `Buscar por placas, marca, modelo, no. motor o NIV...`.
- **Tabla:** columnas `N°`, `Placas`, `Marca`, `Modelo`, `No. Motor`, `NIV` y `Acciones`. Se muestra dentro de un contenedor con desplazamiento horizontal (`overflow-x-auto`), alto mínimo estable de `220px` y un máximo de 5 registros por página. Los identificadores largos (`Placas`, `No. Motor` y `NIV`) se muestran completos, sin partirse ni truncarse, y la tabla se expande horizontalmente cuando el ancho no alcanza. La paginación inferior usa números limpios y el conteo `Mostrando X de Y`.
- **Acciones de fila:** se conserva la plantilla de Operadores: íconos de editar (azul) y eliminar (rojo) con tooltip, hover tenue y `cursor-pointer`.
- **Formulario:** diálogo con los campos Placas, Marca (Freightliner, International, Chevrolet), Modelo, No. Motor y NIV. Todos los textos se normalizan con `trim` y minúsculas; el NIV se limita a 17 caracteres.
- **Eliminación:** el modal advierte que la unidad se elimina permanentemente del catálogo y que los viajes históricos de la bitácora se conservan mediante el snapshot de sus placas.
- **Sincronización:** altas, ediciones y eliminaciones se reflejan en tiempo real mediante `useRealtimeCollection` sobre la tabla `unidades`.

## 7. Criterios de Aceptación (BDD / Gherkin)

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
- **Y** advierte que la unidad se eliminará permanentemente del catálogo
- **Y cuando** el usuario confirma la acción
- **Entonces** el sistema ejecuta un `DELETE` real del registro en Supabase y actualiza la tabla
- **Y** los viajes históricos de la bitácora permanecen intactos gracias al snapshot de las placas de la unidad

---

# Módulo 4 - Destinos

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de los destinos registrados en la flotilla.

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
  - El campo `destino` únicamente acepta letras de la `A` a la `Z` (mayúsculas y minúsculas), acentos y espacios simples entre palabras; no acepta caracteres especiales ni números.
  - El campo `km` únicamente acepta valores numéricos mayores que cero.
- **RN-4.2 (Campos Obligatorios):**
  - Ninguno de los dos campos (`destino`, `km`) puede estar vacío.
- **RN-4.3 (Limpieza de Espacios):**
  - Se deben eliminar automáticamente los espacios en blanco al inicio y al final del texto (`trim`) en los campos.
- **RN-4.4 (Destinos Unicos):**
  - Validar que no se agreguen destinos duplicados o previamente registrados, tanto al momento de dar de alta como al editar un registro.
- **RN-4.5 (Normalización en Base de Datos):**
  - Al hacer clic en el botón de registrar o guardar, la información del texto ingresado debe convertirse y almacenarse **en minúsculas** en la base de datos de Supabase.

## 6. Interfaz y comportamiento responsive

La sección Destinos hereda estrictamente la plantilla maestra definida en las reglas UI-19 a UI-29 y en el Módulo 2 (Operadores):

- **Controles superiores:** el título `Destinos` se oculta en pantallas menores a `md`. El botón principal `Nuevo Destino` y el campo de búsqueda se apilan en columna al 100% del ancho con espaciado uniforme; desde `md` el título queda a la izquierda y el botón a la derecha.
- **Búsqueda:** input sin etiqueta flotante, a ancho completo, con el marcador de posición `Buscar por destino o kilómetros...`.
- **Tabla:** columnas `N°`, `Destino`, `Km` y `Acciones`. Se muestra dentro de un contenedor con desplazamiento horizontal (`overflow-x-auto`), alto mínimo estable de `220px` y un máximo de 5 registros por página. La paginación inferior usa números limpios y el conteo `Mostrando X de Y`.
- **Acciones de fila:** se conserva la plantilla de Operadores: íconos de editar (azul) y eliminar (rojo) con tooltip, hover tenue y `cursor-pointer`.
- **Formulario:** diálogo con los campos Destino y Km. El destino se normaliza con `trim` y minúsculas, y admite letras, acentos y espacios simples entre palabras; los kilómetros deben ser mayores que cero.
- **Columna derivada:** `requiere_tiros` existe en la base de datos como columna generada para la futura Bitácora, pero no se muestra en la tabla de Destinos.
- **Eliminación:** el modal advierte que el destino se elimina permanentemente del catálogo y que los viajes históricos de la bitácora se conservan mediante el snapshot del destino y los tiros capturados.
- **Sincronización:** altas, ediciones y eliminaciones se reflejan en tiempo real mediante `useRealtimeCollection` sobre la tabla `destinos`.

## 7. Criterios de Aceptación (BDD / Gherkin)

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
- **Y** advierte que el destino se eliminará permanentemente del catálogo
- **Y cuando** el usuario confirma la acción
- **Entonces** el sistema ejecuta un `DELETE` real del registro en Supabase
- **Y** actualiza la tabla removiendo la fila correspondiente
- **Y** los viajes históricos de la bitácora permanecen intactos gracias al snapshot del destino y de los tiros capturados

---

# Módulo 5 - Bitácora de viajes

## 1. Descripción

Permite la gestión (alta, consulta, edición y eliminación) de los viajes realizados en la flotilla, vinculando la información registrada previamente en las secciones de Operadores, Unidades y Destinos mediante snapshots históricos.

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
| `operador_id`  | Text                      | Obligatorio                      | Snapshot histórico del operador (primer nombre y primer apellido); no depende de la tabla `operadores` |
| `unidad_id`    | Text                      | Obligatorio                      | Snapshot histórico de las placas de la unidad; no depende de la tabla `unidades` |
| `destino_id`   | Text                      | Obligatorio                      | Snapshot histórico del nombre del destino; no depende de la tabla `destinos` |
| `numero_tiros` | Numérico                  | Condicional / Oculto por defecto | Requerido solo si el destino contiene la palabra "refrigerado" (sin distinguir mayúsculas ni acentos) |

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
  - Debe mostrarse únicamente cuando el destino seleccionado contenga la palabra `"refrigerado"` en cualquier posición, sin distinguir mayúsculas, minúsculas ni acentos (por ejemplo: `"Celaya Refrigerado"`, `"Refrigerado Tlapa"` o `"Refrigerado C"`).
  - Si se cambia el destino a uno que no contenga `"refrigerado"`, el campo debe volver a ocultarse y limpiar su valor, enviándose como `null`.
- **RN-5.4 (Independencia histórica de los catálogos):**
  - La bitácora guarda snapshots de texto: `operador_id` con `"nombre apellido_paterno"`, `unidad_id` con las placas y `destino_id` con el nombre del destino.
  - No mantiene llaves foráneas hacia `operadores`, `unidades` ni `destinos`.
  - Si cualquiera de esos registros se elimina físicamente del catálogo, los viajes históricos permanecen consultables y se incluyen en nóminas y estadísticas.

## 6. Interfaz y comportamiento responsive

La sección Bitácora hereda estrictamente la plantilla maestra definida en las reglas UI-19 a UI-29 y en el Módulo 2 (Operadores):

- **Controles superiores:** el título `Bitácora` se oculta en pantallas menores a `md`. El botón principal `Nuevo Viaje` y el campo de búsqueda se apilan en columna al 100% del ancho con espaciado uniforme; desde `md` el título queda a la izquierda y el botón a la derecha.
- **Búsqueda:** input sin etiqueta flotante, a ancho completo, con el marcador de posición `Buscar por fecha, operador, unidad o destino...`.
- **Tabla:** columnas `N°`, `Fecha`, `Operador`, `Unidad`, `Destino`, `Tiros` y `Acciones`. Se muestra dentro de un contenedor con desplazamiento horizontal (`overflow-x-auto`), alto mínimo estable de `220px` y un máximo de 5 registros por página. La columna `Tiros` siempre está visible y muestra `—` cuando el viaje no tiene tiros. La paginación inferior usa números limpios y el conteo `Mostrando X de Y`.
- **Orden:** los viajes se muestran por fecha descendente y, en empate, por creación más reciente.
- **Acciones de fila:** se conserva la plantilla de Operadores: íconos de editar (azul) y eliminar (rojo) con tooltip, hover tenue y `cursor-pointer`.
- **Formulario:** diálogo con Fecha, Operador, Unidad, Destino y el campo condicional Número de tiros. Los tres selects muestran `"Seleccionar opción"` como primera opción y se alimentan de los catálogos registrados.
- **Snapshots históricos en edición:** si el operador, la unidad o el destino de un viaje ya no existe en su catálogo, el formulario conserva el valor histórico como opción para no perder el dato.
- **Sincronización:** altas, ediciones y eliminaciones se reflejan en tiempo real mediante `useRealtimeCollection` sobre la tabla `bitacora_viajes`.

## 7. Criterios de Aceptación (BDD / Gherkin)

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

### Escenario 2: Registro de viaje con destino refrigerado

- **Dado** que el usuario está completando el formulario de registro de viaje
- **Y** en el campo Destino selecciona uno que contiene la palabra `"refrigerado"` (por ejemplo `"Refrigerado"`, `"Refrigerado C"` o `"Celaya Refrigerado"`)
- **Entonces** el sistema hace visible el campo "Número de tiros"
- **Y cuando** ingresa un valor numérico mayor que cero en dicho campo y presiona "Registrar"
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
- **Y si** el destino contiene la palabra `"refrigerado"`, muestra el campo "Número de tiros" con su valor actual
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
