// Central demo data store for ExportReady

export type BatchStatus = 'Ready' | 'Almost ready' | 'Missing docs' | 'In progress' | 'Submitted' | 'Overdue';
export type DocStatus = 'Verified' | 'Expiring soon' | 'Missing' | 'Partial';
export type SupplierStatus = 'Verified' | 'Needs review' | 'Expiring soon';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Batch {
  id: string;
  product: string;
  buyer: string;
  country: string;
  batch: string;
  readiness: number;
  status: BatchStatus;
  material: string;
  qty: string;
  lastUpdated: string;
  passportHref: string;
}

export interface Document {
  id: number;
  name: string;
  product: string;
  supplier: string;
  type: string;
  status: DocStatus;
  expires: string;
  size: string;
  uploaded: string;
  batch: string;
}

export interface Supplier {
  id: number;
  name: string;
  role: string;
  location: string;
  contact: string;
  docs: number;
  status: SupplierStatus;
  since: string;
  spend: string;
  spendValue: number;
}

export interface Task {
  id: number;
  title: string;
  owner: string;
  ownerType: 'Supplier' | 'Internal';
  due: string;
  priority: Priority;
  doc: string;
  status: 'Pending' | 'Under Review' | 'Overdue' | 'Expiring soon';
  batch: string;
  product: string;
}

export interface BuyerRequest {
  id: number;
  buyer: string;
  country: string;
  flag: string;
  product: string;
  batch: string;
  received: string;
  deadline: string;
  requirements: string[];
  readiness: number;
  status: 'In progress' | 'Blocked' | 'Almost ready' | 'Submitted';
  passportHref: string;
  blockedBy: string | null;
}

export const BATCHES: Batch[] = [
  { id: 'APC-PUMP-316-042', product: 'SS 316 Pump Impeller', buyer: 'Müller Industrial Systems', country: 'Germany', batch: 'BATCH-2026-0918', readiness: 86, status: 'Almost ready', material: 'Stainless steel SS 316', qty: '2,500 units', lastUpdated: '24 Sep 2026', passportHref: '/passport/APC-PUMP-316-042/BATCH-2026-0918' },
  { id: 'VH-CNC-004', product: 'Valve Housing CNC', buyer: 'Kress GmbH', country: 'Germany', batch: 'BATCH-2026-0915', readiness: 62, status: 'Missing docs', material: 'Carbon steel EN8', qty: '800 units', lastUpdated: '22 Sep 2026', passportHref: '/passport/VH-CNC-004/BATCH-2026-0915' },
  { id: 'MBA-007', product: 'Motor Bracket Assembly', buyer: 'Bosch Supplier Network', country: 'Germany', batch: 'BATCH-2026-0901', readiness: 94, status: 'Almost ready', material: 'Mild steel IS 2062', qty: '1,200 units', lastUpdated: '19 Sep 2026', passportHref: '/passport/MBA-007/BATCH-2026-0901' },
  { id: 'HFS-012', product: 'Hydraulic Fitting Set', buyer: 'Parker Hannifin', country: 'UK', batch: 'BATCH-2026-0887', readiness: 100, status: 'Submitted', material: 'Brass IS 319', qty: '5,000 units', lastUpdated: '15 Sep 2026', passportHref: '/passport/HFS-012/BATCH-2026-0887' },
  { id: 'PSC-019', product: 'Precision Shaft Coupling', buyer: 'Siemens Procurement', country: 'Germany', batch: 'BATCH-2026-0876', readiness: 71, status: 'In progress', material: 'Alloy steel 4140', qty: '650 units', lastUpdated: '14 Sep 2026', passportHref: '/passport/PSC-019/BATCH-2026-0876' },
  { id: 'BRG-031', product: 'Bearing Housing Block', buyer: 'SKF India Export', country: 'Sweden', batch: 'BATCH-2026-0862', readiness: 55, status: 'Missing docs', material: 'Cast iron GG25', qty: '3,000 units', lastUpdated: '10 Sep 2026', passportHref: '/passport/BRG-031/BATCH-2026-0862' },
  { id: 'FLG-045', product: 'Flanged Coupling DN50', buyer: 'ABB Group Procurement', country: 'Switzerland', batch: 'BATCH-2026-0851', readiness: 100, status: 'Submitted', material: 'Ductile iron EN-GJS', qty: '400 units', lastUpdated: '05 Sep 2026', passportHref: '/passport/FLG-045/BATCH-2026-0851' },
  { id: 'SPR-003', product: 'Spring Steel Disc Pack', buyer: 'Rexnord GmbH', country: 'Germany', batch: 'BATCH-2026-0840', readiness: 78, status: 'In progress', material: 'Spring steel 51CrV4', qty: '10,000 units', lastUpdated: '02 Sep 2026', passportHref: '/passport/SPR-003/BATCH-2026-0840' },
];

