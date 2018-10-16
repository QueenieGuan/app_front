import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class GridSearchModel extends BaseModel {
  constructor(props) {
    super(props);
  }

  getGridCenter(gridId, currentCity) {
    return new Promise((resolve) => {
      const url = hosts + 'queryBoxByList.action';
      const params = {
        type: "",
        max: "",
        min: "",
        block: "",
        region: "",
        name: "",
        ids: gridId,
        aim: "",
        city: ''
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

export default GridSearchModel;