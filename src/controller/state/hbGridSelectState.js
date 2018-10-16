import BaseState from './baseState';
import EventType from '../../common/eventType';
import StateType from './stateType';

class HBGridSelectState extends BaseState {
  /**
   * 处理事件
   * @param {object} context   上下文
   * @param {string} eventType 事件类型
   * @param {object} params    事件参数
   */
  handleEvent(context, eventType, params) {
    switch (eventType) {
      case EventType.FOOTBAR_ITEM_CLICK:
        context.notify('请先退出家宽选址业务，再进行后续操作');
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
      case EventType.GRID_SELECT_BUTTON_CLICK:
        context.switchState(StateType.GRID_SELECT_STATE);
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
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        context.switchState(StateType.INIT_STATE);
        context.clearFileName();
        context.changeTab({ topView: 'functionCard', params: {} });
        break;
      case EventType.ON_CREATE_CLICK:
        context.selectHBGrids(params);
        break;
      case EventType.PAGE_CHANGE:
        context.getHBGridsDataByPage(params.currentPage, params.pageSize);
        break;
      case EventType.FEATURE_TABLE_ROW_CLICK:
        context.showFeatureTable(false);
        context.zoomToHBGrid(params.record.gridId);
        break;
      case EventType.FEATURE_TABLE_DATA_LOADED:
        context.getHBGridsDataByPage(params.currentPage, params.pageSize);
        break;
      case EventType.ON_EXIT_BUTTON_CLICK:
        context.toast('是否确定退出家宽选址业务？');
        break;
      case EventType.ON_TOAST_CONFIRM:
        context.exitSelectHBGrids();
        context.switchState(StateType.INIT_STATE);
        break;
      case EventType.ON_EXPAND_BUTTON_CLICK:
        context.showFeatureTable(true);
        break;
      case EventType.ON_HIDE_TABLE_BUTTON_CLICK:
        context.showFeatureTable(false);
        break;
      default:
        break;
    }
  }
}

export default HBGridSelectState;