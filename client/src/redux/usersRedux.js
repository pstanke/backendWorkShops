/* INITIAL STATE */
export const initialUserState = {
  user: null,
};

/* SELECTORS */
export const isUser = (state) => state.user.user;

/* ACTIONS */
// action name creator
const reducerName = 'user';
const createActionName = (name) => `app/${reducerName}/${name}`;

const SET_USER = createActionName('SET_USER');
const LOG_OUT = createActionName('LOG_OUT');

export const logOut = () => ({ type: LOG_OUT });
export const setUser = (payload) => ({ payload, type: SET_USER });
/* THUNKS */

/* REDUCER */
export const userReducer = (statePart = initialUserState, action) => {
  switch (action.type) {
    case LOG_OUT:
      return { user: null };
    case SET_USER:
      return { user: action.payload };
    default:
      return statePart;
  }
};
