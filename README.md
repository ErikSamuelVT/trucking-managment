# TruckingControl

opencode -s ses_e6f92ef35ffedo7fWGUY2lZ3Hj

Aplicación web para la administración de una flotilla de transporte: operadores, unidades, destinos, bitácora de viajes, nóminas y estadísticas.

**Estado:** Fase 1 — Autenticación.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Realtime)
- Autenticación propia con usuario y contraseña

## Requisitos

- Node.js 20.9 o superior
- npm

## Puesta en marcha

```bash
npm install
cp .env.local.example .env.local
# completa las credenciales en .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable                        | Alcance              | Uso                                           |
| :------------------------------ | :------------------- | :-------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Navegador y servidor | URL del proyecto Supabase                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Navegador y servidor | Clave pública para operaciones con RLS        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Solo servidor        | Acceso del módulo auth a `cuentas`; omite RLS |
| `SUPABASE_JWT_SECRET`           | Solo servidor        | Firma y verificación del JWT de sesión propio |

`SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_JWT_SECRET` nunca deben llevar el prefijo `NEXT_PUBLIC_` ni exponerse al navegador.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run start      # servidor de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir
```

## Estructura de la Fase 1

```txt
src/
├─ app/
│  ├─ (auth)/                 # login, registro y recuperación
│  ├─ (dashboard)/            # layout protegido y placeholder de operadores
│  ├─ api/sesion/token/       # JWT para Realtime con sesión válida
│  ├─ layout.tsx              # layout raíz y ToastProvider
│  └─ page.tsx                # redirección según sesión
├─ components/ui/             # componentes base de la Fase 0
├─ modules/auth/
│  ├─ actions/                # registro, login/logout y recuperación
│  ├─ components/             # formularios React Hook Form
│  ├─ lib/                    # bcrypt y JWT/cookie de sesión
│  └─ schemas/                # validaciones Zod
├─ lib/supabase/              # clientes browser, server, admin y Realtime
└─ proxy.ts                   # protección de rutas y renovación de sesión
```

Las migraciones están en `supabase/migrations/`. Los tipos generados de la base de datos y los módulos restantes se añaden en las fases correspondientes.

## Principios de arquitectura

- Las mutaciones pasan por Server Actions; el navegador solo usa Supabase para Realtime.
- La tabla `cuentas` se consulta exclusivamente desde el servidor con `service_role`.
- RLS protege todas las tablas operativas con el rol `authenticated`.
- Los textos de dominio se normalizan y validan en Zod y en PostgreSQL.
