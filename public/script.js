const key = "ff7c632c43e0a8f8d2a7d12220e4619a";
var result;
//Getting the value entered in the input
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    city = searchBar.value;
    urlCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
    function makeRequest(method, url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        };
        xhr.send();
      });
    }

    makeRequest("GET", urlCity)
      .then(function (datums) {
        return datums;
      })
      .then(function (datums) {
        cityName = JSON.parse(datums)[0].name;
        var lat = JSON.parse(datums)[0].lat;
        var lon = JSON.parse(datums)[0].lon;

        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
        return url;
      })
      .then(function (url) {
        makeRequest("GET", url)
          .then(function (datums) {
            return JSON.parse(datums);
          })
          .then(function (result) {
            let city = document.querySelector(".city");
            city.innerText = `${cityName},${result.sys.country}`;
            let temp = document.querySelector(".temp");
            temp.innerText = `${Math.round(result.main.temp)}°C`;
            let desc = document.querySelector(".desc");
            desc.innerText = result.weather[0].description.toLocaleUpperCase();
            let minmax = document.querySelector(".minmax");
            minmax.innerText = `${Math.round(
              result.main.temp_min
            )}°C / ${Math.round(result.main.temp_max)}°C`;
          })
          .catch(function (err) {
            console.error("Augh, there was an error!", err.statusText);
          });
      })
      .catch(function (err) {
        console.error("Augh, there was an error!", err.statusText);
        let city = document.querySelector(".city");
        city.innerText = `Not Found`;
        let temp = document.querySelector(".temp");
        temp.innerText = `———`;
        let desc = document.querySelector(".desc");
        desc.innerText = "————";
        let minmax = document.querySelector(".minmax");
        minmax.innerText = `——`;
      });
  }
});
