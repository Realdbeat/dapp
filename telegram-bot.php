<?php

// Configuration
$botToken = '7976947553:AAGr5pENqwENJ8UxKdBQjPuZHXOMb0mWt8E'; // Replace with your Telegram bot token
$webhookUrl = 'https://dppas.rav.com.ng/telegram-bot.php'; // Replace with your webhook URL

// Initialize Telegram API base URL
$telegramApiUrl = "https://api.telegram.org/bot$botToken/";

// Function to send a message to Telegram
function sendMessage($chatId, $text) {
    global $telegramApiUrl;
    $url = $telegramApiUrl . "sendMessage?chat_id=$chatId&text=" . urlencode($text);
    file_get_contents($url);
}

// Function to send a photo to Telegram
function sendPhoto($chatId, $filePath) {
    global $telegramApiUrl;
    $ch = curl_init();
    $data = [
        'chat_id' => $chatId,
        'photo' => new CURLFile(realpath($filePath))
    ];
    curl_setopt($ch, CURLOPT_URL, $telegramApiUrl . "sendPhoto");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
}

// Function to send a video to Telegram
function sendVideo($chatId, $filePath) {
    global $telegramApiUrl;
    $ch = curl_init();
    $data = [
        'chat_id' => $chatId,
        'video' => new CURLFile(realpath($filePath))
    ];
    curl_setopt($ch, CURLOPT_URL, $telegramApiUrl . "sendVideo");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
}

// Function to fetch Instagram post details via scraping
function getInstagramMediaDetails($postUrl) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $postUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
    $html = curl_exec($ch);
    curl_close($ch);

    if (!$html) {
        return null;
    }

    // Extract JSON data from the HTML
    if (preg_match('/<script type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches)) {
        $jsonData = json_decode($matches[1], true);

        if ($jsonData && isset($jsonData['@type']) && $jsonData['@type'] === 'ImageObject') {
            return ['media_url' => $jsonData['contentUrl'], 'media_type' => 'IMAGE'];
        } elseif ($jsonData && isset($jsonData['@type']) && $jsonData['@type'] === 'VideoObject') {
            return ['media_url' => $jsonData['contentUrl'], 'media_type' => 'VIDEO'];
        }
    }

    // Fallback: Try extracting JSON data from another script tag
    if (preg_match('/window\._sharedData\s*=\s*(.*?);\s*<\/script>/s', $html, $matches)) {
        $sharedData = json_decode($matches[1], true);

        if ($sharedData && isset($sharedData['entry_data']['PostPage'][0]['graphql']['shortcode_media'])) {
            $media = $sharedData['entry_data']['PostPage'][0]['graphql']['shortcode_media'];

            if (isset($media['is_video']) && $media['is_video']) {
                return ['media_url' => $media['video_url'], 'media_type' => 'VIDEO'];
            } else {
                return ['media_url' => $media['display_url'], 'media_type' => 'IMAGE'];
            }
        }
    }

    return null;
}

// Function to download media
function downloadMedia($mediaUrl, $outputPath) {
    $ch = curl_init($mediaUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $data = curl_exec($ch);
    curl_close($ch);

    file_put_contents($outputPath, $data);
    return $outputPath;
}

// Main logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $update = json_decode(file_get_contents('php://input'), true);

    if (isset($update['message']['text'])) {
        $chatId = $update['message']['chat']['id'];
        $messageText = $update['message']['text'];

        // Check if the message contains an Instagram URL
        if (preg_match('/https:\/\/www\.instagram\.com\/(p|reel)\/[^\/]+/', $messageText)) {
            sendMessage($chatId, "Processing your request...");

            // Fetch media details
            $mediaDetails = getInstagramMediaDetails($messageText);
            $errors = error_get_last();
            if ($mediaDetails && isset($mediaDetails['media_url'])) {
                $mediaType = $mediaDetails['media_type'];
                $mediaUrl = $mediaDetails['media_url'];

                // Download and send media
                if ($mediaType === 'IMAGE') {
                    $filePath = downloadMedia($mediaUrl, 'downloaded_image.jpg');
                    sendPhoto($chatId, $filePath);
                    unlink($filePath); // Clean up temporary file
                } elseif ($mediaType === 'VIDEO') {
                    $filePath = downloadMedia($mediaUrl, 'downloaded_video.mp4');
                    sendVideo($chatId, $filePath);
                    unlink($filePath); // Clean up temporary file
                }
            } else {
                sendMessage($chatId, "Error fetching media details.");
            }
        } else {
            sendMessage($chatId, "Please send a valid Instagram post or reel link.");
        }
    }
}

// Set webhook (run this once manually)
if (!empty($_GET['set_webhook'])) {
    $setWebhookUrl = $telegramApiUrl . "setWebhook?url=" . urlencode($webhookUrl);
    file_get_contents($setWebhookUrl);
    echo "Webhook set successfully.";
}