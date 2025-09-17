declare module 'react' {
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useState<T>(initialState?: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useRef<T>(initialValue?: T): { current: T };
  export interface ChangeEvent<T = Element> {
    target: T;
  }
  export type ReactNode = any;
  export const React: any;
  export default React;
}

declare module 'firebase/firestore' {
  export function collection(firestore: any, path: string, ...pathSegments: string[]): any;
  export function query(collection: any, ...queryConstraints: any[]): any;
  export function getDocs(query: any): Promise<any>;
  export function orderBy(field: string, direction?: string): any;
  export function where(field: string, op: string, value: any): any;
  export function addDoc(collection: any, data: any): Promise<any>;
  export function serverTimestamp(): any;
  export function updateDoc(doc: any, data: any): Promise<any>;
  export function deleteDoc(doc: any): Promise<any>;
  export function doc(firestore: any, path: string, ...pathSegments: string[]): any;
  export function limit(count: number): any;
}

declare module 'lucide-react' {
  export const Loader2: any;
  export const CalendarCheck: any;
  export const User: any;
  export const Bell: any;
  export const Plus: any;
  export const Clock: any;
  export const AlertTriangle: any;
  export const CheckCircle: any;
  export const XCircle: any;
  export const Edit: any;
  export const Trash2: any;
  export const Phone: any;
  export const Mail: any;
  export const MapPin: any;
  export const UploadCloud: any;
  export const GitCompareArrows: any;
  export const Camera: any;
  export const AlertCircle: any;
  export const Sparkles: any;
  export const FileImage: any;
  export const ClipboardCheck: any;
  export const FileDown: any;
  export const TrendingUp: any;
  export const TrendingDown: any;
  export const Minus: any;
  export const Calendar: any;
  export const BarChart3: any;
  export const Download: any;
  export const Share2: any;
  export const LayoutDashboard: any;
  export const FileText: any;
  export const X: any;
  export const ClipboardList: any;
  export const Archive: any;
  export const CopyCheck: any;
  export const Users: any;
  export const ChevronRight: any;
  export const Menu: any;
  export const PlusCircle: any;
  export const MoreHorizontal: any;
  export const Eye: any;
  export const CalendarDays: any;
  export const MessageSquare: any;
  export const Stethoscope: any;
  export const HeartPulse: any;
  export const Pill: any;
  export const Microscope: any;
  export const FilePlus: any;
  export const Info: any;
  export const RefreshCw: any;
  export const Syringe: any;
  export const Droplets: any;
  export const Ruler: any;
  export const RedoDot: any;
  export const Languages: any;
  export const Moon: any;
  export const Sun: any;
  export const Contrast: any;
  export const Text: any;
  export const Cat: any;
  export const Bot: any;
  export const X: any;
  export const Filter: any;
  export const RefreshCw: any;
  export const Brain: any;
  export const Shield: any;
  export const Zap: any;
  export const ArrowRight: any;
  export const Star: any;
  export const Award: any;
  export const Heart: any;
  export const Activity: any;
  export const MessageCircle: any;
  export const Linkedin: any;
  export const Youtube: any;
  export const Instagram: any;
  export const Accessibility: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const Crown: any;
  export const UserCheck: any;
  export const Lock: any;
  export const Smartphone: any;
  export const Headphones: any;
  export const Settings: any;
}

declare module 'date-fns' {
  export function add(date: Date, duration: any): Date;
  export function format(date: Date, formatStr: string, options?: any): string;
  export function isAfter(date: Date, dateToCompare: Date): boolean;
  export function isSameDay(date: Date, dateToCompare: Date): boolean;
  export function startOfToday(): Date;
  export function differenceInDays(dateLeft: Date, dateRight: Date): number;
  export function isToday(date: Date): boolean;
  export function isTomorrow(date: Date): boolean;
  export function isPast(date: Date): boolean;
}

declare module 'date-fns/locale' {
  export const ptBR: any;
}

declare module 'next/image' {
  export default any;
}

declare module 'next/link' {
  export default any;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): any;
}

declare module 'jspdf' {
  export default any;
}

declare module 'jspdf-autotable' {
  export default any;
}

declare module 'react-hook-form' {
  export function useForm<T>(options?: any): any;
  export function FormProvider(props: any): any;
}

declare global {
  const process: any;
}
