import React from 'react';
import PropTypes from 'prop-types';


// 实现链式调用组件
class ChainComponent extends React.Component {
  static childContextTypes = {
    parent: PropTypes.instanceOf(ChainComponent),
  };

  static contextTypes = {
    parent: PropTypes.instanceOf(ChainComponent),
  };

  getChildContext() {
    return {
      parent: this,
    };
  }

  /**
   * 处理事件入口， 在view层的时间通知都使用该方法
   * > 如果需要处理事件，必须重写该方法;
   * > 如果自己处理不了的事件，需要抛给父类进行处理
   *
   * @param eventType
   */
  handleEvent(eventType, params) {
    this._parentHandleEvent(eventType, params);
  }


  /**
   * 父类处理事件逻辑
   * @param eventType
   * @param params
   * @private
   */
  _parentHandleEvent(eventType, params) {
    if (this.context && this.context.parent) {
      this.context.parent.handleEvent(eventType, params);
    }
  }
}

export default ChainComponent;
