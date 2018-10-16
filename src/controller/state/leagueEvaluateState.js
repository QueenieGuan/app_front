import BaseState from './baseState';
import EventType from '../../common/eventType';
import StateType from './stateType';

class LeagueEvaluateState extends BaseState {
  /**
   * 处理事件
   * @param {object} context   上下文
   * @param {string} eventType 事件类型
   * @param {object} params    事件参数
   */
  handleEvent(context, eventType, params) {
    switch (eventType) {
      case EventType.FOOTBAR_ITEM_CLICK:
        context.notify('请先退出加盟厅评估业务，再进行后续操作');
        break;
      case EventType.ON_SELECT_CITY:
        const targetCity = params.targetCity;
        const center = params.center;
        context.changeCity(targetCity, center);
        break;
      case EventType.ON_CREATE_CLICK:
        context.showLeagueEvaluteList(params);
        break;
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        context.switchState(StateType.INIT_STATE);
        context.clearFileName();
        context.changeTab({ topView: 'functionCard', params: {} });
        break;
      case EventType.PAGE_CHANGE:
        context.getLeagueEvaluateDataByPage(params.currentPage, params.pageSize);
        break;
      case EventType.ON_TOAST_CONFIRM:
        context.exitLeagueEvaluate();
        context.switchState(StateType.INIT_STATE);
        break;
      case EventType.ON_EXIT_BUTTON_CLICK:
        context.toast('是否确定退出加盟厅评估业务？');
        break;
      case EventType.FEATURE_TABLE_ROW_CLICK:
        context.showFeatureTable(false);
        context.zoomToSelectedLeagueEvaluatePos(params.record.coor);
        break;
      case EventType.DOWNLOAD_BUTTON_CLICK:
        context.downLoadTemplate();
        break;
      case EventType.UPLOAD_BUTTON_CLICK:
        context.uploadFile(params);
        break;
      case EventType.FEATURE_TABLE_DATA_LOADED:
        context.getLeagueEvaluateDataByPage(params.currentPage, params.pageSize);
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

export default LeagueEvaluateState;