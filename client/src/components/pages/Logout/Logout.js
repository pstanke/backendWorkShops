import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config';
import { logOut, setUser } from '../../../redux/usersRedux';
export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: 'DELETE',
    };
    fetch(`${API_URL}/auth/logout`, options).then(() => {
      dispatch(logOut());
      dispatch(setUser(null));
      navigate('/');
    });
  }, [dispatch, navigate]);

  return null;
};
