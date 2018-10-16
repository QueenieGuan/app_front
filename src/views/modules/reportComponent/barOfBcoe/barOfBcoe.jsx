import React from 'react';
import BaseView from '../../../baseView';
import style from './barOfBcoe.scss';
import EventType from '../../../../common/eventType';

class BarOfBcoe extends BaseView{
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
  				<div id='barOfBcoe' className={style.bar}></div>
		    </div> 
  		);
  	}
}
export default BarOfBcoe
