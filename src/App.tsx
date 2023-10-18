import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import { useState } from 'react';

import './App.scss';

function App(){
  const [viewCart, setViewCart] = useState<boolean>(false)

  const pageContent = viewCart ? <Cart />: <ProductList />

  const content = (
    <>
      <Header viewCart={viewCart} setViewCart={setViewCart} />
      {pageContent}
      <Footer viewCart = {viewCart} />
    </>
  )

  return content
}

// const App:React.FC=()=> {
//   return (
//     <div>
//       <h1>hi</h1>
//     </div>
//   );
// }

export default App;
