(function($) {
	$(function() {
		$('audio').each(function() {
			var control = $(this);
			control.prop("volume", 0.3);
		});
	});
	
	$.fn.imagePreload = function() {
		return $(this).each(function() {
			var element = $(this);
			var url = element.attr('data-preload');
			var img = new Image();
			img.onload = function() {
				element.css('background-image', "url('" + url + "')");
			};
			img.src = url;
		});
	};
})(jQuery);