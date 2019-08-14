import React, { Component } from 'react';
import { fetchPhotosIfNeeded, fetchPhotos } from './actions'
import { connect } from 'react-redux';
import debounce from "lodash.debounce";
import Spinner from './Spinner';

class Gallery extends Component {
	constructor(props) {
		super(props);
    this.listRef = React.createRef();
	
		window.onscroll = debounce(() => {
      const { loadMore } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (this.props.fetchPhotos) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    }, 100);
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchPhotosIfNeeded());
	}

	loadMore = () => {
		if(!this.props.fetchingPhotos) {
			const { dispatch } = this.props;
			dispatch(fetchPhotos());			
		}
	}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.photos.length < this.props.photos.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    console.log('componentDidUpdate', snapshot)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

	render() {

		const { fetchingPhotos, photos } = this.props;

    const pics = photos.map((item, i) => {
			let img = `${process.env.REACT_APP_BASE_URL}/web/${item.file}`
			return (
				<li key={item.file}>
					<figure>
						<img src={img}/>
					</figure>
				</li>
			)
		});
		
		return(
			<main className='gallery'>
				<Spinner />
				<ul className='gallery__list' ref={this.listRef}>
					{pics}
				</ul>
			</main>

		)
	}
	
}

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state)
  const { fetchingPhotos, photos } = state  || 
  			{ fetchingPhotos: true, photos: [] }; 
  
  return { fetchingPhotos, photos}  
  
}

 

export default connect(mapStateToProps)(Gallery);