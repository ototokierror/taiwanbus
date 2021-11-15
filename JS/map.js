// city ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const cityData = [
  { name: '臺北市', value: 'Taipei' },
  { name: '新北市', value: 'NewTaipei' },
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
const routeSelector = document.getElementById('routeSelector');

function citySelector(){
  let str = '';
  cityData.forEach(i => {
    str+= `<option value="${i.value}">${i.name}</option>`
  });
  citySelect.innerHTML = str;
}
citySelector();
let cityName = '';
let routeName = '';

// 監聽 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
citySelect.addEventListener('change',function(e){
  console.log(e.target.value);
  ruteSearch(e.target.value);
  cityName = e.target.value ;
})
routeSelector.addEventListener('change',function(e){
  routeName = e.target.value;
  routeSearch ();
})

// MAP ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
let mymap = L.map('mapid').setView([35.6896067,139.6983773], 11);
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
      console.log(longitude)
      console.log(latitude)

      // 重新設定 view 的位置
      mymap.setView([latitude, longitude], 14);
      // 將經緯度當作參數傳給 getData 執行
      // getStationData(longitude, latitude);
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
// TDX ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const busData = [] ;
const appId = 'd97e3a7603f049728fb4966c08eba8da';
const appKey = '2mG7iZNmoX2fvkOpn2XQauzJMqI';
const APIURL = 'https://ptx.transportdata.tw/MOTC';
// 取得城市 and 車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function ruteSearch(cityName){
  let routeNameArr = [];
  axios({
    method: 'get',
    url: `${APIURL}/v2/Bus/RealTimeByFrequency/City/${cityName}`,
    headers: getAuthorizationHeader()
  })
   .then(function (response) {
     let busData ;
     busData = response.data;
     busData.forEach(i=>{
      routeNameArr.push(i.RouteName.Zh_tw);
     })
     let newRouteNameArr = routeNameArr.reduce((obj, item)=> {
       obj[item] = 1 ;
       return obj ;
     },{});
     newRouteNameArr = Object.keys(newRouteNameArr);
     let str = '';
     newRouteNameArr.forEach(i => {
       str += `<option value="${i}">${i}</option>`;
     });
     routeSelector.innerHTML = str;
   })
   .catch(function (error) {
     console.log(error);
   }); 
}

const departureStopName = document.getElementById('departureStopName');
const destinationStopName = document.getElementById('destinationStopName');
const busDirection = document.getElementById('busDirection');

// 搜尋選擇的車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function routeSearch () {
  const getbusURL =  `${APIURL}/v2/Bus/EstimatedTimeOfArrival/City/${cityName}/${routeName}`;  
  axios({
    method: 'get',
    url: getbusURL,
    headers: getAuthorizationHeader()
  })
  .then (res => {
    let data = res.data;
    let currentData = data.filter(i => i.PlateNumb!="" && i.RouteName.Zh_tw === routeName);
    getbusStatus()
    console.log(currentData);  
  })
  .catch(err=>{
    console.log(err);
  })
  
}

function getbusStatus() {
  let getbusData = [];
  const getRouteURL = `${APIURL}/v2/Bus/Route/City/${cityName}/${routeName}`;
  axios({
    method: 'get',
    url: getRouteURL,
    headers: getAuthorizationHeader()
  })
  .then (res => {
    getbusData = res.data ;
    let newGetbusData = getbusData.filter(i => i.RouteName.Zh_tw=== routeName);
    console.log(newGetbusData)
    busDirection.innerHTML = `
    <li class="bdrs_left">往 <span>${newGetbusData[0].DepartureStopNameZh}</span></li>
    <li class="bdrs_right">往 <span>${newGetbusData[0].DestinationStopNameZh}</span></li>
    `
  })
  .catch(err=>{
    console.log(err);
  })
}

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
  
