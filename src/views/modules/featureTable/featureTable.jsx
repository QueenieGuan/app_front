import React from 'react';
import BaseView from '../../baseView';
import style from './featureTable.scss';
import EventType from '../../../common/eventType';
import ModelFactory from '../../../model/modelFactory';
import ModelType from '../../../model/modelType';
import { Pagination, Icon } from 'antd-mobile';

class FeatureTable extends BaseView {
  constructor(props) {
    super(props);

    this.gridSelectModel = ModelFactory.createModel(ModelType.GRID_SELECT_MODEL);
    this.candidateSelectModel = ModelFactory.createModel(ModelType.CANDIDATE_SELECT_MODEL);
    this.hbGridSelectModel = ModelFactory.createModel(ModelType.HBGRID_SELECT_MODEL);
    this.leagueEvaluateModel = ModelFactory.createModel(ModelType.LEAGUE_EVALUATE_MODEL);
    this.pageSize = 5;
    
    this.state = {
      total: 0,
      tableData: [],
      currentPage: 1,
      currentIndex: '',
    }
  }

  componentDidMount() {
    this.gridSelectModel.addDataChangeListener('loadedGridsDataSuccess', this.handleDataLoaded);
    this.gridSelectModel.addDataChangeListener('loadedGridsData', this.handleGridsDataLoaded);
    this.candidateSelectModel.addDataChangeListener('loadedCandidateDataSuccess', this.handleDataLoaded);
    this.candidateSelectModel.addDataChangeListener('loadedCandidateData', this.handleCandidateDataLoaded);
    this.hbGridSelectModel.addDataChangeListener('loadedHBGridsDataSuccess', this.handleDataLoaded);
    this.hbGridSelectModel.addDataChangeListener('loadedHBGridsData', this.handleGridsDataLoaded);
    this.leagueEvaluateModel.addDataChangeListener('loadedLeagueEvaluateDataSuccess', this.handleDataLoaded);
    this.leagueEvaluateModel.addDataChangeListener('loadedLeagueEvaluateData', this.handleCandidateDataLoaded);
  }

  componentWillUnmount() {
    this.gridSelectModel.removeDataChangeListener('loadedGridsDataSuccess', this.handleDataLoaded);
    this.gridSelectModel.removeDataChangeListener('loadedGridsData', this.handleGridsDataLoaded);
    this.candidateSelectModel.removeDataChangeListener('loadedCandidateDataSuccess', this.handleDataLoaded);
    this.candidateSelectModel.removeDataChangeListener('loadedCandidateData', this.handleCandidateDataLoaded);
    this.hbGridSelectModel.removeDataChangeListener('loadedHBGridsDataSuccess', this.handleDataLoaded);
    this.hbGridSelectModel.removeDataChangeListener('loadedHBGridsData', this.handleGridsDataLoaded);
    this.leagueEvaluateModel.removeDataChangeListener('loadedLeagueEvaluateDataSuccess', this.handleDataLoaded);
    this.leagueEvaluateModel.removeDataChangeListener('loadedLeagueEvaluateData', this.handleCandidateDataLoaded);
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.PAGE_CHANGE:
        this.setState({
          currentPage: params.current,
        }, () => {
          super.handleEvent(eventType, {currentPage: this.state.currentPage, pageSize: 5});
        })
        break;
      case EventType.FEATURE_TABLE_ROW_CLICK:
        this.setState({
          currentIndex: params.record.rank
        });
        super.handleEvent(eventType, params);
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  handleDataLoaded = (data) => {
    this.setState({ isLoading: false });
    if (data.code === 200) {
      console.log(data, 'handleDataLoaded');
      // 发送事件请求第一页数据
      this.handleEvent(EventType.FEATURE_TABLE_DATA_LOADED, { currentPage: this.state.currentPage, pageSize: 5 });
    } else if (data.code === 401) {
      this.handleEvent(EventType.NO_RIGHT);
    } else {
      this.handleEvent(EventType.TOAST, { text: 'Load account failed, please try again.' })
    }
  }

  handleGridsDataLoaded = (data) => {
    const pageList  = data.pageList;
    const totalPage = data.totalPage;
    this.setState({ isLoading: false });
    if (pageList.length > 0) {
      console.log(data, 'handleGridsDataLoaded');
      const tableData = [];
      pageList.forEach((item, index) => {
        const obj = {
          gridId: item.gridId,
          gridScore: item.gridScr,
          rank: index + this.pageSize * (this.state.currentPage - 1) + 1,
        };
        tableData.push(obj);
      });
      this.setState({
        total: totalPage,
        tableData: tableData,
      });
      this.handleEvent(EventType.GRIDS_DATA_FINISHED_LOADED);
    } else if (data.code === 401) {
      this.handleEvent(EventType.NO_RIGHT);
    } else {
      this.handleEvent(EventType.TOAST, { text: 'Load account failed, please try again.' })
    }
  }

  handleCandidateDataLoaded = (data) => {
    const pageList  = data.pageList;
    const totalPage = data.totalPage;
    this.setState({ isLoading: false });
    if (pageList.length > 0) {
      console.log(data, 'handleCandidateDataLoaded');
      const tableData = [];
      pageList.forEach((item, index) => {
        const obj = {
          gridId: item.addr,
          gridScore: item.cddscore,
          rank: index + this.pageSize * (this.state.currentPage - 1) + 1,
          coor: [item.gpsLat, item.gpsLon]
        };
        tableData.push(obj);
      });
      this.setState({
        total: totalPage,
        tableData: tableData,
      });
      this.handleEvent(EventType.CANDIDATE_DATA_FINISHED_LOADED);
    } else if (data.code === 401) {
      this.handleEvent(EventType.NO_RIGHT);
    } else {
      this.handleEvent(EventType.TOAST, { text: 'Load account failed, please try again.' })
    }
  }

  render() {
    return (
      <div className={style.main}>
        <div className={style.table}>
          <div className={style.table_head}>
            <div className={style.head_id}>编号</div>
            <div className={style.head_score}>得分</div>
            <div className={style.head_compare}>加入对比</div>
          </div>
          <div className={style.table_body}>
            {this.state.tableData.map((item, index) => 
              <div key={index} className={item.rank === this.state.currentIndex? style.selected_table_row : style.table_row}  onClick={() => this.handleEvent(EventType.FEATURE_TABLE_ROW_CLICK, { record: item })}>
                <div className={style.id}>
                  <div className={style.symbol}>{item.rank}</div>
                  <div className={style.text}>{item.gridId}</div>
                </div>
                <div className={style.score}>{item.gridScore}</div>
                <div className={style.compare}>+</div>
              </div>
            )}
          </div>
        </div>
        <div className={style.pagination}>
          <Pagination total={this.state.total}
            current={this.state.currentPage}
            locale={{
              prevText: (<span><Icon type="left" /></span>),
              nextText: (<span><Icon type="right" /></span>),
            }}
            onChange={(current) => this.handleEvent(EventType.PAGE_CHANGE, {current})}
          />
        </div>
        <div className={style.hide_button} onClick={() => this.handleEvent(EventType.ON_HIDE_TABLE_BUTTON_CLICK)}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref="#icon-hide"></use>
          </svg>
        </div>
      </div> 
    );
  }
}

export default FeatureTable;