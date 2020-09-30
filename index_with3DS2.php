<?php
include ('config/timezone.php');
?>

<!DOCTYPE html>
<html class="html">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <meta name="robots" content="noindex"/>
    <title>Example PHP checkout</title>
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    <link rel="stylesheet" type="text/css" href="assets/css/securedFields.style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.14.1/adyen.css" />
    <script src="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.14.1/adyen.js"></script>
</head>
<body class="body">
<div class="content">
    <div class="explanation">
        <h3>To run this securedFields example: </h3>
        <p>
            <b>1)</b> Edit the following PHP variables in the <b>config/authentication.ini</b> file:</br></br>
            <b>$merchantAccount</b>: 'YOUR MERCHANT ACCOUNT', more information in our <a href="https://docs.adyen.com/developers/payments-basics/get-started-with-adyen">Getting started guide</a>.<br/>
            <b>$checkoutAPIkey</b>: 'YOUR CHECKOUT API KEY'.
        </p>
        <p>
            <b>2)</b> Also make sure that the <i>url</i> function in <b>config/server.php</b> is setting the protocol to the correct value (it might need to be <i>http</i> if you are running these files locally)
        </p>
    </div>

    <h1>Checkout SecuredFields Component</h1>
    <div class="merchant-checkout__form">
        <div class="merchant-checkout__payment-method__header">
            <h2 class="sf-text">SecuredFields</h2>
        </div>
        <div class="merchant-checkout__payment-method">
            <div class="merchant-checkout__payment-method__details secured-fields" style="display:none;">
                <span class="pm-image">
                    <img id="pmImage" width="40" src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/nocard.svg" alt="">
                </span>
                <label class="pm-form-label">
                    <span class="pm-form-label__text">Card number:</span>
                    <span class="pm-input-field" data-cse="encryptedCardNumber"></span>
                    <span class="pm-form-label__error-text">Please enter a valid credit card number</span>
                </label>
                <label class="pm-form-label pm-form-label--exp-date">
                    <span class="pm-form-label__text">Expiry date:</span>
                    <span class="pm-input-field" data-cse="encryptedExpiryDate"></span>
                    <span class="pm-form-label__error-text">Date error text</span>
                </label>
                <label class="pm-form-label pm-form-label--cvc">
                    <span class="pm-form-label__text">CVV/CVC:</span>
                    <span class="pm-input-field" data-cse="encryptedSecurityCode"></span>
                    <span class="pm-form-label__error-text">CVC Error text</span>
                </label>
            </div>
            <div class="card-input__spinner__holder">
                <div class="card-input__spinner card-input__spinner--active">
                    <div class="adyen-checkout__spinner__wrapper ">
                        <div class="adyen-checkout__spinner adyen-checkout__spinner--large"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3DS2 FLOW -->
    <script src = "threeds2/main.js" ></script >
</body>
</html>