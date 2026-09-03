"use client";

import { claims as seedClaims, packingLots as seedLots, recalls as seedRecalls } from "@/data";
import { sourced } from "@/data/sources";
import type { Claim, ClaimStatus, LotStatus, PackingLot, Recall, RecallStatus } from "@/types";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

const STORAGE_KEY = "zhenda-agro-store-v1";

interface StoreState {
  lotStatuses: Record<string, LotStatus>;
  claimStatuses: Record<string, ClaimStatus>;
  extraLots: PackingLot[];
  extraClaims: Claim[];
  extraRecalls: Recall[];
  recallStatuses: Record<string, RecallStatus>;
  recallUpdates: Record<string, Recall["updates"]>;
  claimComments: Record<string, Claim["comments"]>;
  claimReplies: Record<string, string[]>;
  locatedBoxes: Record<string, number>;
  generatedDossiers: { id: string; lotId: string; createdAt: string }[];
}

const empty: StoreState = {
  lotStatuses: {},
  claimStatuses: {},
  extraLots: [],
  extraClaims: [],
  extraRecalls: [],
  recallStatuses: {},
  recallUpdates: {},
  claimComments: {},
  claimReplies: {},
  locatedBoxes: {},
  generatedDossiers: [{ id: "AUD-2026-011", lotId: "EMP-2026-0841", createdAt: "2026-08-22T14:00:00-05:00" }],
};

function loadState(): StoreState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

let memory: StoreState = empty;
let bootstrapped = false;
const listeners = new Set<() => void>();

function getClientSnapshot(): StoreState {
  if (!bootstrapped) {
    memory = loadState();
    bootstrapped = true;
  }
  return memory;
}

