import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { API_URL } from '../../../config';
export const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(null); //loading, success, serverError, clientError, loginError

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('login', login);
    fd.append('password', password);
    fd.append('phone', phone);
    fd.append('avatar', avatar);
    const options = {
      method: 'POST',
      body: fd,
    };
    setStatus('loading');
    fetch(`${API_URL}/auth/register`, options)
      .then((res) => {
        if (res.status === 201) {
          setStatus('success');
        } else if (res.status === 400) {
          setStatus('clientError');
        } else if (res.status === 409) {
          setStatus('loginError');
        } else {
          setStatus('serverError');
        }
      })
      .catch((err) => {
        setStatus('serverError');
      });
  };
  return (
    <Form className='col-12 col-sm-3 mx-auto' onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      {status === 'success' && (
        <Alert variant='success'>
          <Alert.Heading>Success!</Alert.Heading>
          <p>You have been successfully registered! You can now log in...</p>
        </Alert>
      )}
      {status === 'serverError' && (
        <Alert variant='danger'>
          <Alert.Heading>Something went wrong...</Alert.Heading>
          <p>Unexpected error... Please try again later.</p>
        </Alert>
      )}
      {status === 'clientError' && (
        <Alert variant='warning'>
          <Alert.Heading>Not enough data</Alert.Heading>
          <p>You have to fill all the fields.</p>
        </Alert>
      )}

      {status === 'loginError' && (
        <Alert variant='warning'>
          <Alert.Heading>Login already in use</Alert.Heading>
          <p>You have to use other login.</p>
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
      <Form.Group className='mb-3' controlId='formPhone'>
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type='tel'
          placeholder='Phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formFile'>
        <Form.Label>Avatar</Form.Label>
        <Form.Control
          type='file'
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </Form.Group>
      <Button variant='danger' type='submit'>
        Submit
      </Button>
    </Form>
  );
};
