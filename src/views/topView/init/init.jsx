import React from 'react';
import BaseView from '../../baseView';
import style from './init.scss';
import EventType from '../../../common/eventType';
import ModalCard from '../../modules/layerManagerCard';
import FeatureTable from '../../modules/featureTable';
import FootBar from '../../modules/footBar';
import SearchBox from '../../modules/searchBox';
import CitySelector from '../../modules/citySelector';
import BusinessReport from '../../modules/businessReport';

class MapPage extends BaseView {
  constructor(props) {
    super(props);
    this.map = null;

    this.state = {
      isLoading: true,
      data: {},
      layerCardVisiable: false,
      expandBtnVisiable: false,
      featureTableVisiable: false,
      exitBtnVisiable: false,
      reportTabVisiable: false
    };
  }

  componentDidMount() {
    this.map = L.map('map');
    // 将map作为全局变量保存
    window.map = this.map;
    this.map.on('click', evt => {
      this.handleEvent(EventType.MAP_CLICK, evt);
    })
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.ON_LAYER_BUTTON_CLICK:
        this.setState({layerCardVisiable: true});
        break;
      case EventType.ON_LAYER_BUTTON_CLOSE:
        this.setState({ layerCardVisiable: false });
        break;
      case EventType.ON_HIDE_TABLE_BUTTON_CLICK:
        this.setState({
          expandBtnVisiable: true,
        });
        super.handleEvent(eventType, params);
        break;
      case EventType.ON_EXPAND_BUTTON_CLICK:
        this.setState({
          expandBtnVisiable: false,
        });
        super.handleEvent(eventType, params);
        break;
      case EventType.GRIDS_DATA_FINISHED_LOADED:
        this.setState({
          featureTableVisiable: true,
          exitBtnVisiable: true,
        });
        break;
      case EventType.CANDIDATE_DATA_FINISHED_LOADED:
        this.setState({
          featureTableVisiable: true,
          exitBtnVisiable: true,
        });
        break;
      case EventType.FEATURE_TABLE_ROW_CLICK:
        this.setState({
          expandBtnVisiable: true,
        });
        super.handleEvent(eventType, params);
        break;
      case EventType.ON_SELECT_POINT:
        this.setState({
          exitBtnVisiable: true,
          expandBtnVisiable: true,
        });
        super.handleEvent(eventType, params);
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    const currentCity = this.props.params.currentCity;
    const cities = this.props.params.cities;
    const expandBtnVisiable = this.props.params.expandBtnVisiable === undefined? this.state.expandBtnVisiable : this.props.params.expandBtnVisiable;
    const featureTableVisiable = this.props.params.featureTableVisiable === undefined? this.state.featureTableVisiable : this.props.params.featureTableVisiable;
    const exitBtnVisiable = this.props.params.exitBtnVisiable === undefined? this.state.exitBtnVisiable : this.props.params.exitBtnVisiable;
    const currentInputContent = this.props.params.currentInputContent === undefined? this.state.currentInputContent : this.props.params.currentInputContent;
    const reportTabVisiable = this.props.params.reportTabVisiable === undefined? this.state.reportTabVisiable : this.props.params.reportTabVisiable;
    return (
      <div className={style.main}>
        <div id='map'></div>
        <div className={style.taskbar}>
          <SearchBox currentInputContent={currentInputContent}></SearchBox>
          <div className={style.layer_manager_button} onClick={() => this.handleEvent(EventType.ON_LAYER_BUTTON_CLICK)}>
            <svg className={style.icon} aria-hidden="true">
              <use xlinkHref="#icon-layerManager"></use>
            </svg>
          </div>
          <CitySelector currentCity={currentCity} cityList={cities}></CitySelector>
        </div>
        <div className={this.state.layerCardVisiable? '': style.hide_modal}>
          <ModalCard></ModalCard>
        </div>
        <div 
          className={expandBtnVisiable? style.expand_button_show: style.expand_button_hide}
          onClick={() => this.handleEvent(EventType.ON_EXPAND_BUTTON_CLICK)}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref="#icon-expand"></use>
          </svg>
        </div>
        <div 
          className={exitBtnVisiable? style.exit_button_show: style.exit_button_hide}
          onClick={() => this.handleEvent(EventType.ON_EXIT_BUTTON_CLICK)}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref="#icon-exit"></use>
          </svg>
        </div>
        <div className={featureTableVisiable? '': style.hide_modal}>
          <FeatureTable></FeatureTable>
        </div>
        <div className={reportTabVisiable? '': style.hide_modal}>
          <BusinessReport {...this.props}></BusinessReport>
        </div>
        <FootBar footBarIndex={this.props.params.currentFootBarIndex}></FootBar>
      </div>
    );
  }
}

export default MapPage;
