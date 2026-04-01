import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomePageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <h1>{siteConfig.title}</h1>
        <p>{siteConfig.tagline}</p>
        <p className={styles.subtext}>
          This site explains every important part of the Rick&apos;s Radar codebase for readers who are brand new to web development and Firebase.
        </p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="Developer Documentation"
      description="Beginner-first architecture and Firebase documentation for Rick's Radar">
      <HomePageHeader />
    </Layout>
  );
}
