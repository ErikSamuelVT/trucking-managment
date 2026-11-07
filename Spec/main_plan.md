# Plan General de Arquitectura — TruckingControl

- **Proyecto:** Trucking Managment
- **Documento:** Plan General de Arquitectura (fase Planificar)
- **Versión:** 4.0
- **Estado:** Aprobado
- **Basado en:** `Spec/main_spec.md`
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Realtime)
- **Cambio principal v4.0:** autenticación propia sin correo electrónico, con tabla nativa `cuentas` y contraseñas hasheadas.

---

## 1. Decisiones finales

| Tema | Decisión |
| :--- | :--- |
| Framework | Next.js App Router + TypeScript |
| Estilos y UI | Tailwind CSS + componentes propios (sin shadcn) |
| Estado | Carga inicial en Server Components + hook propio de Realtime + `useState` |
| Formularios | React Hook Form + Zod |
| Persistencia | Supabase PostgreSQL + Realtime |
| Autenticación | Propia, **sin correo electrónico**: usuario + contraseña contra la tabla nativa `cuentas` |
| Hash de contraseña | `bcrypt` (`bcryptjs`, costo 10–12) ejecutado en Server Actions; alternativa equivalente con `pgcrypto` |
| Sesión | JWT propio firmado con `SUPABASE_JWT_SECRET`, guardado en cookie `httpOnly`; Supabase lo acepta como rol `authenticated` |
| Autorización de datos | RLS con rol `authenticated`; `cuentas` es de acceso exclusivo del servidor |
| Claves primarias | UUID (`gen_random_uuid()`) |
| Borrado de catálogos | Operadores: físico (`DELETE`). Unidades y destinos: lógico (`activo = false`). La bitácora conserva un snapshot del operador y no depende de su existencia |
| Número de tiros | Obligatorio si el destino contiene la palabra "refrigerado" |
| Nóminas | Cálculo al momento, sin persistencia |
| Estadísticas | Snapshot único en base de datos, refresco perezoso al visitar |
| KPIs de catálogos | Unidades y destinos activos; operadores registrados (sin estatus) |
| Roles | Sin roles ni privilegios (datos compartidos por todos los usuarios autenticados) |

> **Nota:** la especificación menciona "6 secciones", pero enumera 7 módulos contando Autenticación. Este plan cubre los 7 módulos.

---

## 2. Arquitectura y patrón por módulo

Cada módulo sigue el mismo flujo:

```txt
página (Server Component: carga inicial)
  → hook useRealtimeCollection (estado local + suscripción)
    → componentes de UI propios
      → Server Action (mutación)
        → Zod (validación en servidor)
          → PostgreSQL (CHECK + trigger + RLS como última defensa)
```

La UI solo usa el cliente Supabase para Realtime; las mutaciones pasan por Server Actions. Las reglas de negocio se validan dos veces: Zod en el servidor y restricciones/triggers en la base de datos.

**Frontera de autenticación:**

```txt
Formulario (cliente)
  → Server Action (módulo auth)
    → normalización + Zod
      → bcrypt / consulta a `cuentas` con cliente admin (solo servidor)
        → cookie de sesión httpOnly (JWT firmado)
          → middleware valida JWT en cada navegación
            → RLS de Supabase recibe el JWT como rol `authenticated`
```

Ninguna consulta a `cuentas` se hace desde el navegador y el hash nunca sale del servidor. No existe flujo de correo electrónico en ningún punto.

---

## 3. Estructura de carpetas y módulos

