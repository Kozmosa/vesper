import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppConfig, ColorScheme } from '../types';
import { getAvailableColorSchemes } from '../utils/ColorSchemeManager';
import './ConfigPanel.css';

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
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.showWeekends}
                  onChange={(e) => updateVisualConfig('showWeekends', e.target.checked)}
                />
                {t('configPanel.showWeekends')}
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.gridLines}
                  onChange={(e) => updateVisualConfig('gridLines', e.target.checked)}
                />
                {t('configPanel.showGridLines')}
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.showTimeLabels}
                  onChange={(e) => updateVisualConfig('showTimeLabels', e.target.checked)}
                />
                {t('configPanel.showTimeLabels')}
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.timeFormat')}:
                <select
                  value={localConfig.visualConfig.timeFormat}
                  onChange={(e) => updateVisualConfig('timeFormat', e.target.value as '12h' | '24h')}
                >
                  <option value="24h">{t('configPanel.timeFormat24h')}</option>
                  <option value="12h">{t('configPanel.timeFormat12h')}</option>
                </select>
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.colorScheme')}:
                <select
                  value={localConfig.visualConfig.colorScheme}
                  onChange={(e) => updateVisualConfig('colorScheme', e.target.value as ColorScheme)}
                >
                  {getAvailableColorSchemes().map(scheme => (
                    <option key={scheme.id} value={scheme.id}>
                      {t(`configPanel.colorSchemes.${scheme.id}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.highlightColor')}:
                <input
                  type="color"
                  value={localConfig.visualConfig.highlightColor}
                  onChange={(e) => updateVisualConfig('highlightColor', e.target.value)}
                />
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.freeTimeOpacity')}: {Math.round(localConfig.visualConfig.freeTimeOpacity * 100)}%
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={localConfig.visualConfig.freeTimeOpacity}
                  onChange={(e) => updateVisualConfig('freeTimeOpacity', parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div className="config-section">
            <h4>{t('configPanel.dataSettings')}</h4>
            
            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.dataConfig.autoSave}
                  onChange={(e) => updateDataConfig('autoSave', e.target.checked)}
                />
                {t('configPanel.autoSave')}
              </label>
            </div>

            <div className="config-item">
              <label>
                {t('configPanel.maxStoredSchedules')}:
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={localConfig.dataConfig.maxStoredSchedules}
                  onChange={(e) => updateDataConfig('maxStoredSchedules', parseInt(e.target.value))}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="config-actions">
          <button className="button secondary" onClick={onClose}>
            {t('configPanel.cancel')}
          </button>
          <button className="button primary" onClick={handleSave}>
            {t('configPanel.save')}
          </button>
        </div>
      </div>
    </div>
  );
};