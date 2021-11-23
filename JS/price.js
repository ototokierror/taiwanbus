// city ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const cityData = [
  { name: '桃園市', value: 'Taoyuan' },
  { name: '臺中市', value: 'Taichung' },
  { name: '高雄市', value: 'Kaohsiung' },
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
]

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

//city 渲染 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const citySelector = document.getElementById('citySelector');
let cityName = '';
cityRender();
function cityRender() {
  let str = `<option
  value=""
  hidden
>選擇縣市</option>` ;
  cityData.forEach(i => {
    str += `
<option
  value="${i.value}"
>${i.name}</option>
`
  })
  citySelector.innerHTML = str;
}
citySelector.addEventListener('change', e => {
  cityName = e.target.value;
  getRoute();
})

//get 路線 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
const routeSelector = document.getElementById('routeSelector');
let routeName = '';
function getRoute() {
  const url = `${APIURL}/v2/Bus/RouteFare/City/${cityName}`;
  axios({
    method: 'get',
    url: url,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      let data = res.data;
      let newArr = [];
      data.forEach(i => {
        newArr.push(i.RouteName);
      });
      let newRouteNameArr = newArr.reduce((obj, item) => {
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
    .catch(err => {
      console.log(err);
    })
}
routeSelector.addEventListener('change', e => {
  routeName = e.target.value;
  getPrice();
  console.log(routeName)
})

//get 起站 ★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰★∻∹⋰⋰ ☆∻∹⋰⋰ ★∻∹⋰⋰ ☆∻∹⋰⋰
function getPrice() {
  const url = `${APIURL}/v2/Bus/RouteFare/City/${cityName}/${routeName}`;
  axios({
    method: 'get',
    url: url,
    headers: getAuthorizationHeader()
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
}