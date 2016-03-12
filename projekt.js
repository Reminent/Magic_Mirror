var CLIENT_ID = '502608824683-rov1f6d0c7lin2emfnt5db1p8eldnc5n.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function start_mirror() {
  //run every minute
  setInterval(function(){
    set_todays_date();
  }, 60*1000);
	//Functions run every hour
  setInterval(function(){  
    get_weatheryr();
    dailyQuote();
    listUpcomingEventsPrimary();
  }, 3600*1000);
  //Functions run every day
  setInterval(function(){
    //get_upcoming_movie();
  }, 86400*1000);

  dailyQuote();
  get_weatheryr();
  //get_upcoming_movie();
  set_todays_date();
	startTime();
  listUpcomingEventsPrimary();
}

function todays_date() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = yyyy + '-' + mm + '-' + dd;
	return today;
}

function get_upcoming_movie() {
	$.ajax({
  		url: "http://api.themoviedb.org/3/discover/movie?api_key=a3cf0556d0f01a2b1ce79bd72da07170",
  		type: "GET",
  		dataType: "json",
  		data: {	"primary_release_date.gte": todays_date(),
  				    "sort_by": "primary_release_date.asc",
              "page": "1"
            },
  		success: function(json) {
  			var date = new Date();
        var number_of_movies = 0;
  			for(var i = 0; i < json.results.length; i++) {
  				var title = json.results[i].original_title;
  				var overview = json.results[i].overview;
  				var date = json.results[i].release_date;
  				var image = json.results[i].poster_path;
          var popularity = json.results[i].popularity;
          var language = json.results[i].original_language;
          if(popularity > 2 && language == "en" && number_of_movies < 3){
            document.getElementById("movies").innerHTML += "<div><b>" + title + "</b><br>" + date;
            number_of_movies++;
          }
  				
  			}
  		}
  	});
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function set_todays_date() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();

  $.ajax({
    url: "get_date.php",
    type: "GET",
    dataType: "json",
    data: {"date": [year, month, date].join("/")},
    success: function(json) {
      var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
      var d = new Date();
      var week = json.dagar[0].vecka;
      var day = json.dagar[0].veckodag;
      var date = day + " " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
      document.getElementById("week").innerHTML = "V." + week;
      document.getElementById("date").innerHTML = date;
    }
  });
}

function get_weatherSMHI() {
    $.ajax({
      url: "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/62.39/lon/17.29/data.json",
      type: "GET",
      dataType: "json",
      success: function(json) {
        var today = todays_date();
        var weather_date = json.timeseries[0].validTime;
        weather_date = weather_date.split("T");
        var period = [0,0,0,0];
        var counts = [0,0,0,0];
        
        for(var i = 0; i < json.timeseries.length; i++) {
          if(weather_date[0] == todays_date()) {
            var weather_time = weather_date[1].split(":")
            if(parseInt(weather_time[0]) <= 6) {
              period[0] += parseInt(json.timeseries[i].t);
              counts[0]++;
            }
            if(parseInt(weather_time[0]) > 6 && parseInt(weather_time[0]) <= 12) {
              period[1] += parseInt(json.timeseries[i].t);
              counts[1]++;
            }
            if(parseInt(weather_time[0]) > 12 && parseInt(weather_time[0]) <= 18) {
              period[2] += parseInt(json.timeseries[i].t);
              counts[2]++;
            }
            if(parseInt(weather_time[0]) > 18 && parseInt(weather_time[0]) <= 24) {
              period[3] += parseInt(json.timeseries[i].t);
              counts[3]++;
            }
          }
          weather_date = json.timeseries[i].validTime;
          weather_date = weather_date.split("T");
        }

        var average_temps = [0,0,0,0];
        for(var i=0; i < average_temps.length; i++){
          average_temps[i] = period[i]/counts[i];
          average_temps[i] = average_temps[i].toFixed(1);
        }

        var weather_content_one = "<div id='period_one'> 00:00 - 06:00 : " + average_temps[0] + "C </div>"
        var weather_content_two = "<div id='period_two'> 06:00 - 12:00 : " + average_temps[1] + "C </div>"
        var weather_content_three = "<div id='period_three'> 12:00 - 18:00 : " + average_temps[2] + "C </div>"
        var weather_content_four = "<div id='period_four'> 18:00 - 24:00 : " + average_temps[3] + "C </div>";
        
        if(!isNaN(period[0]/counts[0]) && current_hour() <= 6) {
          document.getElementById("weather").innerHTML = weather_content_one;
        }
        if(!isNaN(period[1]/counts[1]) && current_hour() <= 12) {
          document.getElementById("weather").innerHTML += weather_content_two;
        }
        if(!isNaN(period[2]/counts[2]) && current_hour() <= 18) {
          document.getElementById("weather").innerHTML += weather_content_three;
        }
        if(!isNaN(period[3]/counts[3]) && current_hour() <= 24) {
          document.getElementById("weather").innerHTML += weather_content_four;
        }


      }
    });
}

