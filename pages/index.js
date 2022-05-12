import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.logo}>
        <Image
          src="/nacelle-logo.svg"
          width="500"
          height="400"
          alt="Nacelle Logo"
        />
      </div>
      <h1>Welcome to your Nacelle Storefront</h1>
      <h2>Welcome to your Nacelle Storefront</h2>
      <h3>Welcome to your Nacelle Storefront</h3>
      <h4>Welcome to your Nacelle Storefront</h4>
      <h5>Welcome to your Nacelle Storefront</h5>
      <h6>Welcome to your Nacelle Storefront</h6>
      <p>Welcome to your Nacelle Storefront</p>
      <a>Welcome to your Nacelle Storefront</a>
      <a className="btn">Welcome to your Nacelle Storefront</a>
      <p>
        Edit <code className={styles.inlineCode}>pages/index.js</code> to get
        started.
      </p>
      <p>
        For help on how to build your storefront,
        <a
          href="https://docs.getnacelle.com/next/intro-next.html"
          target="none"
        >
          visit the Nacelle documentation.
        </a>
      </p>
    </div>
  );
}
