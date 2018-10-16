import React from 'react';
import BaseView from '../../baseView';
import style from './businessReport.scss';
import { List, Picker, Button, Slider } from 'antd-mobile';
import EventType from '../../../common/eventType';

class BusinessReport extends BaseView {
  constructor(props) {
    super(props);

    this.initialData = this.props.params.initialData;

    this.state = {
      currentDichType: '自营',
      currentDirection: '竞争补点',
      currentRadius: 500,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.ON_DITCHTYPE_SELECT:
        this.setState({ currentDichType: params[0] });
        break;
      case EventType.ON_DIRECTION_SELECT:
        this.setState({ currentDirection: params[0] });
        break;
      case EventType.ON_RADIUS_CHANGE:
        this.setState({ currentRadius: params.radius });
        super.handleEvent(eventType, params);
        break;
      case EventType.ON_CREATE_REPORT:
        const obj = {
          ditchType:this.state.currentDichType,
          direction: this.state.currentDirection,
          currentRadius: this.state.currentRadius,
        };
        super.handleEvent(eventType, obj);
        this.setState({
          currentDichType: '',
          currentDirection: '',
          currentRadius: ''
        });
        break;
      case EventType.ON_FUNCTION_CANCEL_CLICK:
        this.setState({
          currentDichType: '',
          currentDirection: '',
          currentRadius: ''
        });
        super.handleEvent(eventType, params);
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    const dichType = this.props.params.dichType;
    const direction = this.props.params.direction;
    const { currentDichType, currentDirection } = this.state;
    return (
      <div className={style.main}>
        <div className={style.container}>
          <div className={style.head}>
            <div style={{float:'left',margin:'4px 5px 0 4px'}}>
              <svg style={{height:'22px',width:'22px'}} aria-hidden="true">
                <use xlinkHref={'#icon-auxiliary-location'}></use>
              </svg>
            </div>
            选址导向
          </div>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentDichType}
              data={dichType}
              onOk={e => this.handleEvent(EventType.ON_DITCHTYPE_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">选择类型</List.Item>
            </Picker>
          </List>
          <List className="picker-list" className={style.list}>
            <Picker extra={currentDirection}
              data={direction}
              onOk={e => this.handleEvent(EventType.ON_DIRECTION_SELECT, e)}
              onDismiss={e => console.log('dismiss', e)}
            >
              <List.Item arrow="horizontal">选择目的</List.Item>
            </Picker>
          </List>
          <div className={style.slider}>
            <span className={style.radius_text1}>选择半径（m）</span>
            <span className={style.radius_text2}>当前：{this.state.currentRadius}米</span>
            <Slider
              defaultValue={500}
              min={500}
              max={5000}
              step={500}
              onAfterChange={(e) => this.handleEvent(EventType.ON_RADIUS_CHANGE, { radius: e })}
            />
          </div>
          <div className={style.button_group}>
            <Button size="small" type="primary" inline className={style.btn} onClick={() => this.handleEvent(EventType.ON_SELECT_POINT)}>选 点</Button>
            <Button size="small" inline className={style.btn} style={{width:'96px',backgroundColor:'#108ee9',color:'white'}} onClick={() => this.handleEvent(EventType.ON_CREATE_REPORT)}>生成报告</Button>
            <Button size="small" inline className={style.btn} onClick={() => this.handleEvent(EventType.ON_EXIT_BUTTON_CLICK)}>退 出</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessReport;