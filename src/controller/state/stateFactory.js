/**
 * State 工厂类，只能通过工厂获取State变量
 */
class StateFactory {
  static _instance = {};

  /**
   * @param type
   * @returns BaseState
   */
  static getState(type) {

    if (!type) {
      return null;
    }

    if (this._instance[type] == null) {
      const BaseState = require('./' + type + '.js').default;
      this._instance[type] = new BaseState();
    }
    return this._instance[type];
  }
}

export default StateFactory;