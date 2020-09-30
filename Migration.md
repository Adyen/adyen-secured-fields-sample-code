## Secured Fields v2.0 Migration guide

This file is meant to help you quickly migrate from a v1.x CheckoutSecuredFields integration 
to a v2.x SecuredFields Component integration.

### v1.x

A typical implementation of v1.x CheckoutSecuredFields looked like this:

#### Markup
```html
<div class="checkout-div">
    <!-- TOP LEVEL SECURED FIELDS CONTAINER -->
    <div class="general-payments-container">
        <!-- FIRST CARD PAYMENT METHOD -->
        <div class="payment-container-div">
            <input type="hidden" name="txvariant" value="card"/>
            <label class="pm-form-label">
                <span class="pm-form-label__text">Card number:</span>
                <span class="pm-input-field" data-cse="encryptedCardNumber"></span>
            </label>
            <label class="pm-form-label pm-form-label--exp-date">
                <span class="pm-form-label__text">Expiry date:</span>
                <span class="pm-input-field" data-cse="encryptedExpiryDate"></span>
            </label>
            <label class="pm-form-label pm-form-label--cvc">
                <span class="pm-form-label__text">CVV/CVC:</span>
                <span class="pm-input-field" data-cse="encryptedSecurityCode"></span>
            </label>
        </div>
        <!-- SECOND CARD PAYMENT METHOD -->
        <div class="payment-container-div">
            <input type="hidden" name="txvariant" value="..."/>
            ...
        </div>
    </div>
</div>
```

A key feature to note in the above markup is the top level container: `<div class="general-payments-container">` 
which could contain multiple Card Payment Methods - each in their own `<div>`.
This secondary `<div>` was expected to have a child element ```<input type="hidden" name="txvariant"/>```.

#### JavaScript
```javascript
const csfSetupObj = {
    rootNode : '.general-payments-container',
    configObject : {
        originKey: "pub.v2.9915...4010.adkjhgdjhg...",
        cardGroupTypes: ['mc', 'visa', 'amex']
    },
    paymentMethods : {
        card : {
            sfStyles : {
                base: {
                    color: '#000',
                    fontSize: '14px',
                },
                error: {
                    color: 'red'
                },
                placeholder: {
                    color: '#d8d8d8'
                },
                validated:{
                    color: 'blue'
                }
            },
            placeholders : {
                encryptedCardNumber: '9999 9999 9999 9999',
                encryptedSecurityCode: '1234'
            }
        }
    }
};

const secureFields = window.csf(csfSetupObj);

// Callbacks
secureFields.onLoad( function(cbObj){} )
    .onConfigSuccess( function (cbObj) {} )
    .onAllValid( function (cbObj) {} )
    .onFieldValid( function (cbObj) {} )
    .onBrand( function (cbObj) {} )
    .onError( function (cbObj) {} )
    .onFocus( function (cbObj) {} )
    .onBinValue( function (cbObj) {} );
```

A single instance of CheckoutSecuredFields would be initialised with a reference to the top level container: `.general-payments-container`
and would traverse this element looking for all HTML nodes that contained an `<input name="txvariant">`.
It would create a set of SecuredFields for each discovered HTML node and manage all of these sets.

##### Callbacks
Once the instance of CheckoutSecuredFields was created you could then call its callback setters
passing them a function to act as the callback for particular events: `onConfigSuccess`, `onBrand` etc.

### v2.x

A typical implementation of v2.x SecuredFields component looks like this:

