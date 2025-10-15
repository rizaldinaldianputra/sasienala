export interface DetailProduct {
  item_id: number;
  item_name: string;
  pre_order: boolean;
  description: string;
  image_list: string[];
  model_list: ProductModel[];
  attribute_list: ProductAttribute[];
  size_chart: string;
  min_purchase: number;
}

export interface ProductModel {
  color: string;
  color_code: string;
  image: string;
  size_list: ProductModelSize[];
}

export interface ProductModelSize {
  model_id: number;
  size: string;
  price: number;
  stock: number;
}

export interface ProductAttribute {
  attribute_id: number;
  original_attribute_name: string;
  attribute_value_list: ProductAttributeValue[];
  is_mandatory: boolean;
}

export interface ProductAttributeValue {
  value_id: number;
  original_value_name: string;
  value_unit: string;
}
