import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAdById, getRequests } from '../../../redux/adsRedux';
import { Card, Col, ProgressBar, Row, Alert } from 'react-bootstrap';
import { IMGS_URL } from '../../../config';
import styles from './Ad.module.scss';
export const Ad = () => {
  const { id } = useParams();
  const adData = useSelector((state) => getAdById(state, id));
  const request = useSelector(getRequests);

  if (request.pending) {
    return <ProgressBar striped variant='danger' now={80} />;
  } else if (request.error) {
    return <Alert color='warning'>{request.error}</Alert>;
  } else if (!request.success || !adData) {
    return <Alert color='info'>No Ads Found</Alert>;
  } else if (request.success) {
    return (
      <Card>
        <Row>
          <Col xs={12} lg={6}>
            <Card.Img variant='top' src={IMGS_URL + adData.photo} />
          </Col>
          <Col>
            <Card.Body>
              <Card.Title className='d-flex justify-content-between'>
                <h2>{adData.title}</h2>
                <h4>
                  Price: <strong>${adData.price}</strong>
                </h4>
              </Card.Title>
              <Card.Text>{adData.content}</Card.Text>
              <Card.Text className='d-flex justify-content-between'>
                <h4>
                  Added: <strong>{adData.date}</strong>
                </h4>
                <h4>
                  Location: <strong>{adData.location}</strong>
                </h4>
              </Card.Text>
              <Col>
                <h4>
                  <strong>Contact Me!</strong>
                </h4>
                <img
                  src={IMGS_URL + adData.user.avatar}
                  alt={adData.user.login}
                  className={styles.avatar}
                />
                <Card.Text>
                  E-mail: <strong>{adData.user.login}</strong>
                </Card.Text>
                <Card.Text>
                  Phone: <strong>{adData.user.phone}</strong>
                </Card.Text>
              </Col>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  }
};