export const SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Bharat Steel Mills', role: 'Raw material (SS 316 bar stock)', location: 'Jamshedpur, India', contact: 'Ravi Shankar · ravi@bharatsteel.in', docs: 4, status: 'Needs review', since: 'Jan 2024', spend: '₹48.2L / yr', spendValue: 4820000 },
  { id: 2, name: 'Precision Heat Treatment', role: 'Heat treatment & passivation', location: 'Chakan, Pune', contact: 'Anil Desai · anil@pht.co.in', docs: 2, status: 'Expiring soon', since: 'Mar 2023', spend: '₹12.7L / yr', spendValue: 1270000 },
  { id: 3, name: 'EcoPack Solutions', role: 'Export packaging', location: 'Bhosari, Pune', contact: 'Seema Patil · seema@ecopack.in', docs: 1, status: 'Verified', since: 'Jun 2023', spend: '₹5.1L / yr', spendValue: 510000 },
  { id: 4, name: 'TUV SUD India Pvt. Ltd.', role: 'Third-party inspection & certification', location: 'Mumbai, Maharashtra', contact: 'Priya Mehta · priya.mehta@tuv-sud.in', docs: 6, status: 'Verified', since: 'Aug 2022', spend: '₹8.9L / yr', spendValue: 890000 },
  { id: 5, name: 'Nhava Sheva Freight Forwarders', role: 'Export logistics & customs clearance', location: 'Navi Mumbai, Maharashtra', contact: 'Karan Shah · karan@nsff.in', docs: 3, status: 'Verified', since: 'Nov 2023', spend: '₹22.4L / yr', spendValue: 2240000 },
  { id: 6, name: 'Mahindra Intertrade', role: 'Raw material (alloy steel billets)', location: 'Nagpur, Maharashtra', contact: 'Deepak Kulkarni · d.kulkarni@mintertrade.in', docs: 2, status: 'Needs review', since: 'Apr 2025', spend: '₹19.3L / yr', spendValue: 1930000 },
];

