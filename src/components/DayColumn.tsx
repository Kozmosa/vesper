import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessedSchedule, VisualConfig, TimeRange, VisualizationBounds } from '../types';
import { mergeOverlappingCourses, getMergedBlockDisplayName, getMergedBlockDisplayRoom, getMergedBlockColor } from '../utils/CourseMerger';
import './DayColumn.css';

interface DayColumnProps {
  day: number;
  schedules: ProcessedSchedule[];
  freeTimeRanges: TimeRange[];
  bounds: VisualizationBounds;
  config: VisualConfig;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  schedules,
  freeTimeRanges,
  bounds,
  config
}) => {
  const { t } = useTranslation();
  const calculatePosition = (time: Date) => {
    const offsetMinutes = (time.getTime() - bounds.earliestStart.getTime()) / (1000 * 60);
    return (offsetMinutes / bounds.totalMinutes) * 100;
  };

  const calculateHeight = (startTime: Date, endTime: Date) => {
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return (durationMinutes / bounds.totalMinutes) * 100;
  };

  // Get all occupied slots for this day across all schedules
  const allOccupiedSlots = schedules.flatMap(schedule => 
    schedule.weeklySchedule[day]?.entries || []
  );

  // 合并重叠的课程块
  const mergedCourseBlocks = mergeOverlappingCourses(allOccupiedSlots);

  return (
    <div className="day-column">
      <div className="day-content">
        {config.gridLines && (
          <div className="grid-lines">
            {Array.from({ length: Math.ceil(bounds.totalMinutes / 60) }, (_, i) => (
              <div 
                key={i} 
                className="grid-line"
                style={{ top: `${(i * 60 / bounds.totalMinutes) * 100}%` }}
              />
            ))}
          </div>
        )}

        {/* Render merged occupied time blocks */}
        {mergedCourseBlocks.map((block, index) => {
          const displayName = getMergedBlockDisplayName(block);
          const displayRoom = getMergedBlockDisplayRoom(block);
          const blockColor = getMergedBlockColor(block);
          
          return (
            <div
              key={`merged-${index}`}
              className="occupied-block"
              style={{
                top: `${calculatePosition(block.startTime)}%`,
                height: `${calculateHeight(block.startTime, block.endTime)}%`,
                backgroundColor: blockColor,
              }}
              title={block.courses.length === 1 ? `${displayName}\n${displayRoom}` : displayName}
            >
              <div className="course-name">{displayName}</div>
              {block.courses.length === 1 && (
                <div className="course-details">
                  <div className="room">{displayRoom}</div>
                </div>
              )}
            </div>
          );
        })}

        {/* Render free time intersections */}
        {freeTimeRanges.map((range, index) => (
          <div
            key={`free-${index}`}
            className="free-block"
            style={{
              top: `${calculatePosition(range.startTime)}%`,
              height: `${calculateHeight(range.startTime, range.endTime)}%`,
              backgroundColor: config.highlightColor,
              opacity: config.freeTimeOpacity,
            }}
            title={`${t('dayColumn.freeTime')}: ${range.startTime.toLocaleTimeString()} - ${range.endTime.toLocaleTimeString()}`}
          >
            <div className="free-label">{t('dayColumn.free')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};