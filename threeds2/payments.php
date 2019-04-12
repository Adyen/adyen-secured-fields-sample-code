<?php
date_default_timezone_set("Europe/Amsterdam");

global $jsSetupResponse;

if (!empty (getenv('MERCHANT_ACCOUNT')) && !empty(getenv('CHECKOUT_API_KEY'))) {
    $authentication['merchantAccount'] = getenv('MERCHANT_ACCOUNT');
    $authentication['checkoutAPIkey'] = getenv('CHECKOUT_API_KEY');
} else {
    $authentication = parse_ini_file('../config/authentication.ini', true);
}

$order = include('../payment/order.php');
$server = include('../config/server.php');
$threeds2 = include('./threeds2.php');

/** Set up the cURL call to  adyen */
function requestPaymentData($order, $server, $authentication, $threeds2)
{
    $request = array(

        'paymentMethod' => $_POST,

        /** All order specific settings can be found in payment/order.php */

        'amount' => $order['amount'],
        'channel' => $order['channel'],
        'countryCode' => $order['countryCode'],
        'shopperReference' => $order['shopperReference'],
        'shopperLocale' => $order['shopperLocale'],
        'reference' => $order['reference'],

        /** All server specific settings can be found in config/server.php */

        'origin' => $server['origin'],
        'shopperIP' => $server['shopperIP'],
        'returnUrl' => $server['returnURL'],

        /** All merchant/authentication specific settings can be found in config/authentication.php */

        'merchantAccount' => $authentication['merchantAccount'],


        /** All order specific settings can be found in payment/threeds2.php */

        'additionalData' => $threeds2['additionalData'],
        'browserInfo' => $threeds2['browserInfo']
    );

    $setupString = json_encode($request);

    //  Initiate curl
    $curlAPICall = curl_init();

    // Set to POST
    curl_setopt($curlAPICall, CURLOPT_CUSTOMREQUEST, "POST");

    // Add JSON message
    curl_setopt($curlAPICall, CURLOPT_POSTFIELDS, $setupString);

    // Will return the response, if false it print the response
    curl_setopt($curlAPICall, CURLOPT_RETURNTRANSFER, true);

    // Set the url
    curl_setopt($curlAPICall, CURLOPT_URL, $server['paymentsURL']);

    // Api key
    curl_setopt($curlAPICall, CURLOPT_HTTPHEADER,
        array(
            "X-Api-Key: " . $authentication['checkoutAPIkey'],
            "Content-Type: application/json",
            "Content-Length: " . strlen($setupString)
        )
    );

    // Execute
    $result = curl_exec($curlAPICall);

    // Closing
    curl_close($curlAPICall);

    // When this file gets called by javascript or another language, it will respond with a json object
    echo $result;
}

requestPaymentData($order, $server, $authentication, $threeds2);
