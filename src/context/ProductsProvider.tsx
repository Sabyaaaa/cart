
import { ReactElement, createContext, useState, useEffect } from "react";

export type ProductType ={
    id: number,
    product_name: string,
    image_url: string,
    price: number,
    sizes: string[],
}

const initState: ProductType[] = []

export type UseProductsContextType = {products: ProductType[]}

const initContextState: UseProductsContextType = {products: []}

const ProductsContext = createContext<UseProductsContextType>(initContextState)

type ChildrenType = {children?: ReactElement | ReactElement[] }

export const ProductsProvider= ({ children }: ChildrenType):ReactElement => {
    const [products, setProducts]=useState<ProductType[]>(initState)

    console.log("product console"+products)

    useEffect(()=>{
        const fetchProducts = async (): Promise<ProductType[]> => {
            const data = await fetch("http://localhost:3001/products").then(res => {
                return res.json()
            }).catch(err => {
                if(err instanceof Error)
                console.log(err.message)
            })
        return data
        }
        fetchProducts().then(products => setProducts(products))
    },[])

    return(
        <ProductsContext.Provider value={{products}}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsContext