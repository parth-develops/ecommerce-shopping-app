import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import useStyles from './styles';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, emptyCartHandler, removeFromCartHandler, updateCartQtyHandler }) => {
  const classes = useStyles();

  const EmptyCart = () => {
    return (
      <Typography variant='subtitle1'>Your cart is empty! <Link to="/">Start adding some items!</Link> </Typography>
    );
  };

  const FilledCart = () => {
    return (
      <>
        <Grid container spacing={3}>
          {cart?.line_items.map((item) => (
            <Grid item xs={12} sm={4} key={item.id}>
              <CartItem item={item} onUpdateCartQty={updateCartQtyHandler} onRemoveFromCart={removeFromCartHandler} />
            </Grid>
          ))}
        </Grid>
        <div className={classes.cardDetails}>
          <Typography variant="h4">
            Sub Total: {cart.subtotal.formatted_with_symbol}
          </Typography>
          <div>
            <Button className={classes.emptyButton} size="large" type="button" variant='contained' color="secondary" onClick={emptyCartHandler} >Empty Cart</Button>
            <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant='contained' color="primary">Checkout</Button>
          </div>
        </div>
      </>
    );
  };

  if (!cart.line_items) {
    return 'Loading...';
  }

  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography className={classes.title} gutterBottom variant='h3'>Your Shopping Cart</Typography>
      {!cart?.line_items.length ? <EmptyCart /> : <FilledCart />}
    </Container>
  );
};

export default Cart;