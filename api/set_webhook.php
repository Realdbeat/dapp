<?php

// Replace with your bot token
$botToken = "";
$website = "https://api.telegram.org/bot" . $botToken;

// Replace with the URL of your server where the bot script is hosted
$webhookUrl = "https://dppas.rav.com.ng/appbot.php";

//https://dppas.rav.com.ng/set_webhook.php

// Set the webhook
setWebhook($webhookUrl, $botToken);

function setWebhook($url, $token) {
    $setWebhookUrl = "https://api.telegram.org/bot" . $token . "/setWebhook?url=" . urlencode($url);
    $result = file_get_contents($setWebhookUrl);
    echo $result;
}
