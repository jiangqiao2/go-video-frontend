import React from 'react';
import { Layout } from 'antd';

export interface TechShellProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

const { Header, Content } = Layout;

const TechShell: React.FC<TechShellProps> = ({ header, children }) => {
  return (
    <Layout className="tech-shell" style={{ minHeight: '100vh' }}>
      {/* Decorative grid overlay (content stays above via z-index). */}
      <div className="grid-background" style={{ opacity: 0.12 }} />

      {header && (
        <Header style={{ padding: 0, height: 'auto', background: 'transparent', zIndex: 10 }}>
          <div style={{ position: 'relative', zIndex: 2 }}>{header}</div>
        </Header>
      )}

      <Content style={{ position: 'relative', zIndex: 1 }}>{children}</Content>
    </Layout>
  );
};

export default TechShell;

