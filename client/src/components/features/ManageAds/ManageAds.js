import { useDispatch, useSelector } from 'react-redux';
import {
  getAdsByUser,
  getRequests,
  removeAdRequest,
} from '../../../redux/adsRedux';
import { isUser } from '../../../redux/usersRedux';
import {
  ProgressBar,
  Alert,
  Row,
  Col,
  Button,
  Container,
  Modal,
} from 'react-bootstrap';

import { useState } from 'react';
import { AdSummary } from '../../common/AdSummary/AdSummary';
import { Link } from 'react-router-dom';

export const ManageAds = () => {
  const request = useSelector(getRequests);
  const user = useSelector(isUser);

  const userAds = useSelector((state) =>
    getAdsByUser(state, user ? user._id : null)
  );

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (request.pending) {
    return <ProgressBar striped variant='danger' now={80} />;
  } else if (request.error) {
    return <Alert color='warning'>{request.error}</Alert>;
  } else if (!request.success || (!userAds.length && user !== null)) {
    return <Alert color='info'>Add advertisement first!</Alert>;
  } else if (user === null) {
    return <Alert variant='danger'>Unauthorized</Alert>;
  } else if (request.success) {
    return (
      <Container>
        <h1>My Ads</h1>
        <Row>
          {userAds.map((ad) => (
            <Col xs={12} md={6} lg={4}>
              <AdSummary
                ad={ad}
                buttons={[
                  {
                    variant: 'dark',
                    className: 'mr-2',
                    to: `/ads/edit/${ad._id}`,
                    label: 'Edit',
                    as: Link,
                  },
                  {
                    variant: 'danger',
                    action: handleShow,
                    label: 'Delete',
                  },
                ]}
              />
              <Modal show={show} onHide={handleClose} backdrop={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  This operation will completely remove this post from the app.
                  <br />
                  Are you sure, you want to do that?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant='danger'
                    onClick={() => {
                      dispatch(removeAdRequest(ad._id));
                      handleClose();
                    }}
                  >
                    Remove
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
};
