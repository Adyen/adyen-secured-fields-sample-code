<?php

function url(){
    return sprintf(
        "%s://%s",
        'https', $_SERVER['HTTP_HOST']
    );
}

/** Adyen checkout endpoints */
$checkoutBaseURL = 'https://checkout-test.adyen.com/v67';
$checkoutOriginKeysURL = $checkoutBaseURL . '/originKeys';
$checkoutPaymentsURL = $checkoutBaseURL . '/payments';
$checkoutDetailsURL = $checkoutPaymentsURL . '/details';

/** Your server endpoints */
/** @var $returnURL - the url you want the shopper to return to after they complete their transaction */
$returnURL = url();

/** Shopper IP */
$shopperIP = $_SERVER['REMOTE_ADDR'];

return array(
    'origin' => url(),
    'baseURL' => $checkoutBaseURL,
    'originKeysURL' => $checkoutOriginKeysURL,
    'paymentsURL' => $checkoutPaymentsURL,
    'detailsURL' => $checkoutDetailsURL,
    'returnURL' => $returnURL,
    'shopperIP' => $shopperIP,
);