```txt
trucking-managment/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                  # root layout, fuentes y providers
│  │  ├─ globals.css
│  │  ├─ page.tsx                    # redirección según sesión
│  │  ├─ (auth)/
│  │  │  ├─ layout.tsx               # layout centrado, sin shell
│  │  │  ├─ login/page.tsx
│  │  │  ├─ registro/page.tsx
│  │  │  └─ recuperar/page.tsx       # solicitud + nueva contraseña en dos pasos
│  │  ├─ (dashboard)/
│  │  │  ├─ layout.tsx               # guard de sesión + shell responsive
│  │  │  ├─ operadores/page.tsx
│  │  │  ├─ unidades/page.tsx
│  │  │  ├─ destinos/page.tsx
│  │  │  ├─ bitacora/page.tsx
│  │  │  ├─ nominas/page.tsx
│  │  │  └─ estadisticas/page.tsx
│  │  └─ api/
│  │     └─ sesion/token/route.ts    # token de Realtime para el cliente
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ components/              # login-form, registro-form, recuperar-form
│  │  │  ├─ schemas/                 # cuenta.schema.ts
│  │  │  ├─ lib/
│  │  │  │  ├─ hash.ts               # bcrypt hash / compare
│  │  │  │  └─ session.ts            # firmar/verificar JWT, cookies
│  │  │  └─ actions/
│  │  │     ├─ cuenta.actions.ts     # registro
│  │  │     ├─ sesion.actions.ts     # login / logout
│  │  │     └─ recuperar.actions.ts  # verificar usuario y restablecer
│  │  ├─ operadores/
│  │  │  ├─ components/              # operador-form, operadores-table, delete-dialog
│  │  │  ├─ hooks/use-operadores.ts
│  │  │  ├─ actions/operador.actions.ts
│  │  │  ├─ schemas/operador.schema.ts
│  │  │  ├─ services/operador.service.ts
│  │  │  └─ types.ts
│  │  ├─ unidades/                   # misma anatomía
│  │  ├─ destinos/                   # misma anatomía
│  │  ├─ bitacora/                   # misma anatomía + lógica de número de tiros
│  │  ├─ nominas/
│  │  │  └─ lib/{generar-nomina.ts, plantilla.ts}
│  │  └─ estadisticas/
│  │     ├─ components/
│  │     ├─ hooks/use-estadisticas.ts
│  │     └─ services/estadisticas.service.ts
│  ├─ components/
│  │  ├─ ui/                         # Button, Input, Select, Textarea, Dialog, Table,
│  │  │                              # Card, Badge, Toast, Pagination, Skeleton
│  │  ├─ layout/                     # Sidebar, Topbar, MobileNav
│  │  └─ shared/                     # ConfirmDialog, DataTable, EmptyState
│  ├─ hooks/
│  │  └─ use-realtime-collection.ts  # hook genérico de suscripción
│  ├─ lib/
│  │  ├─ supabase/                   # client.ts, server.ts, admin.ts, middleware.ts
│  │  ├─ validations/                # texto, placas, NIV, fechas
│  │  ├─ formatters/                 # fechas es-MX, porcentajes
│  │  └─ utils/cn.ts
│  ├─ types/database.types.ts        # generado con Supabase CLI
│  └─ middleware.ts                  # validación de JWT y protección de rutas
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/
│  └─ seed.sql                       # marcas y datos de prueba
├─ tests/
│  ├─ unit/
│  └─ e2e/                           # Playwright sobre escenarios Gherkin
├─ .env.local.example
└─ package.json
```

**Navegación responsive:** barra superior modular con pestañas de los módulos en desktop y desplazamiento horizontal en móvil. Las pestañas de módulos aún no implementados se muestran deshabilitadas con "Próximamente". Las tablas se convierten en tarjetas apiladas en pantallas pequeñas, conservando las acciones de editar y eliminar.

---

## 4. Esquema de relaciones en Supabase

### 4.1 Orden de creación (migraciones)

| Migración | Contenido | Depende de |
| :--- | :--- | :--- |
| `0001_extensions.sql` | `pgcrypto`, `unaccent` | — |
| `0002_cuentas.sql` | tabla nativa `cuentas` (sin `auth.users`) | — |
| `0003_operadores.sql` | catálogo de operadores (la `0012` retira `activo`) | — |
| `0004_unidades.sql` | catálogo con `activo` y único parcial por placas | — |
| `0005_destinos.sql` | catálogo con `activo` y `requiere_tiros` generado | — |
| `0006_bitacora_viajes.sql` | dos FKs a unidades/destinos y snapshot del operador | 0003–0005 |
| `0007_estadisticas_snapshot.sql` | fila única con `payload jsonb` | 0006 (semántica) |
| `0008_indexes.sql` | FKs, fecha e índices únicos parciales | 0003–0006 |
| `0009_functions.sql` | normalización, validaciones, recálculo, nómina | 0006–0007 |
| `0010_rls_policies.sql` | políticas de acceso | todas |
| `0011_realtime.sql` | publicación de las 5 tablas operativas | todas |
| `0012_operadores_delete_real.sql` | elimina `activo` de operadores y habilita el `DELETE` real | 0003 |

