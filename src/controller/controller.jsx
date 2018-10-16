import React from 'react';
import ChainComponent from '../core/chainComponent';
import RootView from './../views/root';
import Context from './context';

class Controller extends ChainComponent {
  constructor(props) {
    super(props);

    this.rootView = null;
    this.context = null;
  }

  componentDidMount() {
    this.context = new Context(this);
  }

  /**
   * 处理事件
   * @param eventType 事件类型
   * @param params    事件参数
   */
  handleEvent(eventType, params) {
    switch (eventType) {
      default: this.context.handleEvent(eventType, params);
      break;
    }
  }

  /**
   * 下发指令
   * @param {string} commandType 指令类型
   * @param {object} params      指令参数
   */
  processCommand(commandType, params) {
    this.rootView.processCommand(commandType, params);
  }

  render() {
    return ( 
      < RootView ref = {
        (instance) => {
          this.rootView = instance;
        }
      }
      />);
    }
  }

  export default Controller;