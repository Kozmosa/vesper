import React from 'react';
import { useTranslation } from 'react-i18next';
import './StoragePermission.css';

interface StoragePermissionProps {
  onPermissionChange: (granted: boolean) => void;
}

export const StoragePermission: React.FC<StoragePermissionProps> = ({
  onPermissionChange
}) => {
  const { t } = useTranslation();
  return (
    <div className="storage-permission-modal">
      <div className="modal-backdrop" />
      <div className="modal-content">
        <h3>{t('storagePermission.title')}</h3>
        <p>
          {t('storagePermission.description')}
        </p>
        <div className="permission-details">
          <h4>{t('storagePermission.storedData')}</h4>
          <ul>
            <li>{t('storagePermission.dataList.schedules')}</li>
            <li>{t('storagePermission.dataList.settings')}</li>
            <li>{t('storagePermission.dataList.noPersonalInfo')}</li>
          </ul>
        </div>
        <div className="modal-actions">
          <button 
            className="button secondary"
            onClick={() => onPermissionChange(false)}
          >
            {t('storagePermission.decline')}
          </button>
          <button 
            className="button primary"
            onClick={() => onPermissionChange(true)}
          >
            {t('storagePermission.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};