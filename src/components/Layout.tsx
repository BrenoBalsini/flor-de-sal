'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        {/* Sidebar Desktop - usa display none/block via CSS */}
        <div className="sidebar-container">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="main-content" style={{ 
          flex: 1,
          minHeight: '100vh'
        }}>
          {children}
        </main>
      </div>
      
      {/* Bottom Nav Mobile */}
      <div className="bottom-nav-container">
        <BottomNav />
      </div>

      <style jsx global>{`
        /* Mobile First */
        .sidebar-container {
          display: none;
        }

        .bottom-nav-container {
          display: block;
        }

        .main-content {
          padding-bottom: 80px;
        }

        /* Desktop - a partir de 768px */
        @media (min-width: 768px) {
          .sidebar-container {
            display: block;
          }

          .bottom-nav-container {
            display: none;
          }

          .main-content {
            margin-left: 240px;
            padding-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}
    