import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from './router';
import { apiRequest } from './utils';
import jwt from 'jwt-decode';

// Create a `useAuth` hook and `AuthProvider` that enables
const authContext = createContext();

// any component to subscribe to auth and re-render when it changes.
export const useAuth = () => useContext(authContext);

// This should wrap the app in `src/pages/_app.js`
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that creates the `auth` object and handles state
// This is called from `AuthProvider` above (extracted out for readability)
function useAuthProvider() {
  const [user, setUser] = useState();

  useEffect(() => {
    const loggedUser = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData'))
      : null;
    if (loggedUser) {
      const authUser = jwt(loggedUser.access_token);
      setUser(authUser);
    } else {
      setUser(false);
    }
  }, []);

  const handleAuth = (resp) => {
    if (resp.status === 'success') {
      console.log("inside Authhhhhhhhhhh");
      localStorage.setItem('userData', JSON.stringify(resp.value));
      const authUser = jwt(resp?.value?.access_token);
      setUser(authUser);
      return authUser;
    } else {
      setUser(false);
      return user;
    }
  };

  const signup = async (email, first_name, last_name, phone_number,personal_email, role) => {
    const signUpData = {};
    signUpData['email'] = email;
    signUpData['first_name'] = first_name;
    signUpData['last_name'] = last_name;
    signUpData['phone_number'] = phone_number;
    signUpData['personal_email'] = personal_email;
    const signupResponse = await apiRequest(
      `api/users/signUp?${role === 'Trainer' ? 'role=Trainer' : ''}`,
      'POST',
      signUpData
    )
      .then((response) => handleError(response))
      .then((response) => response);
    return signupResponse;
  };

  const signin = async (email, password, phone_number) => {
    const data = {};
    if (email) {
      data['email'] = email;
    } else {
      data['phone_number'] = phone_number;
    }
    data['password'] = password;
   
    const signinresponse = await apiRequest('api/users/signIn', 'POST', data)
      .then((response) => handleError(response))
      .then((response) => handleAuth(response));

    return signinresponse;
  };

  const forgotPassword = async (email) => {
    const forgotPasswordData = {};
    forgotPasswordData['email'] = email;
   
    console.log(forgotPasswordData, '@@@@@@@@@email@@@@@@@@@@@@@');
    const forgotPasswordResponse = await apiRequest(
      'api/users/forgotPassword',
      'PUT',
      forgotPasswordData
    )
      .then((response) => handleError(response))
      .then((response) => response);
    return forgotPasswordResponse;
  };

  const resetPassword = async (password, confirmPassword, token) => {
    const resetPasswordData = {};
    resetPasswordData['password'] = password;
    resetPasswordData['confirmPassword'] = confirmPassword;
    resetPasswordData['token'] = token;
   
    console.log(resetPasswordData, '@@@@@@@@@RESET_PASSWORD@@@@@@@@@@@@@');
    const resetPasswordResponse = await apiRequest(
      `api/users/resetPassword`,
      'POST',
      resetPasswordData
    )
      .then((response) => handleError(response))
      .then((response) => response);
    return resetPasswordResponse;
  };

  const updatePassword = async (old_password, password, new_password) => {
    const data = {};
    data['old_password'] = old_password;
    data['password'] = password;
    data['confirm_password'] = new_password;

    const updatepasswordResponse = await apiRequest(
      'api/users/setPassword',
      'POST',
      data
    )
      .then((response) => handleError(response))
      .then((response) => response);

    return updatepasswordResponse;
  };

  const signInWithOtp = async (email, phone_number) => {
    const signIndata = {};
    if (email) {
      signIndata['input'] = email;
    } else {
      signIndata['input'] = phone_number;
    }
    
    console.log('Inputttttt', signIndata);
    const OTPResponse = await apiRequest('api/users/sendOtp', 'POST', signIndata)
      .then((response) => handleError(response))
      .then((response) => response);

    return OTPResponse;
  };

  const verifyotp = async (email, phone_number, OTP) => {
    const verifydata = {};
    if (email) {
      verifydata['input'] = email;
    } else {
      verifydata['input'] = phone_number;
    }
    verifydata['otp'] = OTP;
    console.log('verifydata', verifydata);

    const verifyOTPResponse = await apiRequest(
      'api/users/verifyOtp',
      'POST',
      verifydata
    )
      .then((response) => handleError(response))
      .then((response) => handleAuth(response));
    return verifyOTPResponse;
  };

  const handleError = (response) => {
    if (response.status === 'error') {
      console.log('response::', response, response.status === 'error');
      throw new Error(response.message);
    }
    return response;
  };

  return {
    user: user,
    signup,
    signin,
    forgotPassword,
    resetPassword,
    updatePassword,
    signInWithOtp,
    verifyotp,
  };
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return (props) => {
    // Get authenticated user
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false) {
        router.navigate('/auth/signin', { replace: true });
      }
    }, [auth]);

    return <Component {...props} />;
  };
};
