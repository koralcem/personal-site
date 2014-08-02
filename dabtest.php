<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
<meta charset="utf-8" />
<title>Cem Schemel</title>
<meta name="description" content="Cem Schemel" />
</head>

<body>

<?php

echo "Testing php page";

$connection = mysqli_connect("mysql.cemschemel.com", "cemschemel_user", "testpass", "cemschemel_testdb");

// Check connection
if (mysqli_connect_errno($connection))
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
else
{
	echo "Connected to db...?";
}
echo "<br>";

$query = "SELECT * FROM Text";
$result = mysqli_query($connection, $query);

while($row = mysqli_fetch_array($result))
{
  echo $row['id'] . " - " . $row['text'] . " - " . $row['number'];
  echo "<br>";
}




mysqli_close($connection);

?>


</body>
</html>