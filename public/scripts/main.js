$(document).ready(function(){
     
     // triger collapsable nav-bar(this is materializecss spec)
	 $(".button-collapse").sideNav();
	 $("#fab").fadeIn("slow");
     
     // smooth  nav section fade in effect
	 $("#logo").fadeIn("slow", function(){
	 	$('#msg').fadeIn("slow", function(){
	 		$("#setting").fadeIn("slow", function(){
	 			$("#profile").fadeIn("slow",function(){
	 				$("#home").fadeIn("slow", function(){
	 					
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
               $('.button-collapse').sideNav('hide');
			}
		})
	})

	// logout function
	$('#logoutSide').click(function(){
		console.log('logged out');

		$.ajax({
			url:'/api/logout',
			method:'GET',
			success: function(res){
               console.log(res);
               $('.button-collapse').sideNav('hide');
			}
		})
	})

  // close sidenav at button click
  $('.coolside').click(function(){
  	 // Hide sideNav
  $('.button-collapse').sideNav('hide');

  })


  // close sidenav at button click
  $('#close').click(function(){
  	 // Hide sideNav
  $('.button-collapse').sideNav('hide');

  })

 
// GO TOP 
$('#gotop').click(function(){
 $("html, body").animate({ scrollTop: 0 }, 700);
        
 
})


})//end

