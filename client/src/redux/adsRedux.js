import axios from 'axios';
import { API_URL } from '../config';

/* SELECTORS */
export const getAds = ({ ads }) => ads.data;

export const getRequests = ({ ads }) => ads.requestStatus;

export const getAdById = (state, id) =>
  state.ads.data.find((ad) => ad._id === id);

export const getAdsByUser = (state, id) =>
  state.ads.data.filter((ad) => ad.user._id === id);

/* ACTIONS */

// action name creator
const reducerName = 'ads';
const createActionName = (name) => `app/${reducerName}/${name}`;

const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');

const LOAD_ADS = createActionName('LOAD_ADS');
const REMOVE_AD = createActionName('REMOVE_AD');

export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = (error) => ({ error, type: ERROR_REQUEST });

export const loadAds = (payload) => ({ payload, type: LOAD_ADS });
export const removeAd = (payload) => ({ type: REMOVE_AD, payload });

/* THUNKS */

export const loadAdsRequest = () => {
  return async (dispatch) => {
    dispatch(startRequest());
    try {
      let res = await axios.get(`${API_URL}/ads`);
      dispatch(loadAds(res.data));
      dispatch(endRequest());
    } catch (e) {
      dispatch(errorRequest(e.message));
    }
  };
};

export const searchByPhraseRequest = (phrase) => {
  return async (dispatch) => {
    dispatch(startRequest());
    try {
      let res = await axios.get(`${API_URL}/ads/search/${phrase}`);
      dispatch(loadAds(res.data));
      dispatch(endRequest());
    } catch (e) {
      dispatch(errorRequest(e.message));
    }
  };
};

export const removeAdRequest = (id) => {
  return async (dispatch) => {
    dispatch(startRequest());
    try {
      await axios.delete(`${API_URL}/ads/${id}`);
      dispatch(removeAd(id));
      dispatch(endRequest());
    } catch (e) {
      dispatch(errorRequest(e.message));
    }
  };
};

/* INITIAL STATE */

export const initialAdsState = {
  data: [],
  requestStatus: {
    error: null,
    pending: false,
    success: null,
  },
};

/* REDUCER */

export const adsReducer = (statePart = initialAdsState, action) => {
  switch (action.type) {
    case LOAD_ADS:
      return { ...statePart, data: [...action.payload] };
    case REMOVE_AD:
      return {
        ...statePart,
        data: statePart.data.filter((ad) => ad._id !== action.payload),
      };
    case START_REQUEST:
      return {
        ...statePart,
        requestStatus: { pending: true, error: null, success: false },
      };
    case END_REQUEST:
      return {
        ...statePart,
        requestStatus: { pending: false, error: null, success: true },
      };
    case ERROR_REQUEST:
      return {
        ...statePart,
        requestStatus: {
          pending: false,
          error: action.payload.error,
          success: false,
        },
      };
    default:
      return statePart;
  }
};
