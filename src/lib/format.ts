const DATE_FMT = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const DATETIME_FMT = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DATE_FMT.format(d);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DATETIME_FMT.format(d);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-PE").format(n);
}

export function entityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    company: "Empresa",
    product: "Producto",
    farm: "Fundo",
    plot: "Parcela",
    harvest: "Cosecha",
    harvestCrew: "Cuadrilla de cosecha",
    crate: "Jaba",
    nursery: "Material vegetal / vivero",
    transport: "Transporte de campo",
    reception: "Recepción de planta",
    qrCode: "QR de clamshells",
    processingLot: "Procesamiento",
    packingLot: "Lote de empaque",
    packagingMaterial: "Material de empaque",
    clamshellBatch: "Lote de clamshell",
    inputLot: "Lote de insumo",
    box: "Caja",
    pallet: "Pallet",
    container: "Contenedor",
    booking: "Booking",
    qualityControl: "Control de calidad",
    certification: "Certificación",
    importer: "Importador",
    distributor: "Distribuidor",
    distributionCenter: "Centro de distribución",
    supermarket: "Supermercado",
    destination: "Destino",
    claim: "Reclamo",
    incident: "Incidencia",
    recall: "Retiro",
    document: "Documento",
    supplier: "Proveedor",
  };
  return map[type] ?? type;
}