Los catálogos (`operadores`, `unidades`, `destinos`) no dependen entre sí y pueden crearse en paralelo. `bitacora_viajes` es la única tabla del núcleo con llaves foráneas a catálogos (unidades y destinos) y debe crearse al final. `cuentas` es independiente de todo el resto del modelo.

### 4.2 Modelo de datos

```sql
-- cuentas (autenticación propia, sin Supabase Auth ni correo)
id uuid PK DEFAULT gen_random_uuid()
usuario text NOT NULL                    -- minúsculas, trim, único (índice lower(usuario))
contrasena_hash text NOT NULL            -- bcrypt; nunca se guarda la contraseña en claro
creado_en / actualizado_en timestamptz

-- operadores
id uuid PK
nombre, apellido_paterno, apellido_materno text NOT NULL
creado_en / actualizado_en
-- Sin columna activo: el borrado es físico mediante DELETE.

-- unidades
id uuid PK
placas text NOT NULL                    -- único parcial entre activos
marca text NOT NULL                     -- freightliner | international | chevrolet
modelo smallint NOT NULL                -- 1950–2100
no_motor text NOT NULL
niv char(17) NOT NULL                   -- exactamente 17 alfanuméricos
activo boolean NOT NULL DEFAULT true
creado_en / actualizado_en

-- destinos
id uuid PK
destino text NOT NULL                   -- único parcial entre activos
km numeric(10,2) NOT NULL               -- > 0
requiere_tiros boolean GENERATED ALWAYS AS
  (unaccent(lower(destino)) LIKE '%refrigerado%') STORED
activo boolean NOT NULL DEFAULT true
creado_en / actualizado_en

-- bitacora_viajes
id uuid PK
fecha date NOT NULL
operador_id text NOT NULL               -- snapshot "nombre apellido_paterno"; sin FK
unidad_id   uuid NOT NULL → unidades(id)   ON DELETE RESTRICT
destino_id  uuid NOT NULL → destinos(id)   ON DELETE RESTRICT
numero_tiros integer NULL               -- > 0 cuando aplica
creado_en / actualizado_en

-- estadisticas_snapshot
id smallint PK = 1                      -- fila única
payload jsonb NOT NULL                  -- kpis + 4 desgloses
obsoleto boolean NOT NULL DEFAULT true
generado_en timestamptz
version bigint NOT NULL DEFAULT 0
```

### 4.3 Relaciones

```txt
cuentas                  (tabla aislada, sin relaciones)
operadores               (catálogo independiente: la bitácora guarda su snapshot)
bitacora_viajes >── 1 unidades
                └── 1 destinos
estadisticas_snapshot    (agregado global, sin FK)
```

### 4.4 Índices

- `bitacora_viajes(fecha)`
- `bitacora_viajes(operador_id)`, `(unidad_id)`, `(destino_id)`
- `bitacora_viajes(fecha, operador_id)`
- Único parcial `lower(placas) WHERE activo` en `unidades`
- Único parcial `lower(destino) WHERE activo` en `destinos`
- Único global `lower(usuario)` en `cuentas`

### 4.5 Reglas de integridad en PostgreSQL

- Trigger de `trim + lower` en `cuentas.usuario` y en los textos de catálogos (nunca sobre `contrasena_hash`).
- `CHECK` de longitud y caracteres en `cuentas.usuario`: mínimo 6, solo letras con acentos y números.
- `CHECK` de longitud mínima del hash y ausencia de espacios en `contrasena_hash`.
- `niv` con exactamente 17 caracteres alfanuméricos.
- `modelo` entre 1950 y 2100; `km > 0`.
- `marca` restringida a `freightliner`, `international` y `chevrolet`.
- Trigger que valida `numero_tiros` contra `destinos.requiere_tiros`:
  - si el destino requiere tiros → obligatorio y mayor a 0;
  - si no los requiere → debe ser `NULL`.
- Trigger compartido `set_actualizado_en()`.
- Triggers de sentencia que marcan el snapshot como obsoleto ante cambios en bitácora o catálogos.
- **Borrado de operadores:** la aplicación ejecuta `DELETE` físico. La bitácora no tiene FK hacia `operadores`; guarda un snapshot de texto (`operador_id = "nombre apellido_paterno"`), por lo que los viajes históricos permanecen intactos.
- Unidades y destinos conservan su borrado lógico (`UPDATE activo = false`).

