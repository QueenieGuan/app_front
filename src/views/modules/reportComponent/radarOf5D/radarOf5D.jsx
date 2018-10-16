import React from 'react';
import BaseView from '../../../baseView';
import style from './radarOf5D.scss';
import EventType from '../../../../common/eventType';

class RadarOf5D extends BaseView{
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
  				<div id='radarOf5D' className={style.bar}></div>
		    </div> 
  		);
  	}
}
export default RadarOf5D