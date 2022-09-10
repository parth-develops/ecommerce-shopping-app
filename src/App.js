import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import Products from './components/Products/Products';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fecthCart = async () => {
    const theCart = await commerce.cart.retrieve();
    setCart(theCart);
  };

  const addToCartHandler = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);
    setCart(item);
  };

  const updateCartQtyHandler = async (productId, quantity) => {
    const item = await commerce.cart.update(productId, { quantity });
    setCart(item);
  };

  const removeFromCartHandler = async (productId) => {
    const item = await commerce.cart.remove(productId);
    setCart(item);
  }

  const emptyCartHandler = async () => {
    const item = await commerce.cart.empty();
    setCart(item);
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);

  }
  const captureCheckoutHandler = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
    fecthCart();
  }, []);

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Routes>
          <Route exact path="/" element={
            products?.length > 0 ? <Products products={products} onAddToCart={addToCartHandler} />
              : <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <CircularProgress />
              </div >
          } />
          <Route exact path="/cart" element={<Cart
            cart={cart}
            updateCartQtyHandler={updateCartQtyHandler}
            removeFromCartHandler={removeFromCartHandler}
            emptyCartHandler={emptyCartHandler}
          />} />
          <Route exact path="/checkout" element={
            <Checkout cart={cart} order={order} onCaptureCheckout={captureCheckoutHandler} emptyCartHandler={emptyCartHandler} error={errorMessage} />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;