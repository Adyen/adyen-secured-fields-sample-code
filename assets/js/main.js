$(document).ready(function() {

    var apiResponseData,
        securedFields,
        paymentMethodType,
        showHint = false,
        payButton = $(".button--pay"),
        logoBaseUrl,
        brandImage = $('.brand-container__image');


    // Send styling to securedFields, for more information: https://docs.adyen.com/developers/checkout-javascript-sdk/styling-secured-fields
    var hostedFieldStyle = {
        base: {
            fontSize: '16px'
        }
    };

    // Functionality around showing hint on how to configure the 'setup' call
    var explanationDiv = $('.explanation');
    explanationDiv.hide();

    function showExplanation() {
        if (showHint) {
            explanationDiv.show();
        }
    }

    window.setTimeout(showExplanation, 4000);


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// INITIALIZE CHECKOUT SECURED FIELDS /////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @function Renders the hosted iframes into the elements created to hold them
     * (In this case <span> elements within the <form> element)
     *
     * @param jsonResponseObject - the JSON response from the 'setup' call to the Adyen CheckoutAPI
     */
    function initializeSecuredFields(jsonResponseObject) {

        // Create config object
        var securedFieldsConfiguration = {
            configObject : jsonResponseObject,
            rootNode: '.form-div',
            cssStyles : hostedFieldStyle
        };

        // Pass config object to checkoutSecuredFields
        securedFields = csf(securedFieldsConfiguration);

        // Add listeners to checkoutSecuredFields
        securedFields.onLoad( function(){
            // Triggers when all the securedFields iframes are loaded
        });

        securedFields.onFieldValid( function(fieldValidObject){
            // Triggers as individual input fields become valid - and triggers again if the same field becomes invalid
        });

        securedFields.onAllValid( function(allValidObject){
            // Triggers when all the credit card input fields are valid - and triggers again if this state changes

            if (allValidObject.allValid === true) {
                payButton.removeClass('disabled');
            } else {
                payButton.addClass('disabled');
            }
        });

        securedFields.onBrand( function(brandObject){
            // Triggered when receiving a brand callback from the credit card number validation

            if (brandObject.brand) {
                brandImage.attr("src",logoBaseUrl + brandObject.brand + "@2x.png");
                paymentMethodType = brandObject.brand;
            }
        });

        securedFields.onError( function(pCallbackObj){
            // Triggered when an error occurs e.g. invalid date
        });
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// PERFORM SETUP CALL /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Make 'setup' call with serverCall.php - performs the server call to checkout.adyen.com
    $.ajax({
        url: 'api/serverCall.php',
        dataType:'json',
        method:'POST', // jQuery > 1.9
        type:'POST', //jQuery < 1.9

        success:function(data) {

            // Store JSON response from 'setup' call
            apiResponseData = data;

            // Store base url for setting card brand images
            logoBaseUrl = apiResponseData.logoBaseUrl;

            // Set initial 'generic' card logo
            brandImage.attr("src", logoBaseUrl + "card@2x.png");

            // For demo purposes check that the expected object has been loaded, otherwise show hint
            if(apiResponseData.hasOwnProperty('originKey')){

                // Initialize checkoutSecuredFields
                initializeSecuredFields(apiResponseData);

            }else{

                // Show hint to edit Merchant Account property etc
                showHint = true;
            }
        },

        error : function(){
            if(window.console && console.log){
                console.log('### adyenCheckout::error:: args=', arguments);
            }
        }
    });


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// AUTHORIZE PAYMENT //////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @function Create a function that the 'Pay' button can call on click.
     * Uses the global var 'cip', created when checkoutInitiatePayment.js is loaded, to authorize a payment
     * against checkout.adyen.com
     */
    window.authorizePayment = function(){

        // Disable 'Pay' button
        var payBtn = $('#payBtn')[0];
        payBtn.style['pointer-events'] = 'none';

        // Get reference to main 'holder' div
        var holder = $('.form-div')[0];

        // Get reference to <form> element that holds the securedFields
        var form = $('.payment-div')[0];


        //////////////// SUBMIT PAYMENT INITIATION REQUEST ///////////////
        var successFn = function(data){

            holder.innerHTML = '<p>Your payment has been processed: type="' + data.type + '" , resultCode="' + data.resultCode + '"</p>' + '<p> payload=' + data.payload + '</p>';
        }

        var errorFn = function(xhr, status, text){

            holder.innerHTML = 'SUBMIT ERROR status="' + status + '", text=' + text;
        }

        var initPayConfig = {
            responseData : apiResponseData,
            pmType : paymentMethodType,
            formEl : form,
            onSuccess : successFn,
            onError : errorFn
        }

        var res = chcktPay(initPayConfig);

        //--------- end SUBMIT PAYMENT INITIATION REQUEST -----------------
    }
});