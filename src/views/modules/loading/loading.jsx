import React from 'react';
import BaseView from '../../baseView';
import style from './loading.scss';
import EventType from '../../../common/eventType';

class Loading extends BaseView {
  constructor(props) {
    super(props);
    this.map = null;

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
      <div className={style.spinner}>
        <div className={style.loader}></div>
      </div>
    );
  }
}

export default Loading;