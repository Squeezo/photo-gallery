import React, { Component } from 'react';
import { connect } from 'react-redux';

class Spinner extends Component {

	constructor() {
		super()

		this.state = { height: 0, offset:0}
	}

	componentWillMount() {
		window.addEventListener('resize', this.setHeight)
		window.addEventListener('scroll', this.setOffset)

	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setHeight)
		window.removeEventListener('scroll', this.setOffset)
	}

	componentDidMount(){
		this.setHeight();
		this.setOffset();
	}

	setHeight = () => {
		let height = Math.max(
		  document.body.scrollHeight, document.documentElement.scrollHeight,
		  document.body.offsetHeight, document.documentElement.offsetHeight,
		  document.body.clientHeight, document.documentElement.clientHeight
		);
		this.setState({height: height})
	}

	setOffset = () => {
				this.setState({'scroll': window.scrollY})
	}

	render() {

		const { fetchingPhotos } = this.props;

		let cssClass = 'stats hidden';

		if(fetchingPhotos) {
			cssClass = 'stats visible'
		}

		return (
    	<figure className={cssClass}>
    		<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </figure>	
    )
	}

}


const mapStateToProps = (state) => {
  const { fetchingPhotos } = state  || 
  			{ fetchingPhotos: true }; 
  
  return { fetchingPhotos}  
  
}

 

export default connect(mapStateToProps)(Spinner);