(function($) {
	$(function() {
		var thumbs = $('.thumb');
		var container = thumbs.first().parent();
		var width = container.width();
		var height = container.height();
		
		var pool = [];
		thumbs.each(function() { pool.push($(this)); });
		
		// add item
		setInterval(function() {
			var item = pool.pop();
			pool.unshift(item);
			
			item.css({ opacity: '0', transition: 'none', top: '0px' });
			setTimeout(function() {
				item.css({
					top: '0px',
					left: Math.round(Math.random() * width - item.width()) + 'px',
					right: 'auto',
					bottom: 'auto',
					opacity: '1',
					transition: '30s linear top, 1s ease opacity'
				});
				setTimeout(function() {
					item.css({
						top: height + 'px'
					});
					setTimeout(function() {
						item.css({opacity: '0', transition: 'none', top: '0px'});
					}, 30000);
				}, 1);
			}, 1);
		}, 3000);
	});
	
})(jQuery);