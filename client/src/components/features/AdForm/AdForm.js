import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { API_URL, IMGS_URL } from '../../../config';
import { loadAdsRequest } from '../../../redux/adsRedux';
import { useForm } from 'react-hook-form';
export const AdForm = ({
  method,
  URL,
  actionText,
  requireFile,
  editFile,
  ...props
}) => {
  const [title, setTitle] = useState(props.title || '');
  const [content, setContent] = useState(props.content || '');
  const [date, setDate] = useState(props.date || '');
  const [photo, setPhoto] = useState(props.photo || null);
  const [price, setPrice] = useState(props.price || '');
  const [location, setLocation] = useState(props.location || '');
  const [status, setStatus] = useState(null); //loading, success, serverError, clientError
  const [clientErrorMessage, setClientErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit: validate,
    formState: { errors },
  } = useForm();

  const handleSubmit = () => {
    if (content !== '<p><br></p>') {
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
          if (res.ok) {
            setStatus('success');
            dispatch(loadAdsRequest());
          } else {
            res.text().then((errorMessage) => {
              setClientErrorMessage(errorMessage);
              setStatus('clientError');
            });
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
          <p>{clientErrorMessage}</p>
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

        <Form.Control
          {...register('content', {
            required: true,
            minLength: 20,
            maxLength: 1000,
          })}
          as='textarea'
          style={{ height: '100px' }}
          placeholder='Enter content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {errors.content && (
          <small className='d-block form-text text-danger mt-2'>
            This filed is required (min.20)(max.1000)
          </small>
        )}
      </Form.Group>
      <Form.Group className='mb-3' controlId='formDate'>
        <Form.Label>Date</Form.Label>
        <Form.Control
          {...register('date', { required: true })}
          type='date'
          placeholder='Enter date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && (
          <small className='d-block form-text text-danger mt-2'>
            This filed is required
          </small>
        )}
      </Form.Group>
      <Form.Group className='mb-3' controlId='formFile'>
        <Form.Label>Photo</Form.Label>
        {editFile && (
          <img
            className='m-2'
            style={{ height: '150px' }}
            alt={props.title}
            src={IMGS_URL + props.photo}
          />
        )}
        <Form.Control
          {...register('photo', { required: requireFile ? true : false })}
          type='file'
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        {errors.photo && (
          <small className='d-block form-text text-danger mt-2'>
            File is required
          </small>
        )}
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
        {errors.price && (
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
