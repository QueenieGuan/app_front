import React from 'react';
import BaseView from '../../baseView';
import style from './footBar.scss';
import EventType from '../../../common/eventType';

class FootBar extends BaseView {
  constructor(props) {
    super(props);
    this.barList = [
      {
        iconOff: '#icon-mapOff',
        iconOn: '#icon-mapOn',
        iconName: 'init',
        iconText: '地图',
      },
      {
        iconOff: '#icon-funcOff',
        iconOn: '#icon-funcOn',
        iconName: 'functionCard',
        iconText: '功能',
      },
      {
        iconOff: '#icon-mineOff',
        iconOn: '#icon-mineOn',
        iconName: 'mine',
        iconText: '我',
      },
    ];
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.FOOTBAR_ITEM_CLICK:
        super.handleEvent(eventType, { pageName: this.barList[params.idx].iconName, index: params.idx });
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    const selectedIndex = this.props.footBarIndex;
    return (
      <div className={style.container}>
        {this.barList.map((item, index) =>
          <div key={index} className={style.item} onClick={() => this.handleEvent(EventType.FOOTBAR_ITEM_CLICK, { idx: index })}>
            <div className={style.image}>
              <svg className={style.icon} aria-hidden="true">
                <use xlinkHref={ index === selectedIndex? item.iconOn: item.iconOff }></use>
              </svg>
            </div>
            <div className={ index === selectedIndex? style.textOn: style.textOff }>
              {item.iconText}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default FootBar;