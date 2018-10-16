class ModelFactory {

  static _instance = {};

  static createModel(type) {
    if (!type) {
      return null;
    }

    if (!this._instance[type]) {
      const BaseModel = require('./modules/' + type + '.js').default;
      this._instance[type] = new BaseModel();
    }
    return this._instance[type];
  }
}


export default ModelFactory;
