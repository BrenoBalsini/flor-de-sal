'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Package, Calculator, History, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
  ];

  const handleSignOut = async () => {
    if (confirm('Deseja sair da sua conta?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Erro ao sair:', error);
      }
    }
  };

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#111827',
          margin: 0
        }}>
          Flor de Sal
        </h1>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
          Gestão de Artesanato
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '4px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#111827' : '#6B7280',
                backgroundColor: isActive ? '#F0FDFA' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s',
                border: isActive ? '1px solid #00FFCC' : '1px solid transparent'
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #F3F4F6'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Usuário'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #00FFCC'
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              fontSize: '14px',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.displayName?.split(' ')[0]}
            </p>
            <p style={{ 
              fontSize: '12px',
              color: '#6B7280',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
