export interface User {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  published: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface PetitionSignature {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  zipcode?: string;
  subscribed?: boolean;
  created_at?: Date | string;
}

export interface DashboardStats {
  totalInquiries: number;
  totalNews: number;
  totalSignatures: number;
  pendingInquiries: number;
}
