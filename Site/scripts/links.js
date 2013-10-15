
//********** Gannon easter egg *************//
(function($) {
	$.fn.gannon = function() {
		return $(this).each(function() {
			var target = $(this).attr('data-gannon-target');
			$(this).on('click', function() {
				$(target).show();
				setTimeout(function() {
					$(target).hide();
				}, 5000);
			});
		});
	};
})(jQuery);