function get_weatheryr() {
  $.ajax({
    url: "get_weather.php",
    success: function(xml) {
      var size = xml.getElementsByTagName("time");
      var period = [0,0,0,0];
      var counts = [0,0,0,0];
      var cloud_index = [0,0,0,0];
      var take_icon = [null,null,null,null];
      var i = 0;
      var start_date = xml.getElementsByTagName("time")[0].getAttribute("from");
      var cloud_symbol = xml.getElementsByTagName("time")[i+1].childNodes[1].getElementsByTagName("symbol");     
      start_date = start_date.split("T");

      while(start_date[0] == todays_date()){
        var entrysize = xml.getElementsByTagName("time")[i].childNodes[1].childNodes.length; 
        if(entrysize > 9) {
          time = start_date[1].split(":");
          var weather_time = time[0];
          var temp = xml.getElementsByTagName("time")[i].childNodes[1].getElementsByTagName("temperature");
          temp = temp[0].getAttribute("value");
          
          if(parseInt(weather_time) < 6) {
            period[0] += parseInt(temp);
            counts[0]++;
            if(parseInt(weather_time) == 5 && cloud_index[0]+1 < size.length){
              cloud_symbol = xml.getElementsByTagName("time")[i+1].childNodes[1].getElementsByTagName("symbol");
              cloud_index[0] = cloud_symbol[0].getAttribute("number");
            }
          }
          if(parseInt(weather_time) >= 6 && parseInt(weather_time) < 12) {
            period[1] += parseInt(temp);
            counts[1]++;
            if(parseInt(weather_time) == 11 && cloud_index[1]+1 < size.length){
              cloud_symbol = xml.getElementsByTagName("time")[i+1].childNodes[1].getElementsByTagName("symbol");
              cloud_index[1] = cloud_symbol[0].getAttribute("number");
            }
          }
          if(parseInt(weather_time) >= 12 && parseInt(weather_time) < 18) {
            period[2] += parseInt(temp);
            counts[2]++;
            if(parseInt(weather_time) == 17 && cloud_index[2]+1 < size.length){
              cloud_symbol = xml.getElementsByTagName("time")[i+1].childNodes[1].getElementsByTagName("symbol");
              cloud_index[2] = cloud_symbol[0].getAttribute("number");
            }
          }
          if(parseInt(weather_time) >= 18 && parseInt(weather_time) < 24) {
            period[3] += parseInt(temp);
            counts[3]++;
            if(parseInt(weather_time) == 23 && cloud_index[3]+1 < size.length){
              cloud_symbol = xml.getElementsByTagName("time")[i+1].childNodes[1].getElementsByTagName("symbol");
              cloud_index[3] = cloud_symbol[0].getAttribute("number");
            }
          }  
        }

        i++;
        start_date = xml.getElementsByTagName("time")[i].getAttribute("from");
        start_date = start_date.split("T");
      }

      var average_temps = [0,0,0,0];
      for(var i=0; i < average_temps.length; i++){
        average_temps[i] = period[i]/counts[i];
        average_temps[i] = average_temps[i].toFixed(1);
      }

      var day_night = [1,2,3,5,6,7,8,20,21,24,25,26,27,28,29,40,41,42,43,44,45];
      for(var i = 0; i < day_night.length; i++) {
        if(cloud_index[3] == day_night[i]){
          cloud_index[3] += "n";
        }
        if(cloud_index[0] == day_night[i]){
          cloud_index[0] += "n";
        }
      }

      for(var i = 0; i < day_night.length; i++) {
        if(cloud_index[1] == day_night[i]){
          cloud_index[1] += "d";
        }
        if(cloud_index[2] == day_night[i]){
          cloud_index[2] += "d";
        }
      }

      var weather_content_one = "00:00 - 06:00: <br>" + average_temps[0] + "C " + "<img id='weather_image' src='icons/used_icons/" + cloud_index[0] + ".png' alt=" + "Weather icon" + ">" + "<br><br>";
      var weather_content_two = "06:00 - 12:00: <br>" + average_temps[1] + "C " + "<img id='weather_image' src='icons/used_icons/" + cloud_index[1] + ".png' alt=" + "Weather icon" + ">" + "<br><br>";
      var weather_content_three = "12:00 - 18:00: <br>" + average_temps[2] + "C " + "<img id='weather_image' src='icons/used_icons/" + cloud_index[2] + ".png' alt=" + "Weather icon" + ">" + "<br><br>";
      var weather_content_four = "18:00 - 24:00: <br>" + average_temps[3] + "C " + "<img id='weather_image' src='icons/used_icons/" + cloud_index[3] + ".png' alt=" + "Weather icon" + ">" + "<br><br>";
      
      if(!isNaN(period[0]/counts[0]) && current_hour() <= 6) {
        document.getElementById("weather_one").innerHTML = weather_content_one;
      }
      if(!isNaN(period[1]/counts[1]) && current_hour() <= 12) {
        document.getElementById("weather_two").innerHTML = weather_content_two;
      }
      if(!isNaN(period[2]/counts[2]) && current_hour() <= 18) {
        document.getElementById("weather_three").innerHTML = weather_content_three;
      }
      if(!isNaN(period[3]/counts[3]) && current_hour() <= 24) {
        document.getElementById("weather_four").innerHTML = weather_content_four;
      }
    }
  });
}

