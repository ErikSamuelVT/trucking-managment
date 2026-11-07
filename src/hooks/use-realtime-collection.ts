"use client";

import { useEffect, useState } from "react";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { applyRealtimeSession } from "@/lib/supabase/realtime";

type RealtimeCollectionOptions<T extends { id: string }> = {
  table: string;
  initialData: T[];
  filter?: string;
  reload: () => Promise<T[]>;
};

/**
 * Suscripción Realtime genérica a una tabla de Supabase.
 *
 * - Un único canal por hook/página.
 * - Aplica INSERT/UPDATE/DELETE al estado local por `id`, sin recargar.
 * - Al pasar a SUBSCRIBED (incluida una reconexión) resincroniza en
 *   silencio para recuperar eventos perdidos.
 * - Ante CHANNEL_ERROR/TIMEOUT reintenta con backoff exponencial.
 */
export function useRealtimeCollection<T extends { id: string }>({
  table,
  initialData,
  filter,
  reload,
}: RealtimeCollectionOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    let active = true;
    let channel: RealtimeChannel | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    function upsert(item: T) {
      setItems((current) => {
        const index = current.findIndex((existing) => existing.id === item.id);

        if (index === -1) {
          return [...current, item];
        }

        const next = current.slice();
        next[index] = item;

        return next;
      });
    }

    function remove(id: string) {
      setItems((current) => current.filter((item) => item.id !== id));
    }

    function handlePayload(
      payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
    ) {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        const item = payload.new as unknown as T;

        if (item?.id) {
          upsert(item);
        }

        return;
      }

      if (payload.eventType === "DELETE") {
        const old = payload.old as { id?: string };

        if (old?.id) {
          remove(old.id);
        }
      }
    }

    async function resync() {
      try {
        const data = await reload();

        if (active) {
          setItems(data);
        }
      } catch {
        // La resincronización es silenciosa: se conserva el estado actual.
      }
    }

    function scheduleRetry() {
      if (!active) {
        return;
      }

      if (channel) {
        void client.removeChannel(channel);
        channel = null;
      }

      const delay = Math.min(1000 * 2 ** Math.min(attempt, 4), 15000);
      attempt += 1;

      retryTimer = setTimeout(() => {
        void connect();
      }, delay);
    }

    async function connect() {
      if (!active) {
        return;
      }

      const authorized = await applyRealtimeSession(client);

      if (!active) {
        return;
      }

      if (!authorized) {
        scheduleRetry();
        return;
      }

      channel = client
        .channel(`realtime:${table}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            ...(filter ? { filter } : {}),
          },
          handlePayload,
        )
        .subscribe((status) => {
          if (!active) {
            return;
          }

          if (status === "SUBSCRIBED") {
            attempt = 0;
            void resync();
          } else if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT"
          ) {
            scheduleRetry();
          }
        });
    }

    void connect();

    return () => {
      active = false;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      if (channel) {
        void client.removeChannel(channel);
      }
    };
  }, [table, filter, reload]);

  return { items, setItems };
}
