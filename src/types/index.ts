// Raw data types from the schedule file format
export interface TimeConfig {
  courseLen: number;
  id: number;
  name: string;
  sameBreakLen: boolean;
  sameLen: boolean;
  theBreakLen: number;
}

export interface TimeSlot {
  endTime: string;
  node: number;
  startTime: string;
  timeTable: number;
}

export interface CourseTableConfig {
  background: string;
  courseTextColor: number;
  id: number;
  itemAlpha: number;
  itemHeight: number;
  itemTextSize: number;
  maxWeek: number;
  nodes: number;
  showOtherWeekCourse: boolean;
  showSat: boolean;
  showSun: boolean;
  showTime: boolean;
  startDate: string;
  strokeColor: number;
  sundayFirst: boolean;
  tableName: string;
  textColor: number;
  timeTable: number;
  type: number;
  widgetCourseTextColor: number;
  widgetItemAlpha: number;
  widgetItemHeight: number;
  widgetItemTextSize: number;
  widgetStrokeColor: number;
  widgetTextColor: number;
}

export interface Course {
  color: string;
  courseName: string;
  credit: number;
  id: number;
  note: string;
  tableId: number;
}

export interface ScheduleEntry {
  day: number; // 1-7 (Monday-Sunday)
  endTime: string;
  endWeek: number;
  id: number;
  level: number;
  ownTime: boolean;
  room: string;
  startNode: number;
  startTime: string;
  startWeek: number;
  step: number; // duration in nodes
  tableId: number;
  teacher: string;
  type: number;
}

export interface RawScheduleData {
  timeConfig: TimeConfig;
  timeSlots: TimeSlot[];
  tableConfig: CourseTableConfig;
  courses: Course[];
  scheduleEntries: ScheduleEntry[];
}

// Processed data types
export interface ProcessedTimeSlot {
  node: number;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
}

export interface ProcessedCourse extends Course {
  scheduleEntries: ProcessedScheduleEntry[];
}

export interface ProcessedScheduleEntry {
  id: string;
  courseId: number;
  courseName: string;
  day: number;
  startNode: number;
  endNode: number;
  startTime: Date;
  endTime: Date;
  room: string;
  teacher: string;
  weeks: number[];
  color: string;
}

export interface ProcessedSchedule {
  id: string;
  fileName: string;
  tableName: string;
  startDate: Date;
  timeSlots: ProcessedTimeSlot[];
  courses: ProcessedCourse[];
  scheduleEntries: ProcessedScheduleEntry[];
  weeklySchedule: WeeklySchedule;
}

export interface WeeklySchedule {
  [day: number]: DaySchedule; // 1-7
}

export interface DaySchedule {
  day: number;
  entries: ProcessedScheduleEntry[];
  freeSlots: TimeRange[];
}

export interface TimeRange {
  startTime: Date;
  endTime: Date;
  startNode: number;
  endNode: number;
}

export interface FreeTimeIntersection {
  day: number;
  timeRanges: TimeRange[];
}

// Configuration types
export interface VisualConfig {
  showWeekends: boolean;
  timeFormat: '12h' | '24h';
  highlightColor: string;
  freeTimeOpacity: number;
  gridLines: boolean;
  showTimeLabels: boolean;
}

export interface DataConfig {
  enableLocalStorage: boolean;
  autoSave: boolean;
  maxStoredSchedules: number;
}

export interface AppConfig {
  visualConfig: VisualConfig;
  dataConfig: DataConfig;
}

// UI types
export interface VisualizationBounds {
  earliestStart: Date;
  latestEnd: Date;
  totalMinutes: number;
}