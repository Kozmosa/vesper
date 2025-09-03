import React, { useMemo } from 'react';
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
  const processor = new ScheduleProcessor();

  const { freeTimeIntersections, visualizationBounds } = useMemo(() => {
    const freeTimeIntersections = processor.calculateFreeTimeIntersections(schedules);
    const visualizationBounds = processor.calculateVisualizationBounds(schedules);
    
    return { freeTimeIntersections, visualizationBounds };
  }, [schedules]);

  if (schedules.length === 0) {
    return (
      <div className="visualization-empty">
        <p>Upload schedule files to see the visualization</p>
      </div>
    );
  }

  return (
    <div className="schedule-visualization">
      <div className="visualization-header">
        <h2>Weekly Schedule Analysis</h2>
        <div className="analysis-summary">
          <div className="summary-item">
            <span className="label">Schedules:</span>
            <span className="value">{schedules.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Free Time Periods:</span>
            <span className="value">
              {freeTimeIntersections.reduce((total, day) => total + day.timeRanges.length, 0)}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Time Range:</span>
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
          <span>Occupied Time</span>
        </div>
        <div className="legend-item">
          <div className="legend-color free" style={{ backgroundColor: config.highlightColor, opacity: config.freeTimeOpacity }}></div>
          <span>Free Time (All Schedules)</span>
        </div>
      </div>
    </div>
  );
};