<?php

// Replace with your bot token
$botToken = "";
$website = "https://api.telegram.org/bot" . $botToken;

// Read incoming data from Telegram
$content = file_get_contents("php://input");
$update = json_decode($content, true);

if (!$update) {
    exit; // Exit if no valid JSON data is received
}

// Extract chat ID and message text
$chatId = $update["message"]["chat"]["id"];
$message = isset($update["message"]["text"]) ? $update["message"]["text"] : "";

// Function to send a message with an inline keyboard
function sendMessageWithInlineKeyboard($chatId, $text, $keyboard, $token) {
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text,
        'reply_markup' => json_encode($keyboard)
    ];
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}

// Function to send a photo with an inline keyboard
// Function to send a photo with inline keyboard and menu keyboard
function sendPhotoWithKeyboards($chatId, $photoUrl, $caption, $inlineKeyboard, $menuKeyboard, $token) {
    $url = "https://api.telegram.org/bot" . $token . "/sendPhoto";
    $data = [
        'chat_id' => $chatId,
        'photo' => $photoUrl,
        'caption' => $caption,
        'parse_mode' => 'HTML', // Enable HTML parsing for the caption
        'reply_markup' => json_encode([
            'inline_keyboard' => $inlineKeyboard, // Inline keyboard for interactive buttons
            'keyboard' => $menuKeyboard,          // Menu keyboard for persistent options
            'resize_keyboard' => true,
            'one_time_keyboard' => false
        ])
    ];
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}

// Function to send a simple message
function sendMessage($chatId, $text, $token) {
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text
    ];
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}

// Check if the user sent the /start command
if ($message === "Refreral Link") {
    // Define the keyboard layout (menu)
    $keyboard = [
        'keyboard' => [
            [['text' => 'Refreral Link']],
            [['text' => 'My Account']],
            [['text' => 'Settings']]
        ],
        'resize_keyboard' => true,
        'one_time_keyboard' => false
    ];

    // Response message for /start command
    $responseText = "Welcome to the future of decentralized faith and community empowerment with <b>Religion Coin (RLG)</b> – a revolutionary blockchain project designed to unite people from all walks of life under one common goal: creating a more inclusive, transparent, and spiritual ecosystem.";

    sendMessageWithKeyboard($chatId, $responseText, $keyboard, $botToken);
} elseif ($message === "/start") {
    // Handle Option 1 by sending a photo with an inline keyboard
    $photoUrl = "https://dppas.rav.com.ng/Assets/rglcoin.jpg"; // Replace with your image URL
    $caption = "Hi,🥳 Welcome to the future of decentralized faith and community empowerment with ☯️ <b>Religion Coin (RLG)</b> – <i>a revolutionary blockchain 🔗 📊 project designed to unite people from all walks of life under one common goal: creating a more inclusive, transparent, and spiritual ecosystem.</i>";
    
    /* Define the inline keyboard*/
    $inlineKeyboard = [
        [
            ['text' => '🚀Earn RLGCoin🎁', 'url' => 'https://t.me/rlgcoin_bot/rlgcoin']
        ]
    ];

    $menuKeyboard = [
        [['text' => 'Refreral Link']],
        [['text' => 'My Account']],
        [['text' => 'Settings']]
    ];

    sendPhotoWithKeyboards($chatId, $photoUrl, $caption, $inlineKeyboard, $menuKeyboard, $botToken);

} elseif ($message === "My Account") {
    // Handle Option 2
    sendMessage($chatId, "You selected Option 2!", $botToken);
} elseif ($message === "Settings") {
    // Handle Option 3
    sendMessage($chatId, "You selected Option 3!", $botToken);
}

// Function to send a message with a custom keyboard
function sendMessageWithKeyboard($chatId, $text, $keyboard, $token) {
    $url = "https://api.telegram.org/bot" . $token . "/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text,
        'reply_markup' => json_encode($keyboard)
    ];
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}



// Check if the update contains a callback query
if (isset($update['callback_query'])) {
    $callbackQueryId = $update['callback_query']['id'];
    $callbackData = $update['callback_query']['data'];
    $chatId = $update['callback_query']['message']['chat']['id'];

    if ($callbackData === 'button_clicked') {
        // Respond to the button click
        $responseText = "You clicked the button!";
        sendMessage($chatId, $responseText, $botToken);

        // Answer the callback query to remove the loading indicator
        $answerCallbackQueryUrl = "https://api.telegram.org/bot" . $botToken . "/answerCallbackQuery?callback_query_id=" . $callbackQueryId;
        file_get_contents($answerCallbackQueryUrl);
    }
}