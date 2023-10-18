import React from 'react'
import useCart from '../hooks/useCart'

type PropsType= {
  viewCart: boolean
}

const Footer = ({viewCart}: PropsType) => {
  const {totalItems, totalPrice} = useCart()

  const pageContent = viewCart?
   <p>Shopping Cart &copy;</p>:
   (
    <>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: {totalPrice}</p>
      <p>Shopping Cart &copy;</p>
    </>
   )

   const content = (
    <footer className="footer">
      {pageContent}
    </footer>
   )
  return content
}

export default Footer