### 4.6 RLS

- Habilitado en todas las tablas.
- Catálogos, bitácora y snapshot: `select/insert/update/delete` solo para el rol `authenticated`.
- `cuentas`: RLS habilitado **sin políticas**. Solo el cliente `service_role` (exclusivamente en Server Actions del módulo auth) puede leerla o escribirla. El navegador nunca la consulta.
- Ningún acceso anónimo a datos de negocio.
- Sin roles ni propietarios por fila: todos los usuarios autenticados comparten los datos de la flotilla, conforme a la especificación.

---

## 5. Autenticación (usuario + contraseña, sin correo)

### 5.1 Modelo y almacenamiento

- Tabla nativa `cuentas`: `id`, `usuario`, `contrasena_hash`, `creado_en`, `actualizado_en`.
- `usuario`: `trim` + minúsculas, mínimo 6, solo letras (con acentos) y números, sin caracteres especiales, único.
- Contraseña: `trim` + minúsculas (conforme a RN-1.4 de la Master Spec), mínimo 6, admite caracteres especiales. Se aplica `bcrypt` con costo 10–12 y solo se persiste el hash.
- **No existe columna `correo` ni flujo con `auth.users`, `perfiles`, enlaces mágicos o callbacks de correo.**
- Elección de hash: `bcryptjs` en Server Actions para mantener la lógica en TypeScript; si se prefiere no cargar la librería, `pgcrypto` con `crypt(..., gen_salt('bf', 10))` es equivalente y se encapsula en una función `security definer`.

### 5.2 Registro

1. Formulario pide usuario y contraseña (sin correo).
2. Server Action normaliza (`trim`, minúsculas) y valida con Zod.
3. Verifica duplicado y, si existe, responde con aviso "El usuario ya está registrado" (también se captura la violación `23505` como defensa final).
4. Genera el hash y lo inserta con el cliente admin de servidor.
5. Responde con notificación de registro exitoso y redirige al login.

### 5.3 Inicio de sesión y sesión

1. Formulario pide usuario y contraseña.
2. Normaliza el usuario; busca la cuenta por `lower(usuario)` desde el servidor.
3. Compara la contraseña con `bcrypt.compare` (o `crypt` en Postgres).
4. Si falla, mensaje genérico "Usuario o contraseña incorrectos" (no revela si el usuario existe).
5. Si acierta, se emite un JWT firmado con `SUPABASE_JWT_SECRET` (`HS256`) con claims `sub = cuentas.id`, `role = authenticated`, `aud = authenticated`, `exp ≈ 7 días`.
6. El JWT se guarda en la cookie `tc_session` (`httpOnly`, `secure`, `sameSite=lax`, `path=/`). El middleware lo valida con `jose` y protege `(dashboard)`.
7. **Integración con Supabase:** `createServerClient` usa la opción `accessToken` para enviar el JWT; así PostgREST y RLS lo tratan como `authenticated`. El cliente de Realtime obtiene un token vigente desde `/api/sesion/token` y llama `realtime.setAuth(token)`.
8. **Logout:** elimina la cookie y redirige al login.
9. Renovación deslizante: si al token le quedan menos de 2 días, el middleware emite uno nuevo.

> Si el proyecto Supabase migra a *JWT signing keys* y deja de aceptar el secreto legado, se usa la clave de firma asimétrica correspondiente; el resto del flujo no cambia. Como alternativa de contingencia, todo el acceso a datos puede pasar por Server Actions con `service_role`, manteniendo Realtime deshabilitado para datos sensibles.

### 5.4 Recuperación de contraseña (simplificada, sin correo)

1. El usuario entra a `/recuperar` e ingresa solo su nombre de usuario.
2. El servidor normaliza el usuario y consulta `cuentas`.
3. **Si no existe:** se muestra el aviso "El usuario no está registrado" y no se habilita el resto del formulario.
4. **Si existe:** se habilita en la misma pantalla el campo de nueva contraseña (con opción de mostrarla/ocultarla).
5. Al enviar: se valida longitud y caracteres, se normaliza a minúsculas, se genera el nuevo hash y se actualiza el registro.
6. Se notifica "Contraseña actualizada correctamente" y se redirige al login.
7. No se envía correo, no se generan enlaces y no se usa el callback de Supabase Auth.

