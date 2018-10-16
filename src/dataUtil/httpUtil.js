import fetchJsonp from 'fetch-jsonp';
/**
 * Http请求
 */
class HttpUtil {
  /**
   * default header setting
   */
  static defaultHeader = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache'
  }

  /**
   * post request
   * @param {string} url 
   * @param {object} params 
   * @param {object} headerJson 
   */
  static post(url, params, headerOptions) {
    let method = 'POST';
    // merge the header params
    headerOptions = { ...headerOptions, 'Cache-Control':'2s' }

    return fetch(url, {
      method: method,
      // headers: headerOptions,
      headerOptions,
      body: params
    })
      .then(response => {
        // return the json format if request success
        if (response.ok) {
          return response.json();
        }

        // return the response status if request failed
        return {
          data: {
            code: response.status,
            isSuccess: false
          }
        }
      })
      .then((data) => {
        console.log(`Fetch Data: ${JSON.stringify(data)} `)
        return data;
      })
      .catch((error) => {
        console.log(`Fetch Error: ${error} `);
      });
  }

  static get(url) {
    let method = 'GET';

    return fetch(url, {
      method: method,
    })
      .then(response => {
        // return the json format if request success
        console.log(response, 'httpResponse');
        if (response.ok) {
          return response.json();
        }

        // return the response status if request failed
        return {
          data: {
            code: response.status,
            isSuccess: false
          }
        }
      })
      .then((data) => {
        console.log(`Fetch Data: ${JSON.stringify(data)} `)
        return data;
      })
      .catch((error) => {
        console.log(`Fetch Error: ${error} `);
      });
  }

  static query(url, params) {
    let _url = url + '?';
    if (params !== null) {
      Object.keys(params).forEach((key) => {
        _url += '&';
        _url += key;
        _url += '=';
        _url += params[key];
      });
    }
    return fetchJsonp(_url, {
      // jsonpCallback: 'custom_callback', // 回调函数名称，默认callback
      timeout: 100000
    })
    .then((response) => { // fetch will not reject wrong http status even if 404 or 500, except for network error 
      // return the json format if request success
      if (response.ok) {
        return response.json();
      }
      // return the response status if request failed
      return {
        data: {
          code: response.status,
          isSuccess: false
        }
      }
    })
    .then((data) => {
      return {
        data: {
          data: data,
          code: 200,
          isSuccess: true,
        }
      }
    })
    .catch((ex) => {
      console.log('parsing failed', ex);
    })
  }
}

export default HttpUtil;