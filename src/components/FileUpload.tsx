import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessedSchedule } from '../types';
import './FileUpload.css';

// 引入Ant Design组件
import { Upload, Button, List, Typography, Space } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Text } = Typography;

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  existingSchedules: ProcessedSchedule[];
  onRemoveSchedule: (id: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  existingSchedules,
  onRemoveSchedule
}) => {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => 
      file.name.includes('.wakeup_schedule') || file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (validFiles.length === 0) {
      alert(t('fileUpload.supportedFormats'));
      return;
    }

    onFileUpload(validFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // 将DataTransferItem转换为File数组
    const files: File[] = [];
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }
    
    handleFileSelect(files);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 从UploadFile数组中提取File对象
    const files: File[] = newFileList
      .map(file => file.originFileObj)
      .filter((file): file is RcFile => file !== undefined)
      .map(file => file as File); // 类型断言为File类型
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
    
    setFileList(newFileList);
  };

  const customRequest = ({ file, onSuccess }: any) => {
    // 模拟上传成功
    setTimeout(() => {
      if (onSuccess) onSuccess("ok");
    }, 0);
  };

  return (
    <div className="file-upload-section">
      <div className="upload-area">
        <div
          className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <p>{t('fileUpload.dropFiles')}</p>
            <p className="upload-hint">{t('fileUpload.supportedFormats')}</p>
          </div>
          <Upload
            customRequest={customRequest}
            fileList={fileList}
            onChange={handleChange}
            showUploadList={false}
            accept=".wakeup_schedule,.json"
            multiple
          >
            <Button icon={<UploadOutlined />}>{t('fileUpload.browse')}</Button>
          </Upload>
        </div>
      </div>

      {existingSchedules.length > 0 && (
        <div className="existing-schedules">
          <h3>{t('fileUpload.loadedSchedules')} ({existingSchedules.length})</h3>
          <List
            dataSource={existingSchedules}
            renderItem={schedule => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    onClick={() => onRemoveSchedule(schedule.id)}
                    title={t('fileUpload.removeSchedule')}
                  />
                ]}
              >
                <List.Item.Meta
                  title={schedule.tableName}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">{schedule.fileName}</Text>
                      <Text type="secondary">
                        {schedule.courses.length} {t('fileUpload.courses')}, 
                        {schedule.scheduleEntries.length} {t('fileUpload.entries')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};