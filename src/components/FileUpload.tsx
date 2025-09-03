import React, { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      file.name.includes('.wakeup_schedule') || file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (validFiles.length === 0) {
      alert('Please select valid schedule files (.wakeup_schedule or .json)');
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
            <p>Drop schedule files here or click to browse</p>
            <p className="upload-hint">Supports .wakeup_schedule and .json files</p>
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
          <h3>Loaded Schedules ({existingSchedules.length})</h3>
          <div className="schedule-list">
            {existingSchedules.map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-info">
                  <div className="schedule-name">{schedule.tableName}</div>
                  <div className="schedule-filename">{schedule.fileName}</div>
                  <div className="schedule-meta">
                    {schedule.courses.length} courses, 
                    {schedule.scheduleEntries.length} entries
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => onRemoveSchedule(schedule.id)}
                  title="Remove schedule"
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