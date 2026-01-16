import React from 'react';
import { Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TechShell from './TechShell';

const { Title, Text } = Typography;

export interface TechAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const TechAuthLayout: React.FC<TechAuthLayoutProps> = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <TechShell
      header={
        <div
          style={{
            position: 'sticky',
            top: 0,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            background: 'rgba(2, 6, 23, 0.55)',
            borderBottom: '1px solid var(--border-0)',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space size={12}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ color: 'var(--text-secondary)' }}
              >
                返回首页
              </Button>
              <div style={{ width: 1, height: 18, background: 'var(--border-0)' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <Text strong style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                  GoVideo
                </Text>
                <Text style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Tech Streaming</Text>
              </div>
            </Space>
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 64px' }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <Title level={2} style={{ margin: 0 }}>
              {title}
            </Title>
            {subtitle && (
              <Text className="tech-muted" style={{ fontSize: 13 }}>
                {subtitle}
              </Text>
            )}
          </div>
          {children}
        </div>
      </div>
    </TechShell>
  );
};

export default TechAuthLayout;

