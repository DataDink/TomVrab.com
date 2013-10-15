
(function($) {
	$(function() {
		$('audio').each(function() {
			var control = $(this);
			control.prop("volume", 0.4);
		});
	});


	var pipeSound = $('[data-roles~=link-audio]');
	var jumpSound = $('[data-roles~=jump-audio]');
	var fireSound = $('[data-roles~=fireball-audio]');
	
	var mario = $('[data-roles~=player]');
	var collisions = $('[data-roles~=collision]');
	var enterLefts = $('[data-roles~=enter-left]');
	var enterBottoms = $('[data-roles~=enter-bottom]');
	
	var acceptingInput = false;
	setTimeout(function() { acceptingInput = true; }, 1000);
	var keySettings = { left: [37, 100], right: [39, 102], jump: [38, 104], shoot: [40, 101] };
	var downkeys = { left: false, right: false, jump: false, shoot: false };
	
	var jumpspeed = 60;
	var momentumJump = 0;
	var gravity = 5;

	var walkspeed = 20;
	var momentumWalk = 0;
	var friction = 3;
	
	var fireballspeed = 20;
	
	var maxX = $('body').width() - mario.width();
	var maxY = $('body').height() - mario.height();
	
	function getBounds(element) {
		var body = $('body').offset();
		var offset = element.offset();
		var left = offset.left - body.left;
		var top = offset.top - body.top;
		var width = element.width(), height = element.height();
		var right = left + width, bottom = top + height;
		return { left: left, right: right, top: top, bottom: bottom, width: width, height: height };
	}
	
	function getCollision(source) {
		var collision = { left: 0, right: 0, top: 0, bottom: 0, object: null }
		collisions.each(function() {
			var object = $(this);
			var bounds = getBounds(object);
			var hitLeft = source.left < bounds.right && source.left > bounds.left && source.bottom > bounds.top && source.top < bounds.bottom;
			var hitRight = source.right > bounds.left && source.right < bounds.right && source.bottom > bounds.top && source.top < bounds.bottom;
			var hitTop = source.top < bounds.bottom && source.top > bounds.top && source.left < bounds.right && source.right > bounds.left;
			var hitBottom = source.bottom > bounds.top && source.bottom < bounds.bottom && source.left < bounds.right && source.right > bounds.left;
			if (hitLeft) { collision.left = bounds.right - source.left; }
			if (hitRight) { collision.right = source.right - bounds.left; }
			if (hitTop) { collision.top = bounds.bottom - source.top; }
			if (hitBottom) { collision.bottom = source.bottom - bounds.top; }
			if (hitLeft || hitRight || hitTop || hitBottom) { collision.object = object; }
		});
		return collision;
	}
	
	function isEnterLeft(object, source) {
		if (!object.is('[data-roles~=enter-left]')) { return false; }
		var target = getBounds(object);
		var isAttempt = source.right > target.left && source.right < target.right;
		var overlap = target.height - Math.abs(source.top - target.top) - Math.abs(source.bottom - target.bottom);
		var isEnter = overlap / source.height > .5;
		if (isEnter) { source.top = target.top + target.height / 2 - source.height / 2; }
		return isEnter;
	}
	
	function isEnterBottom(object, source) {
		if (!object.is('[data-roles~=enter-bottom]')) { return false; }
		var target = getBounds(object);
		var isAttempt = source.top < target.bottom && source.top > target.top;
		var overlap = target.width - Math.abs(source.left - target.left) - Math.abs(source.right - target.right);
		var isEnter = overlap / source.width > .9;
		if (isEnter) { source.left = target.left + target.width / 2 - source.width / 2; }
		return isEnter;
	}
	
	function startEnter(object, x, y) {
		clearInterval(positionUpdater);
		clearInterval(positionWalker);
		acceptingInput = false;
		$('[data-roles~=link-audio]')[0].play();
		
		var enterUpdater = setInterval(function () {
			var position = getBounds(mario);
			mario.css('left', position.left + x + 'px');
			mario.css('top', position.top + y + 'px');
		}, 50);
		var linkTimeout = setTimeout(function() {
			clearInterval(enterUpdater);
			var path = object.attr('href');
			location = path;
		}, 2000);
	}
	
	function startShoot() {
		mario.addClass('shoot');
		var source = getBounds(mario);
		setTimeout(function() { mario.removeClass('shoot'); }, 250);
		
		var left = mario.hasClass('left') ? source.left : source.right;
		var movement = mario.hasClass('left') ? -fireballspeed : fireballspeed;
		var top = source.top + source.height / 4;
		var fireball = $('<div>', {
			'class': 'fireball',
			css: { left: left + 'px', top: top + 'px' }
		}).appendTo('body');
		var fballMover = setInterval(function() {
			left += movement;
			fireball.css('left', left + 'px');
			if (left > maxX || left < 0) { 
				clearInterval(fballMover);
				fireball.remove();
			};
		}, 50);
		$('[data-roles~=fireball-audio]')[0].play();
	}
	
	function pressKey(e) {
		$.each(keySettings, function(key, settings) {
			$.each(settings, function(index, value) {
				if (e.keyCode == value) { downkeys[key] = true; }
			});
		});
		if (downkeys.left) { mario.addClass('left'); downkeys.right = false; }
		if (downkeys.right) { mario.removeClass('left'); }
		if (downkeys.shoot) {
			downkeys.shoot = false;
			startShoot();
		}
	}
	$('body').on('keydown', pressKey);
	
	function releaseKey(e) {
		$.each(keySettings, function(key, settings) {
			$.each(settings, function(index, value) {
				if (e.keyCode == value) { downkeys[key] = false; }
			});
		});
		if (downkeys.left) { mario.addClass('left'); downkeys.right = false; }
		if (downkeys.right) { mario.removeClass('left'); }
	}
	$('body').on('keyup', releaseKey);
	
	function updatePosition() {
		var projection = getBounds(mario);
		
		var vertical = Math.max(-jumpspeed, momentumJump + gravity);
		projection.top += vertical;
		projection.bottom += vertical;
		var collision = getCollision(projection);
		if (collision.object && isEnterBottom(collision.object, projection)) {
			mario.css('left', projection.left + 'px');
			startEnter(collision.object, 0, -3);
			return;
		}
		projection.top += collision.top - collision.bottom;
		projection.bottom += collision.top - collision.bottom;
		if (collision.top == 0 && collision.bottom == 0) { momentumJump = vertical; }
		else if (collision.bottom > 0 && downkeys.jump && acceptingInput) { 
			momentumJump = -jumpspeed; 
			mario.addClass('jump');
			$('[data-roles~=jump-audio]')[0].play();
		}
		else { 
			momentumJump = 0; 
			mario.removeClass('jump');
		}
		
		var isLeft = mario.hasClass('left');
		var horizontal = isLeft ? Math.min(0, momentumWalk + friction) : Math.max(0, momentumWalk - friction);
		projection.left += horizontal;
		projection.right += horizontal;
		collision = getCollision(projection);
		if (collision.object && isEnterLeft(collision.object, projection)) {
			mario.css('top', projection.top + 'px');
			startEnter(collision.object, 3, 0);
			return;
		}
		projection.left += collision.left - collision.right;
		projection.right += collision.left - collision.right;
		if ((downkeys.right || downkeys.left) && acceptingInput) { 
			momentumWalk = isLeft ? -walkspeed : walkspeed; 
			mario.addClass('walk');
		} else if (collision.left == 0 && collision.right == 0) { 
			momentumWalk = horizontal;
			mario.removeClass('walk');
		} else {
			momentumWalk = 0;
			mario.removeClass('walk');
		}
		
		
		mario.css('left', Math.max(0, Math.min(maxX, Math.round(projection.left))) + 'px');
		mario.css('top', Math.max(0, Math.min(maxY, Math.round(projection.top))) + 'px');
	}
	var positionUpdater = setInterval(updatePosition, 50);
	
	function animateWalk() {
		if (mario.hasClass('walk')) {
			mario.toggleClass('step');
		} else {
			mario.removeClass('step');
		}
	}
	var positionWalker = setInterval(animateWalk, 250);
})(jQuery);