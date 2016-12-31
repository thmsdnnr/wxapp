//http://api.openweathermap.org/data/2.5/weather?lat=41.9046284&lon=-87.71214499999999&APPID=5f6dea19208b429284a263b064da2393
//returns
/* {"coord":{"lon":-87.78,"lat":41.89},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"stations","main":{"temp":273.93,"pressure":1010,"humidity":50,"temp_min":272.15,"temp_max":275.15},"visibility":16093,"wind":{"speed":6.7,"deg":280,"gust":10.3},"clouds":{"all":75},"dt":1483224900,"sys":{"type":1,"id":961,"message":0.1881,"country":"US","sunrise":1483190332,"sunset":1483223463},"id":4904381,"name":"Oak Park","cod":200}
*/

    /*
var wxJSON={"coord":{"lon":-122.09,"lat":37.39},
"sys":{"type":3,"id":168940,"message":0.0297,"country":"US","sunrise":1427723751,"sunset":1427768967},
"weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}],
"base":"stations",
"main":{"temp":285.68,"humidity":74,"pressure":1016.8,"temp_min":284.82,"temp_max":286.48},
"wind":{"speed":0.96,"deg":285.001},
"clouds":{"all":0},
"dt":1427700245,
"id":0,
"name":"Mountain View",
"cod":200};*/

//var wxJSON={"coord":{"lon":-87.78,"lat":41.89},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":275.15,"pressure":1006,"humidity":51,"temp_min":273.15,"temp_max":277.15},"visibility":16093,"wind":{"speed":6.2,"deg":300,"gust":11.3},"clouds":{"all":75},"dt":1483215300,"sys":{"type":1,"id":961,"message":0.2092,"country":"US","sunrise":1483190332,"sunset":1483223457},"id":4904381,"name":"Oak Park","cod":200};

//geolocation is not supported if not HTTPS!

var APP_TAG="iojakmCD3fdsaASDF"

function cToF(degC) {return ((degC)*(9/5)+32).toFixed(2);}
  
  function dataDisplay(wxJSON,tempUnits) {
    var tempC_avg=(wxJSON.main.temp-273.15).toFixed(2); //convert from Kelvin
    var tempC_low=(wxJSON.main.temp_min-273.15).toFixed(2);
    var tempC_high=(wxJSON.main.temp_max-273.15).toFixed(2);
    var tempF_avg=cToF(wxJSON.main.temp-273.15);
    var tempF_low=cToF(wxJSON.main.temp_min-273.15);
    var tempF_high=cToF(wxJSON.main.temp_max-273.15);
    var tempString="";
    switch (tempUnits) { 
      case "C": tempString="Current temperature: "+tempC_avg+"˚C<br />low: "+tempC_low+"˚C<br />high: "+tempC_high+"˚C"; break;
      case "F": tempString="Current temperature: "+tempF_avg+"˚F<br />low: "+tempF_low+"˚F<br />high: "+tempF_high+"˚F"; break;
      default: tempString="Current temperature: "+tempF_avg+"˚F<br />low: "+tempF_low+"˚F<br />high: "+tempF_high+"˚F"; break;
    }
    var sunRise=new Date(); var sunSet=new Date();
    sunRise.setTime(wxJSON.sys.sunrise*1000);
    sunSet.setTime(wxJSON.sys.sunset*1000); //convert to MS
    var dayLength=(sunSet-sunRise)/(1000*60*60);
    var dayMinutes=Math.round(dayLength%24);
//    var dayMinutes=Math.floor((String(dayLength).split(".")[1])*0.6);
    var dayString=Math.floor(dayLength)+" hours "+dayMinutes+" minutes";
    var wxString="<em>Oh my what a lovely day in "+wxJSON.name+"!</em><br />"+tempString+"<br /><h2>"+wxJSON.weather[0].description+"</h2>Sunrise: "+sunRise.toLocaleTimeString()+" / Sunset: "+sunSet.toLocaleTimeString()+"<br />Day Length: "+dayString;

    $('div.data').html(wxString);
  }

function checkLocalStorage(zip_code) {
  var local = localStorage.getItem("wx"+zip_code+APP_TAG); 
  if (local) {
    var now = new Date(Date.now());
    var then = new Date(JSON.parse(local).cachedOn) || null;
    var hours_old = 4; // how old we'll display weather from
    if ((now-then)<(1000*60*60*hours_old)) 
    {
      console.log((now-then)+" is less than"+(1000*60*60*hours_old));
      return local;
    }
    else //too old, so remove the cahced wx
    {
      localStorage.removeItem("wx"+zip_code+APP_TAG)
      return false;
    }
  }
  else {
    return false;
  }
}

