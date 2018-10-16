import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class CandidateSelectModel extends BaseModel {
  constructor(props) {
    super(props);
    this.initialData = [];
    this.fileName = '';
  }

  getLeagueEvaluateList(data, fileName) {
    return new Promise((resolve) => {
      const obj = {
        lbl_type: "自营",
        lbl_aim: '',
        block: data.block,
        Region: data.region,
        type: 5,
        fileName: fileName,
        userid: '',
        city: data.city
      };
      const url = hosts + 'addBusinessCandite1.action';
      HttpUtil.query(url, obj)
        .then((res) => {
          resolve(res);
          this.initialData = res.data.data.candidateList;
          this._handleDataChange('loadedLeagueEvaluateDataSuccess', res.data);
        })
        .catch((error) => {
          console.log(error, 'error');
        })
    })
  }

  getData(currentPage, pageSize) {
    const pageList = [];
    if (this.initialData.length > 0) {
      for (let i = 0; i < pageSize; i++) {
        if ((i + pageSize * (currentPage - 1)) < this.initialData.length) {
          let index = i + pageSize * (currentPage - 1);
          pageList.push(this.initialData[index]);
        }
      }

      const totalPage = this.initialData.length % 5 === 0 ? parseInt(this.initialData.length / 5, 10) : parseInt(this.initialData.length / 5 + 1, 10);
      this._handleDataChange('loadedLeagueEvaluateData', {
        pageList: pageList,
        totalPage: totalPage
      });
    }
  }
}

export default CandidateSelectModel;