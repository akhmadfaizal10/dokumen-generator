export interface DocumentData {
  title: string;
  content: string;
  recipient?: string;
  date: string;
  subject?: string;
  documentNumber?: string;
  invoiceNumber?: string;
  dueDate?: string;
  totalAmount?: string;
  taxRate?: string;
  department?: string;
  periodStart?: string;
  periodEnd?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  classification?: 'public' | 'internal' | 'confidential' | 'restricted';
  cc?: string;
  location?: string;
  template: DocumentTemplate;
  letterhead?: Letterhead;
  signature?: {
    name: string;
    position: string;
    signatureImage?: string;
    useDigitalSignature?: boolean;
  };
}