function getServerSnapshot(): StoreState {
  return empty;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeState(next: StoreState) {
  memory = next;
  bootstrapped = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  emit();
}

interface StoreApi extends StoreState {
  getLotStatus: (id: string, fallback: LotStatus) => LotStatus;
  setLotStatus: (id: string, status: LotStatus) => void;
  getClaimStatus: (id: string, fallback: ClaimStatus) => ClaimStatus;
  setClaimStatus: (id: string, status: ClaimStatus) => void;
  getRecallStatus: (id: string, fallback: RecallStatus) => RecallStatus;
  setRecallStatus: (id: string, status: RecallStatus) => void;
  addClaimComment: (id: string, text: string) => void;
  addRecallUpdate: (id: string, text: string) => void;
  startRecall: (input: {
    packingLotId: string;
    claimId?: string;
    palletId: string;
    boxFrom: string;
    boxTo: string;
    totalBoxes: number;
  }) => Recall;
  getRecall: (id: string) => Recall | undefined;
  allRecalls: () => Recall[];
  allClaims: () => Claim[];
  allLots: () => PackingLot[];
  addLot: (input: { variety: string; destinationCountry: string; boxCount: number }) => PackingLot;
  addDossier: (lotId: string) => { id: string; lotId: string; createdAt: string };
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const persist = useCallback((updater: (prev: StoreState) => StoreState) => {
    writeState(updater(getClientSnapshot()));
  }, []);

  const api = useMemo<StoreApi>(() => {
    const allRecalls = () => {
      const extras = state.extraRecalls;
      const merged = seedRecalls.map((r) => {
        const extra = extras.find((e) => e.id === r.id);
        return extra ?? r;
      });
      const extraOnly = extras.filter((e) => !seedRecalls.some((s) => s.id === e.id));
      return [...merged, ...extraOnly].map((r) => ({
        ...r,
        status: state.recallStatuses[r.id] ?? r.status,
        updates: state.recallUpdates[r.id] ?? r.updates,
        locatedBoxes: state.locatedBoxes[r.id] ?? r.locatedBoxes,
      }));
    };

    return {
      ...state,
      getLotStatus: (id, fallback) => state.lotStatuses[id] ?? fallback,
      setLotStatus: (id, status) => persist((p) => ({ ...p, lotStatuses: { ...p.lotStatuses, [id]: status } })),
      getClaimStatus: (id, fallback) => state.claimStatuses[id] ?? fallback,
      setClaimStatus: (id, status) => persist((p) => ({ ...p, claimStatuses: { ...p.claimStatuses, [id]: status } })),
      getRecallStatus: (id, fallback) => state.recallStatuses[id] ?? fallback,
      setRecallStatus: (id, status) => persist((p) => ({ ...p, recallStatuses: { ...p.recallStatuses, [id]: status } })),
      addClaimComment: (id, text) =>
        persist((p) => {
          const seed = seedClaims.find((c) => c.id === id)?.comments ?? [];
          const current = p.claimComments[id] ?? seed;
          return {
            ...p,
            claimComments: {
              ...p.claimComments,
              [id]: [
                ...current,
                {
                  id: `c-${Date.now()}`,
                  author: "María Delgado",
                  at: new Date().toISOString(),
                  text,
                },
              ],
            },
          };
        }),
      addRecallUpdate: (id, text) =>
        persist((p) => {
          const seed = allRecalls().find((r) => r.id === id)?.updates ?? [];
          const current = p.recallUpdates[id] ?? seed;
          return {
            ...p,
            recallUpdates: {
              ...p.recallUpdates,
              [id]: [
                ...current,
                {
                  id: `u-${Date.now()}`,
                  at: new Date().toISOString(),
                  author: "María Delgado",
                  text,
                },
              ],
            },
          };
        }),
      startRecall: (input) => {
        const existing = allRecalls().find((r) => r.packingLotId === input.packingLotId && r.status !== "cerrado");
        if (existing) return existing;
        const id = `RET-2026-${String(3 + state.extraRecalls.length + 1).padStart(3, "0")}`;
        const recall: Recall = {
          id,
          motive: "Incidencia de calidad",
          packingLotId: input.packingLotId,
          palletId: input.palletId,
          boxFrom: input.boxFrom,
          boxTo: input.boxTo,
          totalBoxes: input.totalBoxes,
          locatedBoxes: 0,
          distribution: [],
          status: "iniciado",
          claimId: input.claimId,
          startedAt: new Date().toISOString(),
          updates: [
            {
              id: `u-${Date.now()}`,
              at: new Date().toISOString(),
              author: "María Delgado",
              text: "Retiro iniciado desde el panel Zhenda.",
            },
          ],
        };
        persist((p) => ({ ...p, extraRecalls: [...p.extraRecalls, recall] }));
        return recall;
      },
      getRecall: (id) => allRecalls().find((r) => r.id === id),
      allRecalls,
      allClaims: () =>
        seedClaims.map((c) => ({
          ...c,
          status: state.claimStatuses[c.id] ?? c.status,
          comments: state.claimComments[c.id] ?? c.comments,
        })),
      allLots: () => {
        const extras = state.extraLots ?? [];
        const extraOnly = extras.filter((lot) => !seedLots.some((s) => s.id === lot.id));
        return [...seedLots, ...extraOnly].map((lot) => ({
          ...lot,
          status: state.lotStatuses[lot.id] ?? lot.status,
        }));
      },
      addLot: (input) => {
        const seed =
          seedLots.find((l) => l.id === (input.variety === "Biloxi" ? "EMP-2026-0845" : "EMP-2026-0841")) ??
          seedLots[0];
        const current = [...seedLots, ...(getClientSnapshot().extraLots ?? [])];
        const maxN = current.reduce((max, lot) => {
          const n = Number(lot.id.match(/EMP-2026-(\d+)/)?.[1] ?? 0);
          return Math.max(max, n);
        }, 0);
        const seq = maxN + 1;
        const id = `EMP-2026-${String(seq).padStart(4, "0")}`;
        const boxFromN = 9000 + (seq - 841) * 80;
        const boxToN = boxFromN + input.boxCount - 1;
        const now = new Date().toISOString();
        const date = now.slice(0, 10);
        const lot: PackingLot = {
          ...seed,
          id,
          variety: input.variety,
          productId: input.variety === "Biloxi" ? "PROD-BILOXI" : "PROD-VENTURA",
          status: "autorizado",
          boxIds: Array.from({ length: input.boxCount }, (_, i) => `C-${boxFromN + i}`),
          boxFrom: `C-${boxFromN}`,
          boxTo: `C-${boxToN}`,
          boxCount: input.boxCount,
          palletIds: [`PAL-${String(200 + seq).padStart(3, "0")}`],
          destinationIds: [],
          qualityControlIds: [],
          claimIds: [],
          weightKg: sourced(input.boxCount * 1.5, "PackLine", "Sistema de empaque PackLine", now),
          harvestDate: sourced(date, seed.harvestDate.source.system, seed.harvestDate.source.source, now),
          processingDate: sourced(date, seed.processingDate.source.system, seed.processingDate.source.source, now),
          packingDate: sourced(date, "PackLine", "Sistema de empaque PackLine", now),
          clamshellCount: input.boxCount * 12,
          destinationCountry: input.destinationCountry,
        };
        persist((p) => ({ ...p, extraLots: [...(p.extraLots ?? []), lot] }));
        return lot;
      },
      addDossier: (lotId) => {
        const item = {
          id: `AUD-2026-${String(11 + state.generatedDossiers.length).padStart(3, "0")}`,
          lotId,
          createdAt: new Date().toISOString(),
        };
        persist((p) => ({ ...p, generatedDossiers: [item, ...p.generatedDossiers] }));
        return item;
      },
    };
  }, [state, persist]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useZhendaStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useZhendaStore must be used within StoreProvider");
  return ctx;
}

export function useLotStatus(id: string, fallback: LotStatus): LotStatus {
  const store = useZhendaStore();
  return store.getLotStatus(id, fallback);
}

export { seedLots };
