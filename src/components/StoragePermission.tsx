import React from 'react';
import './StoragePermission.css';

interface StoragePermissionProps {
  onPermissionChange: (granted: boolean) => void;
}

export const StoragePermission: React.FC<StoragePermissionProps> = ({
  onPermissionChange
}) => {
  return (
    <div className="storage-permission-modal">
      <div className="modal-backdrop" />
      <div className="modal-content">
        <h3>Local Storage Permission</h3>
        <p>
          This application can save your uploaded schedules and preferences locally 
          for your convenience. This data never leaves your device.
        </p>
        <div className="permission-details">
          <h4>What will be stored:</h4>
          <ul>
            <li>Processed schedule data</li>
            <li>Application settings and preferences</li>
            <li>No personal information beyond what you upload</li>
          </ul>
        </div>
        <div className="modal-actions">
          <button 
            className="button secondary"
            onClick={() => onPermissionChange(false)}
          >
            No, thanks
          </button>
          <button 
            className="button primary"
            onClick={() => onPermissionChange(true)}
          >
            Allow local storage
          </button>
        </div>
      </div>
    </div>
  );
};