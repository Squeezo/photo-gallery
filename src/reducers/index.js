import {
  REQUEST_PHOTOS, RECEIVE_PHOTOS,
  DOWNLOAD_LARGE, DOWNLOAD_SMALL,
  ERROR
} from '../actions'

const photosReducer = (state = {startat: 0, photos:[]}, action) => {

  switch (action.type) {
    case REQUEST_PHOTOS:
      return {
        ...state,
        fetchingPhotos: true

      }
    case RECEIVE_PHOTOS:
      console.log('state.photos', state)
      return {
        ...state,
        fetchingPhotos: false,
        photos: [...state.photos, ...action.photos],
        startat: action.endat
      }
    case DOWNLOAD_LARGE:
      return {
        ...state,
        id: action.id
      }
    case DOWNLOAD_SMALL:
      return {
        ...state,
        id: action.id
      }
    case ERROR:
      return {
        ...state,
        fetchingPhotos: false
      }

    default:
      return state
  }
}

const arrayToObject = (array) =>
  array.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})

export default photosReducer;