import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { API_URL } from '../../../config';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/usersRedux';
import { Navigate } from 'react-router-dom';
export const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); //loading, success, serverError, clientError,

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    };

    fetch(`${API_URL}/auth/login`, options)
      .then((res) => {
        if (res.status === 200) {
          setStatus('success');
          return res.json();
        } else if (res.status === 400) {
          setStatus('clientError');
          throw new Error('clientError');
        } else {
          setStatus('serverError');
          throw new Error('serverError');
        }
      })
      .then((res) => {
        dispatch(setUser(res));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Form className='col-12 col-sm-3 mx-auto' onSubmit={handleSubmit}>
      {status === 'success' && <Navigate to='/' />}
      {status === 'serverError' && (
        <Alert variant='danger'>
          <Alert.Heading>Something went wrong...</Alert.Heading>
          <p>Unexpected error... Please try again later.</p>
        </Alert>
      )}
      {status === 'clientError' && (
        <Alert variant='danger'>
          <Alert.Heading>Incorrect data</Alert.Heading>
          <p>Login or password are incorrect...</p>
        </Alert>
      )}
      {status === 'loading' && (
        <Spinner
          animation='border'
          role='status'
          variant='danger'
          className='d-block mx-auto'
        >
          <span className='sr-only'>Loading...</span>
        </Spinner>
      )}
      <Form.Group className='mb-3' controlId='formEmail'>
        <h1>Login</h1>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type='email'
          placeholder='Enter email'
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant='danger' type='submit'>
        Sign in
      </Button>
    </Form>
  );
};
