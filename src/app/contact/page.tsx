"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './Contact.module.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createContact();
    try {
      await axios.post('/api/contact', form);
      setSuccess('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setSuccess('Failed to send message.');
    }
  };

  async function createContact() {
    try {
      await axios.post('/api/saveContact', form);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>Contact Us</h1>
        <p>We&apos;d love to hear from you. Reach out with any questions, comments, or feedback!</p>
      </header>

      <div className={styles.contactInfoWrapper}>
        <div className={styles.contactDetails}>
          <h2>Our Office</h2>
          <p>Medavakkam</p>
          <p>Chennai, Tamilnadu, India.</p>
          <p>Phone: +91 9994705804</p>
          <p>Email: info@qmshealthcare.org</p>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509289!2d144.96315761568026!3d-37.814107979751575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727b7b66c3d50!2sQMS%20Healthcare!5e0!3m2!1sen!2sus!4v1617190818207!5m2!1sen!2sus"
            width="100%"
            height="350"
            frameBorder="0"
            style={{ border: 0 }}
            aria-hidden="false"
          ></iframe>
        </div>
      </div>

      <div className={styles.formContainer}>
        <h2 className={styles.header}>Get in Touch</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
        {success && <p className={styles.successMessage}>{success}</p>}
      </div>

      <footer className={styles.footer}>
        <h3>Why Choose Us?</h3>
        <p>
          At QMS Healthcare, we are committed to providing the best services in the industry. Our dedicated team is here to support you every step of the way.
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;