export const DOCUMENTS: Document[] = [
  { id: 1, name: 'Mill_Test_Certificate_HN-316-7782.pdf', product: 'SS 316 Pump Impeller', supplier: 'Bharat Steel Mills', type: 'Material Certificate', status: 'Verified', expires: '31 Dec 2027', size: '2.4 MB', uploaded: '12 Sep 2026', batch: 'BATCH-2026-0918' },
  { id: 2, name: 'Inspection_Report_IR-0918.pdf', product: 'SS 316 Pump Impeller', supplier: 'Internal QC', type: 'Inspection Report', status: 'Verified', expires: 'N/A', size: '1.1 MB', uploaded: '19 Sep 2026', batch: 'BATCH-2026-0918' },
  { id: 3, name: 'ISO_9001_Certificate_2024.pdf', product: 'All Products', supplier: 'TUV SUD India', type: 'Quality Certificate', status: 'Expiring soon', expires: '30 Oct 2026', size: '0.8 MB', uploaded: '15 Jan 2024', batch: 'All' },
  { id: 4, name: 'Packing_List_BATCH-0918.pdf', product: 'SS 316 Pump Impeller', supplier: 'EcoPack Solutions', type: 'Shipping', status: 'Verified', expires: 'N/A', size: '0.3 MB', uploaded: '24 Sep 2026', batch: 'BATCH-2026-0918' },
  { id: 5, name: 'CE_Declaration_Conformity.pdf', product: 'Motor Bracket Assembly', supplier: 'Internal', type: 'Compliance', status: 'Verified', expires: '31 Mar 2027', size: '0.5 MB', uploaded: '05 Sep 2026', batch: 'BATCH-2026-0901' },
  { id: 6, name: 'Recycled_Content_Declaration.pdf', product: 'SS 316 Pump Impeller', supplier: 'Bharat Steel Mills', type: 'Sustainability', status: 'Missing', expires: 'Required', size: '—', uploaded: '—', batch: 'BATCH-2026-0918' },
  { id: 7, name: 'Energy_Data_2025.xlsx', product: 'All Products', supplier: 'Operations', type: 'Sustainability', status: 'Partial', expires: 'N/A', size: '0.9 MB', uploaded: '01 Sep 2026', batch: 'All' },
  { id: 8, name: 'Origin_Declaration_BATCH-0918.pdf', product: 'SS 316 Pump Impeller', supplier: 'Internal', type: 'Trade / Origin', status: 'Verified', expires: 'N/A', size: '0.2 MB', uploaded: '20 Sep 2026', batch: 'BATCH-2026-0918' },
  { id: 9, name: 'ISO_14001_Environmental.pdf', product: 'All Products', supplier: 'TUV SUD India', type: 'Environmental', status: 'Expiring soon', expires: '01 Nov 2026', size: '1.2 MB', uploaded: '02 Nov 2023', batch: 'All' },
  { id: 10, name: 'Customs_Invoice_BATCH-0915.pdf', product: 'Valve Housing CNC', supplier: 'Nhava Sheva FF', type: 'Shipping', status: 'Verified', expires: 'N/A', size: '0.4 MB', uploaded: '22 Sep 2026', batch: 'BATCH-2026-0915' },
  { id: 11, name: 'BIS_Certificate_ISI_2062.pdf', product: 'Motor Bracket Assembly', supplier: 'BIS India', type: 'Quality Certificate', status: 'Verified', expires: '31 Dec 2026', size: '0.6 MB', uploaded: '10 Mar 2025', batch: 'BATCH-2026-0901' },
  { id: 12, name: 'Third_Party_Test_Report_HFS.pdf', product: 'Hydraulic Fitting Set', supplier: 'Intertek India', type: 'Testing', status: 'Verified', expires: 'N/A', size: '3.1 MB', uploaded: '05 Sep 2026', batch: 'BATCH-2026-0887' },
];

export const TASKS: Task[] = [
  { id: 1, title: 'Upload recycled-content declaration', owner: 'Bharat Steel Mills', ownerType: 'Supplier', due: '22 Sep 2026', priority: 'High', doc: 'Recycled Content Declaration', status: 'Overdue', batch: 'BATCH-2026-0918', product: 'SS 316 Pump Impeller' },
  { id: 2, title: 'Verify energy-consumption data', owner: 'Operations Team', ownerType: 'Internal', due: '23 Sep 2026', priority: 'Medium', doc: 'Energy Data 2025', status: 'Under Review', batch: 'BATCH-2026-0918', product: 'SS 316 Pump Impeller' },
  { id: 3, title: 'Renew ISO 14001 environmental certificate', owner: 'TUV SUD India', ownerType: 'Supplier', due: '01 Nov 2026', priority: 'Medium', doc: 'ISO 14001 Certificate', status: 'Pending', batch: 'All batches', product: 'All Products' },
  { id: 4, title: 'Confirm production-batch quantity for Valve Housing', owner: 'Production Manager', ownerType: 'Internal', due: '20 Sep 2026', priority: 'High', doc: 'Production Record', status: 'Overdue', batch: 'BATCH-2026-0915', product: 'Valve Housing CNC' },
  { id: 5, title: 'Obtain BIS certificate for Motor Bracket', owner: 'Quality Dept.', ownerType: 'Internal', due: '30 Sep 2026', priority: 'High', doc: 'BIS Certificate', status: 'Pending', batch: 'BATCH-2026-0901', product: 'Motor Bracket Assembly' },
  { id: 6, title: 'Upload updated packing list for Bearing Housing', owner: 'EcoPack Solutions', ownerType: 'Supplier', due: '28 Sep 2026', priority: 'Low', doc: 'Packing List', status: 'Pending', batch: 'BATCH-2026-0862', product: 'Bearing Housing Block' },
  { id: 7, title: 'Renew ISO 9001 quality certificate', owner: 'TUV SUD India', ownerType: 'Supplier', due: '30 Oct 2026', priority: 'Medium', doc: 'ISO 9001 Certificate', status: 'Expiring soon', batch: 'All batches', product: 'All Products' },
];

