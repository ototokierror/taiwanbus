import { busNearBy, getBusShape } from './map.js';

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
const routeSelector = document.getElementById('routeSelector');

function citySelector() {
  let str = '<option value="" hidden>選擇縣市</option>';
  cityData.forEach(i => {
    str += `<option value="${i.value}">${i.name}</option>`
  });
  citySelect.innerHTML = str;
}
citySelector();
let cityName = '';
let routeName = '';

// 監聽 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
citySelect.addEventListener('change', function (e) {
  console.log(e.target.value);
  ruteSearch(e.target.value);
  cityName = e.target.value;
})
routeSelector.addEventListener('change', function (e) {
  routeName = e.target.value;
  routeSearch();
  getBusShape(cityName, routeName, mymap);
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
      console.log(longitude)
      console.log(latitude)
      busNearBy(longitude, latitude, mymap);

      // 重新設定 view 的位置
      mymap.setView([latitude, longitude], 16);
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
const busData = [];
const appId = 'd97e3a7603f049728fb4966c08eba8da';
const appKey = '2mG7iZNmoX2fvkOpn2XQauzJMqI';
const APIURL = 'https://ptx.transportdata.tw/MOTC';
// 取得城市 and 車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function ruteSearch(cityName) {
  let routeNameArr = [];
  axios({
    method: 'get',
    url: `${APIURL}/v2/Bus/RealTimeByFrequency/City/${cityName}`,
    headers: getAuthorizationHeader()
  })
    .then(function (response) {
      let busData;
      busData = response.data;
      console.log(busData);
      busData.forEach(i => {
        routeNameArr.push(i.RouteName.Zh_tw);
      })
      let newRouteNameArr = routeNameArr.reduce((obj, item) => {
        obj[item] = 1;
        return obj;
      }, {});
      newRouteNameArr = Object.keys(newRouteNameArr);
      newRouteNameArr.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'accent' }));
      let str = '<option value="" hidden>選擇路線</option>';
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
const stopSeqContent = document.getElementById('stopSeqContent');


let backData = [];
let goData = [];
// 搜尋選擇的車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function routeSearch() {
  const getbusURL = `${APIURL}/v2/Bus/EstimatedTimeOfArrival/City/${cityName}/${routeName}`;
  axios({
    method: 'get',
    url: getbusURL,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      let data = res.data;
      console.log('全部的車車', data);
      // 將沒有跑的車車篩掉 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
      let bus = data.filter(i => i.StopStatus === 0);
      console.log('有開的車車', bus);
      // 去程車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
      let catchGoData = bus.filter(i => !i.Direction);
      console.log('去程車車：', catchGoData);

      catchGoData.forEach(i => {
        const index = goData.map(i => i.plateNumb).indexOf(i.PlateNumb);
        if (index === -1) { // 代表沒找到
          goData.push({
            plateNumb: i.PlateNumb, //車牌號碼
            stops: [{
              estimateTime: i.EstimateTime,//到站時間預估(秒) 
              stopUID: i.StopUID//站牌唯一識別代碼
            }]
          })
        } else { // 有找到
          goData[index].stops.push({
            estimateTime: i.EstimateTime,//到站時間預估(秒) 
            stopUID: i.StopUID//站牌唯一識別代碼
          });
        }
      })

      // 返程車車 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
      let catchBackData = bus.filter(i => i.Direction);
      console.log('返程車車', catchBackData);

      catchBackData.forEach((i) => {
        const index = backData.map(i => i.plateNumb).indexOf(i.PlateNumb);

        if (index === -1) { // 代表沒找到
          backData.push({
            plateNumb: i.PlateNumb, //車牌號碼
            stops: [{
              estimateTime: i.EstimateTime,//到站時間預估(秒) 
              stopUID: i.StopUID//站牌唯一識別代碼
            }]
          })
        } else { // 有找到
          backData[index].stops.push({
            estimateTime: i.EstimateTime,//到站時間預估(秒) 
            stopUID: i.StopUID//站牌唯一識別代碼
          });
        }

      })
      getbusStatus();
      getRoute();

      if (goData.length == 0) {
        console.log('去程沒車車')
      } else {
        console.log('整理過的去程車車', goData)
      }

      if (backData.length == 0) {
        console.log('返程沒車車')

      } else {
        console.log('整理過的返程車車', backData)
      }

    })
    .catch(err => {
      console.log(err);
    })
}

