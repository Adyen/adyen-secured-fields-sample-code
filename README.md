# Secured Fields Component PHP server example

## This repository is for demo purposes only
This PHP server example is intended to help developers to quickly get up and running with our SecuredFields (aka CustomCard) Component v4.x. <br/>
Always ask a back-end developer to create an implementation of this product.

## Requirements
To run this Secured Fields example, edit the following variables in the <b>config/authentication.ini</b> file:<br/>

<b>$merchantAccount</b>= "YOUR MERCHANT ACCOUNT". <br/>
<b>$checkoutAPIkey</b>= "YOUR CHECKOUT API KEY". <br/>
<b>$clientKey</b>= "YOUR CHECKOUT CLIENT KEY". <br/>

These variables can be found in our customer area.
For more information visit our <a href="https://docs.adyen.com/get-started-with-adyen">getting started guide</a>.<br/>
Also of interest:<br/>
<a href="https://docs.adyen.com/account/manage-account-structure">Manage you account structure</a><br/>
<a href="https://docs.adyen.com/development-resources/api-credentials">API credentials</a>.<br/>
<a href="https://docs.adyen.com/development-resources/client-side-authentication#get-your-client-key">Client-side authentication</a>.

Also make sure that the url function in config/server.php is setting the protocol to the correct value (it might need to be http if you are running these files locally) 

To run with docker, run `$ docker run --rm -it -v $(pwd):/var/www/html -p 8080:80 php:7.4-apache` and then visit `http://localhost:8080`

## Installation

### Deploying this example to Heroku

Use this shortcut to deploy to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Adyen/adyen-secured-fields-sample-code)
  
Alternatively, clone this repository and deploy it to your own PHP server

## Documentation

#### SecuredFields 4.x Component
https://docs.adyen.com/payment-methods/cards/custom-card-integration

#### 3DS 2.0 Example
To see an example of 3DS 2.0 in action run the sample code with the relevant (3DS2) test card numbers, test expiry date and security code credentials.<br/>
See: https://docs.adyen.com/classic-integration/3d-secure/native-3ds2/browser-based-integration#testing-3d-secure-2

#### Migration from CheckoutSecuredFields 1.x
See *Migration.md* (https://github.com/Adyen/adyen-secured-fields-sample-code/blob/main/Migration.md)

#### Migration from CheckoutSecuredFields 2.x or 3.x
See: https://docs.adyen.com/online-payments/migrate-to-web-4-0-0

## License

This repository is open source and available under the MIT license. For more information, see the LICENSE file.
