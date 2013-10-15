(function($) {
	$(function() {
		$('audio').each(function() {
			var control = $(this);
			control.prop("volume", 0.3);
		});
	});

	var step_init = -1
	$.fn.slider = function() {
		return $(this).each(function() {
			var element = $(this);
			var interval = parseFloat(element.attr('data-slider-interval')) || 2;
			var step = step_init;
			step_init = -step_init;
			var total = 0;
			var hover = false;
			var resume = false;
			element.on('mouseenter', function() { hover=true; });
			element.on('mouseleave', function() { hover=false; });
			function update(e) {
				if (e) {
					var property = e.originalEvent.propertyName;
					if (property.indexOf('transform', property.length - 'transform'.length) === -1) { return; }
					var trigger = $(e.target);
					if (!trigger.is('[data-interaction~=slider]')) { return; }
				}
				if (hover) {
					setTimeout(update, 1000);
					return;
				}
				
				var containerSize = element.parent().width();
				var elementSize = element.width();
				var itemSize = element.children().first().width();
				total += itemSize * step;
				var max = containerSize - containerSize*.25;
				var min = -elementSize + containerSize*.25;
				if (total <= min || total >= max) { step = -step; }
				element.css({
					'transition': 'all ' + interval + 's linear',
					'transform': 'translateX(' + total + 'px)',
					'-webkit-transform': 'translateX(' + total + 'px)',
					'-khtml-transform': 'translateX(' + total + 'px)',
					'-moz-transform': 'translateX(' + total + 'px)',
					'-ms-transform': 'translateX(' + total + 'px)',
					'-o-transform': 'translateX(' + total + 'px)'
				});
			}
			element.on('webkitTransitionEnd oTransitionEnd transitionend', update);
			update();
		});
	};
	
	$.fn.showImage = function() {
		return $(this).each(function() {
			var link = $(this);
			var href = link.attr('href');
			var img = new Image();
			img.onload = function() {
				var element = $('<div>', { css: {
					width: img.width + 'px', height: img.height + 'px'
				}, 'class': 'image-viewer'})
				.appendTo('body')
				.hide()
				.fadeIn();
				var image = $('<img>', { src: href, css: {
					width: img.width + 'px', height: img.height + 'px'
				}}).appendTo(element);
			};
			img.src = href;
		});
	};
	
	function hideImages() {
		var images = $('.image-viewer');
		images.fadeOut(function() {
			$(this).remove();
		});
	};
	
	$(function() {
		$(document).on('click', '*', function() { hideImages(); });
		
		$(document).on('click', '#images a', function(e) {
			e.preventDefault();
			hideImages();
			$(this).showImage();
		});
	});
})(jQuery);