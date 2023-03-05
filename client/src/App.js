import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { API_URL } from './config';
import { setUser } from './redux/usersRedux';
import { loadAdsRequest } from './redux/adsRedux';

import { MainLayout } from './components/layout/MainLayout/MainLayout';

import { Home } from './components/pages/Home/Home';
import { Ad } from './components/pages/Ad/Ad';
import { AddAd } from './components/pages/AddAd/AddAd';
import { EditAd } from './components/pages/EditAd/EditAd';
import { Register } from './components/pages/Register/Register';
import { Login } from './components/pages/Login/Login';
import { Logout } from './components/pages/Logout/Logout';
import { NotFound } from './components/pages/NotFound/NotFound';

import { ManageAds } from './components/features/ManageAds/ManageAds';
import { AllAds } from './components/features/AllAds/AllAds';

export const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const options = {
      credentials: 'include',
      method: 'GET',
    };

    fetch(`${API_URL}/auth/user`, options)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('authorization failed');
        }
      })
      .then((res) => {
        dispatch(setUser(res));
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(loadAdsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ads' element={<AllAds />} />
        <Route path='/ads/:id' element={<Ad />} />
        <Route path='/ads/add' element={<AddAd />} />
        <Route path='/ads/manage' element={<ManageAds />} />
        <Route path='/ads/edit/:id' element={<EditAd />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};
