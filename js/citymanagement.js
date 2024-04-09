
$(document).ready(function () {
  cityID = {};

  // 检查是否是第一次打开网页
  if (localStorage.getItem('cityArray') === null) {
      // 如果是第一次打开网页，创建一个对象并存储到localStorage
      localStorage.setItem('cityArray', JSON.stringify(cityID));
  }
  else {
      // 如果不是第一次打开网页，从localStorage中获取之前存储的对象
      cityID = JSON.parse(localStorage.getItem('cityArray'));
  }

  // 添加元素的函数
  $('#add_city').click(function () {
      cityname = $('#fileContent').val();
      if(cityname==''){
        alert('请输入城市名');
      }
      else{
      city_id = ""
      var u = `https://geoapi.qweather.com/v2/city/lookup?key=1913a911182e4a21b074ac7b7be72cd9&location=${cityname}`;
      city_name=""
      $.get(u, function (da) {
          city_id = da.location[0].id;
          // 假设要添加的元素值为 newValue
          var newValue = city_id;
        city_name=da.location[0].name;
          // 在 object 中查找是否已经存在相同的值
          var isDuplicate = false;
          $.each(cityID, function (key, value) {
              if (value === newValue) {
                  isDuplicate = true;
                  return false; // 结束循环
              }
          });

          // 如果存在相同的值，则弹出警告框
          if (isDuplicate) {
              alert("该城市已存在: " + cityname);
          } else {
              // 如果不存在相同的值，则继续添加元素到 object 中
              cityID[city_name] = newValue;
            
            var apiKey = '1913a911182e4a21b074ac7b7be72cd9'; // 替换为你的和风天气API密钥
            var apiUrl = `https://devapi.qweather.com/v7/weather/3d?location=${newValue}&key=${apiKey}`;

            $.get(apiUrl, function (data) {
                var fxDate  = data["daily"][0]["fxDate"];//日期
                var precip  = data["daily"][0]["precip"];//降雨量
                var humidity=data["daily"][0]["humidity"];//湿度
                var windSpeedDay=data["daily"][0]["windSpeedDay"];//风速
                var uvIndex  = [data["daily"][0]["uvIndex"],data["daily"][1]["uvIndex"],data["daily"][2]["uvIndex"]];// 紫外线
                var textDay = [data["daily"][0]["textDay"],data["daily"][1]["textDay"],data["daily"][2]["textDay"]];//天气状况
                var tempMin = [data["daily"][0]["tempMin"],data["daily"][1]["tempMin"],data["daily"][2]["tempMin"]];//低温
                var tempMax = [data["daily"][0]["tempMax"],data["daily"][1]["tempMax"],data["daily"][2]["tempMax"]];//高温
                var newDiv=`
                <div class="container" id="${newValue}">
                <div class="weather-side">
                  <div class="weather-gradient"></div>
                  <div class="date-container">
                    <h2 class="date-dayname">${city_name}</h2>
                    <span class="date-day">${fxDate}</span>
                    <i class="location-icon" data-feather="map-pin"></i>
                    <span class="location"></span>
                  </div>
                  <div class="weather-container">
                    <i class="weather-icon" data-feather="sun"></i>
                    <h1 class="weather-temp">${tempMax[0]}°C</h1>
                    <h3 class="weather-desc">${textDay[0]}</h3>
                  </div>
                </div>
                <div class="info-side">
                <button class="x" id="${city_name}">DEL</button>
                  <div class="today-info-container">
                    <div class="today-info">
                      <div class="precipitation">
                        <span class="title">PCP</span>
                        <span class="value">${precip} mm</span>
                        <div class="clear"></div>
                      </div>
                      <div class="humidity">
                        <span class="title">HUMIDITY</span>
                        <span class="value">${humidity} %</span>
                        <div class="clear"></div>
                      </div>
                      <div class="wind">
                        <span class="title">WIND</span>
                        <span class="value">${windSpeedDay} km/h</span>
                        <div class="clear"></div>
                      </div>
                    </div>
                  </div>
                  <div class="week-container">
                    <ul class="week-list">
                      <li class="active">
                        <i class="day-icon"></i>
                        <span class="day-name">今天<br>${textDay[0]}</span>
                        <span class="day-temp">${tempMin[0]}°C<br>${tempMax[0]}°C<br><br>UV${uvIndex[0]}</span>
                      </li>
                      <li>
                        <i class="day-icon"></i>
                        <span class="day-name">明天<br>${textDay[1]}</span>
                        <span class="day-temp">${tempMin[1]}°C<br>${tempMax[1]}°C<br><br>UV${uvIndex[1]}</span>
                      </li>
                      <li>
                        <i class="day-icon"></i>
                        <span class="day-name">后天<br>${textDay[2]}</span>
                        <span class="day-temp">${tempMin[2]}°C<br>${tempMax[2]}°C<br><br>UV${uvIndex[2]}</span>
                      </li> 
                      <div class="clear"></div>
                    </ul>
                  </div>
                </div>
              </div>
              `
                $("#container").append(newDiv);
            });
          }

      })
      $('#fileContent').val('');
    }
  })

  $('#delcity').click(function () {
      cityname = $('#fileContent').val();
      if (cityID.hasOwnProperty(cityname)) {
          delete cityID[cityname];
            $('#cityname').parent().remove();
      } else {
          alert('请输入已收藏的城市名');
      }
      $('#fileContent').val('');

      
  })
 
  $('#showcity').click(function () {
      // 将数组存储在localStorage中
      localStorage.setItem('cityArray', JSON.stringify(cityID));
      $("#container").empty();
        $.each(cityID, function (key, value) {
            var city_id = value;
            var city_name=key;
            var apiKey = '1913a911182e4a21b074ac7b7be72cd9'; // 替换为你的和风天气API密钥
            var apiUrl = `https://devapi.qweather.com/v7/weather/3d?location=${city_id}&key=${apiKey}`;

            $.get(apiUrl, function (data) {
                var fxDate  = data["daily"][0]["fxDate"];//日期
                var precip  = data["daily"][0]["precip"];//降雨量
                var humidity=data["daily"][0]["humidity"];//湿度
                var windSpeedDay=data["daily"][0]["windSpeedDay"];//风速
                var uvIndex  = [data["daily"][0]["uvIndex"],data["daily"][1]["uvIndex"],data["daily"][2]["uvIndex"]];// 紫外线
                var textDay = [data["daily"][0]["textDay"],data["daily"][1]["textDay"],data["daily"][2]["textDay"]];//天气状况
                var tempMin = [data["daily"][0]["tempMin"],data["daily"][1]["tempMin"],data["daily"][2]["tempMin"]];//低温
                var tempMax = [data["daily"][0]["tempMax"],data["daily"][1]["tempMax"],data["daily"][2]["tempMax"]];//高温
                var newDiv=`
                <div class="container" id="${city_id}" >
                <div class="weather-side">
                  <div class="weather-gradient"></div>
                  <div class="date-container">
                    <h2 class="date-dayname">${city_name}</h2>
                    <span class="date-day">${fxDate}</span>
                    <i class="location-icon" data-feather="map-pin"></i>
                    <span class="location"></span>
                  </div>
                  <div class="weather-container">
                    <i class="weather-icon" data-feather="sun"></i>
                    <h1 class="weather-temp">${tempMax[0]}°C</h1>
                    <h3 class="weather-desc">${textDay[0]}</h3>
                  </div>
                </div>
                <div class="info-side">
                <button class="x" id="${city_name}">DEL</button>
                  <div class="today-info-container">
                    <div class="today-info">
                      <div class="precipitation">
                        <span class="title">PCP</span>
                        <span class="value">${precip} mm</span>
                        <div class="clear"></div>
                      </div>
                      <div class="humidity">
                        <span class="title">HUMIDITY</span>
                        <span class="value">${humidity} %</span>
                        <div class="clear"></div>
                      </div>
                      <div class="wind">
                        <span class="title">WIND</span>
                        <span class="value">${windSpeedDay} km/h</span>
                        <div class="clear"></div>
                      </div>
                    </div>
                  </div>
                  <div class="week-container">
                    <ul class="week-list">
                      <li class="active">
                        <i class="day-icon"></i>
                        <span class="day-name">今天<br>${textDay[0]}</span>
                        <span class="day-temp">${tempMin[0]}°C<br>${tempMax[0]}°C<br><br>UV${uvIndex[0]}</span>
                      </li>
                      <li>
                        <i class="day-icon"></i>
                        <span class="day-name">明天<br>${textDay[1]}</span>
                        <span class="day-temp">${tempMin[1]}°C<br>${tempMax[1]}°C<br><br>UV${uvIndex[1]}</span>
                      </li>
                      <li>
                        <i class="day-icon"></i>
                        <span class="day-name">后天<br>${textDay[2]}</span>
                        <span class="day-temp">${tempMin[2]}°C<br>${tempMax[2]}°C<br><br>UV${uvIndex[2]}</span>
                      </li> 
                      <div class="clear"></div>
                    </ul>
                  </div>
                </div>
              </div>
              `
                $("#container").append(newDiv);
            });


        });
      // 从localStorage中读取数组内容
      cityID = JSON.parse(localStorage.getItem('cityArray'));

  })

})
