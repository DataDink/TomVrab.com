(function($) {
	
	function flash(element) {
		setTimeout(function(element) { element.show(); }, 0, element);
		setTimeout(function(element) { element.hide(); }, 500, element);
		setTimeout(function(element) { element.show(); }, 1000, element);
		setTimeout(function(element) { element.hide(); }, 1500, element);
		setTimeout(function(element) { element.show(); }, 2000, element);
		setTimeout(function(element) { element.hide(); }, 2500, element);
	}

	$.fn.neon = function() {
		return  $(this).each(function() {
			var container = $(this);
			var messages = container.children();
			messages.hide();
			
			var interval = 4000;
			for (var i = 0; i < messages.length; i++) {
				setTimeout(function(element) {
					setInterval(function(element) {
						flash(element);
					}, interval * messages.length, element);
					flash(element);
				}, interval * i, $(messages[i]));
			}
		});
	};
})(jQuery);