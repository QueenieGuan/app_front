import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class HBGridSelectModel extends BaseModel {
  constructor(props) {
    super(props);
    this.initialData = [];
  }

  getSelectHBGrids(data) {
    return new Promise((resolve) => {
      const url = hosts + 'kdBox.action';
      const params = {
        lbl_aim: '',
        block: '',
        type: 3,
        region: data.region,
        userid:'',
        city: data.city,
        ps: '',
        ss: '',
        isHave: data.isHave,
        num: data.num
      };
      HttpUtil.query(url, params)
      .then((res) => {
        resolve(res.data.data);
        this.initialData = res.data.data.boxList;
        console.log(res.data.data.boxList, 'res.data.data.boxList');
        console.log(res.data.data, 'res.data.data');
        this._handleDataChange('loadedHBGridsDataSuccess', res.data);
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
      this._handleDataChange('loadedHBGridsData', { pageList: pageList, totalPage: totalPage });
    }
  }
}

export default HBGridSelectModel;