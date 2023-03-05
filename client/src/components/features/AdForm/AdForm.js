import { useState } from 'react';
import { Alert, Button, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../../config';
import { loadAdsRequest } from '../../../redux/adsRedux';
import { useForm } from 'react-hook-form';
export const AdForm = ({ method, URL, actionText, ...props }) => {
  const [title, setTitle] = useState(props.title || '');
  const [content, setContent] = useState(props.content || '');
  const [date, setDate] = useState(props.date || '');
  const [photo, setPhoto] = useState(props.photo || null);
  const [price, setPrice] = useState(props.price || '');
  const [location, setLocation] = useState(props.location || '');
  const [status, setStatus] = useState(null); //loading, success, serverError, clientError

  const [contentError, setContentError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit: validate,
    formState: { errors },
  } = useForm();

  const handleSubmit = () => {
    setContentError(!content);
    setDateError(!date);
    if (
      content &&
      content !== '<p><br></p>' &&
      20 < content.length < 1000 &&
      date
    ) {
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
          } else {
            setStatus('clientError');
          }
        })
        .catch((err) => {
          setStatus('serverError');
          console.log(err);
        });
    }
  };

  return (
    <Form className='col-12 col-sm-5 mx-auto' onSubmit={validate(handleSubmit)}>
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
          <p>
            A photo is required, it should weigh <strong>less than 2MB</strong>
            and be in jpeg, gif or png format.
          </p>
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
          {...register('title', {
            required: true,
            minLength: 10,
            maxLength: 50,
          })}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type='text'
          placeholder='Enter title'
        />
        {errors.title && (
          <small className='d-block form-text text-danger mt-2'>
            This field is required (min.10)(max.50)
          </small>
        )}
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
          {contentError && (
            <small className='d-block form-text text-danger mt-2'>
              This filed is required (min.20)(max.1000)
            </small>
          )}
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
        {dateError && (
          <small className='d-block form-text text-danger mt-2'>
            This filed is required
          </small>
        )}
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
          {...register('price', { required: true, valueAsNumber: true })}
          type='number'
          placeholder='Enter Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.location && (
          <small className='d-block form-text text-danger mt-2'>
            This field is required
          </small>
        )}
      </Form.Group>
      <Form.Group className='mb-3' controlId='formLocation'>
        <Form.Label>Location</Form.Label>
        <Form.Control
          {...register('location', { required: true, maxLength: 100 })}
          type='location'
          placeholder='Enter Location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && (
          <small className='d-block form-text text-danger mt-2'>
            This field is required (max.100)
          </small>
        )}
      </Form.Group>
      <Button variant='danger' type='submit'>
        Submit
      </Button>
    </Form>
  );
};
