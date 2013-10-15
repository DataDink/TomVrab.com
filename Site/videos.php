<?php
	// API Account: TomVrab.Web@gmail.com
	// API Account Password: TomPass1
	// API YouTube Key: AIzaSyDHeQiIaklLaWauGqgyHv1VreLXiumu77Y
	$DEVELOPER_KEY = 'AIzaSyDHeQiIaklLaWauGqgyHv1VreLXiumu77Y'; // <--- google api key
	$YOUTUBE_CHANNEL = 'UCB3gc5aUQjOdGtph5IObLYA'; // <--- youtube channel ID
	$VIDEO_HREF = "http://www.youtube.com/watch?v="; // <--- the link

	$data = array(); // <-- results will get stored as ['id', 'title', 'desc', 'thumb']
	$item_class = array_key_exists('class', $_GET) ? $_GET['class'] : 'video';

	set_include_path('lib');
	require_once 'google-api-php-client/src/Google_Client.php';
	require_once 'google-api-php-client/src/contrib/Google_YouTubeService.php';
	$client = new Google_Client();
	$client->setDeveloperKey($DEVELOPER_KEY);
	$youtube = new Google_YoutubeService($client);

	$page = array();
	$next = null;
	
	do {
		
		for ($i = 0; $i < 9999; $i++) { // The API is not very reliable.
			try {
				$page = $youtube->search->listSearch('id,snippet', array(
				  'channelId' => $YOUTUBE_CHANNEL,
				  'maxResults' => '50',
				  'pageToken' => $next == null ? '' : $next,
				));
			} catch (Exception $ex) {
				sleep(1);
				continue;
			}
			break;
		}
		
		if (array_key_exists('items', $page)) {
			foreach ($page['items'] as $item) {
				$has_id = array_key_exists('id', $item) && array_key_exists('videoId', $item['id']); 
				$is_video = $has_id && array_key_exists('kind', $item['id']) && $item['id']['kind'] == 'youtube#video';
				$has_info = array_key_exists('snippet', $item);
				$has_title = $has_info && array_key_exists('title', $item['snippet']);
				$has_desc = $has_info && array_key_exists('description', $item['snippet']);
				$has_thumb = $has_info && array_key_exists('thumbnails', $item['snippet']) && array_key_exists('medium', $item['snippet']['thumbnails']);
				
				$no_show = !$is_video || !$has_info || !$has_title || !$has_thumb;
				if ($no_show) { continue; }
				
				$itemInfo = array(
					'id' => $item['id']['videoId'],
					'title' => filter_var($item['snippet']['title'], FILTER_SANITIZE_SPECIAL_CHARS) ,
					'desc' => $has_desc ? filter_var($item['snippet']['description'], FILTER_SANITIZE_SPECIAL_CHARS) : '',
					'thumb' => $item['snippet']['thumbnails']['medium']['url'],
				);
				array_push($data, $itemInfo);
			}
		}
		
		$next = array_key_exists('nextPageToken', $page) ? $page['nextPageToken'] : null;
	} while ($next != null);
	
	foreach ($data as $video) {
		print('<div class="' . $item_class . '">');
		print('<a target="_blank" href="' . $VIDEO_HREF . $video['id'] . '">');
		print('<img src="' . $video['thumb'] . '" /> ');
		print('<span class="title">' . $video['title'] . '</span> ');
		print("</a></div>\r\n");
	}
?>
