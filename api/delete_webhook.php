<?php

// Replace with your bot token
$botToken = "";
$website = "https://api.telegram.org/bot" . $botToken;

// Function to delete the webhook
function deleteWebhook($token) {
    $deleteWebhookUrl = "https://api.telegram.org/bot" . $token . "/deleteWebhook";
    $result = file_get_contents($deleteWebhookUrl);
    echo $result; // Output the result for debugging purposes
}

// Call the function to delete the webhook
deleteWebhook($botToken);