import { Alert, ProgressBar, Col, Row, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getRequests, getAds } from '../../../redux/adsRedux';
import { selectItemsChronologically } from '../../../utils/selectItemsChronologically';
import { AdSummary } from '../../common/AdSummary/AdSummary';

export const AllAds = () => {
  const ads = useSelector(getAds);
  const adsChronologically = selectItemsChronologically(ads);
  const request = useSelector(getRequests);

  if (request.pending) {
    return <ProgressBar striped variant='danger' now={80} />;
  } else if (request.error) {
    return <Alert color='warning'>{request.error}</Alert>;
  } else if (!request.success || !ads.length) {
    return <Alert color='info'>No Ads Found</Alert>;
  } else if (request.success) {
    return (
      <Container>
        <Row>
          {adsChronologically.map((ad) => (
            <Col xs={12} md={6} lg={4}>
              <AdSummary
                ad={ad}
                buttons={[
                  {
                    variant: 'danger',
                    as: Link,
                    to: `ads/${ad._id}`,
                    label: 'Read More',
                  },
                ]}
              />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
};
