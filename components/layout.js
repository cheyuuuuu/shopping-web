
import styles from "./Layout.module.css";
import Nav from "./nav";

export default function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      
      <Nav className={styles.navBar}></Nav>
      <main className={styles.mainContent}>
        {children}
      </main>
      <footer className={styles.footer}>
        <h6>@copyRight by cheyu,Lin</h6>
      </footer>
    </div>
  );
}