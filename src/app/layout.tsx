// src/app/layout.tsx
import { FC, ReactNode } from 'react';
import Header from '../components/Header';
import '../styles/globals.css';

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="siteContainer">
          <Header />
          <main className="contentContainer">{children}</main>
          <footer className="footer">
            <p>&copy; 2024 QMS Healthcare. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
