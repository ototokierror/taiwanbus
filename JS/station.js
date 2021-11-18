// city ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const cityData = [
  { name: '桃園市', value: 'Taoyuan' },
  { name: '臺中市', value: 'Taichung' },
  { name: '臺南市', value: 'Tainan' },
  { name: '高雄市', value: 'Kaohsiung' },
  { name: '基隆市', value: 'Keelung' },
  { name: '新竹市', value: 'Hsinchu' },
  { name: '新竹縣', value: 'HsinchuCounty' },
  { name: '苗栗縣', value: 'MiaoliCounty' },
  { name: '彰化縣', value: 'ChanghuaCounty' },
  { name: '南投縣', value: 'NantouCounty' },
  { name: '雲林縣', value: 'YunlinCounty' },
  { name: '嘉義縣', value: 'ChiayiCounty' },
  { name: '嘉義市', value: 'Chiayi' },
  { name: '屏東縣', value: 'PingtungCounty' },
  { name: '宜蘭縣', value: 'YilanCounty' },
  { name: '花蓮縣', value: 'HualienCounty' },
  { name: '臺東縣', value: 'TaitungCounty' },
  { name: '金門縣', value: 'KinmenCounty' },
  { name: '澎湖縣', value: 'PenghuCounty' },
  { name: '連江縣', value: 'LienchiangCounty' },
]
const citySelect = document.getElementById('citySelect');
function citySelector() {
  let str = '<option value="" hidden>選擇縣市</option>';
  cityData.forEach(i => {
    str += `<option value="${i.value}">${i.name}</option>`
  });
  citySelect.innerHTML = str;
}
citySelector();
let cityName = '';
let stationName = '';

// 站搜尋 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const stationSearch = document.getElementById('stationSearch');
stationSearch.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    stationName = stationSearch.value;
    stationSearch.value = "";

  }
});
/* 
先撈出可以取得該城市所有站牌的 API

*/


// 監聽 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
citySelect.addEventListener('change', function (e) {
  console.log(e.target.value);
  cityName = e.target.value;
  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/${cityName}`,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      console.log('站位資料', res);
    })
  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bus/Stop/City/${cityName}`,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      console.log('站牌資料', res);
    })
})

// MAP ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
let mymap = L.map('mapid').setView([35.6896067, 139.6983773], 11);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 20,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoic29ueWtvIiwiYSI6ImNrdmFvNDI3MzJxMGUydW5uMjE0dWd1MnkifQ.d5Tb0HYCecMQxpqq_YivNQ'
}).addTo(mymap);

// 定位 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const longitude = position.coords.longitude;  // 經度
      const latitude = position.coords.latitude;  // 緯度
      busNearBy(longitude, latitude, mymap);
      mymap.setView([latitude, longitude], 16);
    },
    // 錯誤訊息
    function (e) {
      const msg = e.code;
      const dd = e.message;
      console.error(msg)
      console.error(dd)
    }
  )
}
function busNearBy(lon, lat, mymap) {
  const nearByUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/NearBy?$top=30&$spatialFilter=nearby(${lat},${lon},500)&$format=JSON`;
  axios({
    method: 'get',
    url: nearByUrl,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      let data = res.data;
      data.forEach(i => {
        L.marker([i.BusPosition.PositionLat, i.BusPosition.PositionLon], { icon: busIcon }).bindPopup(`<h3>車牌：${i.PlateNumb}</h3><h4>路線：${i.RouteName.Zh_tw}</h4>`)
          .closePopup().addTo(mymap);
      })
    })
    .catch(err => {
      console.log(err);
    })
}
const busIcon = new L.Icon({
  iconUrl: 'image/busIcon.png',
  iconSize: [48, 54],
});


// TDX ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const appId = 'd97e3a7603f049728fb4966c08eba8da';
const appKey = '2mG7iZNmoX2fvkOpn2XQauzJMqI';
const APIURL = 'https://ptx.transportdata.tw/MOTC';

// token ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
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