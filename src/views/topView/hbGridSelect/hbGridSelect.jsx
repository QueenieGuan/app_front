import React from 'react';
import BaseView from '../../baseView';
import style from './hbGridSelect.scss';
import { List, Picker, Button } from 'antd-mobile';
import EventType from '../../../common/eventType';
import Header from '../../modules/header';
import Loading from '../../modules/loading';

const Item = List.Item;

class HBGridSiteSelect extends BaseView {
  constructor(props) {
    super(props);

    this.initialData = this.props.params.initialData;

    this.state = {
      isLoading: false,
      currentRegion: '',
      currentIsPortCover: '',
      currentReturnNums: '',
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.ON_REGION_SELECT:
        this.setState({ currentRegion: params[0] });
        break;
      case EventType.ON_ISPORTCOVER_SELECT:
        this.setState({ currentIsPortCover: params[0] });
        break;
      case EventType.ON_RETURNNUMS_SELECT:
        this.setState({ currentReturnNums: params[0] });
        break;
      case EventType.ON_CREATE_CLICK:
        const obj = {
          region: this.state.currentRegion,
          isHave:this.state.currentIsPortCover,
          num: this.state.currentReturnNums,
        };
        super.handleEvent(eventType, obj);
        this.setState({
          currentRegion: '',
          currentIsPortCover: '',
          currentReturnNums: '',
        });
        break;
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        this.setState({
          currentRegion: '',
          currentIsPortCover: '',
          currentReturnNums: '',
        });
        super.handleEvent(eventType, params);
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    const isLoading = this.props.params.isLoading === undefined? this.state.isLoading : this.props.params.isLoading;
    const currentCity = this.props.params.currentCity;
    const regions = [];
    this.props.params.regions.forEach((region) => {
      let item = {
        value: region,
        label: region,
      };
      regions.push(item);
    });
    const isPortCover = [];
    this.props.params.isPortCover.forEach((isPort) => {
      let item = {
        value: isPort,
        label: isPort,
      };
      isPortCover.push(item);
    });
    const returnNums = [];
    this.props.params.returnNums.forEach((num) => {
      let item = {
        value: num,
        label: num,
      };
      returnNums.push(item);
    });
    const { currentRegion, currentIsPortCover, currentReturnNums } = this.state;
    return (
      <div className={style.main}>
        <Header title="家宽选址" image="#icon-home"></Header>
        <div className={style.container}>
          <List className="my-list" className={style.list}>
            <Item extra={currentCity}>地市</Item>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentRegion}
              data={regions}
              onOk={e => this.handleEvent(EventType.ON_REGION_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">行政区</List.Item>
            </Picker>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentIsPortCover}
              data={isPortCover}
              onOk={e => this.handleEvent(EventType.ON_ISPORTCOVER_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">端口覆盖</List.Item>
            </Picker>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentReturnNums}
              data={returnNums}
              onOk={e => this.handleEvent(EventType.ON_RETURNNUMS_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">返回数目</List.Item>
            </Picker>
          </List>
          <Button type="primary" inline className={style.btn} onClick={() => this.handleEvent(EventType.ON_CREATE_CLICK)}>创建</Button>

          <Button size="large" inline className={style.btn} onClick={() => this.handleEvent(EventType.ON_FUNCTION_CANCEL_CLICK)}>退出</Button>
        </div>
        <div className={isLoading? '': style.hide}>
          <Loading></Loading>
        </div>
      </div>
    );
  }
}

export default HBGridSiteSelect;