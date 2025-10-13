// src/hook/useProducts.ts
import { useEffect, useState } from 'react';
import { Product, ProductResponse } from '../interface/product';
import { productService } from '../service/product_service';

export const useProducts = (autoFetchAll = true) => {
  // State untuk list produk
  const [data, setData] = useState<ProductResponse | null>(null);

  // State untuk detail produk
  const [product, setProduct] = useState<Product | null>(null);

  // State loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua produk
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProduct();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil produk');
    } finally {
      setLoading(false);
    }
  };

  // Cari produk berdasarkan kata kunci
  const searchProduct = async (key: string) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const res = await productService.searchProduct(key);
      setData(res);
    } catch (err: any) {
      setError('Produk tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail produk by id
  const fetchProductById = async (id?: number) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      setProduct(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil detail produk');
    } finally {
      setLoading(false);
    }
  };

  // Fetch produk berdasarkan kategori
  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const res = await productService.getAllProductByCategory(categoryId);
      // normalisasi semua products dari category
      const productsArray = res || [];
      setData({ data: productsArray, count: productsArray.length });
      setError(null);
    } catch (err) {
      setError('Gagal mengambil produk berdasarkan kategori');
    } finally {
      setLoading(false);
    }
  };

  // Ambil kategori produk
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductCategory();
      return res;
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil kategori produk');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Clear semua data
  const clearData = () => {
    setData(null);
    setProduct(null);
    setError(null);
  };

  // Auto-fetch semua produk hanya jika autoFetchAll = true
  useEffect(() => {
    if (autoFetchAll) {
      fetchProducts();
    }
  }, [autoFetchAll]);

  return {
    data, // list produk
    product, // detail produk
    loading,
    error,
    refetch: fetchProducts,
    searchProduct,
    fetchProductById,
    fetchProductsByCategory,
    fetchCategories,
    clearData,
  };
};
