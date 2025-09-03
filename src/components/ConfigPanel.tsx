import React, { useState } from 'react';
import { AppConfig } from '../types';
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
          <h3>Settings</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="config-content">
          <div className="config-section">
            <h4>Visual Settings</h4>
            
            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.showWeekends}
                  onChange={(e) => updateVisualConfig('showWeekends', e.target.checked)}
                />
                Show weekends
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.gridLines}
                  onChange={(e) => updateVisualConfig('gridLines', e.target.checked)}
                />
                Show grid lines
              </label>
            </div>

            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.visualConfig.showTimeLabels}
                  onChange={(e) => updateVisualConfig('showTimeLabels', e.target.checked)}
                />
                Show time labels
              </label>
            </div>

            <div className="config-item">
              <label>
                Time format:
                <select
                  value={localConfig.visualConfig.timeFormat}
                  onChange={(e) => updateVisualConfig('timeFormat', e.target.value)}
                >
                  <option value="24h">24 hour</option>
                  <option value="12h">12 hour</option>
                </select>
              </label>
            </div>

            <div className="config-item">
              <label>
                Free time highlight color:
                <input
                  type="color"
                  value={localConfig.visualConfig.highlightColor}
                  onChange={(e) => updateVisualConfig('highlightColor', e.target.value)}
                />
              </label>
            </div>

            <div className="config-item">
              <label>
                Free time opacity: {Math.round(localConfig.visualConfig.freeTimeOpacity * 100)}%
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
            <h4>Data Settings</h4>
            
            <div className="config-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localConfig.dataConfig.autoSave}
                  onChange={(e) => updateDataConfig('autoSave', e.target.checked)}
                />
                Auto-save changes
              </label>
            </div>

            <div className="config-item">
              <label>
                Max stored schedules:
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
            Cancel
          </button>
          <button className="button primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};