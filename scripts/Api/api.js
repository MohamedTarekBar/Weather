class WeatherApi {
  constructor () {
    this.baseUrl = 'http://api.weatherapi.com/v1/';
    this.Apikey = 'key=4615d98babb24f8d8f7101245221510&';  
    this.qKey = 'q=';
    this.days = '&days=7'
    this.unnessery_param = '&aqi=no&alerts=no'
    this.endpoints = {
      current: 'current.json?',
      forecast: 'forecast.json?',
    };
  }

  async getCurrent (q) {
    const result = await fetch (
      `${this.baseUrl}${this.endpoints.current}${this.Apikey}${this.qKey}${q}`
    );
    const finalRes = await result.json ();
    return finalRes;
  }

  async getforecast (q) {
    const result = await fetch (
      `${this.baseUrl}${this.endpoints.forecast}${this.Apikey}${this.qKey}${q}${this.days}${this.unnessery_param}`
    );
    const finalRes = await result.json ();
    return finalRes;
  }
}

async function getImageForCity (city,imageSrc,indicator) {
  indicator.show()
  if (city.trim() != '') {
    await fetch (
      `https://api.unsplash.com/search/photos?client_id=9QgYgpS9Lv2FVAo2JH1ulDkDkRmnmtIdWyoN1hw3tX8&page=1&query=${city}`
    )
      .then (async function (result) {
        return await result.json ();
      })
      .then (function (res) {
        if (res.results.length > 0) {
          for (let i = 0; i < res.results.length; i++) {
            if (res.results[i].width > 500) {
              imageSrc(res.results[i].links.download)
              return
            }
          }        
        } else {
          imageSrc("https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80")
        }
      });
  }
}

export {
  getImageForCity,WeatherApi
}