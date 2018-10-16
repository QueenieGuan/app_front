import BaseModel from '../baseModel';
import HttpUtil from '../../dataUtil/httpUtil';


class CandidateSelectModel extends BaseModel {
  constructor(props) {
    super(props);
    this.initialData = [];
    this.fileName = '';
  }

  getFileName(file) {
    return new Promise((resolve) => {
      const url = hosts + 'FileUpload.action';
      const formData = new FormData();
      formData.append("file", file);
      const headers = {
        "Content-Type": "multipart/form-data"
      };
      HttpUtil.post(url, formData, headers)
        .then((res) => {
          resolve(res.data.fileName);
          this.fileName = res.data.fileName;
        })
        .catch((error) => {
          console.log(error, 'error');
        })
    })
  }

  getCandidateList(data, fileName) {
    return new Promise((resolve) => {
      const obj = {
        city: data.city,
        lbl_type: data.ditchType,
        lbl_aim: '',
        block: data.block,
        Region: data.region,
        type: 2,
        fileName: fileName,
        userid: ''
      };
      const url = hosts + 'addBusinessCandite.action';
      HttpUtil.query(url, obj)
        .then((res) => {
          resolve(res);
          this.initialData = res.data.data.candidateList;
          this._handleDataChange('loadedCandidateDataSuccess', res.data);
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
      this._handleDataChange('loadedCandidateData', {
        pageList: pageList,
        totalPage: totalPage
      });
    }
  }
}

export default CandidateSelectModel;