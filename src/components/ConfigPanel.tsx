import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppConfig, ColorScheme } from '../types';
import { getAvailableColorSchemes } from '../utils/ColorSchemeManager';
import './ConfigPanel.css';

// 引入Ant Design组件
import { Switch, ColorPicker, Slider, Select, InputNumber, Button } from 'antd';
import type { SliderSingleProps } from 'antd';

interface ConfigPanelProps {
  config: AppConfig;
  onConfigUpdate: (config: AppConfig) => void;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigUpdate,
  onClose
}) => {
  const { t } = useTranslation();
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  const handleSave = () => {
    onConfigUpdate(localConfig);
    onClose();
  };

  const updateVisualConfig = (key: keyof typeof localConfig.visualConfig, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      visualConfig: {
        ...prev.visualConfig,
        [key]: value
      }
    }));
  };

  const updateDataConfig = (key: keyof typeof localConfig.dataConfig, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      dataConfig: {
        ...prev.dataConfig,
        [key]: value
      }
    }));
  };

  // Slider marks for free time opacity
  const opacityMarks: SliderSingleProps['marks'] = {
    0.1: '10%',
    0.5: '50%',
    1: '100%'
  };

  return (
    <div className="config-panel-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="config-panel">
        <div className="config-header">
          <h3>{t('configPanel.title')}</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="config-content">
          <div className="config-section">
            <h4>{t('configPanel.visualSettings')}</h4>
            
            <div className="config-item">
              <label className="checkbox-label">
                <Switch
                  checked={localConfig.visualConfig.showWeekends}
                  onChange={(checked) => updateVisualConfig('showWeekends', checked)}
                />
                {t('configPanel.showWeekends')}
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <Switch
                  checked={localConfig.visualConfig.gridLines}
                  onChange={(checked) => updateVisualConfig('gridLines', checked)}
                />
                {t('configPanel.showGridLines')}
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <Switch
                  checked={localConfig.visualConfig.showTimeLabels}
                  onChange={(checked) => updateVisualConfig('showTimeLabels', checked)}
                />
                {t('configPanel.showTimeLabels')}
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.timeFormat')}:
                <Select
                  value={localConfig.visualConfig.timeFormat}
                  onChange={(value) => updateVisualConfig('timeFormat', value)}
                  style={{ width: 120 }}
                >
                  <Select.Option value="24h">{t('configPanel.timeFormat24h')}</Select.Option>
                  <Select.Option value="12h">{t('configPanel.timeFormat12h')}</Select.Option>
                </Select>
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.colorScheme')}:
                <Select
                  value={localConfig.visualConfig.colorScheme}
                  onChange={(value) => updateVisualConfig('colorScheme', value)}
                  style={{ width: 120 }}
                >
                  {getAvailableColorSchemes().map(scheme => (
                    <Select.Option key={scheme.id} value={scheme.id}>
                      {t(`configPanel.colorSchemes.${scheme.id}`)}
                    </Select.Option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.highlightColor')}:
                <ColorPicker
                  value={localConfig.visualConfig.highlightColor}
                  onChange={(value) => updateVisualConfig('highlightColor', value.toHexString())}
                />
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.freeTimeOpacity')}: {Math.round(localConfig.visualConfig.freeTimeOpacity * 100)}%
                <Slider
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={localConfig.visualConfig.freeTimeOpacity}
                  onChange={(value) => updateVisualConfig('freeTimeOpacity', value)}
                  marks={opacityMarks}
                />
              </label>
            </div>
          </div>

          <div className="config-section">
            <h4>{t('configPanel.dataSettings')}</h4>
            
            <div className="config-item">
              <label className="checkbox-label">
                <Switch
                  checked={localConfig.dataConfig.autoSave}
                  onChange={(checked) => updateDataConfig('autoSave', checked)}
                />
                {t('configPanel.autoSave')}
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.maxStoredSchedules')}:
                <InputNumber
                  min={1}
                  max={50}
                  value={localConfig.dataConfig.maxStoredSchedules}
                  onChange={(value) => updateDataConfig('maxStoredSchedules', value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="config-actions">
          <Button onClick={onClose}>
            {t('configPanel.cancel')}
          </Button>
          <Button type="primary" onClick={handleSave}>
            {t('configPanel.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};