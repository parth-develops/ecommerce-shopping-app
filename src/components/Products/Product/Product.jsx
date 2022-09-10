import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import useStyles from './styles';

const Product = ({ product, onAddToCart }) => {
  const classes = useStyles();

  const handleAddToCart = () => onAddToCart(product.id, 1);

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.media} image={product.image.url} title={product.name} />
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant='h5' gutterBottom>
            {product.name}
          </Typography>
          <Typography variant='h5'>
            {product.price.formatted_with_symbol}
          </Typography>
        </div>
        <Typography dangerouslySetInnerHTML={{ __html: product.description }} variant='body2' color='textSecondary' />
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Button className={classes.addToCartBtn} fullWidth aria-label='Add to Cart' onClick={handleAddToCart} variant='contained' color='primary'>
          <span style={{marginRight: '16px'}}>Add to Cart</span>
          <AddShoppingCart />
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;