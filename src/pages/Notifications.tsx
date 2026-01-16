import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Input, List, Space, Spin, Tabs, Typography, Empty } from 'antd';
import { ArrowLeftOutlined, BellOutlined, LikeOutlined, MessageOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import TechShell from '@/components/layout/TechShell';
import { useNotificationStore, mapNotificationCategory } from '@/store/notifications';
import type { NotificationItem as NotificationItemType } from '@/types/api';
import { formatPublishedTime } from '@/utils/date';

const { Text, Title, Paragraph } = Typography;

type TabKey = 'reply' | 'at' | 'likes' | 'system' | 'mine';

const TAB_KEYS: TabKey[] = ['reply', 'at', 'likes', 'system', 'mine'];

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'reply', label: '回复我的', icon: <MessageOutlined /> },
  { key: 'at', label: '@我的', icon: <NotificationOutlined /> },
  { key: 'likes', label: '收到的赞', icon: <LikeOutlined /> },
  { key: 'system', label: '系统消息', icon: <NotificationOutlined /> },
  { key: 'mine', label: '我的消息', icon: <BellOutlined /> },
];

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const routeTab = (params.tab || 'reply') as TabKey;

  const { items, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const activeTab: TabKey = TAB_KEYS.includes(routeTab) ? routeTab : 'reply';

  useEffect(() => {
    fetchNotifications().catch(() => undefined);
  }, [fetchNotifications, activeTab]);

  useEffect(() => {
    if (!TAB_KEYS.includes(routeTab)) {
      navigate('/notifications/reply', { replace: true });
    }
  }, [routeTab, navigate]);

  const categoryCounts = useMemo(() => {
    const res = { reply: 0, at: 0, likes: 0, system: 0, mine: 0 };
    items.forEach((n: NotificationItemType) => {
      if (n.is_read) return;
      const cat = mapNotificationCategory(n.type);
      if (cat === 'reply' || cat === 'comment') res.reply += 1;
      else if (cat === 'mention') res.at += 1;
      else if (cat === 'like') res.likes += 1;
      else if (cat === 'system') res.system += 1;
      else res.mine += 1;
    });
    return res;
  }, [items]);

  const filteredList = useMemo(() => {
    const byTab = items.filter((n) => {
      const cat = mapNotificationCategory(n.type);
      switch (activeTab) {
        case 'reply':
          return cat === 'reply' || cat === 'comment';
        case 'at':
          return cat === 'mention';
        case 'likes':
          return cat === 'like';
        case 'system':
          return cat === 'system';
        case 'mine':
          return cat === 'other';
        default:
          return true;
      }
    });

    if (!keyword.trim()) return byTab;

    const kw = keyword.trim().toLowerCase();
    return byTab.filter((n) => {
      const t = (n.title || '').toLowerCase();
      const c = (n.content || '').toLowerCase();
      return t.includes(kw) || c.includes(kw);
    });
  }, [items, activeTab, keyword]);

  const selectedItem = useMemo(() => items.find((n) => n.id === selectedId) || null, [items, selectedId]);

  const handleTabChange = (key: string) => {
    setSelectedId(null);
    navigate(`/notifications/${key}`);
  };

  const handleItemClick = (item: NotificationItemType) => {
    setSelectedId(item.id);
    if (!item.is_read) {
      markAsRead(item.id).catch(() => undefined);
    }
  };

  const renderListItem = (item: NotificationItemType) => {
    const isActive = item.id === selectedId;
    const isUnread = !item.is_read;

    return (
      <div
        key={item.id}
        onClick={() => handleItemClick(item)}
        style={{
          padding: '10px 12px',
          borderRadius: 12,
          cursor: 'pointer',
          background: isActive ? 'rgba(34, 211, 238, 0.10)' : 'transparent',
          border: isActive ? '1px solid rgba(34, 211, 238, 0.28)' : '1px solid transparent',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <Space size={8} align="start">
              <Badge dot={isUnread} color="#fb7185" />
              <Text strong style={{ display: 'block' }} ellipsis>
                {item.title || '通知'}
              </Text>
            </Space>
            <Text className="tech-muted" style={{ fontSize: 12 }}>
              {formatPublishedTime(item.created_at)}
            </Text>
            {item.content && (
              <div style={{ marginTop: 6 }}>
                <Text className="tech-muted" style={{ fontSize: 12 }} ellipsis>
                  {item.content}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space size={10}>
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ color: 'var(--text-secondary)' }}>
                返回
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                通知中心
              </Title>
            </Space>
            <Button type="link" onClick={() => markAllAsRead().catch(() => undefined)}>
              全部已读
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 36px' }}>
        <div className="tech-surface tech-surface-glow" style={{ padding: 18 }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={TABS.map((t) => ({
              key: t.key,
              label: (
                <Space size={6}>
                  {t.icon}
                  <span>{t.label}</span>
                  {categoryCounts[t.key] > 0 && (
                    <span style={{ color: 'var(--primary-color)', fontSize: 12 }}>{categoryCounts[t.key]}</span>
                  )}
                </Space>
              ),
            }))}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <Input.Search
              placeholder="搜索消息"
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ maxWidth: 420 }}
            />
            <Text className="tech-muted" style={{ fontSize: 12 }}>
              共 {filteredList.length} 条
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, minHeight: 480 }}>
            <div
              style={{
                borderRight: '1px solid var(--border-0)',
                paddingRight: 14,
                overflowY: 'auto',
                maxHeight: 540,
              }}
            >
              {loading ? (
                <div style={{ paddingTop: 90, textAlign: 'center' }}>
                  <Spin />
                </div>
              ) : filteredList.length === 0 ? (
                <div style={{ paddingTop: 90, textAlign: 'center' }}>
                  <Empty description="暂无相关消息" />
                </div>
              ) : (
                <List dataSource={filteredList} renderItem={renderListItem} split={false} />
              )}
            </div>

            <div style={{ padding: '4px 8px' }}>
              {selectedItem ? (
                <div>
                  <Space size={8} align="center">
                    <Badge dot={!selectedItem.is_read} color="#fb7185" />
                    <Title level={5} style={{ margin: 0 }}>
                      {selectedItem.title || '通知'}
                    </Title>
                  </Space>
                  <div style={{ marginTop: 8, marginBottom: 14 }}>
                    <Text className="tech-muted" style={{ fontSize: 12 }}>
                      {formatPublishedTime(selectedItem.created_at)}
                    </Text>
                  </div>
                  <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0, color: 'var(--text-secondary)' }}>
                    {selectedItem.content || '暂无内容'}
                  </Paragraph>
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 260,
                        height: 160,
                        borderRadius: 14,
                        border: '1px dashed var(--border-0)',
                        margin: '0 auto 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-tertiary)',
                        background: 'rgba(2, 6, 23, 0.25)',
                      }}
                    >
                      选择一条消息查看详情
                    </div>
                    <Text className="tech-muted">你的互动与系统消息会展示在这里</Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TechShell>
  );
};

export default Notifications;
