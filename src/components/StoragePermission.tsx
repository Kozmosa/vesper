import React from 'react';
import { useTranslation } from 'react-i18next';
import './StoragePermission.css';

// 引入Ant Design组件
import { Button, Modal, Typography, List } from 'antd';

const { Title, Paragraph } = Typography;

interface StoragePermissionProps {
  onPermissionChange: (granted: boolean) => void;
}

export const StoragePermission: React.FC<StoragePermissionProps> = ({
  onPermissionChange
}) => {
  const { t } = useTranslation();
  
  return (
    <Modal
      open={true}
      closable={false}
      footer={[
        <Button key="decline" onClick={() => onPermissionChange(false)}>
          {t('storagePermission.decline')}
        </Button>,
        <Button key="accept" type="primary" onClick={() => onPermissionChange(true)}>
          {t('storagePermission.accept')}
        </Button>
      ]}
      title={t('storagePermission.title')}
    >
      <Paragraph>
        {t('storagePermission.description')}
      </Paragraph>
      
      <Title level={5}>{t('storagePermission.storedData')}</Title>
      <List
        size="small"
        dataSource={[
          t('storagePermission.dataList.schedules'),
          t('storagePermission.dataList.settings'),
          t('storagePermission.dataList.noPersonalInfo')
        ]}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </Modal>
  );
};