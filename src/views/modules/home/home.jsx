import React from 'react';
import BaseView from '../../baseView';
import style from './home.scss';

class Home extends BaseView {
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
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default Home;