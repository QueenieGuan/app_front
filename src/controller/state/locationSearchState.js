import BaseState from './baseState';
import EventType from '../../common/eventType';
import StateType from './stateType';

class LocationSearchState extends BaseState {
  /**
   * 处理事件
   * @param {object} context   上下文
   * @param {string} eventType 事件类型
   * @param {object} params    事件参数
   */
  handleEvent(context, eventType, params) {
    switch (eventType) {
      case EventType.GO_BACK:
        context.switchState(StateType.INIT_STATE);
        context.changeTab({ topView: 'init', params: {} });
        break;
      case EventType.ON_TEXT_CHANGE:
        context.searchLocation(params);
        break;
      case EventType.SCROLL_TO_BOTTOM:
        context.getLocationData();
        break;
      case EventType.ZOOM_TO_TARGET:
        context.showLocationPos(params.location);
        context.changeTab({ topView: 'init', params: { currentInputContent: params.name } });
        break;
      case EventType.BACK_BUTTON_CLICK:
        context.removeMarker();
        context.changeTab({ topView: 'lazyLoadList', params: {} });
        break;
      default:
        break;
    }
  }
}

export default LocationSearchState;