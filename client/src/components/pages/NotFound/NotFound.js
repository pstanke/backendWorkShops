import error from '../../.././vendor/404.png';
export const NotFound = () => {
  return (
    <div className='d-flex justify-content-center'>
      <img src={error} alt='error' className='img-fluid' />
    </div>
  );
};
