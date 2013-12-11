var goldenRatio = 1.618;

/* Protect the jQuery '$' alias by placing plugin code inside an immediately-invoked function expression */
(function ($) {
	
	// nifty golden ratio jQuery plugin
	$.fn.makeGolden = function(args) {
		
		//in a setTimeout, 'this' is a refernce to the window, so in order to fix this we need to store this to a variable
		var _this = this;

		//hide the parent div until just before we are ready to go
		var parent = _this.parent().hide();


		//build options object by merging default values with passed arguments
		// ARGUMENT delay - how long to wait before beginning the golden ratio rendering
		// ARGUMENT speed - how quickly to perform the animations
		var options = $.extend({
			delay : 1,
			speed : 500,
		}, args);

		//convert acceptable string delays into millisecond delays
		if (typeof options.delay === 'string') {
			if (options.delay === 'shorter') {
				options.delay = 125;
			} else if (args.delay === 'short') {
				options.delay = 250;
			} else if (args.delay === 'long') {
				options.delay = 750;
			} else if (args.delay === 'longer') {
				options.delay = 1000;
			} else if (args.delay === 'none') {
				options.delay = 1;
			}
		}
		
		//convert acceptable string speeds into millisecond animation durations
		if (typeof options.speed === 'string') {
			if (options.speed === 'faster') {
				options.speed = 125;
			} else if (options.speed === 'fast') {
				options.speed = 250;
			} else if (options.speed === 'slow') {
				options.speed = 750;
			} else if (options.speed === 'slower') {
				options.speed = 1000;
			} else {
				console.log('makeGolden plugin encountered unexcepted value for argument "speed".  Set to default of 500ms');
			}
		}

		setTimeout(function() {
			//show the parent
			parent.show();
			
			/* 
			 * In this pattern, each pair of divs (e.g. 0 & 1, 2 & 3, 4 & 5, etc...)
			 * needs to be floated in the same direction, which alternates pair-by-pair.
			 * This is why you see the extra variables outside of the for loop.
			 */
			var floatCounter = 0;
			var leftNotRight = true;
			for (var i = 0; i < _this.length; i++) {

				var $elem = $(_this[i]);

				// calculate the desired width for this element.
				var lastWidth;
				if (i === 0) {
					//start a little low to prevent any overflowing that occurs because of rounding
					lastWidth = 99.99;
				} else {
					lastWidth = $(_this[i-1]).data('golden-width');
				}
				var newWidth = lastWidth / goldenRatio;
				var roundedWidth = Math.round(newWidth * 1000)/1000;

				//calculate the css float property's value
				var floatValue;
				if (leftNotRight) {
					floatValue = 'left';
				} else {
					floatValue = 'right';
				}

				// set the new CSS percentage width, 
				// set the float appropriately
				// and store the (unrounded) new width in this object's data
				$elem
					.css('width', roundedWidth + '%')
					.css('float', floatValue)
					.data('golden-width', newWidth);

				// square off the element by making its height equal to its rendered width
				// note that this value is adjusted whenever the window is resized
				// also hide before the user can see the rendered result
				$elem.makeSquare().hide();

				// use immediately-invoked function expression to ensure that the proper element is referenced since we
				// are performing an asynchronous action inside of a repetition structure. After a short delay, trigger
				// a fadeIn effect on each subsequent element and call our callback if necessary
				(function(elemToShow, counter) {
					var delay = counter * options.speed + 1;
					setTimeout(
						function() {
							if (args.hasOwnProperty('eachDone') && typeof args.eachDone === 'function') {
								elemToShow.fadeIn(options.speed, args.eachDone);
							} else {
								elemToShow.fadeIn(options.speed);
							}
							
						}, delay
					);
				})($elem, i);
				
				

				// increment our float counter and make necessary adjustments for the next loop iteration
				floatCounter++;
				if (floatCounter === 2) {
					//flip the float, yo
					leftNotRight = !leftNotRight;
					floatCounter = 0;
				}
			}

			return this;
		}, options.delay);
	};

	$.fn.fitToWindow = function() {
		var windowHeight = $(window).height();
		this.css('max-width', (windowHeight * 1.618) + 'px').height(windowHeight);
	};

	$.fn.makeSquare = function() {
		return this.each(function() {
			$(this).height($(this).width());
		});
	};
 
}(jQuery));