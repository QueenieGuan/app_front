import React from 'react';
import BaseView from '../baseView';
import CommandType from '../../common/commandType';
import EventType from '../../common/eventType';
import ViewFactory from '../viewFactory';
import TopViewConfig, { ViewTemplate } from '../topView/topViewConfig';
import Home from '../modules/home';
import style from './root.scss';
import { Modal } from 'antd-mobile';

const alert = Modal.alert;

class RootView extends BaseView {
  constructor(props) {
    super(props);

    this.state = {
      view: null
    };
  }

  /**
   * 处理事件
   * @param eventType 事件类型
   * @param params    事件参数
   */
  handleEvent(eventType, params) {
    switch (eventType) {
      default:
        super.handleEvent(eventType, params);
        break;
    }
  };

  /**
   * 处理事件
   * @param eventType 事件类型
   * @param params    事件参数
   */
  processCommand(commandType, params) {
    switch (commandType) {
      case CommandType.TRANSFER_VIEW:
        console.log(params, 'TRANSFER_VIEW');
        this.transferView(params.params.topView, params.params);
        break;
      case CommandType.TOAST:
        this.toast(params);
        break;
      case CommandType.NOTIFY:
        this.notify(params);
        break;
      default:
        break;
    }
  }

  /**
   * 切换View
   * @param {string} type 
   * @param {object} params 
   */
  transferView(type, params) {
    const TopView = ViewFactory.create(type);
    
    if (TopView) {
      const viewConfig = TopViewConfig[type];
      let view = null;

      switch (viewConfig.template) {
        case ViewTemplate.NONE:  // 顶级
          view = <TopView {...params} />
          ViewFactory.clearAllViews(); // 清除二级View的创建记录
          break;
        case ViewTemplate.HOME:  // 二级
          view = this.buildHomeTemplateView(type, params, viewConfig);
          break;
        default:
          break;
      }

      // set the TopView
      this.setState({
        view: view
      });
    }
  }

  /**
   * 
   */
  buildHomeTemplateView(type, params, viewConfig) {
    const allViews = ViewFactory.getAllViews();
    return (
      <Home viewName={viewConfig.viewName}>
        {
          Object.keys(allViews).map((key, index) => {
            if (TopViewConfig[key].template === ViewTemplate.HOME) {
              const View = allViews[key];
              return (
                <div className={key !== type ? style.hide : ''} key={index}>
                  <View {...params} />
                </div>
              );
            }
            return null;
          })
        }
      </Home>
    );
  }

  /*-------------View Module----------*/
  /**
   * 全局提示框
   * @param {string} text 
   */
  toast(text) {
    const alertInstance = alert('退出业务', text, [
      { text: '取消', style: 'default' },
      { text: '确定', onPress: () => this.handleEvent(EventType.ON_TOAST_CONFIRM)},
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      alertInstance.close();
    }, 500000);
  }

  notify(text) {
    const alertInstance = alert('操作提示', text, []);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      alertInstance.close();
    }, 2000);
  }

  render() {
    const {view} = this.state;
    return (
      <div>{view}</div>
    );
  }
}

export default RootView;