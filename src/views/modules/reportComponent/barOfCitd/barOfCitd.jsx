import React from 'react';
import BaseView from '../../../baseView';
import style from './barOfCitd.scss';
import EventType from '../../../../common/eventType';

class BarOfCitd extends BaseView{
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
  				<div id='barOfCitd' className={style.bar}></div>
		    </div> 
  		);
  	}
}
export default BarOfCitd