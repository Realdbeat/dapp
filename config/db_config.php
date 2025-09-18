<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'ravcomn2_rgl_ad');
define('DB_PASS', 'W{300^j0CVmc');
define('DB_NAME', 'ravcomn2_rgl_coin');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?> 