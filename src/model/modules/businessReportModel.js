import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class BusinessReportModel extends BaseModel {
  constructor(props) {
    super(props);
  }

  getReportData(data) {
    return new Promise((resolve) => {
      const url = hosts + 'getRadomPoint.action';
      const params = {
        size: data.size,
        gps_lat: data.lat,
        gps_lon: data.lng,
        city: data.city,
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res);
        console.log(res, 'res getReportData');
      })
      .catch((error) => {
        console.log(error, 'error');
      })
    })
  }
}

export default BusinessReportModel;