var goldenRatio = 1.618;

/* Protect the jQuery '$' alias by placing our plugin code inside an immediately-invoked function expression */
(function ($) {
 	
 	// nifty golden ratio jQuery plugin
    $.fn.makeGolden = function(args) {

        //in a setTimeout, 'this' is a refernce to the window, so in order to fix this we need to store this to a variable
        var _this = this;

        //hide the parent div until just before we are ready to go
        var parent = _this.parent().hide();

        // ARGUMENT delay - how long to wait before beginning the golden ratio rendering
        var delay;
        if (args.hasOwnProperty('delay')) {
            if (typeof args.delay === 'string') {
                if (args.delay === 'shorter') {
                    delay = 125;
                } else if (args.delay === 'short') {
                    delay = 250;
                } else if (args.delay === 'long') {
                    delay = 750;
                } else if (args.delay === 'longer') {
                    delay = 1000;
                } else if (args.delay === 'none') {
                    delay = 1;
                }
            } else if (typeof args.delay === 'number') {
                delay = args.delay;
            }
        } else {
            delay = 1;
        }

        // ARGUMENT speed - how quickly to perform the animations
        var speed;
        if (args.hasOwnProperty('speed')) {
            if (typeof args.speed === 'string') {
                if (args.speed === 'faster') {
                    speed = 125;
                } else if (args.speed === 'fast') {
                    speed = 250;
                } else if (args.speed === 'slow') {
                    speed = 750;
                } else if (args.speed === 'slower') {
                    speed = 1000;
                } else {
                    console.log('makeGolden plugin encountered unexcepted value for argument "speed".  Set to default of 500ms');
                }
            } else if (typeof args.speed === 'number') {
                speed = args.speed;
            }
        } else {
            speed = 500;
        }

        // ARGUMENT eachDone - a function to execute on each of the processed elements
        if (args.hasOwnProperty('eachDone')) {

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
                    var delay = counter * speed + 1;
                    setTimeout(
                        function() {
                            if (args.hasOwnProperty('eachDone') && typeof args.eachDone === 'function') {
                                elemToShow.fadeIn(speed, args.eachDone);
                            } else {
                                elemToShow.fadeIn(speed);
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
        }, delay);
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