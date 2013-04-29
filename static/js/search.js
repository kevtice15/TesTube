// Once the api loads call enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
  // videoApp.setup();
}


//look into etags & gzip

// Search for a given string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    maxResults: 10,
    // order: 'viewCount',
    // part: 'snippet(title, description, thumbnails)'
    fields: 'items(id(videoId), snippet(title, thumbnails))',
    part: 'snippet'
	});

  request.execute(function(response) {
    var str = JSON.stringify(response.result);

    console.log(response);



/*
		var searchIds = [];
		//loop through results and create a json object from id for the dom
		$.each(response.items, function(i){
			//video id's use this to search stats
			//console.log(response.items[i].id.videoId);
			searchIds.push(response.items[i].id.videoId);
	});
	console.log("searchids");
	console.log(searchIds);
*/
	
	 
			
/*
	 var contentRequest = gapi.client.youtube.videos.list({
		 id: 'wfpL6_0OBuA',
		 part: 'statistics'
	 });
*/

	var source = document.getElementById("myTemplate").innerHTML;
	var template = Handlebars.compile(source);	

	var newObject = response; 

    //loop through results and create a json object from id for the dom
    var statsObject = [];
    var count = response.items.length;
    $.each(response.items, function(i){
			var contentRequest = gapi.client.youtube.videos.list({
			id: response.items[i].id.videoId,
			part: 'statistics'
    	});

    	contentRequest.execute(function(response) {
	    	//console.log(response.items[0].statistics);     
 			statsObject.push(response.items[0].statistics); 
 			
/*  			console.log(newObject.items[i]); */
 			newObject.items[i].stats = response.items[0].statistics;
 			
 			
 			count--;
 			if (count == 0) {
	    		console.log(newObject);
	    		document.getElementById("searchResults").innerHTML = template(newObject);
	    	}	    
     	});
     	
     	
     	
     });
     
     
     var stringify = JSON.stringify(newObject);  
/*     console.log(stringify); */
	
/*
	$.each(response.items, function(i){
	})
*/
//THIS IS THE STATISTICS SEARCH

/*
	 var contentRequest1 = gapi.client.youtube.videos.list({
		 id: 'wfpL6_0OBuA',
		 part: 'statistics'
	 });
	
	 console.log(contentRequest1);
	 
	

	 contentRequest.execute(function(response){
	 var stringify = JSON.stringify(response);  
		 console.log("view count below");
		 console.log(response.items[0].statistics);     
	 });	
*/ 


	var source = document.getElementById("myTemplate").innerHTML;
	var template = Handlebars.compile(source);	
	document.getElementById("searchResults").innerHTML = template(response);


	//var source2 = document.getElementById("myTemplate2").innerHTML;
	//var template2 = Handlebars.compile(source2);

	//click
	$('.video-result-wrapper').on('click', function(){
		// var id = $(this).data('id');
    var videoData = $(this).data();
    console.log("searchJS videodata:" + videoData);
    // var title = $(this).data-title;
    // var thumbnail = $(this).data-thumbnail;

		// console.log(id);
		$(this).children('#video-result-wrapper').css({'backgroundColor': 'grey'});
		// console.log($(this).children('#video-result-wrapper'));
    // videoApp.updatePlaylist(id);

    addVideo(videoData);
		// addVideo(id);
		
		//update dom correclty later
		//var data = {id: id};
		//document.getElementById("playlist-wrapper").innerHTML = template2(data);		
		$('#playlist-wrapper').after('');
	});    






/*
        var videoResult = $(document.createElement('div')).addClass('video-result-wrapper').attr('id',response.items[i].id.videoId);
        var videoTitle = $(document.createElement('h2')).append(response.items[i].snippet.title);
        var videoId = $(document.createElement('p')).append(response.items[i].id.videoId);
        // var videoThumbnail = $(document.createElement('img')).attr('src', response.items[i].snippet.thumbnails.default.url);
                var videoThumbnail = $(document.createElement('img')).attr('src', response.items[i].snippet.thumbnails.default.url);
        var videoThumbnailDiv = $(document.createElement('div')).addClass('thumbnail');
        videoThumbnailDiv.append(videoThumbnail);
        
        // videoResult.append(videoTitle).append(videoId).append(videoThumbnail);
                videoResult.append(videoThumbnailDiv).append(videoTitle).append(videoId);


        $('#searchResults').append(videoResult);
*/



/*
        $(videoResult).on('click', function(){
          // var id = $(document.createElement('li')).append($(this).attr('id'));
          // $('#playlist').append(id);
          
          //MAKE THIS VIDEO ADDED FUNCTION INSIDE THE CLIENTSOKETS.JS FILE!!!
          // socket.emit('videoAdded', {body: $(this).attr('id') });
          // return false;
          addVideo($(this).attr('id'));

          //RELLY SHOULD CHECK FOR ERROR

        });
*/

         // console.log("response "+ i + ": " +response.items[i].snippet.thumbnails);
    //});

    // //really will want to do optimisitc rendering
    // var postVideo = $.post('/videos', {data: response.result});

    // postVideo.done(function(data){
    //   // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + data.data.items[0].id.videoId);
    //   $.each(data.data.items, function(i){
    //     // $('#search-container').append(
    //     //   '<pre>' + JSON.stringify(data.data.items[i].id.videoId) + '</pre>'
    //     // );
    //   videoId.push(data.data.items[i].id.videoId);
    //   });

       
    //     console.log("data successfuly stored")
    // });


  });
}


var apiKey = 'AIzaSyDDCLIZDFCndntgpiPllCsDx98TKciDqfY';


// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    // Step 2: Reference the API key
    gapi.client.setApiKey(apiKey);
    // window.setTimeout(checkAuth,1);
    handleAPILoaded();
}