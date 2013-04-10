// Once the api loads call enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
}


//look into etags & gzip

// Search for a given string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    // maxResults: 10
    // part: 'snippet(title, description, thumbnails)'
    fields: 'items(id(videoId), snippet(title, thumbnails))',
    part: 'snippet'
  });

  request.execute(function(response) {
    //var str = JSON.stringify(response.result);

    // console.log(response);

    //clear the search results continer first
   // $('#searchResults').html('');
    
    //mytemplate is the the template script to compile
	var source = document.getElementById("myTemplate").innerHTML;
	var template = Handlebars.compile(source);	
	//placeholder is the parent div
	document.getElementById("searchResults").innerHTML = template(response);




	//var source2 = document.getElementById("myTemplate2").innerHTML;
	//var template2 = Handlebars.compile(source2);

	//click
	$('.video-result-wrapper').click(function(){
		var id = $(this).data('id');
		console.log(id);
		addVideo(id);
		
		//update dom correclty later
		//var data = {id: id};
		//document.getElementById("playlist-wrapper").innerHTML = template2(data);		
		$('#playlist-wrapper').after('');
	});    











    //$.each(response.items, function(i){


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