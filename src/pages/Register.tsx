import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import TechAuthLayout from '@/components/layout/TechAuthLayout';

const Register: React.FC = () => {
  return (
    <TechAuthLayout title="注册" subtitle="创建账号，开启你的高清视频体验">
      <RegisterForm />
    </TechAuthLayout>
  );
};

export default Register;
