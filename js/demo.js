$(document).ready(function() {

	$('#demoContent').fitToWindow();

	// call the nifty golden ratio plugin after a short delay (for aesthetics)
    $('#demoContent .golden').makeGolden({
        delay: 250,
        eachDone: function() {
        	console.log('done');
        }
    });
	
	
});

$(window).resize(function() {

	$('#demoContent').fitToWindow();

	//the golden ratio layout is made up of all squares, so keep it that way by setting height = width on window resize
	$('#demoContent .golden').makeSquare();

});