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

//geolocation is not supported if not HTTPS!

$(document).ready(function() {

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
      case "C": tempString="The current temperature is "+tempC_avg+"˚C, with a low of "+tempC_low+"˚C, and a high of "+tempC_high+"˚C."; break;
      case "F": tempString="The current temperature is "+tempF_avg+"˚F, with a low of "+tempF_low+"˚F, and a high of "+tempF_high+"˚F."; break;}
    var sunRise=new Date(); var sunSet=new Date();
    sunRise.setTime(wxJSON.sys.sunrise*1000);
    sunSet.setTime(wxJSON.sys.sunset*1000); //convert to MS
    var dayLength=(sunSet-sunRise)/(1000*60*60);
    var dayMinutes=Math.round(dayLength%24);
//    var dayMinutes=Math.floor((String(dayLength).split(".")[1])*0.6);
    var dayString=Math.floor(dayLength)+" hours "+dayMinutes+" minutes.";
    var wxString="Oh my what a lovely day in "+wxJSON.name+"!"+tempString+" "+wxJSON.weather[0].description+". Sunrise: "+sunRise.toLocaleTimeString()+" / Sunset: "+sunSet.toLocaleTimeString()+". Day Length: "+dayString;
$("#data").html(wxString);
  }
  
  $("#sub").click(function(event) {
    var tempUnits=$("#tempUnits").val();
    var countryCode=$("#cCode").val();
    if (!countryCode) { countryCode="us"; } //default to US if not given
    var zipVal=$("#zipC").val();
    if (zipVal.match(/(\d{5})|(\d{5}-\d{4})/)) {          
    $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?zip="+zipVal+","+countryCode+"&APPID=5f6dea19208b429284a263b064da2393",
    dataType: 'jsonp',
    success: function(wxJSON)
      { 
      dataDisplay(wxJSON,tempUnits); 
      console.log(JSON.stringify(wxJSON));
      }
  });
      if (wxJSON.cod==200) {
      dataDisplay(wxJSON,tempUnits);}
    }
  });
     /* var wxJSON="http://api.openweathermap.org/data/2.5/weather?zip="+zipVal+"&APPID=5f6dea19208b429284a263b064da2393";
      $.getJSON(wxJSON,function(data){alert("it is currently "+(data.main.temp-273.15)+" degrees C at your location in"+data.name+"!");});/*
      
    }
    else { alert ("THAT IS NOT A VALID ZIP CODE");}
  });*/
  
 
});