function current_hour() {
  var time = Date();
  time = time.split(" ");
  time = time[4];
  time = time.split(":");
  time = time[0];

  return parseInt(time);
}

function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEventsPrimary);
}

function listUpcomingEventsPrimary() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'b8tq7j7l0i79vhf21g2035fo8np3tm41@import.calendar.google.com',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 3,
      'orderBy': 'startTime',
      'timeZone': 'Europe/Stockholm'
    });

    request.execute(function(resp) {
    var events = resp.items;
    var calendar_add = "<div id='primary'>";
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        when = when.split("T");
        var date = when[0];
        var time = when[1].split("+");
        time = time[0].split(":");
        time  = time[0] + ":" + time[1];
        calendar_add += "(" + when[0] + " " + time + ")" + " " + event.summary + "<br>";
      }
      calendar_add += "</div>";
    } else {
      calendar_add += 'No upcoming events found.' + "</div>";
    }
      document.getElementById("calendar").innerHTML = calendar_add;  
    });
}

function dailyQuote() {
  $.ajax({
      url: "get_quote.php",
      type: "GET",
      dataType: "json",
      success: function(json){
        var quote = json.quote;
        var author = json.author;
        var authorInfo = json.authorInfo;
        var authorName = "";
        for(var i = 0; i < author.length; i++){
          authorName += author[i] + " ";
        }

        document.getElementById("quote").innerHTML = quote;
        document.getElementById("quoteAuthor").innerHTML = authorName;
        document.getElementById("quoteInfo").innerHTML = authorInfo;
      }
    });
}