function getRoute() {
  const URL = `${APIURL}/v2/Bus/StopOfRoute/City/${cityName}/${routeName}`;
  axios({
    method: 'get',
    url: URL,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      const data = res.data;
      const routeData = data.filter((item) => item.RouteName.Zh_tw === routeName);
      console.log('往返列表', routeData);

      busDirection.addEventListener('click', function (e) {
        const backBTN = document.getElementById('backBTN');
        backBTN.classList.remove("be_clicked");
        const goBTN = document.getElementById('goBTN');
        goBTN.classList.add("be_clicked");
        // e.target.closest('li').classList.remove("be_clicked");
        if (e.target.dataset.set === "goBTN") {
          // 去程 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
          let gobusID = ''
          let gotime = 0;
          let gotimeText = '';
          let goStr = '';

          routeData[0].Stops.forEach((item, index) => {
            goData.forEach((go) => {
              go.stops.forEach((stop) => {
                if (stop.stopUID === item.StopUID) {
                  gobusID = go.plateNumb
                  gotime = Math.floor(stop.estimateTime / 60)
                  console.log('往', gobusID, gotime)

                  // 文字顯示
                  if (gotime === 0) {
                    gotimeText = '<span class="orange">進站中<span>';
                  } else if (gotime <= 1 && 0 < gotime) {
                    gotimeText = '<span class="green">即將到站<span>';
                  } else if (!gotime) {
                    gotimeText = '--';
                  } else {
                    gotimeText = `${gotime} 分`;
                  }
                }
              })
            })
            goStr += `
            <div class="seq-content">
            <p class="w32 center">${index + 1}</p>
            <p class="w216 df-aic">${item.StopName.Zh_tw}
              <span class="material-icons place">place</span>
            </p>
            <p class="w64">${gotimeText}</p>
            </div>`
          })
          let newStr = `
          <h3
          class="price_search"
          id="myBtn"
        >票價查詢</h3>
          <ul class="bus-realtime">
          <li>
            <div class="sequence">
              <p class="w32">站序</p>
              <p class="w216">站名</p>
              <p class="w64">預估到站</p>
            </div>
          </li>
          ${goStr}
          </ul>
          <div class="update-content">
          <ul class="update">
            <li><span id="updateCountdown">30</span> 秒後更新</li>
            <li id="update">更新</li>
          </ul>
        </div>
          `
          stopSeqContent.innerHTML = newStr;
        }
      })
      busDirection.addEventListener('click', function (e) {
        if (e.target.dataset.set === "backBTN") {
          const goBTN = document.getElementById('goBTN');
          goBTN.classList.remove("be_clicked");
          const backBTN = document.getElementById('backBTN');
          backBTN.classList.add("be_clicked");
          // 返程 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
          let backbusID = ''
          let backtime = 0;
          let backtimeText = '';
          let backStr = '';

          routeData[1].Stops.forEach((item, index) => {
            backData.forEach((back) => {
              back.stops.forEach((stop) => {
                if (stop.stopUID === item.StopUID) {
                  backbusID = back.plateNumb
                  backtime = Math.floor(stop.estimateTime / 60)
                  console.log('返', backbusID, backtimeText)

                  // 文字顯示
                  if (backtime === 0) {
                    backtimeText = '<span class="orange">進站中<span>';
                  } else if (backtime <= 1 && 0 < backtime) {
                    backtimeText = '<span class="green">即將到站<span>';
                  } else if (!backtime) {
                    backtimeText = '--';
                  } else {
                    backtimeText = `${backtime} 分`;
                  }
                }
              })
            })
            backStr += `
<div class="seq-content">
<p class="w32 center">${index + 1}</p>
<p class="w216 df-aic">${item.StopName.Zh_tw}
  <span class="material-icons place">place</span>
</p>
<p class="w64">${backtimeText}</p>
</div>`
          })
          let newStr = `
      <h3
      class="price_search"
      id="myBtn"
    >票價查詢</h3>
      <ul class="bus-realtime">
      <li>
        <div class="sequence">
          <p class="w32">站序</p>
          <p class="w216">站名</p>
          <p class="w64">預估到站</p>
        </div>
      </li>
      ${backStr}
      </ul>
      <div class="update-content">
      <ul class="update">
        <li><span id="updateCountdown">30</span> 秒後更新</li>
        <li id="update">更新</li>
      </ul>
    </div>
      `
          stopSeqContent.innerHTML = newStr;
        }
      })

      // 預設返程 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
      let backbusID = ''
      let backtime = 0;
      let backtimeText = '';
      let backStr = '';

      routeData[1].Stops.forEach((item, index) => {
        backData.forEach((back) => {
          back.stops.forEach((stop) => {
            if (stop.stopUID === item.StopUID) {
              backbusID = back.plateNumb
              backtime = Math.floor(stop.estimateTime / 60)
              console.log('返', backbusID, backtimeText)

              // 文字顯示
              if (backtime === 0) {
                backtimeText = '<span class="orange">進站中<span>';
              } else if (backtime <= 1 && 0 < backtime) {
                backtimeText = '<span class="green">即將到站<span>';
              } else if (!backtime) {
                backtimeText = '--';
              } else {
                backtimeText = `${backtime} 分`;
              }
            }
          })
        })
        backStr += `
<div class="seq-content">
<p class="w32 center">${index + 1}</p>
<p class="w216 df-aic">${item.StopName.Zh_tw}
  <span class="material-icons place">place</span>
</p>
<p class="w64">${backtimeText}</p>
</div>`
      })
      let newStr = `
      <h3
      class="price_search"
      id="myBtn"
    >票價查詢</h3>
      <ul class="bus-realtime">
      <li>
        <div class="sequence">
          <p class="w32">站序</p>
          <p class="w216">站名</p>
          <p class="w64">預估到站</p>
        </div>
      </li>
      ${backStr}
      </ul>
      <div class="update-content">
      <ul class="update">
        <li><span id="updateCountdown">30</span> 秒後更新</li>
        <li id="update">更新</li>
      </ul>
    </div>
      `
      stopSeqContent.innerHTML = newStr;
      openModal();

    })
    .catch(err => {
      console.log(err)
      alert('目前無此車車');
      stopSeqContent.innerHTML = "";
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
    .then(res => {
      getbusData = res.data;
      let newGetbusData = getbusData.filter(i => i.RouteName.Zh_tw === routeName);

      busDirection.innerHTML = `
    <li class="bdrs_left be_clicked" id="backBTN" data-set="backBTN">往 <span data-set="backBTN">${newGetbusData[0].DepartureStopNameZh}</span></li>
    <li class="bdrs_right" id="goBTN" data-set="goBTN">往 <span data-set="goBTN">${newGetbusData[0].DestinationStopNameZh}</span></li>
    `
    })
    .catch(err => {
      console.log(err);
    })
}

// 查價格 modal ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function openModal() {
  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the button that opens the modal
  let btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}

// header ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
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

