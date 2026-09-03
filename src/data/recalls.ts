import type { Recall } from "@/types";

export const recalls: Recall[] = [
  {
    id: "RET-2026-003",
    motive: "Incidencia de calidad — pérdida de firmeza",
    packingLotId: "EMP-2026-0841",
    palletId: "PAL-086",
    boxFrom: "C-4001",
    boxTo: "C-4024",
    totalBoxes: 24,
    locatedBoxes: 18,
    distribution: [
      { supermarketId: "SM-FM", supermarketName: "Fresh Market", boxes: 10, located: 8 },
      { supermarketId: "SM-GM", supermarketName: "Green Market", boxes: 8, located: 6 },
      { supermarketId: "SM-FC", supermarketName: "Food Center", boxes: 6, located: 4 },
    ],
    status: "en_proceso",
    claimId: "INC-2026-014",
    startedAt: "2026-08-22T12:30:00-05:00",
    updates: [
      {
        id: "u-1",
        at: "2026-08-22T12:30:00-05:00",
        author: "María Delgado",
        text: "Retiro iniciado sobre 24 cajas del pallet PAL-086.",
      },
      {
        id: "u-2",
        at: "2026-08-22T16:10:00-05:00",
        author: "Daniel Brooks",
        text: "Fresh Imports localizó 18 cajas en tienda y en CD-01. Pendientes 6 en góndola.",
      },
    ],
  },
];
