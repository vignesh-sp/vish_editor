VISH.Editor.Image.Flikr = (function(V,$,undefined){
	
	var carrouselDivId = "tab_flikr_content_carrousel";
	var queryMaxNumberFlikrImages= 20; //maximum video query for youtube API's (999 max)
	
//function that is called when 
	var onLoadTab = function(){
		$("#tab_pic_flikr_content").find("input[type='search']").attr("value","");
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId); 
		
		console.log("entra en onLoadTab");
			
		var myInput = $("#tab_pic_flikr_content").find("input[type='search']");
		console.log("myImput vale:" +myInput);
		console.log("lo que voy a buscar vale: " + $(myInput).val());
	  	$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Image.Flikr.listImages($(myInput).val());
		          	$(myInput).blur();
			
			}
	
		});
	};

	var listImages = function(text){
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId); 

		console.log("entra en listImages");
		console.log("lo que voy a buscar vale: " + text);
	  	
	    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);    

 
		//
		var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
	    	var url_flikr = "http://api.flickr.com/services/feeds/photos_public.gne?tags="+text+"&tagmode=any&format=json&jsoncallback=?";
		
		$.getJSON(url_flikr, function(data){
		            $.each(data.items, function(i,item){
		
		            $("#" + carrouselDivId).append('<img id="img_flkr'+i+'" src="'+ item.media.m +'" imageFlikrId="'+i+'"/>');
		
	          });
      //call createCarrousel ( div_Carrousel_id, 1 , callbackFunction)
		VISH.Editor.Carrousel.createCarrousel (carrouselDivId, 2, VISH.Editor.Image.Flikr.addImage);

	     });
	};


var addImage = function(event){
	var ImageId = $(event.target).attr("imageFlikrId");
	 	var image_url=$(event.target).attr("src");
	
 	var template = VISH.Editor.getTemplate();
	var current_area = VISH.Editor.getCurrentArea();

	var nextImageFlikrId = VISH.Editor.getId();
    $.fancybox.close();

//copied from VISH.Editor.Images.js 

   var idToDragAndResize = "draggable" + nextImageFlikrId;
    current_area.attr('type','image');
    current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' />");
    
    V.Editor.addDeleteButton(current_area);
    
    $("#menubar").before("<div id='sliderId"+nextImageFlikrId+"' class='theslider'><input id='imageSlider"+nextImageFlikrId+"' type='slider' name='size' value='1' style='display: none; '></div>");     
   
   
   $("#imageSlider"+nextImageFlikrId).slider({
      from: 1,
      to: 8,
      step: 0.5,
      round: 1,
      dimension: "x",
      skin: "blue",
      onstatechange: function( value ){
          $("#" + idToDragAndResize).width(325*value);
      }
    });
    $("#" + idToDragAndResize).draggable({
    	cursor: "move",
    	stop: function(){
    		$(this).parent().click();  //call parent click to select it in case it was unselected	
    	}
    });



};
	
	return {
		onLoadTab	  : onLoadTab,
		listImages	: listImages,
		addImage	: addImage
		
	};

}) (VISH, jQuery);