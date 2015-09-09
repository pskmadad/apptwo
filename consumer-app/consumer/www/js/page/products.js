$(document).ready(function() {
	
	
	 $(document).on('apna:ShowProductPage', initialize);
	 
	 function initialize(){
		// window.location.hash = "productList";
		 $.mobile.changePage( "#productList", { transition: "none"} )
	//	 $.mobile.initializePage();
	 }
	
	
	
});