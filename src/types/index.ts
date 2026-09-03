export type SupplierType =
  | "agricola"
  | "clamshells"
  | "etiquetas"
  | "cajas"
  | "pallets"
  | "logistica"
  | "otros";

export type LotStatus =
  | "autorizado"
  | "observado"
  | "bloqueado"
  | "inmovilizado"
  | "sujeto_a_retiro"
  | "retirado"
  | "cerrado";

export type SupplierStatus = "aprobado" | "observado" | "suspendido" | "vencido";

export type ClaimType =
  | "calidad"
  | "empaque"
  | "temperatura"
  | "producto"
  | "documentacion"
  | "otro";

export type Severity = "baja" | "media" | "alta" | "critica";

export type ClaimStatus =
  | "nuevo"
  | "en_investigacion"
  | "esperando_informacion"
  | "resuelto"
  | "cerrado";

export type RecallStatus =
  | "borrador"
  | "iniciado"
  | "en_proceso"
  | "parcialmente_recuperado"
  | "finalizado"
  | "cerrado";

export type QCResult = "conforme" | "no_conforme" | "observado";

export type DestinationStatus =
  | "en_transito"
  | "en_cd"
  | "en_tienda"
  | "retirado"
  | "vendido";

export type DocumentCategory =
  | "certificaciones"
  | "calidad"
  | "proveedores"
  | "exportacion"
  | "logistica"
  | "reclamos"
  | "auditorias";

export type DocumentStatus = "vigente" | "por_vencer" | "vencido" | "archivado";

export type CertificationStatus = "vigente" | "por_vencer" | "vencido";

export type AlertLevel = "alta" | "media" | "baja";

export type TraceMode = "inversa" | "adelante";

export type ExplorerMode = "origen" | "destino" | "relaciones";

export type EntityType =
  | "company"
  | "product"
  | "farm"
  | "plot"
  | "harvest"
  | "harvestCrew"
  | "crate"
  | "nursery"
  | "transport"
  | "reception"
  | "qrCode"
  | "processingLot"
  | "packingLot"
  | "packagingMaterial"
  | "clamshellBatch"
  | "inputLot"
  | "box"
  | "pallet"
  | "container"
  | "booking"
  | "qualityControl"
  | "certification"
  | "importer"
  | "distributor"
  | "distributionCenter"
  | "supermarket"
  | "destination"
  | "claim"
  | "incident"
  | "recall"
  | "document"
  | "supplier";

export interface DataSource {
  system: string;
  source: string;
  updatedAt: string;
}

export interface Sourced<T> {
  value: T;
  source: DataSource;
}

export interface Company {
  id: string;
  name: string;
  tradeName: string;
  ruc: string;
  campaign: string;
  plant: string;
  country: string;
  user: {
    name: string;
    role: string;
    initials: string;
  };
}

export interface Product {
  id: string;
  name: string;
  variety: string;
  category: string;
  caliber?: string;
}

export interface Farm {
  id: string;
  name: string;
  code: string;
  supplierId: string;
  region: string;
  district: string;
  hectares: number;
  plotIds: string[];
  certificationIds: string[];
  status: SupplierStatus;
}

export interface Plot {
  id: string;
  code: string;
  farmId: string;
  hectares: number;
  variety: string;
  plantingYear: number;
  supervisor: string;
  nurseryId?: string;
}

export interface Nursery {
  id: string;
  name: string;
  variety: string;
  sourceSystem: string;
  area: string;
  receivedAt: Sourced<string>;
  status: string;
}

export interface TransportMovement {
  id: string;
  harvestId: string;
  fromLabel: string;
  toLabel: string;
  crateFrom: string;
  crateTo: string;
  date: Sourced<string>;
  receptionId: string;
  status: string;
}

export interface ReceptionLot {
  id: string;
  plant: string;
  harvestId: string;
  transportId: string;
  processingLotId: string;
  date: Sourced<string>;
  kgReceived: number;
  status: string;
}

export interface QrCodeRecord {
  id: string;
  packingLotId: string;
  printedAt: Sourced<string>;
  status: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  type: SupplierType;
  productsServices: string;
  status: SupplierStatus;
  lastDelivery: string;
  relatedLotIds: string[];
  incidentCount: number;
  country: string;
  contact: string;
  email: string;
  phone: string;
  certificationIds: string[];
  notes?: string;
}