### 5.5 Validaciones

- Usuario: mínimo 6 caracteres, solo letras con acentos y números, sin caracteres especiales; `trim` y minúsculas.
- Contraseña: mínimo 6 caracteres, letras, números y caracteres especiales; `trim` y minúsculas según la especificación.
- Ambos campos obligatorios en registro, login y recuperación.
- Confirmación de contraseña en registro y recuperación (validación de coincidencia en cliente y servidor) como mejora de UX, sin alterar el contrato de la spec.

### 5.6 Controles de seguridad

- Cookie de sesión `httpOnly`; el JWT nunca se guarda en `localStorage`.
- Hash bcrypt con costo 10–12; nunca se registra en logs ni se devuelve al cliente.
- Mensajes de login genéricos para evitar enumeración de usuarios.
- **Riesgo aceptado:** al restablecer solo con el nombre de usuario, cualquiera que lo conozca podría cambiar la contraseña. Mitigaciones previstas:
  - limitar intentos por usuario/IP (contador en servidor o tabla auxiliar),
  - registrar eventos de recuperación para auditoría,
  - opcionalmente exigir un código de recuperación entregado al registrarse o aprobación manual.
- `service_role` solo se usa en el módulo auth; jamás se expone con prefijo `NEXT_PUBLIC_`.

---

## 6. Estrategia de sincronización Realtime

**Objetivo:** que un cambio hecho en escritorio aparezca en móvil (y viceversa) sin recargar, para `operadores`, `unidades`, `destinos`, `bitacora_viajes` y `estadisticas_snapshot`.

1. **Publicación:** agregar las cinco tablas operativas a `supabase_realtime` y usar `replica identity full` para recibir la fila completa en los eventos. `cuentas` no se publica.
2. **Cliente único:** `createBrowserClient` de `@supabase/ssr` como singleton para evitar múltiples conexiones WebSocket; tras inicializar, se aplica `realtime.setAuth(token)` con el JWT de sesión.
3. **Hook genérico** `useRealtimeCollection({ table, initialData, filter })`:
   - se suscribe a `postgres_changes` con `event: '*'` y `schema: 'public'`;
   - aplica el cambio al estado local por `id` (insertar, reemplazar o retirar), sin recargar toda la tabla;
   - limpia el canal con `removeChannel` al desmontar.
4. **Un canal por página**, no uno por fila ni por componente.
5. **Resincronización:** al pasar a `SUBSCRIBED` (incluida la reconexión tras perder red) se hace una recarga silenciosa para recuperar eventos perdidos. En `CHANNEL_ERROR`/`TIMEOUT` se reintenta con backoff.
6. **Borrado real de operadores:** llega como `DELETE` y la fila se retira del estado local. La bitácora no se modifica porque guarda su propio snapshot del operador. Unidades y destinos mantienen borrado lógico (`UPDATE activo = false`).
7. **Evitar duplicados:** claves por `id`; en altas optimistas se usa un id temporal y se reconcilia con el id real que llega por Realtime.
8. **Nóminas:** escucha `bitacora_viajes` solo si el usuario tiene un rango activo y recalcula con *debounce* local (aprox. 500 ms).
9. **Estadísticas:** escucha `estadisticas_snapshot`; al recibir un nuevo snapshot reemplaza el payload y muestra los KPIs actualizados.
10. **Seguridad:** Realtime respeta RLS; los clientes sin JWT válido no reciben eventos.
11. **Multi-dispositivo:** cada dispositivo mantiene su propia sesión y su propio canal; no hay enrutamiento por dispositivo. La sincronización es por proyecto Supabase, con latencia típica menor a un segundo.

No se contempla modo offline/PWA. Si se requiriera, sería una fase adicional con cola de mutaciones.

---

## 7. Nóminas

### 7.1 Formato de salida

```txt
Buen día, esta es la nómina de la semana
Del 10 al 19 de octubre del 2026.

Gerardo Santiago: 1 Celaya
- Lunes Celaya

Julio Soriano: 1 Tlapa
- Lunes Tlapa (2)

Total de viajes en el periodo: 3
```

### 7.2 Reglas de formato

