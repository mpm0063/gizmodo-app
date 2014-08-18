(function() {

	"use strict";

   	window.GizmodoApp = window.GizmodoApp || {

   		// Set variables and initialize app
   		initApp : function(){
   			GizmodoApp.url = 'http://api.chartbeat.com/live/toppages/v3/?apikey=317a25eccba186e0f6b558f45214c0e7&host=gizmodo.com&limit=10&sort_by=new';
   			GizmodoApp.getXML(GizmodoApp.url);
   		},

   		// generate a new XMLHttpRequest in modern and IE browsers and generate request.
	   	getXML : function(url,callback){
	   		if (window.XMLHttpRequest) { 
		     GizmodoApp.http_request = new XMLHttpRequest();
		    } else if (window.ActiveXObject) {
		      try {
		        GizmodoApp.http_request = new ActiveXObject("Msxml2.XMLHTTP");
		      } 
		      catch (e) {
		        try {
		          GizmodoApp.http_request = new ActiveXObject("Microsoft.XMLHTTP");
		        } 
		        catch (e) {}
		      }
		    }

		    if (!GizmodoApp.http_request) {
		      alert('Giving up :( Cannot create an XMLHTTP instance');
		      return false;
		    }
		    GizmodoApp.http_request.onreadystatechange = GizmodoApp.handleResults;
		    GizmodoApp.http_request.open('GET', url);
		    GizmodoApp.http_request.send();
	   	},

	   	// Check data returned from api for error handling
	   	handleResults : function(){
		    if (GizmodoApp.http_request.readyState === 4) {
		      if (GizmodoApp.http_request.status === 200) {
		      	document.getElementById('top-pages').className = '';
		        GizmodoApp.results = JSON.parse(GizmodoApp.http_request.responseText);
		        GizmodoApp.parseResults(GizmodoApp.results['pages']);
		        setTimeout(function(){
		        	GizmodoApp.getXML(GizmodoApp.url);
		        },5000);
		      } else {
		        console.log('There was a problem with the request.');
		      }
		    }
	   	},

	   	// run through results from api and generate markup
	   	parseResults : function(results){
	   		document.getElementById('top-pages').innerHTML = '';
	   		for(var i=0; i<results.length; i++){
	   			// Set page variable for each result, generate list item markup and append it to the list
	   			var page = results[i];
	   			var el =  document.createElement("li")
					el.id="list_" + i;
					el.dataindex = i;
					el.innerHTML = '<a href="#">' + page['title'] + '</a><div class="path">gizmodo.com' + page['path'] + '</div>';
					document.getElementById('top-pages').appendChild(el);

				// Handle click event to display referrers
				el.addEventListener("click",function(event){
					event.preventDefault();
					var page_data = results[this.dataindex]; 		// get data for clicked item
					GizmodoApp.active_title = page_data['title'];	// set active li
					GizmodoApp.displayReferrers(page_data);			// call function to display server
				});
	   		}
	   		if(GizmodoApp.active_title){
	   			GizmodoApp.updateStats(GizmodoApp.active_title,results);
	   		}

	   	},

	   	// run through new top 10 and update stats if still available
	   	updateStats : function(active_title,results){
	   		for(var i=0; i<results.length; i++){
	   			if(results[i]['title'] == active_title){
	   				GizmodoApp.displayReferrers(results[i]);
	   			}
	   		}
	   	},

	   	// Using data from the clicked item, generate referrer markup
	   	displayReferrers : function(page_data){
	   		// create wrapper element for referrers
	   		var referrer_markup = document.createElement('div');
	   			referrer_markup.innerHTML += '<h2>Top referrers for:</h2><h3>' + page_data['title'] + '</h3><hr/>';
	   		var page_referrers = page_data['stats']['toprefs'];
	   		// for each referrer in page data, generate markup to display data and append it to the page-referrers element
	   		for(var i=0; i<page_referrers.length; i++){
	   			var referrer = '<div class="referrer">';
	   			referrer += '<div class="referrer-domain">' + page_referrers[i]['domain'] + '</div>';
	   			referrer += '<div class="referrer-visitors">' + page_referrers[i]['visitors'] + '</div>';
	   			referrer += '<div class="cb"></div>';
	   			referrer += '</div>';
	   			referrer_markup.innerHTML += referrer;
	   			if(i == (page_referrers.length-1)){
	   				document.getElementById('page-referrers').innerHTML = '';				// empty page-referrers 
	   				document.getElementById('page-referrers').appendChild(referrer_markup);  // append new page-referrers
	   			}
	   		}
	   	}

   };

   GizmodoApp.initApp(); // Initialize App

})();