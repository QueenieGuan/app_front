import React from 'react';
import BaseView from '../../baseView';
import style from './citySelector.scss';
import EventType from '../../../common/eventType';
import { Picker, List } from 'antd-mobile';


class CitySelector extends BaseView {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true,
      cityInfoList: [],
      currentCity: this.props.currentCity,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.ON_SELECT_CITY:
        this.setState({currentCity: params.selectedCity[0]});
        super.handleEvent(eventType, params.selectedCity[0]);
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  handleDataLoaded = (data) => {
    this.setState({ isLoading: false });
    if (data.code === 200) {
      let cityInfoList = [];
      cityInfoList.push({label: '广东省', value: '广东省'});
      data.data.city.forEach((value, index) => {
        let temp = {
          label: value.region, 
          value: value.region,
          gpsLat: value.gpsLat,
          gpsLon: value.gpsLon,
          id: value.id,
          level: value.level,
          region: value.region,
        };
        cityInfoList.push(temp);
      })
      this.setState({
        cityInfoList: cityInfoList
      });
    } else if (data.code === 401) {
      this.handleEvent(EventType.NO_RIGHT);
    } else {
      this.handleEvent(EventType.TOAST, { text: 'Load account failed, please try again.' })
    }
  }

  render() {
    const currentCity = this.state.currentCity;
    const cities = [];
    this.props.cityList.forEach((city) => {
      const item = {
        value: city,
        label: city
      };
      cities.push(item);
    })
    return (
      <div className={style.main}>
        <div className={style.city_box}>
          <Picker
            data={cities}
            value={Array.from(this.state.currentCity)}
            cols={1}
            extra={currentCity}
            onOk={v => this.handleEvent(EventType.ON_SELECT_CITY, { selectedCity: v })}
          >
          <List.Item arrow="horizontal"></List.Item>
          </Picker>
          <svg className={style.city_drop_down} aria-hidden="true">
            <use xlinkHref="#icon-dropDown"></use>
          </svg>
        </div>
      </div> 
    );
  }
}

export default CitySelector;