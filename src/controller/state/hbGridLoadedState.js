import BaseState from './baseState';
import EventType from '../../common/eventType';
import StateType from './stateType';

class InitState extends BaseState {
  /**
   * 处理事件
   * @param {object} context   上下文
   * @param {string} eventType 事件类型
   * @param {object} params    事件参数
   */
  handleEvent(context, eventType, params) {
    switch (eventType) {
      case EventType.CONTEXT_INIT:
        context.contextInit({ topView: 'init', params: {} });
        break;
      case EventType.FOOTBAR_ITEM_CLICK:
        context.changeTab({ topView: params.pageName, params: {} });
        break;
      case EventType.ON_SELECT_CITY:
        context.changeCity(params);
        break;
      case EventType.GRID_SEARCH:
        context.switchState(StateType.GRID_SEARCH_STATE);
        break;
      case EventType.COORDINATE_SEARCH:
        context.switchState(StateType.COORDINATE_SEARCH_STATE);
        break;
      case EventType.GRDI_SELECT_BUTTON_CLICK:
        context.switchState(StateType.GRID_STIE_SELECT_STATE);
        context.changeTab({ topView: 'gridSelect', params: {} });
        break;
      case EventType.MAP_CLICK:
        const param = { layer: 'hbGrid', evt: params };
        context.showFeatureInfo(param);
        break;
      case EventType.LAYERS_CHANGE: 
        context.changeLayers(params);
        break;
      case EventType.GRID_LOADED:
        context.switchState(StateType.INIT_STATE);
        break;
      default:
        break;
    }
  }
}

export default InitState;