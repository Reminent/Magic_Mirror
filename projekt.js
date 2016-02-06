function start_mirror() {
<<<<<<< HEAD
	get_upcoming_movie();
=======
	//get_upcoming_movie();
>>>>>>> origin/master
	startTime();
  get_weather();
	set_todays_date();
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
  			//console.log(json.results[0].popularity);
  			for(var i = 0; i < json.results.length; i++) {
  				var title = json.results[i].original_title;
  				var overview = json.results[i].overview;
  				var date = json.results[i].release_date;
  				var image = json.results[i].poster_path;
          var popularity = json.results[i].popularity;
          var language = json.results[i].original_language;
          if(popularity > 2 && language == "en"){
            document.getElementById("movies").innerHTML += "<div><b>" + title + "</b><br>" + date;
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
  document.getElementById("date").innerHTML = todays_date();
}

function get_weather() {
    $.ajax({
      url: "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/62.39/lon/17.29/data.json",
      type: "GET",
      dataType: "json",
      success: function(json) {
        var today = todays_date();
        var weather_date = json.timeseries[0].validTime;
        weather_date = weather_date.split("T");
<<<<<<< HEAD
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
=======
        var periodone=0, periodtwo=0, periodthree=0, periodfour=0;
        var counts_one=0, counts_two=0,counts_three=0,counts_four=0;
        for(var i = 0; i < json.timeseries.length; i++) {
          if(weather_date[0] == todays_date()) {
            var weather_time = weather_date[1].split(":")
            if(parseInt(weather_time[0]) < 6) {
              periodone += parseInt(json.timeseries[i].t);
              counts_one++;
            }
            if(parseInt(weather_time[0]) >= 6 && parseInt(weather_time[0]) < 12) {
              periodtwo += parseInt(json.timeseries[i].t);
              counts_two++;
            }
            if(parseInt(weather_time[0]) >= 12 && parseInt(weather_time[0]) < 18) {
              periodthree += parseInt(json.timeseries[i].t);
              counts_three++;
            }
              if(parseInt(weather_time[0]) >= 18 && parseInt(weather_time[0]) < 24) {
              periodfour += parseInt(json.timeseries[i].t);
              counts_four++;
>>>>>>> origin/master
            }
          }
          weather_date = json.timeseries[i].validTime;
          weather_date = weather_date.split("T");
        }
<<<<<<< HEAD
        console.log(period, counts);
        var average_temps = [0,0,0,0];
        for(var i=0; i < average_temps.length; i++){
          average_temps[i] = period[i]/counts[i];
          average_temps[i] = average_temps[i].toFixed(1);
        }

        var weather_content_one = "<div id='period_one'> 00:00 - 06:00 : " + average_temps[0] + "C </div>"
        var weather_content_two = "<div id='period_two'> 06:00 - 12:00 : " + average_temps[1] + "C </div>"
        var weather_content_three = "<div id='period_three'> 12:00 - 18:00 : " + average_temps[2] + "C </div>"
        var weather_content_four = "<div id='period_four'> 18:00 - 24:00 : " + average_temps[3] + "C </div>";
        
        if(!isNaN(period[0]/counts[0])) {
          document.getElementById("weather").innerHTML = weather_content_one;
        }
        if(!isNaN(period[1]/counts[1])) {
          document.getElementById("weather").innerHTML += weather_content_two;
        }
        if(!isNaN(period[2]/counts[2])) {
          document.getElementById("weather").innerHTML += weather_content_three;
        }
        if(!isNaN(period[3]/counts[3])) {
          document.getElementById("weather").innerHTML += weather_content_four;
        }
        console.log(period[2]/counts[2]);
      }
    });
}

function weather_icon() {
  
=======
          var average_temps = [4];
          average_temps[0] = periodone/counts_one;
          average_temps[1] = periodtwo/counts_two;
          average_temps[2] = periodthree/counts_three;
          average_temps[3] = periodfour/counts_four;
          for(var i=0; i < average_temps.length; i++){
            average_temps[i] = average_temps[i].toFixed(1);
          }
          console.log(average_temps);
          var weather_content_one = "<div id='period_one'> 00:00 - 06:00 : " + average_temps[0] + "C </div>"
          var weather_content_two = "<div id='period_two'> 06:00 - 12:00 : " + average_temps[1] + "C </div>"
          var weather_content_three = "<div id='period_three'> 12:00 - 18:00 : " + average_temps[2] + "C </div>"
          var weather_content_four = "<div id='period_four'> 18:00 - 24:00 : " + average_temps[3] + "C </div>";
          
          if(!isNaN(periodone/counts_one)) {
            document.getElementById("weather").innerHTML = weather_content_one;
          }
          if(!isNaN(periodtwo/counts_two)) {
            document.getElementById("weather").innerHTML += weather_content_two;
          }
          if(!isNaN(periodtwo/counts_two)) {
            document.getElementById("weather").innerHTML += weather_content_three;
          }
          if(!isNaN(periodtwo/counts_two)) {
            document.getElementById("weather").innerHTML += weather_content_four;
          }
      }
    });
>>>>>>> origin/master
}