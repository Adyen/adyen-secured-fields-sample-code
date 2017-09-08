<?php

function url(){
    return sprintf(
        "%s://%s",
        'https', $_SERVER['HTTP_HOST']
    );
}

/** Adyen checkout endpoints */
$checkoutBaseURL = 'https://checkout-test.adyen.com/services/PaymentSetupAndVerification/v30';
$checkoutSetupURL = $checkoutBaseURL . '/setup';
$checkoutVerifyURL = $checkoutBaseURL . '/verify';

/** Your server endpoints */
/** @var $returnURL - the url you want the shopper to return to after they complete their transaction */
$returnURL = url();

/** Shopper IP */
$shopperIP = $_SERVER['REMOTE_ADDR'];

return array(
    'origin' => url(),
    'baseURL' => $checkoutBaseURL,
    'setupURL' => $checkoutSetupURL,
    'verifyURL' => $checkoutVerifyURL,
    'returnURL' => $returnURL,
    'shopperIP' => $shopperIP,
);
