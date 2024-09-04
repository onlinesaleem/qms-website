import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
    return (
        <div className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Shaping the Future with Innovative Technology</h1>
                <p className={styles.heroSubtitle}>
                    Discover tailored solutions that drive success and growth in a digital era.
                </p>
                <button 
                    className={styles.ctaButton} 
                    onClick={() => window.location.href = "/contact"}
                >
                    Discover More
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
