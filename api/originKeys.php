<?php
date_default_timezone_set("Europe/Amsterdam");

global $jsSetupResponse;

if (!empty (getenv('MERCHANT_ACCOUNT')) && !empty(getenv('CHECKOUT_API_KEY'))) {
    $authentication['merchantAccount'] = getenv('MERCHANT_ACCOUNT');
    $authentication['checkoutAPIkey'] = getenv('CHECKOUT_API_KEY');
} else {
    $authentication = parse_ini_file('../config/authentication.ini', true);
}

$server = include('../config/server.php');

/** Set up the cURL call to  adyen */
function requestOriginKeys($server, $authentication)
{
    $request = array(
        "originDomains" => array($server['origin'])
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
    curl_setopt($curlAPICall, CURLOPT_URL, $server['originKeysURL']);

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

requestOriginKeys($server, $authentication);
