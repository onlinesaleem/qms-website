// src/app/about/page.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './About.module.css';

interface PageContent {
  id: number;
  page: string;
  title: string;
  content: string;
  imageUrl: string;
}

export default function AboutPage() {
  const [pageContent, setPageContent] = useState<PageContent[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/allContent');
        const aboutContent = response.data.filter(
          (content: PageContent) => content.page === 'about'
        );
        setPageContent(aboutContent);
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
    <div className={styles.aboutPage}>
      {pageContent.map((item) => (
        <div key={item.id} className={styles.aboutContainer}>
          {item.imageUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="responsive"
                width={800}
                height={450}
                className={styles.image}
              />
            </div>
          )}
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.content}>{item.content}</p>
        </div>
      ))}
    </div>
  );
}
