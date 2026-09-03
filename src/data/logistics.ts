import type { Booking, Container, Pallet } from "@/types";
import { sourced } from "./sources";

export const pallets: Pallet[] = [
  { id: "PAL-086", packingLotId: "EMP-2026-0841", containerId: "MSKU1234567", boxFrom: "C-4001", boxTo: "C-4096", boxCount: 96, sscc: "176012345600000086" },
  { id: "PAL-087", packingLotId: "EMP-2026-0842", containerId: "MSKU1234567", boxFrom: "C-4101", boxTo: "C-4172", boxCount: 72, sscc: "176012345600000087" },
  { id: "PAL-088", packingLotId: "EMP-2026-0843", containerId: "TCLU7654321", boxFrom: "C-4201", boxTo: "C-4232", boxCount: 32, sscc: "176012345600000088" },
  { id: "PAL-089", packingLotId: "EMP-2026-0843", containerId: "TCLU7654321", boxFrom: "C-4233", boxTo: "C-4264", boxCount: 32, sscc: "176012345600000089" },
  { id: "PAL-090", packingLotId: "EMP-2026-0844", containerId: "MSKU1234567", boxFrom: "C-4301", boxTo: "C-4348", boxCount: 48, sscc: "176012345600000090" },
  { id: "PAL-091", packingLotId: "EMP-2026-0845", containerId: "TCLU7654321", boxFrom: "C-4401", boxTo: "C-4440", boxCount: 40, sscc: "176012345600000091" },
  { id: "PAL-092", packingLotId: "EMP-2026-0846", containerId: "MSKU1234567", boxFrom: "C-5000", boxTo: "C-5047", boxCount: 48, sscc: "176012345600000092" },
  { id: "PAL-093", packingLotId: "EMP-2026-0847", containerId: "TCLU7654321", boxFrom: "C-5048", boxTo: "C-5095", boxCount: 48, sscc: "176012345600000093" },
];

export const containers: Container[] = [
  {
    id: "MSKU1234567",
    bookingId: "BK-958204",
    packingLotIds: ["EMP-2026-0841", "EMP-2026-0842", "EMP-2026-0844"],
    palletIds: ["PAL-086", "PAL-087", "PAL-090"],
    vessel: "MSC ANDES",
    departurePort: sourced("Salaverry", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-21T09:15:00-05:00"),
    destinationPort: sourced("Philadelphia", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-21T09:15:00-05:00"),
    departureDate: sourced("2026-07-21", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-21T09:15:00-05:00"),
    eta: "2026-08-08",
    country: "Estados Unidos",
    seal: "PE-884291",
  },
  {
    id: "TCLU7654321",
    bookingId: "BK-958310",
    packingLotIds: ["EMP-2026-0843", "EMP-2026-0845", "EMP-2026-0847"],
    palletIds: ["PAL-088", "PAL-089", "PAL-091", "PAL-093"],
    vessel: "MAERSK LIMA",
    departurePort: sourced("Callao", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-24T14:00:00-05:00"),
    destinationPort: sourced("Rotterdam", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-24T14:00:00-05:00"),
    departureDate: sourced("2026-07-24", "ERP Valle Azul", "Sistema Logístico ERP", "2026-07-24T14:00:00-05:00"),
    eta: "2026-08-18",
    country: "Países Bajos",
    seal: "PE-884355",
  },
];

export const bookings: Booking[] = [
  {
    id: "BK-958204",
    importerId: "IMP-001",
    containerIds: ["MSKU1234567"],
    carrier: "MSC",
    origin: "Salaverry, Perú",
    destination: "Philadelphia, Estados Unidos",
    etd: "2026-07-21",
    eta: "2026-08-08",
  },
  {
    id: "BK-958310",
    importerId: "IMP-002",
    containerIds: ["TCLU7654321"],
    carrier: "Maersk",
    origin: "Callao, Perú",
    destination: "Rotterdam, Países Bajos",
    etd: "2026-07-24",
    eta: "2026-08-18",
  },
];
