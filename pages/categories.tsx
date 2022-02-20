import React from 'react';
import api from '../service/api'
import { GetServerSideProps } from 'next';

interface IProducts {
  id: number,
  title: string
}

interface ProductsProps {
  products: IProducts[]
}

export default function Home({ products }: ProductsProps) {
  return (
    <div>
      <h1>Products</h1>

      <section>
        <ul>
          {products.map(product => {
            return (
              <li key={product.id}>
                {product.title}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ProductsProps> = async () => {
  const response = await api.get('http://localhost:3333/products')

  const products = await response.data

  return {
    props: {
      products
    }
  }
}
