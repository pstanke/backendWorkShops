import Container from 'react-bootstrap/Container';
import { MainMenu } from './../MainMenu/MainMenu';
import styles from './MainLayout.module.scss';
import { Footer } from './../Footer/Footer';
export const MainLayout = ({ children }) => {
  return (
    <Container className={styles.body}>
      <MainMenu />
      <div className={styles.children}>{children}</div>
      <Footer />
    </Container>
  );
};