function compareTimes(backWhen, format, decPlaces) { // takes a Date object cachedOn from the past
  var now = new Date(Date.now());
  var then = new Date(backWhen);
  switch (format) {
    case "days": return Number((now-then)/(1000*60*60*24)).toFixed(decPlaces); break;
    case "hours": return Number((now-then)/(1000*60*60)).toFixed(decPlaces); break;
    case "minutes": return Number((now-then)/(1000*60)).toFixed(decPlaces); break;
    case "seconds": return Number((now-then)/(1000)).toFixed(decPlaces); break;
    case "milliseconds": return Number(now-then).toFixed(decPlaces); break;
    default: return Number((now-then)*(1000*60)).toFixed(decPlaces); //hours 
  }
}

function sortByKey(arr, key) {
  return arr.sort(function(a,b) { return a.key-b.key; })
}

function bindClicks() {
$('a#wxData').click(function(e) {
  console.log(e.target.className);
  dataDisplay(JSON.parse(localStorage.getItem(e.target.className+APP_TAG)));
});
}

//retrieve cached date and order by stored time
function retrieveStored(sortBy) {
  var s=$('div.archive');
  s.empty();
  s.html('We also have weather for:<br />');
  var recentWx=[]; //array with elements [localStorage key, time]
  for (var i in localStorage)
  {
    var parsed=JSON.parse(localStorage[i]);
    //create an index of localstorage
    //format: localstorage KEY, time in minutes sinced cached, zip code, name
    recentWx.push([i,compareTimes(parsed.cachedOn, "minutes", 2),i.slice(2,7),parsed.name]);
    console.log([i,compareTimes(parsed.cachedOn, "minutes", 2),i.slice(2,7),parsed.name]);
  }
  
  switch (sortBy) {
    case "time": recentWx.sort(function(a,b){return a[1]-b[1];}); break; //time descending
    case "zip": recentWx.sort(function(a,b){return a[2]-b[2];}); break; //zip descending
    case "city": recentWx.sort(function(a,b){return a[3]>b[3];}); break; // name descending
    default: recentWx.sort(function(a,b){return a[1]-b[1];}); break; // time
  }

  for (var i=0;i<recentWx.length;i++) //i[0] is key, i[1] is time value
  {
    console.log(recentWx);
    console.log(recentWx[i][0]);
    var lsKey = recentWx[i][0].slice(0,7);
    console.log(localStorage[lsKey]);
    var parsed=JSON.parse(localStorage.getItem(lsKey+APP_TAG));
    var tag = lsKey.slice(0,7); // e.g., wx31757
    var zip = lsKey.slice(2,7); // e.g., 31757
    var age = compareTimes(parsed.cachedOn, "minutes", 2);
    s.append('<p><a href="#" id="wxData" class="'+tag+'">'+parsed.name+' ['+zip+']</a> '+parsed.weather[0].main+' only '+age+' minutes young!</p>');
    s.html()
  }
  bindClicks();
}

function geoLocate() { //attempt to geolocate
  if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
  $('div.app').append('current latitude: '+position.coords.latitude+' current longitude:'+position.coords.longitude);
});
} else {
  console.log("nope");
}
}

$(document).ready(function() {
  geoLocate(); //attempt to geolocate
  retrieveStored();
  $('div.header').append('');

$('a.sort').click(function(e) {
  console.log(e.target.id); // time zip city
  retrieveStored(e.target.id);
});

$("text#zipC").keypress(function (e){
  e.preventDefault();
  if (e.which === 13) {
    //dooooooit
  }
})

$("#sub").click(function(event) {
  doItToIt();
});

function doItToIt() {
  var tempUnits=$("#tempUnits").val();
  var countryCode=$("#cCode").val();
  if (!countryCode) { countryCode="us"; } //default to US if not given
  
  var zipVal=$("#zipC").val();
  if (zipVal.match(/(\d{5})|(\d{5}-\d{4})/)) 
  {
    var localS = checkLocalStorage(zipVal);
    if (localS) 
    {
      dataDisplay(JSON.parse(localS),tempUnits);
      console.log("succesfully fetched from local storage");
    }
    else
    {
      $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?zip="+zipVal+","+countryCode+"&APPID=5f6dea19208b429284a263b064da2393",
      dataType: 'jsonp',
      success: function(wxJSON)
      { 
        wxJSON.cachedOn=(new Date(Date.now()));
        console.log(wxJSON.cod+" successful API call");
        localStorage.setItem(("wx"+zipVal+APP_TAG), JSON.stringify(wxJSON));
        dataDisplay(wxJSON,tempUnits);
        retrieveStored(); // update list of stored wx
     }
   });
    }
  }
    else { alert ("THAT IS NOT A VALID ZIP CODE");}
    }
});