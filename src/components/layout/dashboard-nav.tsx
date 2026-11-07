"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactElement,
  type SVGProps,
} from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { cerrarSesion } from "@/modules/auth/actions/sesion.actions";

type NavIcon = (props: SVGProps<SVGSVGElement>) => ReactElement;

function IconoOperadores(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

function IconoUnidades(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5V6.75A1.5 1.5 0 0 1 4.5 5.25h9a1.5 1.5 0 0 1 1.5 1.5v9.75M3 16.5h13.5m-13.5 0a2.25 2.25 0 0 0 4.5 0m9 0V9.75l3 3.75v3m-3 0a2.25 2.25 0 0 0 4.5 0m-4.5 0h4.5"
      />
    </svg>
  );
}

function IconoDestinos(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

function IconoBitacora(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4.5h6M9 7.5h6M6.75 3.75h10.5a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function IconoNominas(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5h7.5M8.25 11.25h7.5M8.25 15h4.5M5.25 3.75h13.5A1.5 1.5 0 0 1 20.25 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function IconoEstadisticas(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 20.25h16.5M7.5 16.5V10.5m4.5 6V6.75m4.5 9.75v-4.5"
      />
    </svg>
  );
}

type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
  disponible: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Operadores",
    href: "/operadores",
    icon: IconoOperadores,
    disponible: true,
  },
  {
    label: "Unidades",
    href: "/unidades",
    icon: IconoUnidades,
    disponible: false,
  },
  {
    label: "Destinos",
    href: "/destinos",
    icon: IconoDestinos,
    disponible: false,
  },
  {
    label: "Bitácora",
    href: "/bitacora",
    icon: IconoBitacora,
    disponible: false,
  },
  {
    label: "Nómina",
    href: "/nominas",
    icon: IconoNominas,
    disponible: false,
  },
  {
    label: "Estadísticas",
    href: "/estadisticas",
    icon: IconoEstadisticas,
    disponible: false,
  },
];

function IconoMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function IconoCerrar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

function esActivo(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItemRow({
  item,
  activo,
  fullWidth = false,
  onNavigate,
}: {
  item: NavItem;
  activo: boolean;
  fullWidth?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  if (!item.disponible) {
    return (
      <button
        type="button"
        disabled
        title="Próximamente"
        className={cn(
          "inline-flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-600",
          fullWidth && "w-full",
        )}
      >
        <Icon className="size-4" />
        <span>{item.label}</span>
        <span className="sr-only">(Próximamente)</span>
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        activo
          ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200"
          : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-800",
        fullWidth && "w-full",
      )}
    >
      <Icon className={cn("size-4", activo ? "text-brand-600" : "")} />
      <span>{item.label}</span>
    </Link>
  );
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Módulos" className="w-full">
      <ul className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 md:justify-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="shrink-0">
            <NavItemRow item={item} activo={esActivo(pathname, item.href)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, [abierto]);

  return (
    <div className="md:hidden">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-3">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label="Abrir menú"
          className="absolute left-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
        >
          <IconoMenu className="size-5" />
        </button>

        <p className="truncate text-xl font-bold tracking-tight text-brand-700">
          TruckingControl
        </p>
      </div>

      {abierto ? (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
        >
          <div className="relative flex shrink-0 items-center justify-center border-b border-slate-200 px-4 py-3">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar menú"
              className="absolute left-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
            >
              <IconoCerrar className="size-5" />
            </button>

            <p className="truncate text-xl font-bold tracking-tight text-brand-700">
              TruckingControl
            </p>
          </div>

          <nav
            aria-label="Módulos"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          >
            <ul className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="w-full">
                  <NavItemRow
                    item={item}
                    activo={esActivo(pathname, item.href)}
                    fullWidth
                    onNavigate={() => setAbierto(false)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-slate-200 px-4 py-4">
            <form action={cerrarSesion}>
              <Button type="submit" variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
