import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class InitModel extends BaseModel {
  constructor(props) {
    super(props);
    this.initialData = null;
  }

  /**
   * 获取初始化数据
   * @private
   */
  getInitialData() {
    return new Promise((resolve) => {
      let url = hosts + 'getInitIndex.action';
      HttpUtil.query(url, {})
      .then((res) => {
        resolve(res.data.data);
        this.initialData = res.data;
      })
      .catch((error) => {
        console.log(error, 'error');
      }) 
    });
  }

  /**
   * 根据城市和id获取二级行政区和区块
   * @param city
   * @param id
   * @private
   */
  getRegionsOfCity(city, id) {
    return new Promise((resolve) => {
      const url = hosts + 'regionData.action';
      const params = {
        fid: id,
        city: city
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error, 'error');
      })
    })
  }

  /**
   * 获取点击的地图要素信息
   * @param featureInfoUrl
   * @param chanType
   * @private
   */
  getFeatureInfo(featureInfoUrl, chanType) {
    return new Promise((resolve) => {
      const url = hosts + 'getData.action';
      const params = {
        u: encodeURIComponent(featureInfoUrl),
        chanType: chanType
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error, 'error');
      })
    })
  }
}

export default InitModel;