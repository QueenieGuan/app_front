import React from 'react';
import BaseView from '../../baseView';
import style from './header.scss';
import EventType from '../../../common/eventType';

class Header extends BaseView {
  constructor(props) {
    super(props);
    
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    const title = this.props.title;
    const image = this.props.image;
    return (
      <div className={style.container}>
        <div className={style.arrow} onClick={() => this.handleEvent(EventType.ON_FUNCTION_CANCEL_CLICK)}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref="#icon-leftArrow"></use>
          </svg>
        </div>
        <div className={style.arrow}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref={image}></use>
          </svg>
        </div>
        <div className={style.title}>{title}</div>
      </div>
    )
  }
}

export default Header;