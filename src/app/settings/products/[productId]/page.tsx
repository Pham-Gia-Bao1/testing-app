import React from "react";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";
import { API_URL } from "@/utils";

type Props = {
  params: { productId: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: Props,
  ): Promise<Metadata> {
    const id = params.productId;

    try {
      const product = await fetch(`${API_URL}/foods/${id}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return await res.json();
        });

      return {
        title: product.name,
        description: product.description,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        title: 'Error',
        description: 'Unable to fetch product data',
      };
    }
  }

const ProductPage: React.FC<Props> = async ({ params }) => {
  const { productId } = params;

  if (isNaN(productId)) {
    return <p className="w-full text-center text-red-500">Invalid product ID.</p>;
  }
  return <ProductDetail params={{ productId: productId }} />;
};

export default ProductPage;
