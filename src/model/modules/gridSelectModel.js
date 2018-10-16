import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class GridSelectModel extends BaseModel {
  constructor(props) {
    super(props);
    this.initialData = [];
  }

  getSelectGrids(data) {
    return new Promise((resolve) => {
      const url = hosts + 'addBusinessBox.action';
      const params = {
        city: data.city,
        lbl_type: data.ditchType,
        lbl_aim: data.direction,
        block: data.block,
        type: 1,
        region: data.region,
        userid: '',
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res.data.data);
        this.initialData = res.data.data.boxList;
        this._handleDataChange('loadedGridsDataSuccess', res.data);
      })
      .catch((error) => {
        console.log(error, 'error');
      }) 
    });
  }

  getData(currentPage, pageSize) {
    const pageList = [];
    if (this.initialData.length > 0) {
      for(let i = 0; i < pageSize; i++) {
        if((i + pageSize * (currentPage - 1)) < this.initialData.length){
          let index = i + pageSize * (currentPage - 1);
          pageList.push(this.initialData[index]);
        }
      }
      const totalPage = this.initialData.length % 5 === 0? parseInt(this.initialData.length / 5, 10): parseInt(this.initialData.length / 5 + 1, 10);
      this._handleDataChange('loadedGridsData', { pageList: pageList, totalPage: totalPage });
    }
  }
}

export default GridSelectModel;