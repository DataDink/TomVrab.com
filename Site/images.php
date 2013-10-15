<?php
	$IMAGE_DIR = './media/images';
	
	$item_class = array_key_exists('class', $_GET) ? $_GET['class'] : 'video';
	
	$files = scandir($IMAGE_DIR);
	
	foreach ($files as $file) {
		if ($file == '.' || $file == '..') { continue; }
		$path = $IMAGE_DIR . '/' . $file;
		$parts = explode('.', $file);
		$name = $parts[0];
		print('<div class="' . $item_class . '">');
		print('<a target="_blank" href="' . $path . '">');
		print('<img src="' . $path . '" /> ');
		print('<span class="title">' . $name . '</span> ');
		print("</a></div>\r\n");
	}
?>
