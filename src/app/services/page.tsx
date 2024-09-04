"use client";

import { useEffect, useState } from 'react';
import styles from './Services.module.css';
import axios from 'axios';

interface PageContent {
  id: number;
  page: string;
  title: string;
  content: string;
}

const ServicesPage = () => {
  const [pageContent, setPageContent] = useState<PageContent[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/allContent');
        const servicesContent = response.data.filter(
          (content: PageContent) => content.page === 'services'
        );
        setPageContent(servicesContent);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };

    fetchContent();
  }, []);

  if (pageContent.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.servicesWrapper}>
      <h1 className={styles.servicesTitle}>Our Services</h1>
      <div className={styles.servicesGrid}>
        {pageContent.map((item: PageContent) => (
          <div key={item.id} className={styles.serviceItem}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
