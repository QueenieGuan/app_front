import React from 'react';
import BaseView from '../../baseView';
import style from './layerManagerCard.scss';
import EventType from '../../../common/eventType';
import { Checkbox, Switch } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

class LayerManagerCard extends BaseView {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = { 
      isLoading: true,
      layerList: ['渠道网格图层', '行政区图层'],
      regions: [
        {
          label: '行政区图层',
          isShowInfo: '',
          checked: true,
        },
        {
          label: '区块图层',
          isShowInfo: '', 
          checked: false,
        },
        {
          label: '渠道点图层',
          isShowInfo: 'channel', 
          checked: false,
        },
        {
          label: '渠道网格图层',
          isShowInfo: 'grid', 
          checked: true,
        },
        {
          label: '家宽网格图层',
          isShowInfo: 'hbGrid',
          checked: false, 
        },
      ]
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleEvent = (eventType, params) => {
    switch (eventType) {
      case EventType.LAYERS_CHANGE:
        const list = this.state.layerList;
        const regions = this.state.regions;
        if (list.indexOf(params.label) === -1) {
          regions[params.index].checked = true;
          if (params.label === '家宽网格图层') {
            if (list.indexOf('渠道网格图层') !== -1) {
              list.splice(0, 1, '家宽网格图层');
              regions[3].checked = false;
            } else {
              list.splice(0, 0, '家宽网格图层')
            }
            super.handleEvent(EventType.HBGRID_LOADED);
          } else if (params.label === '渠道网格图层') {
            if (list.indexOf('家宽网格图层') !== -1) {
              list.splice(0, 1, '渠道网格图层');
              regions[4].checked = false;
            } else {
              list.splice(0, 0, '渠道网格图层')
            }
            super.handleEvent(EventType.GRID_LOADED);
          } else {
            list.push(params.label);
          }
        } else {
          regions[params.index].checked = false;
          list.forEach((element, index) => {
            if (element === params.label) {
              list.splice(index, 1);
              index--;
            }
          });
        }
        this.setState({
          layerList: list,
          regions: regions,
        });
        super.handleEvent(EventType.LAYERS_CHANGE, this.state.layerList);
        console.log(this.state.layerList, 'this.state.layerList');
        break;
      default:
        super.handleEvent(eventType, params);
        break;
    }
  }

  render() {
    return (
      <div className={style.main}>
        <div className={style.title}>图层管理</div>
        <div className={style.close_button} onClick={() => this.handleEvent(EventType.ON_LAYER_BUTTON_CLOSE)}>
          <svg className={style.icon} aria-hidden="true">
            <use xlinkHref="#icon-close"></use>
          </svg>
        </div>
        <div className={style.content}>
          {this.state.regions.map((i, index) => (
            <div key={index}>
              <CheckboxItem onChange={() => this.handleEvent(EventType.LAYERS_CHANGE, { label: i.label, index: index })} checked={i.checked}>
                <span>{i.label}</span>
              </CheckboxItem>
            </div>
          ))}
        </div>
      </div> 
    );
  }
}

export default LayerManagerCard;