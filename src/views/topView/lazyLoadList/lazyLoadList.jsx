import React from 'react';
import BaseView from '../../baseView';
import style from './lazyLoadList.scss';
import EventType from '../../../common/eventType';
import ModelFactory from '../../../model/modelFactory';
import ModelType from '../../../model/modelType';
import { InputItem } from 'antd-mobile';

class LazyLoadList extends BaseView {
  constructor(props) {
    super(props);
    this.locationSearchModel = ModelFactory.createModel(ModelType.LOCATION_SEARCH_MODEL);

    this.state = { 
      currentInputContent: '',
      recordList: [],
    };
  }

  componentDidMount() {
    this.locationSearchModel.addDataChangeListener('locationListLoaded', this.handleLocationListLoaded);
    this.locationSearchModel.addDataChangeListener('LocationDataLazyLoad', this.handleLocationDataLazyLoad);
    window.onscroll = () => {
      if (window.pageYOffset > 22) {
        this.handleEvent(EventType.SCROLL_TO_BOTTOM);
      }
    }
  }

  componentWillUnmount() {
    this.locationSearchModel.removeDataChangeListener('locationListLoaded', this.handleLocationListLoaded);
    this.locationSearchModel.removeDataChangeListener('LocationDataLazyLoad', this.handleLocationDataLazyLoad);
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.ON_TEXT_CHANGE:
        this.setState({
          currentInputContent: params,
          recordList: []
        });
        super.handleEvent(eventType, params);
        break;
      case EventType.GO_BACK:
        this.setState({
          currentInputContent: '',
          recordList: []
        });
        super.handleEvent(eventType, params);
        break;
      case EventType.ZOOM_TO_TARGET:
        this.setState({
          currentInputContent: '',
          recordList: []
        });
        super.handleEvent(eventType, params);
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  handleLocationListLoaded = (data) => {
    if (data.code === 200) {
      if (data.data.pois.length > 0) {
        console.log(data, 'handleLocationListLoaded');
        this.locationSearchModel.getData();
      }
    } else if (data.code === 401) {
      this.handleEvent(EventType.NO_RIGHT);
    } else {
      this.handleEvent(EventType.TOAST, { text: 'Load account failed, please try again.' })
    }
  }

  handleLocationDataLazyLoad = (data) => {
    console.log(data, 'handleLocationDataLazyLoad');
    if(data.length > 0) {
      this.setState({recordList: data});
    }
  }

  render() {
    return (
      <div className={style.main}>
        <div className={style.search_box}>
          <div className={style.arrow} onClick={(e) => this.handleEvent(EventType.GO_BACK, e)}>
            <svg className={style.icon} aria-hidden="true">
              <use xlinkHref="#icon-leftArrow"></use>
            </svg>
          </div>
          <InputItem
            type="text"
            value={this.state.currentInputContent}
            placeholder="请输入地点关键字"
            onChange={(e) => this.handleEvent(EventType.ON_TEXT_CHANGE, e)}
          >
          </InputItem>
          <div className={style.searchIcon}>
            <svg className={style.icon} aria-hidden="true">
              <use xlinkHref="#icon-search2"></use>
            </svg>
          </div>
        </div>
        <div className={style.result_box}>
        {this.state.recordList.map((record, index) =>   
          <div className={style.record} key={index} onClick={() => this.handleEvent(EventType.ZOOM_TO_TARGET, record)}>
            <div className={style.searchIcon}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref="#icon-search2"></use>
              </svg>
            </div>
            {record.name}
          </div>
        )}
        </div>
      </div>
    );
  }
}

export default LazyLoadList;