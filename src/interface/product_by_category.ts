// Produk umum
export interface Product {
  item_id: number;
  item_name: string;
  price: number;
  stock: number;
  image: string;
}

// Response get-products
export interface ProductResponse {
  data: Product[];
}

// Response get-category/{id}
export interface CategoryResponse {
  category_id: number;
  category_name: string;
  products: Product[];
}
