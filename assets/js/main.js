$(document).ready(function() {
    // For demo purposes: show hint on how to configure the 'setup' call
    let showHint = false;
    const explanationDiv = $('.explanation');

    function showExplanation() {
        if (showHint) {
            explanationDiv.show();
        }
    }

    window.setTimeout(showExplanation, 5000);
    //-----------------------------------------------------------------------

    let hideCVC = false;
    let hideDate = false;
    let isDualBranding = false;
    let payButton = null;
    const sfText = document.querySelector('.sf-text');

    function setAttributes(el, attrs) {
        for (const key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    function setLogosActive(rootNode, mode) {
        const imageHolder = rootNode.querySelector('.pm-image');
        const dualBrandingImageHolder = rootNode.querySelector('.pm-image-dual');

        switch (mode) {
            case 'dualBranding_notValid':
                Object.assign(imageHolder.style, { display: 'none' });
                Object.assign(dualBrandingImageHolder.style, { display: 'block', 'pointer-events': 'none', opacity: 0.5 });
                break;

            case 'dualBranding_valid':
                Object.assign(imageHolder.style, { display: 'none' });
                Object.assign(dualBrandingImageHolder.style, { display: 'block', 'pointer-events': 'auto', opacity: 1 });
                break;

            default:
                // reset
                Object.assign(imageHolder.style, { display: 'block' });
                Object.assign(dualBrandingImageHolder.style, { display: 'none' });
        }
    }

    function createSecuredFields(clientKey) {

        // Optional SecuredFields styling config
        // For more information: https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
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

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////// CALLBACK FUNCTIONS FOR SECURED FIELDS /////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        const onConfigSuccess = (cbObj) => {
            document.querySelector('.card-input__spinner__holder').style.display = 'none';

            cbObj.rootNode.style.display = 'block';
            cbObj.rootNode.querySelector('.pm-image-dual').style.display = 'none';

            setLogosActive(cbObj.rootNode);
        };

        const onBrand = (cbObj) => {
            /**
             * If not in dual branding mode - add card brand to first image element
             */
            if (!isDualBranding) {
                const brandLogo1 = cbObj.rootNode.querySelector('#pmImage');
                setAttributes(brandLogo1, {
                    src: cbObj.brandImageUrl,
                    alt: cbObj.brand
                });
            }

            /**
             * Deal with showing/hiding CVC field
             */
            const cvcNode = cbObj.rootNode.querySelector('.pm-form-label--cvc');

            if (cbObj.cvcPolicy === 'hidden' && !hideCVC) {
                hideCVC = true;
                cvcNode.style.display = 'none';
            }
            if (hideCVC && cbObj.cvcPolicy !== 'hidden') {
                hideCVC = false;
                cvcNode.style.display = 'block';
            }

            /**
             * Deal with showing/hiding date field(s)
             */
            const dateNode = cbObj.rootNode.querySelector('.pm-form-label--exp-date');
            const monthNode = cbObj.rootNode.querySelector('.pm-form-label.exp-month');
            const yearNode = cbObj.rootNode.querySelector('.pm-form-label.exp-year');

            if (cbObj.datePolicy === 'hidden' && !hideDate) {
                hideDate = true;
                if (dateNode) dateNode.style.display = 'none';
                if (monthNode) monthNode.style.display = 'none';
                if (yearNode) yearNode.style.display = 'none';
            }

            if (hideDate && cbObj.datePolicy !== 'hidden') {
                hideDate = false;
                if (dateNode) dateNode.style.display = 'block';
                if (monthNode) monthNode.style.display = 'block';
                if (yearNode) yearNode.style.display = 'block';
            }
        };

        const onFocus = (cbObj) => {
            const sfNode = cbObj.rootNode.querySelector(`[data-cse="${cbObj.fieldType}"]`);
            // Add focus
            if (cbObj.focus) {
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

        const onError = (cbObj) => {
            const sfNode = cbObj.rootNode.querySelector(`[data-cse="${cbObj.fieldType}"]`);
            const errorNode = sfNode.parentNode.querySelector('.pm-form-label__error-text');
            if (cbObj.error !== '') {
                errorNode.style.display = 'block';
                errorNode.innerText = cbObj.errorI18n;
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

        const onFieldValid = (cbObj) => {
//            console.log('onFieldValid:: end digits =',cbObj.endDigits);
        };

        const onBinValue = (cbObj) => {
//            console.log('onBinValue:: bin =',cbObj.binValue);
        };

        function dualBrandListener(e) {
            securedFields.dualBrandingChangeHandler(e);
        }

        function resetDualBranding(rootNode) {
            isDualBranding = false;

            setLogosActive(rootNode);

            const brandLogo1 = rootNode.querySelector('#pmImageDual1');
            brandLogo1.removeEventListener('click', dualBrandListener);

            const brandLogo2 = rootNode.querySelector('#pmImageDual2');
            brandLogo2.removeEventListener('click', dualBrandListener);
        }

        /**
         * Implementing dual branding
         */
        function onDualBrand(cbObj) {
            const brandLogo1 = cbObj.rootNode.querySelector('#pmImageDual1');
            const brandLogo2 = cbObj.rootNode.querySelector('#pmImageDual2');

            isDualBranding = true;

            const supportedBrands = cbObj.supportedBrandsRaw;

            /**
             * Set first brand icon (and, importantly also add alt &/or data-value attrs); and add event listener
             */
            setAttributes(brandLogo1, {
                src: supportedBrands[0].brandImageUrl,
                alt: supportedBrands[0].brand,
                'data-value': supportedBrands[0].brand
            });

            brandLogo1.addEventListener('click', dualBrandListener);

            /**
             * Set second brand icon (and, importantly also add alt &/or data-value attrs); and add event listener
             */
            setAttributes(brandLogo2, {
                src: supportedBrands[1].brandImageUrl,
                alt: supportedBrands[1].brand,
                'data-value': supportedBrands[1].brand
            });
            brandLogo2.addEventListener('click', dualBrandListener);
        }

        function onBinLookup(cbObj) {
            /**
             * Dual branded result...
             */
            if (cbObj.supportedBrandsRaw?.length > 1) {
                onDualBrand(cbObj);
                return;
            }

            /**
             * ...else - binLookup 'reset' result or binLookup result with only one brand
             */
            resetDualBranding(cbObj.rootNode);
        }

        function onChange(state) {
            /**
             * If we're in a dual branding scenario & the number field becomes valid or is valid and become invalid
             * - set the brand logos to the required 'state'
             */
            if (isDualBranding) {
                const mode = state.valid.encryptedCardNumber ? 'dualBranding_valid' : 'dualBranding_notValid';
                setLogosActive(document.querySelector('.secured-fields'), mode);
            }

            handleOnChange(state);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////// INITIALIZE CHECKOUT CORE //////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        window.checkout = new AdyenCheckout({
            locale: 'en-US',
            clientKey,
            environment: 'test',
            onError: console.error,
            onAdditionalDetails: makeDetailsCall,
            paymentMethodsConfiguration : {
                threeDS2: {challengeWindowSize: '04'}
            }
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// INITIALIZE SECURED FIELDS COMPONENT ////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        window.securedFields = checkout
            .create('securedfields', {
                type: 'card',
                brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
                styles,
                allowedDOMAccess: false, // Whether encrypted blobs will be added to the DOM. OPTIONAL - defaults to false
                autoFocus: true, // Whether focus will automatically jump from date to security code fields. OPTIONAL - defaults to true
                onConfigSuccess,
                onBrand,
                onFocus,
                onError,
                onFieldValid,
                onBinValue,
                onBinLookup,
                onChange
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
        payBtn.classList.add('adyen-checkout__button', `js-${attribute}`);

        payBtn.addEventListener('click', e => {
            e.preventDefault();
            startPayment(component);
        });

        document.querySelector(parent).appendChild(payBtn);

        return payBtn;
    }

    function handleOnChange(state) {
        if (!state.data || !state.data.paymentMethod) return;

        if(state.isValid){
            payButton.removeAttribute('disabled');
        }else{
            payButton.setAttribute('disabled', 'true');
        }
    }

    function handlePaymentResult(result) {
        console.log('Payment result: ', result);

        switch (result.resultCode) {
            case 'RedirectShopper':
                window.securedFields.handleAction(result.action);
                break;
            case 'IdentifyShopper':
            case 'ChallengeShopper':
                threeDS2(result);
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

    function threeDS2(result) {
        const button = document.querySelector('.js-securedfields');

        const { resultCode } = result;

        if (window.securedFields) {
            window.securedFields.unmount();

            const sfNode = document.querySelector('.secured-fields');
            while (sfNode.firstChild) {
                sfNode.removeChild(sfNode.firstChild);
            }
        }

        if (button) {
            button.remove();
        }

        sfText.innerText = 'Identify and/or Challenge Shopper';

        if (resultCode === 'IdentifyShopper' || resultCode === 'ChallengeShopper') {
//            window.checkout.createFromAction(result.action).mount('.secured-fields');
            window.securedFields.handleAction(result.action);//, {challengeWindowSize: '01'});
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// PERFORM SETUP CALL /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function setup(){
        if(window.clientKey){
            createSecuredFields(window.clientKey);
        }else{
            // For demo purposes show hint to edit Merchant Account property etc
            showHint = true;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// MAKE PAYMENT ///////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function startPayment(component){
        payButton.setAttribute('disabled', 'true');

        $.ajax({
            url: './api/payments.php',
            dataType:'json',
            method:'POST',
            data: component.data.paymentMethod,

            success:function(data) {
                handlePaymentResult(data);
            },

            error : function(){
                console.log('Server::startPayment error:: args=', arguments);
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// MAKE 3DS2 DETAILS CALL /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function makeDetailsCall({ data }){
        $.ajax({
            url: './api/payments.details.php',
            dataType:'json',
            method:'POST',
            data,

            success:function(resultData) {
                handlePaymentResult(resultData);
            },

            error : function(){
                console.log('Server::makeDetailsCall error:: args=', arguments);
            }
        });
    }

    setup();
});