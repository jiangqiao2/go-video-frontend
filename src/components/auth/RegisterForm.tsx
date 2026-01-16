import React, { useState } from 'react';
import { Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const { Text } = Typography;

interface RegisterFormData {
  account: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm<RegisterFormData>();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuthStore();

  const redirectPath =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/';

  const onFinish = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await register({
        account: values.account,
        password: values.password,
      });
      message.success('注册成功');
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '注册失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tech-surface tech-surface-glow scale-in" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            创建账号
          </Text>
          <Text className="tech-muted" style={{ fontSize: 12 }}>
            注册后将自动登录
          </Text>
        </div>
        <Text className="tech-muted" style={{ fontSize: 12 }}>
          已有账号？<Link to="/login">去登录</Link>
        </Text>
      </div>

      <Form<RegisterFormData> form={form} name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
        <Form.Item
          name="account"
          label="账号"
          rules={[
            { required: true, message: '请输入账号' },
            { min: 3, message: '账号至少 3 个字符' },
            { max: 50, message: '账号最多 50 个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '仅支持字母、数字、下划线' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码至少 8 位' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          className="gradient-button"
          style={{ height: 44, borderRadius: 10, border: 'none', fontWeight: 700 }}
        >
          注册
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
