<?php
// Define your verify token (this should match the one you provide during subscription)
$verify_token = 'evd0@bkMLDeP';

// Check if the request is a GET request for verifying the webhook
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verify the token provided by Instagram/Facebook
    $mode = $_GET['hub_mode'] ?? '';
    $token = $_GET['hub_verify_token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? '';

    if ($mode === 'subscribe' && $token === $verify_token) {
        echo $challenge; // Return the challenge to complete the verification
    } else {
        http_response_code(403); // Forbidden if the tokens do not match
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle incoming webhook events
    $input = json_decode(file_get_contents('php://input'), true);

    
    if ($input) {
        // Process the incoming data
        processWebhookData($input);
    } else {
        http_response_code(400); // Bad Request if the input is invalid
    }
} else {
    http_response_code(405); // Method Not Allowed for other HTTP methods
}

/**
 * Function to process the incoming webhook data
 */
function processWebhookData($data) {
    // Log or process the data as needed
    error_log(json_encode($data));

    // Example: Check for specific events like media objects being created
    foreach ($data['entry'] as $entry) {
        $changes = $entry['changes'] ?? [];
        foreach ($changes as $change) {
            $value = $change['value'] ?? [];
            $media_id = $value['media_id'] ?? null;

            if ($media_id) {
                // Handle new media object creation
                handleNewMedia($media_id);
            }
        }
    }
}

/**
 * Function to handle new media objects
 */
function handleNewMedia($media_id) {
    // You can fetch more details about the media using the Graph API
    error_log("New media created with ID: " . $media_id);
}
?>