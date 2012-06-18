VISH.Editor.Object.Web = (function(V,$,undefined){
		
	var contentToAdd = null;	
	var urlDivId = "tab_flash_from_web_content";
  var urlInputId = "flash_embedWeb_code";
		
	var init = function(){
		var urlInput = $(urlDivId ).find("input");
    $(urlInput).watermark('Paste website URL');
		
		//Load from URL
    $("#" + urlDivId + " .previewButton").click(function(event) {
      if(VISH.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = VISH.Utils.autocompleteUrls($("#" + urlInputId).val());
        VISH.Editor.Object.drawPreview(urlDivId, contentToAdd)    
      }
    });
		
	};	

  
  var onLoadTab = function(tab){
		contentToAdd = null;
    VISH.Editor.Object.resetPreview(urlDivId);
    $("#" + urlInputId).val("");
  }
	
	
  var drawPreviewElement = function(){
		VISH.Editor.Object.drawPreviewObject(contentToAdd);
  }
	
	var generateWrapperForWeb = function(url){
		return "<iframe src='" + url + "'></embed>"
	}
	
	var generatePreviewWrapperForWeb = function(url){
		return "<iframe class='objectPreview' src='" + url + "'></embed>"
	}
			
	return {
		init: init,
		onLoadTab : onLoadTab,
		drawPreviewElement : drawPreviewElement,
		generatePreviewWrapperForWeb : generatePreviewWrapperForWeb,
		generateWrapperForWeb : generateWrapperForWeb
	};

}) (VISH, jQuery);
