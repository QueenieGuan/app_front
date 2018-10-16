import React from 'react';
import BaseView from '../../baseView';
import style from './gridSelect.scss';
import { List, Picker, Button } from 'antd-mobile';
import EventType from '../../../common/eventType';
import ModelFactory from '../../../model/modelFactory';
import ModelType from '../../../model/modelType';
import Header from '../../modules/header';
import Loading from '../../modules/loading';

const Item = List.Item;

class GridSiteSelect extends BaseView {
  constructor(props) {
    super(props);

    this.initialData = this.props.params.initialData;
    this.state = {
      isLoading: false,
      currentRegion: '',
      currentBlock: '',
      currentDichType: '',
      currentDirection: '',
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
      case EventType.ON_BLOCK_SELECT:
        this.setState({ currentBlock: params[0] });
        break;
      case EventType.ON_DITCHTYPE_SELECT:
        this.setState({ currentDichType: params[0] });
        break;
      case EventType.ON_DIRECTION_SELECT:
        this.setState({ currentDirection: params[0] });
        break;
      case EventType.ON_CREATE_CLICK:
        const obj = {
          region: this.state.currentRegion,
          block: this.state.currentBlock,
          ditchType:this.state.currentDichType,
          direction: this.state.currentDirection,
        };
        super.handleEvent(eventType, obj);
        this.setState({
          currentRegion: '',
          currentBlock: '',
          currentDichType: '',
          currentDirection: '',
        });
        break;
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        this.setState({
          currentRegion: '',
          currentBlock: '',
          currentDichType: '',
          currentDirection: '',
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
    const blocks = [];
    this.props.params.blocks.forEach((region) => {
      let item = {
        value: region,
        label: region,
      };
      blocks.push(item);
    });
    const dichType = this.props.params.dichType;
    const direction = this.props.params.direction;
    const { currentRegion, currentBlock, currentDichType, currentDirection } = this.state;
    return (
      <div className={style.main}>
        <Header title="网格选址" image="#icon-ditu"></Header>
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
            <Picker extra={currentBlock}
              data={blocks}
              onOk={e => this.handleEvent(EventType.ON_BLOCK_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">区块</List.Item>
            </Picker>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentDichType}
              data={dichType}
              onOk={e => this.handleEvent(EventType.ON_DITCHTYPE_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">渠道类型</List.Item>
            </Picker>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentDirection}
              data={direction}
              onOk={e => this.handleEvent(EventType.ON_DIRECTION_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">选址导向</List.Item>
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

export default GridSiteSelect;