export const BUYER_REQUESTS: BuyerRequest[] = [
  { id: 1, buyer: 'Müller Industrial Systems GmbH', country: 'Germany', flag: '🇩🇪', product: 'SS 316 Pump Impeller', batch: 'BATCH-2026-0918', received: '25 Sep 2026', deadline: '10 Oct 2026', requirements: ['Mill Test Certificate', 'ISO 9001', 'Origin Declaration', 'Recycled Content Declaration', 'Inspection Report'], readiness: 86, status: 'In progress', passportHref: '/passport/APC-PUMP-316-042/BATCH-2026-0918', blockedBy: 'Recycled-content declaration missing' },
  { id: 2, buyer: 'Kress GmbH', country: 'Germany', flag: '🇩🇪', product: 'Valve Housing CNC', batch: 'BATCH-2026-0915', received: '22 Sep 2026', deadline: '07 Oct 2026', requirements: ['Material Certificate', 'ISO 9001', 'BIS Certificate', 'Packing List', 'REACH Declaration'], readiness: 62, status: 'Blocked', passportHref: '/passport/VH-CNC-004/BATCH-2026-0915', blockedBy: 'BIS certificate & REACH declaration missing' },
  { id: 3, buyer: 'Bosch Supplier Network', country: 'Germany', flag: '🇩🇪', product: 'Motor Bracket Assembly', batch: 'BATCH-2026-0901', received: '15 Sep 2026', deadline: '05 Oct 2026', requirements: ['Inspection Report', 'ISO 9001', 'CE Declaration', 'Origin Declaration'], readiness: 94, status: 'Almost ready', passportHref: '/passport/MBA-007/BATCH-2026-0901', blockedBy: null },
  { id: 4, buyer: 'Parker Hannifin Ltd.', country: 'United Kingdom', flag: '🇬🇧', product: 'Hydraulic Fitting Set', batch: 'BATCH-2026-0887', received: '02 Sep 2026', deadline: '20 Sep 2026', requirements: ['Material Certificate', 'Pressure Test Report', 'ISO 9001', 'RoHS Compliance'], readiness: 100, status: 'Submitted', passportHref: '/passport/HFS-012/BATCH-2026-0887', blockedBy: null },
];

// Readiness history for chart (last 8 weeks)
export const READINESS_HISTORY = [
  { week: 'Aug W1', readiness: 52 },
  { week: 'Aug W2', readiness: 58 },
  { week: 'Aug W3', readiness: 61 },
  { week: 'Aug W4', readiness: 65 },
  { week: 'Sep W1', readiness: 70 },
  { week: 'Sep W2', readiness: 72 },
  { week: 'Sep W3', readiness: 76 },
  { week: 'Sep W4', readiness: 78 },
];

// Monthly export value
export const EXPORT_VOLUME = [
  { month: 'Apr', value: 18.2 },
  { month: 'May', value: 22.4 },
  { month: 'Jun', value: 19.8 },
  { month: 'Jul', value: 28.6 },
  { month: 'Aug', value: 31.2 },
  { month: 'Sep', value: 34.7 },
];

export const DOC_STATUS_COUNTS = [
  { name: 'Verified', value: 38, color: '#22c55e' },
  { name: 'Expiring soon', value: 3, color: '#f97316' },
  { name: 'Missing', value: 4, color: '#ef4444' },
  { name: 'Partial', value: 2, color: '#f59e0b' },
];
