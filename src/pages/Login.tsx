import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import TechAuthLayout from '@/components/layout/TechAuthLayout';

const Login: React.FC = () => {
  return (
    <TechAuthLayout title="登录" subtitle="欢迎回来，继续你的创作与观看之旅">
      <LoginForm />
    </TechAuthLayout>
  );
};

export default Login;
