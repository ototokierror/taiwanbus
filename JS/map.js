export function busNearBy(lon, lat, mymap) {
  const nearByUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/NearBy?$top=30&$spatialFilter=nearby(${lat},${lon},500)&$format=JSON`;
  axios({
    method: 'get',
    url: nearByUrl,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      let data = res.data;
      console.log(data)
      data.forEach(i => {
        console.log(i.BusPosition.PositionLat, i.BusPosition.PositionLon);
        L.marker([i.BusPosition.PositionLat, i.BusPosition.PositionLon], { icon: busIcon }).bindPopup(`<h3>車牌：${i.PlateNumb}</h3><h4>路線：${i.RouteName.Zh_tw}</h4>`)
          .closePopup().addTo(mymap);
      })
    })
    .catch(err => {
      console.log(err);
    })
  console.log('123', lon, lat);
}

export function getBusShape(city, route, mymap) {
  const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/${city}/${route}`;
  axios({
    method: 'get',
    url: url,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      let data = res.data;
      let geoData = data.filter(i => i.RouteName.Zh_tw === route);

      let geo = geoData[0].Geometry;
      if (myLayer) {
        console.log(myLayer)
        mymap.removeLayer(myLayer);
      }
      polyLine(geo, mymap);
    })
    .catch(err => {
      console.log(err);
    })
}

// 劃線線 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
let myLayer = null;
function polyLine(geo, mymap) {
  const wicket = new Wkt.Wkt();
  const geojsonFeature = wicket.read(geo).toJson()

  const myStyle = {
    "color": "#617673",
    "weight": 4,
    "opacity": 0.65
  };
  myLayer = L.geoJSON(geojsonFeature, {
    style: myStyle
  }).addTo(mymap);

  myLayer.addData(geojsonFeature);
  // zoom the map to the layer
  mymap.fitBounds(myLayer.getBounds());
  console.log('1', myLayer);
}


const busIcon = new L.Icon({
  iconUrl: 'image/busIcon.png',
  iconSize: [48, 54],
});

const appId = 'd97e3a7603f049728fb4966c08eba8da';
const appKey = '2mG7iZNmoX2fvkOpn2XQauzJMqI';
function getAuthorizationHeader() {
  let AppID = appId;
  let AppKey = appKey;
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}