import { AdForm } from '../../features/AdForm/AdForm';
import { useSelector } from 'react-redux';
import { getAdById } from '../../../redux/adsRedux';
import { isUser } from '../../../redux/usersRedux';
import { Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const EditAd = () => {
  const { id } = useParams();
  const ad = useSelector((state) => getAdById(state, id));
  const user = useSelector(isUser);

  if (!user || !ad || user._id !== ad.user._id) {
    return <Alert variant='danger'>Unauthorized</Alert>;
  }

  return (
    <AdForm
      method={'PUT'}
      URL={`/ads/${id}`}
      actionText={'Edit advertisement'}
      title={ad.title}
      content={ad.content}
      date={ad.date}
      photo={ad.photo}
      price={ad.price}
      location={ad.location}
    />
  );
};
