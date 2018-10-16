import React from 'react';
import BaseView from '../../baseView';
import style from './searchBox.scss';
import EventType from '../../../common/eventType';
import { InputItem } from 'antd-mobile';

class SearchBox extends BaseView {
  constructor(props) {
    super(props);
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
    const currentInputContent = this.props.currentInputContent;
    return (
      <div className={style.main}>
        <div className={style.search_section}>
          <svg className={style.searchIcon} aria-hidden="true" onClick={() => this.handleEvent(EventType.BACK_BUTTON_CLICK)}>
            <use xlinkHref={currentInputContent === undefined? "#icon-search":"#icon-leftArrow"}></use>
          </svg>
          <InputItem
            type="text"
            value={currentInputContent}
            placeholder='地址搜索'
            onChange={(e) => this.handleEvent(EventType.ON_TEXT_CHANGE, e)}
            onFocus={(e) => {this.handleEvent(EventType.ON_FOCUS, e)}}
          >
          </InputItem>
        </div>
      </div> 
    );
  }
}

export default SearchBox;