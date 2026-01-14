import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';
import router from './router';

// 配置Ant Design主题 - 更科技感的配色
const { darkAlgorithm } = antdTheme;

const theme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#22d3ee',
    colorInfo: '#22d3ee',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#fb7185',
    colorBgBase: '#070b14',
    colorBgContainer: '#0b1220',
    colorBgElevated: '#0f172a',
    colorBorder: 'rgba(255,255,255,0.12)',
    colorText: '#e6f0ff',
    colorTextSecondary: 'rgba(230,240,255,0.72)',
    borderRadius: 12,
    fontSize: 14,
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 42,
      fontWeight: 600,
    },
    Card: {
      borderRadius: 16,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 42,
    },
    Tabs: {
      inkBarColor: '#22d3ee',
      itemSelectedColor: '#22d3ee',
      itemHoverColor: 'rgba(34,211,238,0.9)',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);
