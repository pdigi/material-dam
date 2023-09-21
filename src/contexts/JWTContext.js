import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from '../utils/main';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
    // return {
    //   ...state,
    //   isAuthenticated: false,
    //   user: null,
    // };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        // console.log(accessToken, "my-account")

        setSession(accessToken);
        // const response = await axios.get('/auth/my-account');

        const user = {user: 'Cam'};

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (value) => {
    // const response = await axios.post('/auth/login', value);
  
    // const { accessToken, user } = response.data.data;
    const { accessToken, user } = {
        accessToken: '435254354543345',
        user:{
            name:'Cam'
        }
    };
    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: "8864c717-587d-472a-929a-8e5f298024da-0",
          displayName: 'Cam',
          email: "demo@demo.cc",
   
        }
      }
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    });

    // **** DO RETURN ACCESS TOKEN ON SIGN UP

    // if (!response.data.data) return;
    const { accessToken, user } = response.data.data;
    // localStorage.setItem('accessToken', accessToken);

    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user: user
    //   },
    // });


    // we do not want to redirect on signup, so we simulate logout dispatch
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });

  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
      initialize
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, initialize]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}