- Rango inclusivo en ambas fechas; fechas en español, días capitalizados y meses en minúsculas.
- Operadores ordenados alfabéticamente.
- Destinos por cantidad descendente y luego alfabéticamente.
- Días en orden cronológico.
- Varios viajes del mismo operador al mismo destino el mismo día: `(n)`.
- Si el destino requiere tiros: se anexa `(N tiros)` al detalle del día.
- Se incluyen los viajes históricos cuyo operador ya no exista en el catálogo, usando el snapshot guardado en la bitácora.
- Estado inicial del `textarea`: `"No se ha seleccionado un rango de fechas"`.
- Botón de copiado con confirmación visual y *fallback* para navegadores sin Clipboard API.

### 7.3 Implementación

- Función SQL `fn_resumen_nomina(p_inicio date, p_fin date)` que devuelve operador, destino, fecha y conteo.
- Formateo del texto en `modules/nominas/lib/generar-nomina.ts`.
- Sin persistencia: se genera cada vez que se solicita.

---

## 8. Estadísticas

- Tabla única `estadisticas_snapshot` con `payload`, `obsoleto`, `generado_en` y `version`.
- Los cambios en bitácora o catálogos marcan `obsoleto = true`; no recalculan de inmediato.
- Al abrir la sección: se muestra el snapshot actual y, si está obsoleto, se ejecuta `fn_recalcular_estadisticas()` y se refresca la vista.
- Botón "Actualizar" para forzar el recálculo.
- **Contenido del payload:**
  - KPIs: total de viajes, destinos activos, operadores registrados y unidades activas.
  - Viajes por destino, por operador, por unidad y por número de tiros.
  - Los viajes sin tiros se agrupan como "sin tiros".
- Porcentajes calculados en SQL con un decimal; paginación en cliente porque el snapshot es pequeño.
- Realtime sobre `estadisticas_snapshot` mantiene sincronizados todos los dispositivos.
- Si el volumen crece, el recálculo puede moverse a `pg_cron` sin cambiar la interfaz.

---

## 9. Plan de trabajo modular

| Fase | Entregable | Depende de | Puerta de salida |
| :--- | :--- | :--- | :--- |
| **0. Fundaciones** | Proyecto Next.js + TypeScript + Tailwind, componentes base propios, estructura de carpetas, Supabase local/cloud, tipos generados, CI | — | Compila; lint y typecheck limpios; conexión a Supabase verificada |
| **1. Autenticación** | Tabla `cuentas`, hash bcrypt, registro, login, recuperación sin correo, JWT + cookie, middleware, RLS, `/api/sesion/token` | 0 | Escenarios 1–4 del Módulo 1 + recuperación con usuario inexistente |
| **2. Catálogos** | Operadores, Unidades y Destinos: CRUD, validaciones, borrado real de operadores, borrado lógico de unidades/destinos, Realtime, responsive | 1 | Gherkin de Módulos 2, 3 y 4 |
| **3. Bitácora** | CRUD, selects dinámicos, campo condicional de tiros, integridad referencial, Realtime | 2 | Escenarios 1–5 del Módulo 5 |
| **4. Nóminas** | RPC de resumen, plantilla de texto, copiado, validación de fechas | 3 | Escenarios 1–4 del Módulo 6 |
| **5. Estadísticas** | Snapshot, recálculo, KPIs, cuatro tablas, porcentajes, paginación, Realtime | 3 | Escenarios 1–2 del Módulo 7 |
| **6. Cierre** | E2E Playwright, pruebas negativas de RLS, accesibilidad, despliegue | 1–5 | Suite completa en verde |

**Ruta crítica:** `0 → 1 → 2 → 3 → (4 ∥ 5) → 6`.

Las fases 4 y 5 pueden solaparse una vez cerrada la bitácora. Operadores, unidades y destinos pueden desarrollarse en paralelo dentro de la fase 2.

---

## 10. Costo cero (Free Tier)

La arquitectura se mantiene dentro de los planes gratuitos con estas condiciones:

| Servicio | Plan | Uso previsto vs. límite |
| :--- | :--- | :--- |
| Next.js | — | Open source, sin costo |
| Vercel | Hobby | Funciones serverless y ancho de banda suficientes para una app interna de bajo tráfico |
| Supabase | Free | PostgreSQL 500 MB, 5 GB de egress, Realtime 200 conexiones concurrentes y ~2M mensajes/mes; el snapshot y los catálogos ocupan pocos MB |
| Hash bcrypt | — | Se ejecuta en la función serverless; no requiere servicio externo |
| Auth | Propia | Sin costo: no se usa Supabase Auth de pago ni proveedores de correo |

