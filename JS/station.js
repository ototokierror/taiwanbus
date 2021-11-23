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
let stationData = [];
let nowData = [];
let stationID = '';
// 站搜尋 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const stationSearch = document.getElementById('stationSearch');
const searchResult = document.getElementById('searchResult');
stationSearch.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    stationName = stationSearch.value;
    stationSearch.value = "";
    console.log('stationData', stationData)
    let filterData = stationData.filter(i => i.StationName.Zh_tw.indexOf(stationName) != -1);
    console.log(filterData);
    // filterData.forEach(i => {
    //   getStation(i.StationID);
    // })
    getStation(stationID);
    searchResult.innerHTML = `<h3>${stationName}</h3>`
  }
});


const keywordList = document.getElementById('keywordList');
stationSearch.addEventListener('input', (e) => {
  stationName = stationSearch.value;
  let filterData = stationData.filter(i => i.StationName.Zh_tw.indexOf(stationName) != -1).slice(0, 10);
  let str = "";
  filterData.forEach(i => {
    let bearing = '';
    if (i.Bearing == 'S') {
      bearing = '( 南行 )';
    } else if (i.Bearing == 'N') {
      bearing = '( 北行 )';
    } else if (i.Bearing == "W") {
      bearing = '( 西行 )';
    } else if (i.Bearing == "E") {
      bearing = '( 東行 )';
    } else if (i.Bearing == "SE") {
      bearing = '( 東南行 )';
    } else if (i.Bearing == "NE") {
      bearing = "( 東北行 )";
    } else if (i.Bearing == "SW") {
      bearing = "( 西南行 )";
    } else if (i.Bearing == "NW") {
      bearing = "( 西北行 )";
    } else {
      bearing = "";
    }

    str += `
   <li data-id="${i.StationID}" data-station="${i.StationName.Zh_tw}">${i.StationName.Zh_tw} ${bearing}</li>
   `
  })
  keywordList.innerHTML = str;
  keywordList.addEventListener('click', (e) => {
    stationID = e.target.closest('li').dataset.id;
    stationSearch.value = e.target.closest('li').dataset.station;
    keywordList.innerHTML = "";
    stationSearch.focus();
  })
})


// 搜尋結果render ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const stations = document.getElementById('stations');
function getStation(StationID) {
  let stationUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${cityName}/PassThrough/Station/${StationID}`;
  axios({
    method: 'get',
    url: stationUrl,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      console.log(res);
      let data = res.data;
      let currentData = data.filter(i => i.PlateNumb !== "-1" && i.PlateNumb);
      let str = `<li class="station_title">
      <div class="title">
        <h5 class="w50">路線名稱</h5>
        <h5 class="w30">預估到站</h5>
        <h5 class="w20">方向</h5>
      </div>
    </li>`;
      if (currentData.length == 0) {
        str = '<h5> 目前無行駛公車 </h5>'
      } else {
        currentData.forEach(i => {
          str += `
          <div class="station">
                          <h5 class="w50">${i.RouteName.Zh_tw}</h5>
                          <h5 class="w30">${Math.floor(i.EstimateTime / 60)} 分</h5>
                          <h5 class="w20">${i.Direction ? "返程" : "去程"}</h5>
                        </div>
          `;
        })
      }
      stations.innerHTML = str;
    })
    .catch(err => {
      console.log(err);
    })
}



function getNowData() {
  const url = `https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${cityName}`;
  axios({
    method: 'get',
    url: url,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      nowData = res.data;
    })
    .catch(err => {
      console.log(err);
    })
}
// 監聽 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
citySelect.addEventListener('change', function (e) {
  console.log(e.target.value);
  cityName = e.target.value;
  getNowData();
  axios({
    method: 'get',
    url: `https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/${cityName}`,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      console.log('站牌資料', res.data);
      stationData = res.data;
    })
    .catch(err => {
      console.log(err);
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