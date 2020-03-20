var xhr = new XMLHttpRequest();

mapboxgl.accessToken = 'pk.eyJ1IjoibWFhNDU4IiwiYSI6ImNrNnhxemhqNzBxMDMzZG8yZzB0M2ZzczAifQ.QT2QvPmKjTlb4yQrzqVJjg';
var map = new mapboxgl.Map({ // create map using mapbox API
  container: 'map', // container id
  style: 'mapbox://styles/maa458/ck6xr2a0a2ob01imw65mdc1np', // hosted style id
  center: [0, 0], // map center
  zoom: 2 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl()); // add zoom and rotation controls to the map

var d = document.createElement('div'); // create DOM element for the marker
d.id = 'marker';
marker = new mapboxgl.Marker(d, {draggable: true}); // create marker
marker.setLngLat([0, 0]); // init marker at (0,0)
marker.addTo(map); // add marker to map

var popup = new mapboxgl.Popup({ offset: 25 }).setHTML('<h3 style="margin:0;color:#da6958;">Drop me anywhere!</h3>'); // create popup
marker.setPopup(popup); // set popup on marker
popup.addTo(map); // add popup to map

function onDragEnd() { // when marker is dropped at location
  coord = marker.getLngLat();
  xhr.open("GET", "/getlocation?lat="+coord.lat+"&long="+coord.lng, true); // GET request to server-side with marker's lat & long
  xhr.send();
  xhr.responseType = "json";
  trends = xhr.response; // json response containing trends
  var loc = trends['location']; // extract location from json
  delete trends['location'];
  var innerHTML = '<div class="popup"><h3>'+loc+'</h3>'; // populate popup contents with trends
  for (const trend in trends) {
    var url = trends[trend]
    var link = "/add?trend="+`${trend}`+"&url="+`${url}`+"&loc="+`${loc}`; // link to redirect to /add endpoint on server-side
    innerHTML += '<a href="'+`${url}`+'"target="_blank">'+`${trend}`+'</a><span class="icon"><a href="'+`${link}`+'" class="icon"><i class="fi-bookmark"></i></a></span><br>';
  }
  innerHTML += '</div>';
  popup.setHTML(innerHTML); // set popup innerHTML
}

marker.on('dragend', onDragEnd);
