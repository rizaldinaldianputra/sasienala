import { ProductResponse } from '../interface/product';
import { CategoryResponse } from '../interface/product_by_category';
import { ProductCategory } from '../interface/product_category';
import { DetailProduct } from '../interface/product_detail';
import { apiCore } from './main_service';

export const productService = {
  getAllProduct: () => apiCore.get<ProductResponse>('/products/get-products'),
  getProductById: (id: number) => apiCore.get<DetailProduct>(`/products/get-product-id/${id}`),
  getProductCategory: () => apiCore.get<ProductCategory[]>('/products/get_categories_used'),
  searchProduct: (key: string) => apiCore.get<ProductResponse>(`/products/search?query=${key}`),

  getAllProductByCategory: (id: string) =>
    apiCore.get<CategoryResponse[]>(`/products/get_category/${id}`),
};
