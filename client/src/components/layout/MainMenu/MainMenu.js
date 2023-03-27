import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { isUser } from '../../../redux/usersRedux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import styles from './MainMenu.module.scss';
import { useState, useEffect } from 'react';

import { searchByPhraseRequest, loadAdsRequest } from '../../../redux/adsRedux';

export const MainMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(isUser);

  const [showLinks, setShowLinks] = useState(false);
  const [searchValue, setSearchInput] = useState('');

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/ads/manage') {
      setSearchInput('');
      dispatch(loadAdsRequest());
    }
  }, [location.pathname, dispatch]);

  const toggleShowLinks = () => {
    setShowLinks(!showLinks);
  };

  const search = (e) => {
    e.preventDefault();
    if (searchValue && searchValue.length > 0) {
      dispatch(searchByPhraseRequest(searchValue));
    } else {
      dispatch(loadAdsRequest());
    }
  };

  return (
    <section className={styles.sticky}>
      <Navbar className={styles.navBar} variant='light'>
        <Nav className='mr-auto'>
          <Nav.Link as={NavLink} to='/'>
            <FontAwesomeIcon icon={faHome} size='2x' />
          </Nav.Link>
        </Nav>

        <Nav className='ml-auto align-items-center'>
          <FontAwesomeIcon
            icon={user ? faUser : faUserRegular}
            size='2x'
            onClick={toggleShowLinks}
          />

          {showLinks && (
            <Nav>
              {user === null && (
                <>
                  <Nav.Link as={NavLink} to='/register'>
                    Sign up
                  </Nav.Link>
                  <Nav.Link as={NavLink} to='/login'>
                    Sign in
                  </Nav.Link>
                </>
              )}
              {user !== null && (
                <>
                  <Nav.Link as={NavLink} to='/logout'>
                    Logout
                  </Nav.Link>
                  <Nav.Link as={NavLink} to='/ads/add'>
                    Add ad
                  </Nav.Link>
                  <Nav.Link as={NavLink} to='/ads/manage'>
                    My ads
                  </Nav.Link>
                </>
              )}
            </Nav>
          )}
        </Nav>
      </Navbar>

      <div className={styles.searchBar}>
        <Form className='d-flex mx-2' onSubmit={search}>
          <Form.Control
            type='search'
            placeholder='Search'
            value={searchValue}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant='outline-danger' type='submit' className='ml-1'>
            Search
          </Button>
        </Form>
      </div>

      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#c00118'
          d='M0,128L34.3,112C68.6,96,137,64,206,90.7C274.3,117,343,203,411,208C480,213,549,139,617,101.3C685.7,64,754,64,823,90.7C891.4,117,960,171,1029,181.3C1097.1,192,1166,160,1234,138.7C1302.9,117,1371,107,1406,101.3L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z'
        ></path>
      </svg>
    </section>
  );
};
