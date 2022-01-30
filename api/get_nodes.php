<?php
require("db.php");
$sql = "SELECT id,nick,x,y,s from users";

$data = mysqli_query($conn, $sql);
$response = array();
header('Content-Type: application/json');
while ($row = mysqli_fetch_assoc($data)) {
    $response[] = $row;
}
echo json_encode($response);
