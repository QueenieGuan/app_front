import React from 'react';
import BaseView from '../../baseView';
import style from './report.scss';
import Header from '../../modules/header';
import EventType from '../../../common/eventType';
import { Popover} from 'antd-mobile';
import Loading from '../../modules/loading';
import HeadPage from '../../modules/reportComponent/headPage';
import RadarOf5D from '../../modules/reportComponent/radarOf5D';
import BarOfBcoe from '../../modules/reportComponent/barOfBcoe';
import BarOfBreq from '../../modules/reportComponent/barOfBreq';
import BarOfCitd from '../../modules/reportComponent/barOfCitd';
import BarOfTraf from '../../modules/reportComponent/barOfTraf';
import PieOfCusval from '../../modules/reportComponent/pieOfCusval';

class Report extends BaseView {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: false,
      data: {},
      visible: false,
      selected:'',
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => { 
    switch (eventType) {
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }
  onSelect = (opt) => {
    console.log('opt.props.value',opt.props.value)
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
    this.scrollToAnchor(opt.props.value);     //跳转到相应位置
  }
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  }
  scrollToAnchor = (anchorName) => {
    if (anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView(); }
    }
    console.log(anchorName)
  }

  render() {
    const isLoading = this.props.params.isLoading === undefined? this.state.isLoading : this.props.params.isLoading;
    const type = this.props.params.type;
    const aim = this.props.params.aim;
    const score = this.props.params.score;
    const date = this.props.params.date;
    const Item = Popover.Item;

    return (
      <div>
        <Header title="商业选址报告" image="#icon-business"></Header>
        <div className={style.main}>
          <div className={style.item}>
            <Popover mask
              overlayClassName='fortest'
              overlayStyle={{ color: 'blue' }}
              visible={this.state.visible}
              overlay={[
                (<Item key='1' value='radarOf5D'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-weidu'}></use>
                    </svg>
                  </div>
                  五大维度分析
                </Item>),
                (<Item key='2' value='barOfBcoe'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-shangquan'}></use>
                    </svg>
                  </div>
                  商圈生态
                </Item>),
                (<Item key='3' value='barOfBreq'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-work'}></use>
                    </svg>
                  </div>
                  业务需求
                </Item>),
                (<Item key='4' value='barOfCitd'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-jingzheng'}></use>
                    </svg>
                  </div>
                  竞争分布
                </Item>),
                (<Item key='5' value='barOfTraf'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-jiaotong'}></use>
                    </svg>
                  </div>
                  交通便利
                </Item>),
                (<Item key='6' value='pieOfCusval'>
                  <div style={{float:'left',marginRight:'6px',marginTop:'3px'}}>
                    <svg style={{height:'16px',width:'16px'}} aria-hidden="true">
                      <use xlinkHref={'#icon-kehu'}></use>
                    </svg>
                  </div>
                  客户价值
                </Item>),
              ]}
              onVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            >
              <svg className={style.icon} style={{height:'32px',width:'32px'}} aria-hidden="true">
                <use xlinkHref={'#icon-open'}></use>
              </svg>
            </Popover>
          </div>
          <div><HeadPage type={type} aim={aim} score={score} date={date}></HeadPage></div>
          <div><RadarOf5D></RadarOf5D></div>
          <div><BarOfBcoe></BarOfBcoe></div>
          <div><BarOfBreq></BarOfBreq></div>
          <div><BarOfCitd></BarOfCitd></div>
          <div><BarOfTraf></BarOfTraf></div>
          <div><PieOfCusval></PieOfCusval></div>
          <div className={isLoading? '': style.hide}><Loading></Loading></div>
        </div>
      </div>
    );
  }
}

export default Report;