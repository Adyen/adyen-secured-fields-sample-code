$(document).ready(function() {

    // For demo purposes: show hint on how to configure the 'setup' call
    let showHint = false;
    const explanationDiv = $('.explanation');

    function showExplanation() {
        if (showHint) {
            explanationDiv.show();
        }
    }

    window.setTimeout(showExplanation, 4000);
    //-----------------------------------------------------------------------

    let csfHideCVC = false;
    let payButton = null;
    const sfText = document.querySelector('.sf-text');

    function createSecuredFields(originKey) {

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////// STYLING, PLACEHOLDERS & ARIA LABELS FOR SECURED FIELDS /////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // For more information:
        // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
        const styles = {
            base: {
                color: '#000',
                fontSize: '14px',
                lineHeight: '14px'
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
        };

        const placeholders = {
            encryptedCardNumber : '9999 9999 9999 9999',
            encryptedSecurityCode : '1234'
        }

        const ariaLabels = {
            lang: 'en-GB',
            encryptedCardNumber: {
                label: 'Credit or debit card number field'
            },
            encryptedExpiryDate: {
                label: 'Credit or debit card expiration date field'
            },
            encryptedSecurityCode: {
                label: 'Credit or debit card 3 or 4 digit security code field'
            }
        };

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////// CALLBACK FUNCTIONS FOR SECURED FIELDS /////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        const onConfigSuccess = function(cbObj) {
            document.querySelector('.secured-fields').style.display = 'block';
            document.querySelector('.card-input__spinner__holder').style.display = 'none';
        };

        const onBrand = function(cbObj) {
            const holderDiv = document.querySelector('.secured-fields');
            holderDiv.querySelector('#pmImage').setAttribute('src', cbObj.brandImageUrl);
            let labelNode;
            if (cbObj.hideCVC && !csfHideCVC) {
                csfHideCVC = true;
                labelNode = cbObj.rootNode.getElementsByClassName('pm-form-label--cvc')[0];
                labelNode.style.display = 'none';
            }
            if (csfHideCVC && cbObj.hideCVC === false) {
                csfHideCVC = false;
                labelNode = cbObj.rootNode.getElementsByClassName('pm-form-label--cvc')[0];
                labelNode.style.display = 'block';
            }
        };

        const onFocus = function(cbObj) {
            const sfNode = cbObj.rootNode.querySelector('[data-cse="' + cbObj.fieldType + '"]');
            // Add focus
            if ( cbObj.focus) {
                if (sfNode.className.indexOf('pm-input-field--focus') === -1) {
                    sfNode.className += ' pm-input-field--focus';
                }
                return;
            }
            // Remove focus
            if (sfNode.className.indexOf('pm-input-field--focus') > -1) {
                const newClassName = sfNode.className.replace('pm-input-field--focus', '');
                sfNode.className = newClassName.trim();
            }
        };

        const onError = function(cbObj) {
            const sfNode = cbObj.rootNode.querySelector('[data-cse="' + cbObj.fieldType + '"]');
            const errorNode = sfNode.parentNode.querySelector('.pm-form-label__error-text');
            if (cbObj.error !== '') {
                errorNode.style.display = 'block';
                errorNode.innerText = cbObj.i18n;
                // Add error classes
                if (sfNode.className.indexOf('pm-input-field--error') === -1) {
                    sfNode.className += ' pm-input-field--error';
                }
            } else if (cbObj.error === '') {
                errorNode.style.display = 'none';
                errorNode.innerText = '';
                // Remove error classes
                if (sfNode.className.indexOf('pm-input-field--error') > -1) {
                    const newClassName = sfNode.className.replace('pm-input-field--error', '');
                    sfNode.className = newClassName.trim();
                }
            }
        };

        const onFieldValid = function(cbObj) {
//            console.log('onFieldValid:: end digits =',cbObj.endDigits);
        };

        const onBinValue = function(cbObj) {
//            console.log('onBinValue:: bin =',cbObj.binValue);
        };

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////// INITIALIZE CHECKOUT CORE //////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        window.checkout = new AdyenCheckout({
            locale: 'en-US',
            originKey,
            loadingContext: 'https://checkoutshopper-test.adyen.com/checkoutshopper/',
            onChange: handleOnChange,
            onError: console.error
        });


        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// INITIALIZE SECURED FIELDS COMPONENT ////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        window.securedFields = checkout
            .create('securedfields', {
                type: 'card',
                groupTypes: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
                styles,
                placeholders,
                ariaLabels,
                allowedDOMAccess: false, // Whether encrypted blobs will be added to the DOM. OPTIONAL - defaults to false
                autoFocus: true, // Whether focus will automatically jump from date to security code fields. OPTIONAL - defaults to true
                onConfigSuccess,
                onBrand,
                onFocus,
                onError,
                onFieldValid,
                onBinValue
            })
            .mount('.secured-fields');
        //--------------------------------------------------------------------------------------------------


        // Add pay button
        payButton = createPayButton('.secured-fields', window.securedFields, 'securedfields');
        payButton.setAttribute('disabled', 'true');
    }


    function createPayButton(parent, component, attribute) {

        const payBtn = document.createElement('button');

        payBtn.textContent = 'Pay';
        payBtn.name = 'pay';
        payBtn.classList.add('adyen-checkout__button', 'js-' + attribute);

        payBtn.addEventListener('click', e => {
            e.preventDefault();
            startPayment(component);
        });

        document.querySelector(parent).appendChild(payBtn);

        return payBtn;
    }

    function handleOnChange(state) {

        if(!state.data.type) return;

        if(state.isValid){
            payButton.removeAttribute('disabled');
        }else{
            payButton.setAttribute('disabled', 'true');
        }
    }

    function handlePaymentResult(result) {
        console.log('Result: ', result);

        switch (result.resultCode) {
            case 'RedirectShopper':
                window.location = result.redirect.url;
                break;
            case 'Authorised':
                sfText.innerText = result.resultCode;
                document.querySelector('.secured-fields').style.display = 'none';
                break;
            case 'Refused':
                sfText.innerText = result.resultCode;
                break;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// PERFORM SETUP CALL /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Make 'setup' call with originKeys.php - performs the server call to checkout.adyen.com
    function setup(){

        $.ajax({

            url: 'api/originKeys.php',
            dataType:'json',
            method:'POST',

            success:function(data) {

                // Check that the expected object has been loaded
                if(data.hasOwnProperty('originKeys')){

                    const protocol = window.location.protocol;
                    const host = window.location.host;
                    const url = protocol + '//' + host;
                    const originKey = data.originKeys[url];

                    // Create SecuredFields component
                    createSecuredFields(originKey);

                }else{

                    // For demo purposes show hint to edit Merchant Account property etc
                    showHint = true;
                }
            },

            error : function(){
                console.log('Server::originKeys error:: args=', arguments);
                showHint = true;
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// MAKE PAYMENT ///////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function startPayment({ paymentData }){

        payButton.setAttribute('disabled', 'true');

        $.ajax({

            url: 'api/payments.php',
            dataType:'json',
            method:'POST',
            data: paymentData,

            success:function(data) {
                handlePaymentResult(data);
            },

            error : function(){
                console.log('Server::startPayment error:: args=', arguments);
            }
        });
    }

    setup();
});