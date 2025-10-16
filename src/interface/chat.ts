// src/interface/chatbot.ts

export interface ChatBot {
  id: number;
  user_id: number;
  role: string; // "assistant" | "user"
  content: string;
  payload: ChatBotPayload | null;
  source_type: string | null;
  created_at: string;
}

export interface ChatBotPayload {
  rag_context: RagContext[];
  extra_context?: string | null;
}

export interface RagContext {
  id: number;
  score: number;
  question?: string | null;
  answer?: string | null;
  payload: RagContextPayload;
  document_type: string; // "faq" | "product"
}

export interface RagContextPayload {
  // untuk document_type = "faq"
  question?: string | null;
  answer?: string | null;
  category?: string | null;
  meta?: Meta | null;

  // untuk document_type = "product"
  model_id?: number | null;
  item_id?: number | null;
  product_name?: string | null;
  brand?: string | null;
  category_id?: number | null;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  price?: number | null;
  currency?: string | null;
  stock?: number | null;
  in_stock?: boolean | null;
  condition?: string | null;
  weight_kg?: number | null;
  material?: string | null;
  pattern?: string | null;
  sleeve_length?: string | null;
  occasion?: string | null;
  style?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export interface Meta {
  question: string;
  answer: string;
  category?: string | null;
  to_embed: string;
}

// src/interface/chatbot_response.ts

export interface ChatBotAskResponse {
  answer: string;
  confirmation: boolean;
  products: Product[]; // bisa kosong
  intent: string | null;
  slots: Record<string, any> | null;
  user_message_id: number;
  assistant_message_id: number;
  pending_cart: any | null;
  selected_product: Product | null;
  cart_result: any | null;
}

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  image_url?: string;
  [key: string]: any; // untuk fleksibilitas data produk
}
