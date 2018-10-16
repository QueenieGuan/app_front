import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class LocationSearchModel extends BaseModel {
  constructor(props) {
    super(props);

    this.initialData = null;
    this.recordList = [];
    this.contentList = [];
    this.recordNums = 0;
  }

  searchLocationByKeywords(keyword) {
    this.recordList = [];
    return new Promise((resolve) => {
      const url = 'http://restapi.amap.com/v3/place/text?parameters';
      const params = {
        key: 'a72f218bc424f6b0f7abad8a8b4c8510',
        keywords: keyword,
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res.data);
        this.initialData = res.data.data;
        this.initialData.pois.forEach((poi) => {
          const coor = poi.location.split(',');
          const point = {
            name: poi.name,
            location: [parseFloat(coor[1]), parseFloat(coor[0])],
          };
          this.recordList.push(point);
        });
        this._handleDataChange('locationListLoaded', res.data)
      })
      .catch((error) => {
        console.log(error, 'error');
      })
    })
  }

  getData() {
    this.contentList = this.recordList.slice(0, this.recordNums + 16);
    if (this.recordNums < this.recordList.length) {
      this.recordNums += 16;
    }
    this._handleDataChange('LocationDataLazyLoad', this.contentList);
  }
}

export default LocationSearchModel;