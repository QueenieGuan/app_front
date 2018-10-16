/**
 * 创建View
 */
class ViewFactory {
  static _instance = {};

  static create(type) {
    console.log(type, 'viewFactory create type');
    if (this._instance[type] === undefined) {
      this._instance[type] = require('./topView/' + type + '/index.js').default;
    }

    return this._instance[type];
  }

  static getAllViews() {
    return this._instance;
  }

  static clearAllViews() {
    this._instance = {};
  }
}

export default ViewFactory;