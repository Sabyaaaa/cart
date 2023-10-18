import React, { ReactElement, useState } from 'react'
import { ProductType } from '../context/ProductsProvider'
import { ReducerActionType, ReducerAction } from '../context/CartProvider';
import data from '../data/products.json';

type PropsType = {
    product: ProductType,
    dispatch: React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS: ReducerActionType,
    inCart: boolean
}

const Product = ({product, dispatch, REDUCER_ACTIONS, inCart}:PropsType): ReactElement => {

    const [sizes, setSizes] = useState<string>('')
    const[error, setError] = useState<string>('')
   
    const handleSelectChange = (event: any) => {
        console.log(event.target.value)
        setSizes(event.target.value)
    }

    const img: string[] = data.products.map((product: {image_url: string}) => product.image_url);
   

    const onAddtoCart = () => {
        if(sizes.length === 0){
            // alert('Please select a size')
            setError('Please select a size')
            return;
            
        }
        setError('')
      return dispatch({type: REDUCER_ACTIONS.ADD, payload : { ...product}, sizes})
        // dispatch({type: REDUCER_ACTIONS.ADD, payload : { ...product, quantity: 1}})
    }

    const itemInCart = inCart ? ' -> Item in Cart: ✅' : null;

    const content = 
        <article className="product">
            <h3>{product.product_name}</h3>
            <img src={product.image_url} alt={product.product_name} className='product_image'/>
            {/* {img.map((image, index) => 
                ( <img key={index} src={image}  className='product_image' alt={product.name}/>)
            )} */}
            <p>{new Intl.NumberFormat('en-IN', {style: 'currency', currency:'INR'}).format(product.price)}
            {itemInCart}</p>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              
                   <select value={sizes || ''} onChange={handleSelectChange}>
                    <option value="" disabled hidden>
                        Select Size
                    </option>
                   {product.sizes.map((size)=> 
                   <option key={size} value={size}>{size}</option>
                   )}
                 </select>
             {error && <div className='error-message'>{error}</div>}
            </div>
            <button onClick={onAddtoCart} disabled={!setSizes}>Add to Cart</button>
        </article>
    
  return content;
}

export default Product

