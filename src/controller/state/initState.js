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
      case EventType.GRID_SELECT_BUTTON_CLICK:
        context.switchState(StateType.GRID_SELECT_STATE);
        context.changeTab({ topView: 'gridSelect', params: {} });
        break;
      case EventType.MAP_CLICK:
        const param = { layer: 'grid', evt: params };
        context.showFeatureInfo(param);
        break;
      case EventType.LAYERS_CHANGE: 
        context.changeLayers(params);
        break;
      case EventType.HBGRID_LOADED:
        context.switchState(StateType.HBGRID_SELECT_STATE);
        break;
      case EventType.ON_FOCUS:
        context.switchState(StateType.LOCATION_SEARCH_STATE);
        context.changeTab({ topView: 'lazyLoadList', params: {} });
        break;
      case EventType.CANDIDATE_SELECT_BUTTON_CLICK:
        context.switchState(StateType.CANDIDATE_SELECT_STATE);
        context.changeTab({ topView: 'candidateSelect', params: {} });
        break;
      case EventType.HBGRID_SELECT_BUTTON_CLICK:
        context.switchState(StateType.HBGRID_SELECT_STATE);
        context.changeTab({ topView: 'hbGridSelect', params: {} });
        break;
      case EventType.LEAGUE_EVALUATE_BUTTON_CLICK:
        context.switchState(StateType.LEAGUE_EVALUATE_STATE);
        context.changeTab({ topView: 'leagueEvaluate', params: {} });
        break;
      case EventType.BUSINESS_REPORT_BUTTON_CLICK:
        context.switchState(StateType.BUSINESS_REPORT_STATE);
        context.showReportTab(true);
        context.changeTab({ topView: 'init', params: {} });
        break;
      case EventType.BUSINESS_MANAGEMENT_CLICK:
        context.notify('功能开发中，敬请期待！');
        break;
      default:
        break;
    }
  }
}

export default InitState;