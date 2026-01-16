import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, App, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const { Text } = Typography;

interface LoginFormData {
  account: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm<LoginFormData>();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const redirectPath =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/';

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login({
        account: values.account,
        password: values.password,
      });
      message.success('登录成功');
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '登录失败，请检查账号和密码';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tech-surface tech-surface-glow scale-in" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <Space size={12}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#051018',
              fontWeight: 800,
              letterSpacing: 0.5,
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Go
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              账号登录
            </Text>
            <Text className="tech-muted" style={{ fontSize: 12 }}>
              支持账号/密码登录
            </Text>
          </div>
        </Space>
      </div>

      <Form<LoginFormData>
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
          <Input prefix={<UserOutlined />} placeholder="请输入账号" />
        </Form.Item>

        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Text className="tech-muted" style={{ fontSize: 12 }}>
            没有账号？<Link to="/register">去注册</Link>
          </Text>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          className="gradient-button"
          style={{ height: 44, borderRadius: 10, border: 'none', fontWeight: 700 }}
        >
          登录
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
