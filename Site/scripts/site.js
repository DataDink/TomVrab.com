
// ********** Music Control *********** //
(function($) {
	$(function() {
		$('audio').each(function() {
			var control = $(this);
			control.prop("volume", 0.1);
		});
	});
	
	$.fn.audioMute = function() {
		$(this).each(function() {
			var control = $(this);
			control.on('click', function() {
				var state = $(this).hasClass('muted');
				
				if (state) {
					$(this).removeClass('muted');
					$('audio').prop('muted', false);
				} else {
					$(this).addClass('muted');
					$('audio').prop('muted', true);
				}
			});
		})
	}
})(jQuery);