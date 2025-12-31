
export interface Item {
  id: string;
  title: string;
  image: string; // Base64 or URL
  description: string;
  price: number | string;
  stock: number | string;
  remarks: string;
  createdAt: number;
}

export type ViewState = 'form' | 'list' | 'settings';
