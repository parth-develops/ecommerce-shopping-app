import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

// const STRIPE_PUB_KEY = 'pk_test_51LgR8tSFyZMMX7hPjSKuEGjQkDQuo0s1HNFT0pno7xrKa5tPolLZByLtHHJdcsq0S0lzznq1FjW06Kx9TiMjiyX800Vz141dy4';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);

const PaymentForm = ({ checkoutToken, shippingData, backStep, nextStep, onCaptureCheckout, timeout, emptyCartHandler }) => {
  const formSubmitHandler = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.log(error);
    } else {
      const orderData = {
        line_items: checkoutToken.line_items,
        customer: {
          firstname: shippingData.firstname,
          lastname: shippingData.lastname,
          email: shippingData.email
        },
        shipping: {
          name: 'Primary',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubDivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        fulfillment: {shipping_method: shippingData.shippingOption},
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id
          }
        }
      };
      onCaptureCheckout(checkoutToken.id, orderData);
      timeout();
      emptyCartHandler();

      nextStep();
    }
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>
        Payment Method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(event) => formSubmitHandler(event, elements, stripe)}>
              <CardElement />
              <br />
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button variant='contained' type='submit' disabled={!stripe} color='primary'>Pay {checkoutToken.subtotal.formatted_with_symbol}</Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;