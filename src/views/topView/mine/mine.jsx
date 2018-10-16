import React from 'react';
import BaseView from '../../baseView';
import style from './mine.scss';
import EventType from '../../../common/eventType';
import FootBar from '../../modules/footBar';

class Mine extends BaseView {
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
      <div>
        <div className={style.main}>
          <div className={style.title}>我的</div>
        </div>
        <FootBar footBarIndex={this.props.params.currentFootBarIndex}></FootBar>
      </div>
    );
  }
}

export default Mine;