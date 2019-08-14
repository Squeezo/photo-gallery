

//export const NEW_CALL = 'NEW_CALL'
export const REQUEST_PHOTOS = 'REQUEST_PHOTOS';
export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS';
export const DOWNLOAD_LARGE = 'DOWNLOAD_LARGE';
export const DOWNLOAD_SMALL = 'DOWNLOAD_SMALL';
export const ERROR = 'ERROR';


export const requestPhotos = () => ({
  type: REQUEST_PHOTOS
})


export const receivePhotos = (json) => ({
  type: RECEIVE_PHOTOS,
  photos: json.pics, 
  endat: json.endat
})

export const fetchPhotos = () => (dispatch, getState) => {
  let state = getState();
  const { startat } = state;
  dispatch(requestPhotos())
  console.log('fetchPhotos called with state.startat', startat)
  fetch(`${process.env.REACT_APP_API_URL}/load/${startat}`)
  .then(response => {
    return response.json();
  })
  .then(resp => {
    console.log('fetch returned', resp)
    dispatch(receivePhotos(resp));

  })
  .catch(error => {
    console.error(error);
    dispatch({ type: ERROR, message: error});
  });
}

const shouldFetchPhotos = (state) => {
  console.log('shouldFetchPhotos', state)
  const { photos }  = state;
  if (!photos.length > 0) {
    console.log('shouldFetchPhotos returning true')
    return true
  }
  if (state.photos.fetchingPhotos) {
    console.log('shouldFetchPhotos returning false')
    return false
  }
  console.log('shouldFetchPhotos returning false')
  return false;
}

export const fetchPhotosIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchPhotos(getState())) {
    return dispatch(fetchPhotos())
  }
}