#### Markup
```html
<div class="checkout-div">
    <!-- FIRST CARD PAYMENT METHOD -->
    <div class="payment-container-div first-card-pm">
        <label class="pm-form-label">
            <span class="pm-form-label__text">Card number:</span>
            <span class="pm-input-field" data-cse="encryptedCardNumber"></span>
        </label>
        <label class="pm-form-label pm-form-label--exp-date">
            <span class="pm-form-label__text">Expiry date:</span>
            <span class="pm-input-field" data-cse="encryptedExpiryDate"></span>
        </label>
        <label class="pm-form-label pm-form-label--cvc">
            <span class="pm-form-label__text">CVV/CVC:</span>
            <span class="pm-input-field" data-cse="encryptedSecurityCode"></span>
        </label>
    </div>
    <!-- SECOND CARD PAYMENT METHOD -->
    <div class="payment-container-div second-card-pm">
    ...
    </div>
</div>
```
The main difference from v1.x is that there is no longer a top level container `<div class="general-payments-container">` 
and the element that holds the SecuredFields `<div class="payment-container-div">` no longer requires a child element `<input name="txvariant>`.


#### Javascript
```javascript
window.checkout = new AdyenCheckout({
    locale: 'en-US',
    originKey: 'pub.v2.8713...445.aHR0cDovL2xvY2Fsa...',
    loadingContext: 'https://checkoutshopper-test.adyen.com/checkoutshopper/',
    onChange: function (cbObj) {}// #3 see note below
});

window.securedFields = checkout
    .create('securedfields', {
         type: 'card',
         groupTypes: ['mc', 'visa', 'amex'],
         styles : {
             base: {
                 color: '#000',
                 fontSize: '14px',
             },
             error: {
                 color: 'red'
             },
             placeholder: {
                 color: '#d8d8d8'
             },
             validated:{
                 color: 'blue'
             }
         },
         placeholders: {
             encryptedCardNumber: '9999 9999 9999 9999',
             encryptedSecurityCode: '1234'
         },
         // Callbacks
         onLoad: function (cbObj) {},
         onConfigSuccess: function (cbObj) {},
         onAllValid: function (cbObj) {},// #1 see note below
         onChange: function (cbObj) {},// #2 see note below
         onFieldValid: function (cbObj) {},
         onBrand: function (cbObj) {},
         onError: function (cbObj) {},
         onFocus: function (cbObj) {},
         onBinValue: function (cbObj) {}
    })
    .mount('.payment-container-div.first-card-pm');
```
The `originKey` and `loadingContext` are now set on **the instance of** ***AdyenCheckout**** **that you have to create before you can instantiate the SecuredFields component.**

A new SecuredFields component
will be instantiated for each `.payment-container-div`. 
A SecuredFields Component has responsibility for **just one** set of SecuredFields.

#### Callbacks ###
Callback functions:
- Are now passed as properties on the config object used to create the component.
- Although the `onAllValid` callback (**\#1**) is still supported it is recommended to replace this with...
- ...the `onChange` callback (**\#2**).

The `onChange` callback receives an object with a property `isValid`. If this is set to `true` then the object can also be read to extract the `data`
property which contains all the **encrypted blobs** generated by the SecuredFields component.

**\#3** It is considered best practice to place this `onChange` callback 
on **the instance of** ***AdyenCheckout**** **that you have to create before you can instantiate the SecuredFields component.**<br/>
This creates a central handler for all payment data in the event that you have mulitple Payment Methods on your page.

### *A note on AdyenCheckout

SecuredFields is now part of the Adyen Checkout Components solution. For this reason you must first instantiate AdyenCheckout before you
can instantiate any SecuredFields components.<br/>
<br /> When AdyenCheckout is instantiated it is passed the `originKey`, `environment` and optionally a `locale`. 
This latter has the benefit that any error messages generated by SecuredFields will be translated according to the `locale` and placed
into an `i18n` property in the object sent to the `onError` callback.

Another **major** benefit of SecuredFields being part of the Adyen Checkout Components is that it makes it **very easy to move into a 3DS2.0 flow** if the
response from the `/payments` request demands it.<br/>
See https://docs.adyen.com/checkout/3d-secure/native-3ds2/web-component#3ds2-component


#### 3DS 2.0 Example
To see an example of 3DS 2.0 in action run the sample code using the url: `/index_with3DS2.php`<br/>
For relevant test card numbers, test expiry date and security code credentials, see https://docs.adyen.com/classic-integration/3d-secure/native-3ds2/browser-based-integration#testing-3d-secure-2