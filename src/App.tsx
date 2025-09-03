import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScheduleVisualization } from './components/ScheduleVisualization';
import { StoragePermission } from './components/StoragePermission';
import { ConfigPanel } from './components/ConfigPanel';
import { ScheduleProcessor } from './utils/ScheduleProcessor';
import { StorageManager } from './utils/StorageManager';
import { AppConfig, ProcessedSchedule, RawScheduleData } from './types';
import './App.css';

const defaultConfig: AppConfig = {
  visualConfig: {
    showWeekends: true,
    timeFormat: '24h',
    highlightColor: '#4CAF50',
    freeTimeOpacity: 0.3,
    gridLines: true,
    showTimeLabels: true
  },
  dataConfig: {
    enableLocalStorage: false,
    autoSave: true,
    maxStoredSchedules: 10
  }
};

function App() {
  const [schedules, setSchedules] = useState<ProcessedSchedule[]>([]);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState<boolean | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const processor = new ScheduleProcessor();
  const storageManager = new StorageManager();

  useEffect(() => {
    // Check if storage permission was previously granted
    const permission = storageManager.getStoragePermission();
    setStoragePermissionGranted(permission);
    
    if (permission) {
      // Load saved schedules and config
      const savedSchedules = storageManager.loadSchedules();
      const savedConfig = storageManager.loadConfig();
      
      setSchedules(savedSchedules);
      setConfig({ ...defaultConfig, ...savedConfig });
    }
  }, []);

  const handleStoragePermission = (granted: boolean) => {
    setStoragePermissionGranted(granted);
    storageManager.setStoragePermission(granted);
    
    if (granted) {
      const updatedConfig = { ...config, dataConfig: { ...config.dataConfig, enableLocalStorage: true } };
      setConfig(updatedConfig);
      storageManager.saveConfig(updatedConfig);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const newSchedules: ProcessedSchedule[] = [];
      
      for (const file of files) {
        const content = await file.text();
        const rawData: RawScheduleData = processor.parseRawData(content);
        const processed = processor.processSchedule(rawData, file.name);
        newSchedules.push(processed);
      }

      const updatedSchedules = [...schedules, ...newSchedules];
      setSchedules(updatedSchedules);

      // Save to localStorage if permission granted
      if (storagePermissionGranted && config.dataConfig.enableLocalStorage) {
        storageManager.saveSchedules(updatedSchedules);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing schedule files. Please check the file format.');
    }
  };

  const handleRemoveSchedule = (id: string) => {
    const updatedSchedules = schedules.filter(s => s.id !== id);
    setSchedules(updatedSchedules);
    
    if (storagePermissionGranted && config.dataConfig.enableLocalStorage) {
      storageManager.saveSchedules(updatedSchedules);
    }
  };

  const handleConfigUpdate = (newConfig: AppConfig) => {
    setConfig(newConfig);
    
    if (storagePermissionGranted && config.dataConfig.enableLocalStorage) {
      storageManager.saveConfig(newConfig);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Course Schedule Analyzer</h1>
        <button 
          className="config-button"
          onClick={() => setShowConfigPanel(!showConfigPanel)}
        >
          ⚙️ Settings
        </button>
      </header>

      {storagePermissionGranted === null && (
        <StoragePermission onPermissionChange={handleStoragePermission} />
      )}

      {showConfigPanel && (
        <ConfigPanel
          config={config}
          onConfigUpdate={handleConfigUpdate}
          onClose={() => setShowConfigPanel(false)}
        />
      )}

      <main className="app-main">
        <FileUpload 
          onFileUpload={handleFileUpload}
          existingSchedules={schedules}
          onRemoveSchedule={handleRemoveSchedule}
        />
        
        {schedules.length > 0 && (
          <ScheduleVisualization
            schedules={schedules}
            config={config.visualConfig}
          />
        )}
      </main>
    </div>
  );
}

export default App;