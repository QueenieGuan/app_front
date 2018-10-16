import BaseState from './baseState';
import EventType from '../../common/eventType';
import StateType from './stateType';

class BusinessReportState extends BaseState {
  /**
   * 处理事件
   * @param {object} context   上下文
   * @param {string} eventType 事件类型
   * @param {object} params    事件参数
   */
  handleEvent(context, eventType, params) {
    switch (eventType) {
      case EventType.FOOTBAR_ITEM_CLICK:
        context.notify('请先退出商业报告业务，再进行后续操作');
        break;
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        context.changeTab({ topView: 'init', params: {} });
        break;
      case EventType.ON_SELECT_CITY:
        context.changeCity(params);
        break;
      case EventType.MAP_CLICK:
        context.setCurrentMapClickCoor(params);
        break;
      case EventType.ON_RADIUS_CHANGE:
        context.radiusChange(params.radius);
        break;
      case EventType.ON_CREATE_REPORT:
        context.showLoading(true);
        context.createReport(params);
        break;
      case EventType.LAYERS_CHANGE: 
        context.changeLayers(params);
        break;
      case EventType.ON_SELECT_POINT:
        context.startSelectPoint();
        context.showReportTab(false);
        break;
      case EventType.ON_EXIT_BUTTON_CLICK:
        context.toast('是否确定退出商业报告功能？');
        break;
      case EventType.ON_TOAST_CONFIRM:
        context.exitReport();
        context.switchState(StateType.INIT_STATE);
        context.changeTab({ topView: 'functionCard', params: {} });
        break;
      case EventType.ON_EXPAND_BUTTON_CLICK:
        context.showReportTab(true);
        break;
      case EventType.ON_HIDE_TABLE_BUTTON_CLICK:
        context.showReportTab(false);
        break;
      default:
        break;
    }
  }
}

export default BusinessReportState;