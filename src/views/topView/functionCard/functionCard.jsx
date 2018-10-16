import React from 'react';
import BaseView from '../../baseView';
import style from './functionCard.scss';
import EventType from '../../../common/eventType';
import FootBar from '../../modules/footBar';

class FunctionCard extends BaseView {
  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true,
      data: {}
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

  render() {
    return (
      <div className={style.main}>
        <div className={style.title}>广东移动渠道辅助选址平台</div>
        <div className={style.btn1}>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.GRID_SELECT_BUTTON_CLICK)}}>
              <div className={style.iconBox}>
                <svg className={style.icon} aria-hidden="true">
                  <use xlinkHref={"#icon-ditu"}></use>
                </svg>
              </div>
              <div className={style.text}>网格选址</div>
          </div>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.HBGRID_SELECT_BUTTON_CLICK)}}>
            <div className={style.iconBox}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={"#icon-home"}></use>
              </svg>
            </div>
            <div className={style.text}>家宽选址</div>
          </div>
        </div>

        <div className={style.btn2}>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.CANDIDATE_SELECT_BUTTON_CLICK)}}>
            <div className={style.iconBox}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={"#icon-site"}></use>
              </svg>
            </div>
            <div className={style.text}>候选点打分</div>
          </div>
          <div className={style.item}>
          </div>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.LEAGUE_EVALUATE_BUTTON_CLICK)}}>
            <div className={style.iconBox}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={"#icon-jiameng"}></use>
              </svg>
            </div>
            <div className={style.text}>加盟厅评估</div>
          </div>
        </div>

        <div className={style.btn3}>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.BUSINESS_REPORT_BUTTON_CLICK)}}>
            <div className={style.iconBox}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={"#icon-business"}></use>
              </svg>
            </div>
            <div className={style.text}>商业报告</div>
          </div>
          <div className={style.item} onClick={() => { this.handleEvent(EventType.BUSINESS_MANAGEMENT_CLICK)}}>
            <div className={style.iconBox}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={"#icon-yewu"}></use>
              </svg>
            </div>
            <div className={style.text}>业务管理</div>
          </div>
        </div>
        <FootBar footBarIndex={this.props.params.currentFootBarIndex}></FootBar>
      </div>
    );
  }
}

export default FunctionCard;