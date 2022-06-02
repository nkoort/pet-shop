import { onAuthStateChanged } from 'firebase/auth'
import { stopSubmit } from 'redux-form'
import { authAPI } from '../api/firebase/firebase'

const AUTH_USER = 'auth/AUTH_USER'

let initialState = {
  auth: '',
  isAuth: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        auth: action.auth,
        isAuth: action.isAuth
      }
    default:
      return state
  }
}

const authAC = (auth, isAuth) => ({
  type: AUTH_USER,
  auth,
  isAuth,
})

export const authTH = (email, password) => async (dispatch) => {
  let response = authAPI.login(email, password)
  response
    .then((userCredential) => {
      debugger
      dispatch(authAC(userCredential.user, true))
    })
    .catch((error) => {
      let message = error.message.length > 0 ? error.message : 'Some error'
      dispatch(
        stopSubmit('login', {
          _error: message,
        }),
      )
    })
}

export const examAuthTH = () => async (dispatch) => {
  let response = await authAPI.examAuth()
  onAuthStateChanged(response, (user) => {
    if (user) {
      dispatch(authAC(user, true))
    } else {
      dispatch(authAC('', false))
    }
    
  })
}
export const logOutTH = () => (dispatch) => {
   let response = authAPI.logout();
   const auth = {};
   dispatch(authAC(auth, false));
}

export default authReducer
