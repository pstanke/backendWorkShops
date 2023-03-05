import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../../config';
import { loadAdsRequest } from '../../../redux/adsRedux';

export const AdForm = ({ method, URL, actionText, ...props }) => {
  const [title, setTitle] = useState(props.title || '');
  const [content, setContent] = useState(props.content || '');
  const [date, setDate] = useState(props.date || '');
  const [photo, setPhoto] = useState(props.photo || null);
  const [price, setPrice] = useState(props.price || '');
  const [location, setLocation] = useState(props.location || '');
  const [status, setStatus] = useState(null); //loading, success, serverError, clientError
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    fd.append('date', date);
    fd.append('photo', photo);
    fd.append('price', price);
    fd.append('location', location);

    const options = {
      method,
      body: fd,
    };
    setStatus('loading');
    fetch(`${API_URL}${URL}`, options)
      .then((res) => {
        if (res.status === 200) {
          setStatus('success');
          dispatch(loadAdsRequest());
        } else if (res.status === 400) {
          setStatus('clientError');
        } else {
          setStatus('serverError');
        }
      })
      .catch((err) => {
        setStatus('serverError');
      });
  };

  return (
    <Form className='col-12 col-sm-5 mx-auto' onSubmit={handleSubmit}>
      <h1>{actionText}</h1>
      {status === 'success' && (
        <Alert variant='success'>
          <Alert.Heading>Success!</Alert.Heading>
          <p>Now you can manage your ads in My ads panel</p>
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
          <Alert.Heading>There is a problem with provided data</Alert.Heading>
          <p>You have to fill all the fields.</p>
          <p>Title min: 10 max 50 Content min:20 max: 1000</p>
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

      <Form.Group className='mb-3' controlId='formTitle'>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type='title'
          placeholder='Enter title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formContent'>
        <Form.Label>Content</Form.Label>
        <FloatingLabel>
          <Form.Control
            as='textarea'
            style={{ height: '100px' }}
            placeholder='Enter content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className='mb-3' controlId='formDate'>
        <Form.Label>Date</Form.Label>
        <Form.Control
          type='date'
          placeholder='Enter date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formFile'>
        <Form.Label>Photo</Form.Label>
        <Form.Control
          type='file'
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formPrice'>
        <Form.Label>Price</Form.Label>
        <Form.Control
          type='price'
          placeholder='Enter Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='formLocation'>
        <Form.Label>Location</Form.Label>
        <Form.Control
          type='location'
          placeholder='Enter Location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Form.Group>
      <Button variant='danger' type='submit'>
        Submit
      </Button>
    </Form>
  );
};
