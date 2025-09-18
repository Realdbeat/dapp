<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once './config/db_config.php';

// Function to validate Telegram WebApp data
function validateTelegramWebAppData($initData) {
    // Add your Telegram Bot Token here
    $botToken = 'YOUR_BOT_TOKEN';
    
    $data = explode('&', $initData);
    $hash = '';
    $dataToCheck = [];
    
    foreach ($data as $item) {
        $keyVal = explode('=', $item);
        if ($keyVal[0] === 'hash') {
            $hash = $keyVal[1];
        } else {
            $dataToCheck[] = $item;
        }
    }
    
    sort($dataToCheck);
    $dataCheckString = implode("\n", $dataToCheck);
    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
    $calculatedHash = bin2hex(hash_hmac('sha256', $dataCheckString, $secretKey, true));
    
    return hash_equals($calculatedHash, $hash);
}

function generateReferralCode($userId) {
    return $userId . '_' . time();
}

// Handle different API endpoints
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create_referral':
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'] ?? null;
        $initData = $data['initData'] ?? '';

        if (!$userId || !validateTelegramWebAppData($initData)) {
            echo json_encode(['error' => 'Invalid request']);
            exit;
        }

        // Check if user exists, if not create new user
        $stmt = $conn->prepare("INSERT IGNORE INTO users (telegram_id) VALUES (?)");
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        // Get or create referral code
        $stmt = $conn->prepare("SELECT referral_code FROM users WHERE telegram_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user['referral_code']) {
            $referralCode = generateReferralCode($userId);
            $stmt = $conn->prepare("UPDATE users SET referral_code = ? WHERE telegram_id = ?");
            $stmt->bind_param("si", $referralCode, $userId);
            $stmt->execute();
        } else {
            $referralCode = $user['referral_code'];
        }

        echo json_encode(['success' => true, 'referral_code' => $referralCode]);
        break;

    case 'process_referral':
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'] ?? null;
        $referralCode = $data['referral_code'] ?? null;
        $initData = $data['initData'] ?? '';

        if (!$userId || !$referralCode || !validateTelegramWebAppData($initData)) {
            echo json_encode(['error' => 'Invalid request']);
            exit;
        }

        // Start transaction
        $conn->begin_transaction();

        try {
            // Check if user has already used a referral
            $stmt = $conn->prepare("SELECT id FROM referrals WHERE referred_id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                throw new Exception('User has already used a referral');
            }

            // Get referrer ID from referral code
            $referrerId = explode('_', $referralCode)[0];
            if ($referrerId == $userId) {
                throw new Exception('Cannot use own referral code');
            }

            // Add referral record
            $stmt = $conn->prepare("INSERT INTO referrals (referrer_id, referred_id, reward_amount, status) VALUES (?, ?, 1000, 'completed')");
            $stmt->bind_param("ii", $referrerId, $userId);
            $stmt->execute();

            // Update referrer's balance
            $stmt = $conn->prepare("UPDATE users SET balance = balance + 1000 WHERE telegram_id = ?");
            $stmt->bind_param("i", $referrerId);
            $stmt->execute();

            // Update referred user's balance (welcome bonus)
            $stmt = $conn->prepare("UPDATE users SET balance = balance + 500 WHERE telegram_id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();

            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Referral processed successfully']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'get_referral_count':
        $userId = $_GET['user_id'] ?? null;
        $initData = $_GET['initData'] ?? '';

        if (!$userId || !validateTelegramWebAppData($initData)) {
            echo json_encode(['error' => 'Invalid request']);
            exit;
        }

        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ? AND status = 'completed'");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];

        echo json_encode(['success' => true, 'count' => $count]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}

$conn->close();
?> 