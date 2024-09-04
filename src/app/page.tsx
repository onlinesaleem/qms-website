"use client";

import { useEffect, useState } from 'react';
import styles from './Home.module.css';
import axios from 'axios';
import Image from 'next/image';
import HeroSection from '@/components/Hero';

interface PageContent {
  id: number;
  page: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [pageContent, setPageContent] = useState<PageContent[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/allContent');
        const homeContent = response.data.filter(
          (content: PageContent) => content.page === 'home'
        );
        setPageContent(homeContent);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };

    fetchContent();
  }, []);

  if (pageContent.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <HeroSection />
      <div className={styles.homeContainer}>
        {pageContent.map((item) => (
          <div key={item.id} className={styles.contentSection}>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.content}>{item.content}</p>
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="responsive"
                width={800}
                height={450}
                className={styles.image}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
