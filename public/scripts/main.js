$(document).ready(function(){
     
     // triger collapsable nav-bar(this is materializecss spec)
	 $(".button-collapse").sideNav();
     
     // smooth  nav section fade in effect
	 $("#logo").fadeIn("slow", function(){
	 	$('#msg').fadeIn("slow", function(){
	 		$("#setting").fadeIn("slow", function(){
	 			$("#profile").fadeIn("slow",function(){
	 				$("#home").fadeIn("slow", function(){
	 					$("#fab").fadeIn("slow");
	 				});
	 			})
	 		})
	 	});
	 });

	

	// logout function
	$('#logout').click(function(){
		console.log('logged out');

		$.ajax({
			url:'/api/logout',
			method:'GET',
			success: function(res){
               console.log(res);
			}
		})
	})




})//end

