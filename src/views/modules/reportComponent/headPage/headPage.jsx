import React from 'react';
import BaseView from '../../../baseView';
import style from './headPage.scss';
import EventType from '../../../../common/eventType';

class HeadPage extends BaseView{
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
  		return(
  			<div className={style.main}>
  				<div id='headPage' className={style.bar}>
            <div>选址类型：{this.props.type}</div>
            <div>选址目的：{this.props.aim}</div>
            <div>选址得分：{this.props.score}</div>
            <div>创建时间：{this.props.date}</div>
          </div>
		    </div> 
  		);
  	}
}
export default HeadPage