import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './components/FileUpload';
import { ScheduleVisualization } from './components/ScheduleVisualization';
import { StoragePermission } from './components/StoragePermission';
import { ConfigPanel } from './components/ConfigPanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ScheduleProcessor } from './utils/ScheduleProcessor';
import { StorageManager } from './utils/StorageManager';
import { AppConfig, ProcessedSchedule, RawScheduleData } from './types';
import './App.css';

// 初始化i18n
import './i18n/config';

// 引入Ant Design组件
import { Button, Switch, ColorPicker, Slider, Select, InputNumber } from 'antd';
import type { SliderSingleProps } from 'antd';

const defaultConfig: AppConfig = {
  visualConfig: {
    showWeekends: true,
    timeFormat: '24h',
    highlightColor: '#4CAF50',
    freeTimeOpacity: 0.3,
    gridLines: true,
    showTimeLabels: true,
    colorScheme: 'original'
  },
  dataConfig: {
    enableLocalStorage: false,
    autoSave: true,
    maxStoredSchedules: 10
  }
};

function App() {
  const { t } = useTranslation();
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
        const processed = processor.processSchedule(rawData, file.name, config.visualConfig.colorScheme);
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
      alert(t('fileUpload.supportedFormats'));
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
    // 如果配色方案更改，需要重新处理所有课程数据
    if (newConfig.visualConfig.colorScheme !== config.visualConfig.colorScheme) {
      const updatedSchedules = schedules.map(schedule => {
        // 检查原始数据是否存在
        if (!schedule.rawData) {
          console.error('原始数据不存在:', schedule);
          return schedule; // 如果没有原始数据，返回原计划
        }
        
        try {
          // 使用原始数据重新处理课表以应用新的配色方案
          return processor.processSchedule(schedule.rawData, schedule.fileName, newConfig.visualConfig.colorScheme);
        } catch (error) {
          console.error('重新处理课表时出错:', error);
          return schedule; // 如果处理失败，返回原计划
        }
      });
      
      setSchedules(updatedSchedules);
    }
    
    setConfig(newConfig);
    
    if (storagePermissionGranted && config.dataConfig.enableLocalStorage) {
      storageManager.saveConfig(newConfig);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <div className="header-controls">
          <LanguageSwitcher />
          <button 
            className="config-button"
            onClick={() => setShowConfigPanel(!showConfigPanel)}
          >
            ⚙️ {t('app.settings')}
          </button>
        </div>
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