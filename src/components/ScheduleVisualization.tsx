import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessedSchedule, VisualConfig, FreeTimeIntersection } from '../types';
import { ScheduleProcessor } from '../utils/ScheduleProcessor';
import { WeeklyView } from './WeeklyView';
import './ScheduleVisualization.css';

interface ScheduleVisualizationProps {
  schedules: ProcessedSchedule[];
  config: VisualConfig;
}

export const ScheduleVisualization: React.FC<ScheduleVisualizationProps> = ({
  schedules,
  config
}) => {
  const { t } = useTranslation();
  const processor = new ScheduleProcessor();

  const { freeTimeIntersections, visualizationBounds } = useMemo(() => {
    const freeTimeIntersections = processor.calculateFreeTimeIntersections(schedules);
    const visualizationBounds = processor.calculateVisualizationBounds(schedules);
    
    return { freeTimeIntersections, visualizationBounds };
  }, [schedules]);

  if (schedules.length === 0) {
    return (
      <div className="visualization-empty">
        <p>{t('scheduleVisualization.uploadPrompt')}</p>
      </div>
    );
  }

  return (
    <div className="schedule-visualization">
      <div className="visualization-header">
        <h2>{t('scheduleVisualization.title')}</h2>
        <div className="analysis-summary">
          <div className="summary-item">
            <span className="label">{t('scheduleVisualization.schedules')}:</span>
            <span className="value">{schedules.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">{t('scheduleVisualization.freePeriods')}:</span>
            <span className="value">
              {freeTimeIntersections.reduce((total, day) => total + day.timeRanges.length, 0)}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">{t('scheduleVisualization.timeRange')}:</span>
            <span className="value">
              {visualizationBounds.earliestStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {visualizationBounds.latestEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <WeeklyView
        schedules={schedules}
        freeTimeIntersections={freeTimeIntersections}
        bounds={visualizationBounds}
        config={config}
      />

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color occupied"></div>
          <span>{t('scheduleVisualization.occupiedTime')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color free" style={{ backgroundColor: config.highlightColor, opacity: config.freeTimeOpacity }}></div>
          <span>{t('scheduleVisualization.freeTime')}</span>
        </div>
      </div>
    </div>
  );
};