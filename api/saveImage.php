<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$uploadDir = '../uploads/';
$maxAge = 24 * 60 * 60; // 24 hours in seconds

// Create uploads directory if it doesn't exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Clean up old images
function cleanupOldImages($dir, $maxAge) {
    $files = glob($dir . '*.png');
    $now = time();
    
    foreach ($files as $file) {
        if (is_file($file)) {
            if ($now - filemtime($file) >= $maxAge) {
                unlink($file);
            }
        }
    }
}

// Clean up old images
cleanupOldImages($uploadDir, $maxAge);

// Handle the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the image data from POST request
        $imageData = $_POST['image'] ?? '';
        if (empty($imageData)) {
            throw new Exception('No image data provided');
        }

        // Remove the data URL prefix
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        $imageData = base64_decode($imageData);

        // Generate unique filename
        $filename = uniqid('quote_') . '.png';
        $filepath = $uploadDir . $filename;

        // Save the image
        if (file_put_contents($filepath, $imageData)) {
            // Return the URL of the saved image
            $imageUrl = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/' . $filename;
            echo json_encode([
                'success' => true,
                'url' => $imageUrl
            ]);
        } else {
            throw new Exception('Failed to save image');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
} 