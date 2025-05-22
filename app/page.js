import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Comming soon!</h1>
      <p className={styles.subTitle}>We are in the process on building it.</p>
    </div>
  );
}
