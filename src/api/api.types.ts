export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface ProductsResponse {
  responseCode: number;
  products: Product[];
  message?: string;
}

export interface BrandsResponse {
  responseCode: number;
  brands: Brand[];
  message?: string;
}

export interface Brand {
  id: number;
  brand: string;
}