export interface Harvest {
  id: string;
  plotId: string;
  farmId: string;
  supplierId: string;
  date: Sourced<string>;
  supervisor: string;
  crateFrom: string;
  crateTo: string;
  crateCount: number;
  kgHarvested: number;
  variety: string;
  shift: string;
  crewId?: string;
}

export interface HarvestCrew {
  id: string;
  farmId: string;
  plotId: string;
  name: string;
  supervisor: string;
  shift: string;
  workerCount: number;
  date: string;
}

export interface Crate {
  id: string;
  harvestId: string;
  weightKg: number;
  receivedAt: string;
}

export interface ProcessingLot {
  id: string;
  plant: string;
  line: string;
  date: Sourced<string>;
  time: string;
  harvestIds: string[];
  receptionId?: string;
  kgReceived: number;
  kgOutput: number;
  operator: string;
}

export interface PackingLot {
  id: string;
  productId: string;
  variety: string;
  status: LotStatus;
  harvestIds: string[];
  processingLotId: string;
  clamshellBatchId: string;
  labelBatchId?: string;
  cartonBatchId?: string;
  boxIds: string[];
  boxFrom: string;
  boxTo: string;
  boxCount: number;
  palletIds: string[];
  containerId: string;
  bookingId: string;
  destinationIds: string[];
  qualityControlIds: string[];
  claimIds: string[];
  weightKg: Sourced<number>;
  harvestDate: Sourced<string>;
  processingDate: Sourced<string>;
  packingDate: Sourced<string>;
  packingLine: string;
  clamshellCount: number;
  destinationCountry: string;
  companyId: string;
}

export interface PackagingMaterial {
  id: string;
  name: string;
  type: "clamshell" | "etiqueta" | "caja" | "pallet" | "otro";
  spec: string;
  supplierId: string;
}

export interface ClamshellBatch {
  id: string;
  supplierId: string;
  materialId: string;
  receivedAt: Sourced<string>;
  quantity: number;
  relatedPackingLotIds: string[];
  status: SupplierStatus;
}

export interface InputLot {
  id: string;
  kind: "clamshell" | "etiqueta" | "caja";
  name: string;
  supplierId: string;
  materialId: string;
  receivedAt: Sourced<string>;
  quantity: number;
  unit: string;
  relatedPackingLotIds: string[];
  status: SupplierStatus;
}

export interface Box {
  id: string;
  packingLotId: string;
  palletId: string;
  clamshellCount: number;
  weightKg: number;
}

export interface Pallet {
  id: string;
  packingLotId: string;
  containerId: string;
  boxFrom: string;
  boxTo: string;
  boxCount: number;
  sscc: string;
}

export interface Container {
  id: string;
  bookingId: string;
  packingLotIds: string[];
  palletIds: string[];
  vessel: string;
  departurePort: Sourced<string>;
  destinationPort: Sourced<string>;
  departureDate: Sourced<string>;
  eta: string;
  country: string;
  seal: string;
}

export interface Booking {
  id: string;
  importerId: string;
  containerIds: string[];
  carrier: string;
  origin: string;
  destination: string;
  etd: string;
  eta: string;
}

export interface QualityControl {
  id: string;
  packingLotId: string;
  date: Sourced<string>;
  type: string;
  result: Sourced<QCResult>;
  responsible: string;
  status: "cerrado" | "abierto";
  firmness: string;
  appearance: string;
  condition: string;
  temperature: string;
  observations: string;
  photos: { id: string; label: string; caption: string }[];
  documentIds: string[];
}

export interface Certification {
  id: string;
  name: string;
  relatedEntityType: EntityType;
  relatedEntityId: string;
  relatedEntityLabel: string;
  code: string;
  issuedAt: string;
  expiresAt: string;
  status: CertificationStatus;
  documentId: string;
}

export interface Importer {
  id: string;
  name: string;
  country: string;
  code: string;
  contact: string;
}

export interface Distributor {
  id: string;
  name: string;
  country: string;
  importerId: string;
}

export interface DistributionCenter {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  importerId: string;
}

export interface Supermarket {
  id: string;
  name: string;
  country: string;
  city: string;
  chain: string;
}

export interface Destination {
  id: string;
  packingLotId: string;
  importerId: string;
  distributorId?: string;
  distributionCenterId: string;
  supermarketId: string;
  country: string;
  boxCount: number;
  boxFrom?: string;
  boxTo?: string;
  status: DestinationStatus;
}

