'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Calculator, History, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Materiais',
      path: '/materiais',
      icon: Package,
    },
    {
      name: 'Calculadora',
      path: '/calculadora',
      icon: Calculator,
    },
    {
      name: 'Histórico',
      path: '/historico',
      icon: History,
    },
    {
      name: 'Perfil',
      path: '/perfil',
      icon: User,
    },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #E5E7EB',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '64px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '60px',
                height: '100%',
                textDecoration: 'none',
                color: isActive ? '#00FFCC' : '#6B7280',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                style={{
                  marginBottom: '2px',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s'
                }}
              />
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? '600' : '500'
              }}>
                {item.name}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '48px',
                  height: '3px',
                  backgroundColor: '#00FFCC',
                  borderRadius: '3px 3px 0 0'
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
