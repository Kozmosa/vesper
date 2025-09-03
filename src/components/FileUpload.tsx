import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessedSchedule } from '../types';
import './FileUpload.css';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
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
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="file-upload-section">
      <div className="upload-area">
        <div
          className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <p>{t('fileUpload.dropFiles')}</p>
            <p className="upload-hint">{t('fileUpload.supportedFormats')}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".wakeup_schedule,.json"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      </div>

      {existingSchedules.length > 0 && (
        <div className="existing-schedules">
          <h3>{t('fileUpload.loadedSchedules')} ({existingSchedules.length})</h3>
          <div className="schedule-list">
            {existingSchedules.map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-info">
                  <div className="schedule-name">{schedule.tableName}</div>
                  <div className="schedule-filename">{schedule.fileName}</div>
                  <div className="schedule-meta">
                    {schedule.courses.length} {t('fileUpload.courses')}, 
                    {schedule.scheduleEntries.length} {t('fileUpload.entries')}
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => onRemoveSchedule(schedule.id)}
                  title={t('fileUpload.removeSchedule')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};