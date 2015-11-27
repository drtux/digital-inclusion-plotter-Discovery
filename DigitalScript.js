$(document).ready(function(){
	$.validate();
	$('form a[name="formSubmit"]').on('click', function (e) {
	    if($(this).parents("form").isValid())
		{
			window.location.replace("DigitalInclusion_" + $(this).attr('nextPage') + ".html");
		}
	});
});
