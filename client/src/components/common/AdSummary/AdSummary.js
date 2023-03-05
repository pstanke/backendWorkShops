import { Button, Card } from 'react-bootstrap';
import { IMGS_URL } from '../../../config';

export const AdSummary = ({ ad, buttons }) => {
  return (
    <Card
      className='m-3'
      style={{
        boxShadow: '0 0 20px 2px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Card.Img
        variant='top'
        src={IMGS_URL + ad.photo}
        style={{ height: '400px' }}
      />
      <Card.Body
        style={{
          height: '250px',
        }}
      >
        <Card.Title>{ad.title}</Card.Title>
        <Card.Text>Price: ${ad.price}</Card.Text>
        <Card.Text>Location: {ad.location}</Card.Text>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            className={button.className}
            as={button.as}
            to={button.to}
            onClick={button.action}
          >
            {button.label}
          </Button>
        ))}
      </Card.Body>
    </Card>
  );
};