**Decisiones para no salir del Free Tier:**

- Snapshot de estadísticas en lugar de recalcular en cada visita (menos CPU y egress).
- Realtime solo en 5 tablas, un canal por página y sin publicar `cuentas`.
- Sin almacenamiento de archivos, sin cron de pago y sin correos transaccionales.
- Paginación en cliente porque el snapshot es pequeño.
- Sin dependencias de servicios de pago.

**Salvedades honestas:**

- **Vercel Hobby** está pensado para uso personal/no comercial. Si el despliegue se considera comercial, Vercel podría exigir el plan Pro. Para uso interno de bajo volumen se puede mantener en Hobby, o desplegar en una alternativa gratuita (por ejemplo, un servidor propio o un host con plan free) sin cambiar el código.
- **Supabase Free** pausa proyectos inactivos tras ~7 días; se reactivan manualmente sin costo. Para evitarlo, basta una visita periódica o una tarea de keep-alive.
- Los límites anteriores son los publicados al momento de este plan; si Supabase o Vercel los cambian, se revisa el consumo antes de escalar.

**Conclusión:** técnicamente el sistema completo (Next.js, Vercel, Supabase PostgreSQL/Realtime y autenticación propia) cabe en el Free Tier y no genera costos recurrentes para el volumen previsto, con las salvedades contractuales de Vercel Hobby indicadas arriba.

---

## 11. Riesgos controlados y supuestos

### 11.1 Riesgos controlados

- **Recuperación sin correo:** resuelta con usuario + nueva contraseña; se acepta el riesgo de suplantación y se mitiga con límites de intentos y auditoría.
- **Pérdida de historial al eliminar operadores:** evitada porque la bitácora guarda un snapshot del operador y no depende de la fila del catálogo.
- **Regla de "refrigerado" frágil:** centralizada en una columna generada de `destinos`, no en comparaciones dispersas de la UI.
- **Consultas repetitivas en Estadísticas:** evitadas con snapshot y refresco perezoso.
- **Contraseñas:** solo se guarda el hash bcrypt; la contraseña se normaliza a minúsculas por requisito de la spec (reduce entropía, se compensa exigiendo mayor longitud).
- **Borrado físico accidental de operadores:** el modal de confirmación es obligatorio; la bitácora conserva su snapshot y las FKs de unidades/destinos siguen en `RESTRICT`.
- **Exposición de `cuentas`:** RLS sin políticas y acceso solo con `service_role` desde el servidor.

### 11.2 Supuestos menores

- Se elimina por completo el campo `correo` y toda dependencia de Supabase Auth.
- Se agrega `activo` únicamente a unidades y destinos; operadores no tiene estatus y se elimina con `DELETE`.
- La aplicación usa la zona horaria `America/Mexico_City` para mostrar fechas.
- Los límites del Free Tier se mantienen durante la operación normal.
- La palabra "refrigerado" se detecta sin distinguir mayúsculas ni acentos; un destino llamado "no refrigerado" también activaría la regla.

---

## 12. Criterios de aceptación por módulo

- **Autenticación:**
  - registro exitoso solo con usuario y contraseña, sin solicitar correo;
  - validación de campos vacíos y longitud mínima de 6;
  - usuario duplicado notificado;
  - login válido y login inválido con mensaje genérico;
  - recuperación: usuario inexistente muestra "El usuario no está registrado";
  - recuperación: usuario existente permite establecer nueva contraseña, normalizarla a minúsculas, hashearla y actualizarla;
  - contraseña nunca visible ni almacenada en claro; cookie de sesión `httpOnly`;
  - ningún formulario o ruta menciona correo electrónico.
- **Catálogos:** alta, consulta, edición, eliminación lógica con confirmación, validaciones de formato y unicidad.
- **Bitácora:** selects precargados con "Seleccionar opción", campo de tiros condicional, edición y eliminación con confirmación.
- **Nóminas:** estado inicial, generación por rango, validación de fechas obligatorias, copiado al portapapeles.
- **Estadísticas:** KPIs globales, desgloses con porcentaje de un decimal, paginación y actualización por Realtime.

---

*Fin del plan. La siguiente fase corresponde a la generación de tareas por módulo.*