export interface ClaimComment {
  id: string;
  author: string;
  at: string;
  text: string;
}

export interface ClaimHistoryItem {
  id: string;
  at: string;
  author: string;
  action: string;
}

export interface Claim {
  id: string;
  date: string;
  client: string;
  supermarketId?: string;
  importerId: string;
  country: string;
  packingLotId: string;
  type: ClaimType;
  severity: Severity;
  status: ClaimStatus;
  responsible: string;
  problem: string;
  description: string;
  affectedBoxes: number;
  photos: { id: string; label: string; caption: string }[];
  attachments: { id: string; name: string; type: string }[];
  comments: ClaimComment[];
  history: ClaimHistoryItem[];
}

export interface Incident {
  id: string;
  claimId?: string;
  packingLotId: string;
  title: string;
  severity: Severity;
  status: ClaimStatus;
  date: string;
}

export interface RecallDistribution {
  supermarketId: string;
  supermarketName: string;
  boxes: number;
  located: number;
}

export interface RecallUpdate {
  id: string;
  at: string;
  author: string;
  text: string;
}

export interface Recall {
  id: string;
  motive: string;
  packingLotId: string;
  palletId: string;
  boxFrom: string;
  boxTo: string;
  totalBoxes: number;
  locatedBoxes: number;
  distribution: RecallDistribution[];
  status: RecallStatus;
  claimId?: string;
  startedAt: string;
  updates: RecallUpdate[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  code: string;
  relatedEntityType: EntityType;
  relatedEntityId: string;
  relatedEntityLabel: string;
  date: string;
  expiresAt?: string;
  source: DataSource;
  status: DocumentStatus;
  category: DocumentCategory;
}

export interface TraceabilityRelation {
  fromType: EntityType;
  fromId: string;
  toType: EntityType;
  toId: string;
  relation: string;
}

export interface TraceSubject {
  type: EntityType;
  id: string;
  label: string;
}

export type TraceBranch = "product" | "input" | "destination";

export interface TraceNode {
  type: EntityType;
  id: string;
  label: string;
  subtitle?: string;
  isOrigin?: boolean;
  relation?: string;
  branch?: TraceBranch;
}

export interface TraceInputGroup {
  kind: "clamshell" | "etiqueta" | "caja";
  title: string;
  batch: TraceNode;
  supplier?: TraceNode;
}

export type TraceLayout = "product-inverse" | "product-forward" | "input-forward" | "input-inverse" | "simple";

export interface TraceViewModel {
  mode: TraceMode;
  layout: TraceLayout;
  origin: TraceNode;
  productChain: TraceNode[];
  inputs: TraceInputGroup[];
  destinationChain: TraceNode[];
}

export type IdentifierLinkKind = "flow" | "uses" | "supplied_by" | "attests";

export interface IdentifierRecord {
  id: string;
  aliases: string[];
  type: EntityType;
  label: string;
  subtitle?: string;
  product?: string;
  status?: string;
  sourceSystem: string;
  area: string;
  updatedAt: string;
  originalId: string;
  sourceName: string;
}

export interface IdentifierLink {
  fromId: string;
  toId: string;
  kind: IdentifierLinkKind;
  relation: string;
  scopeLotIds?: string[];
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  subtitle?: string;
  relation?: string;
  sourceSystem?: string;
  branch?: TraceBranch;
  children: GraphNode[];
}

export interface ExplorerRefGroup {
  title: string;
  node: TraceNode;
  note?: string;
}

export interface ExplorerViewModel {
  mode: ExplorerMode;
  record: IdentifierRecord;
  originTree: GraphNode;
  destinationTree: GraphNode;
  relationTree: GraphNode;
  inputs: TraceInputGroup[];
  quality: ExplorerRefGroup[];
}

export interface ActivityItem {
  id: string;
  at: string;
  text: string;
  href?: string;
}

export interface AlertItem {
  id: string;
  level: AlertLevel;
  text: string;
  href?: string;
}

export interface DashboardKpis {
  activeLots: number;
  observedLots: number;
  openClaims: number;
  criticalIncidents: number;
  activeRecalls: number;
  activeSuppliers: number;
}

export interface NotificationItem {
  id: string;
  text: string;
  at: string;
  read: boolean;
  href?: string;
}
