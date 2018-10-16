class BaseModel {

  constructor() {
    this.dataChangeListeners = {};
    this.defaultType = 'datachange';
  }

  /**
   * 发布消息变更 emit the data change by type
   * @param {string} type 
   * @param {object} data 
   * @private
   */
  _handleDataChange(type, data) {
    console.log(this.dataChangeListeners, '_handleDataChange');
    let subscribers = this.dataChangeListeners[type];
    if (subscribers) {
      subscribers.forEach(callback => {
        callback && callback(data);
      });
    }
  }

  /**
  * 添加监听事件
  * @param {string} type 
  * @param {function} callback 
  */
  addDataChangeListener(type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = this.defaultType;
    }

    let subscribers = this.dataChangeListeners[type];
    if (!subscribers) {
      this.dataChangeListeners[type] = [];
    }
    this.dataChangeListeners[type].push(callback);
    console.log(this.dataChangeListeners, 'addDataChangeListener');
  }

  /**
   * remove data change listener
   * @param {string} type 
   * @param {function} callback 
   */
  removeDataChangeListener(type, callback) {
    if (typeof type === 'function') {
      callback = type;
      type = this.defaultType;
    }

    let subscribers = this.dataChangeListeners[type];
    if (subscribers) {
      let index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    }
    console.log(this.dataChangeListeners, 'removeDataChangeListener');
  }
}

export default BaseModel;
