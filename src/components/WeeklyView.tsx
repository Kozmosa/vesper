import React from 'react';
import { ProcessedSchedule, VisualConfig, FreeTimeIntersection, VisualizationBounds } from '../types';
import { DayColumn } from './DayColumn';
import './WeeklyView.css';

interface WeeklyViewProps {
  schedules: ProcessedSchedule[];
  freeTimeIntersections: FreeTimeIntersection[];
  bounds: VisualizationBounds;
  config: VisualConfig;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  schedules,
  freeTimeIntersections,
  bounds,
  config
}) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysToShow = config.showWeekends ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

  const generateTimeLabels = () => {
    const labels = [];
    const currentTime = new Date(bounds.earliestStart);
    const endTime = new Date(bounds.latestEnd);

    while (currentTime <= endTime) {
      labels.push(new Date(currentTime));
      currentTime.setHours(currentTime.getHours() + 1);
    }

    return labels;
  };

  const timeLabels = generateTimeLabels();

  return (
    <div className="weekly-view">
      <div className="weekly-grid">
        {config.showTimeLabels && (
          <div className="time-labels">
            <div className="time-label-header"></div>
            {timeLabels.map((time, index) => {
              const position = ((time.getTime() - bounds.earliestStart.getTime()) / (1000 * 60)) / bounds.totalMinutes * 100;
              return (
                <div
                  key={index}
                  className="time-label"
                  style={{ top: `${position}%` }}
                >
                  {time.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: config.timeFormat === '12h'
                  })}
                </div>
              );
            })}
          </div>
        )}

        <div className="days-container">
          <div className="day-headers">
            {daysToShow.map(dayNumber => (
              <div key={dayNumber} className="day-header">
                {dayNames[dayNumber - 1]}
              </div>
            ))}
          </div>

          <div className="day-columns">
            {daysToShow.map(dayNumber => {
              const dayFreeTime = freeTimeIntersections.find(f => f.day === dayNumber);
              
              return (
                <DayColumn
                  key={dayNumber}
                  day={dayNumber}
                  schedules={schedules}
                  freeTimeRanges={dayFreeTime?.timeRanges || []}
                  bounds={bounds}
                  config={config}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};