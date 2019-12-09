# Secured Fields Component PHP server example

## This repository is for demo purposes only
This PHP server example is intended to help developers to quickly get up and running with our SecuredFields v2.0 Component. <br/>
Always ask a back-end developer to create an implementation of this product.

## Requirements
To run this Secured Fields example, edit the following variables in the <b>config/authentication.ini</b> file:<br/>

<b>$merchantAccount</b>= "YOURMERCHANTACCOUNT". <br/>
<b>$checkoutAPIkey</b>= "YOUR CHECKOUT API KEY". <br/>

These variables can be found in our customer area.
For more information visit our <a href="https://docs.adyen.com/developers/payments-basics/get-started-with-adyen">getting started guide</a>.<br/>

## Installation

### Deploying this example to Heroku

Use this shortcut to deploy to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Adyen/adyen-secured-fields-sample-code)
  
Alternatively, clone this repository and deploy it to your own PHP server

## Documentation

#### Migration from CheckoutSecuredfields 1.x
See *Migration.md* (https://github.com/Adyen/adyen-secured-fields-sample-code/blob/master/Migration.md)

#### SecuredFields 2.x Component
https://docs.adyen.com/payment-methods/cards/custom-card-fields

#### 3DS 2.0 Example
To see an example of 3DS 2.0 in action run the sample code using the url: `/index_with3DS2.php`<br/>
For relevant test card numbers see https://docs.adyen.com/developers/risk-management/3d-secure-2/3ds2-checkout-api-integration#testing3dsecure2
<br />(and https://docs.adyen.com/developers/development-resources/test-cards/test-card-numbers for test expiry date and security code credentials).

## License

This repository is open source and available under the MIT license. For more information, see the LICENSE file.
