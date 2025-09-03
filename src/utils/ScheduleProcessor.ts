import { 
  RawScheduleData, 
  ProcessedSchedule, 
  ProcessedTimeSlot, 
  ProcessedCourse,
  ProcessedScheduleEntry,
  WeeklySchedule,
  DaySchedule,
  TimeRange,
  FreeTimeIntersection,
  VisualizationBounds,
  ColorScheme
} from '../types';
import { getColorForCourse } from './ColorSchemeManager';

export class ScheduleProcessor {
  
  parseRawData(content: string): RawScheduleData {
    const lines = content.trim().split('\n');
    
    if (lines.length < 4) {
      throw new Error('Invalid file format: Expected at least 4 lines');
    }

    try {
      const timeConfig = JSON.parse(lines[0]);
      const timeSlots = JSON.parse(lines[1]);
      const tableConfig = JSON.parse(lines[2]);
      const courses = JSON.parse(lines[3]);
      const scheduleEntries = lines.length > 4 ? JSON.parse(lines[4]) : [];

      return {
        timeConfig,
        timeSlots,
        tableConfig,
        courses,
        scheduleEntries
      };
    } catch (error) {
      throw new Error('Invalid JSON format in schedule file');
    }
  }

  processSchedule(rawData: RawScheduleData, fileName: string, colorScheme: ColorScheme = 'original'): ProcessedSchedule {
    const id = this.generateId();
    const startDate = new Date(rawData.tableConfig.startDate);
    
    // Process time slots
    const timeSlots = this.processTimeSlots(rawData.timeSlots);
    
    // Process courses and schedule entries
    const { courses, scheduleEntries } = this.processCoursesAndEntries(
      rawData.courses,
      rawData.scheduleEntries,
      timeSlots,
      colorScheme
    );

    // Build weekly schedule
    const weeklySchedule = this.buildWeeklySchedule(scheduleEntries, timeSlots);

    return {
      id,
      fileName,
      tableName: rawData.tableConfig.tableName,
      startDate,
      timeSlots,
      courses,
      scheduleEntries,
      weeklySchedule,
      rawData // 保存原始数据
    };
  }

  private processTimeSlots(rawTimeSlots: any[]): ProcessedTimeSlot[] {
    return rawTimeSlots
      .filter(slot => slot.startTime !== "00:00" || slot.endTime !== "00:00")
      .map(slot => {
        const startTime = this.parseTime(slot.startTime);
        const endTime = this.parseTime(slot.endTime);
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        return {
          node: slot.node,
          startTime,
          endTime,
          duration
        };
      });
  }

  private processCoursesAndEntries(
    rawCourses: any[],
    rawEntries: any[],
    timeSlots: ProcessedTimeSlot[],
    colorScheme: ColorScheme
  ) {
    const scheduleEntries: ProcessedScheduleEntry[] = [];
    
    // Process schedule entries first
    rawEntries.forEach(entry => {
      const course = rawCourses.find(c => c.id === entry.id);
      if (!course) return;

      const startSlot = timeSlots.find(ts => ts.node === entry.startNode);
      const endSlot = timeSlots.find(ts => ts.node === entry.startNode + entry.step - 1);
      
      if (!startSlot || !endSlot) return;

      const weeks = this.generateWeekRange(entry.startWeek, entry.endWeek);

      // 使用配色方案获取课程颜色
      const courseColor = colorScheme === 'original' ? course.color : getColorForCourse(course.courseName, colorScheme);

      scheduleEntries.push({
        id: this.generateId(),
        courseId: course.id,
        courseName: course.courseName,
        day: entry.day,
        startNode: entry.startNode,
        endNode: entry.startNode + entry.step - 1,
        startTime: startSlot.startTime,
        endTime: endSlot.endTime,
        room: entry.room,
        teacher: entry.teacher,
        weeks,
        color: courseColor
      });
    });

    // Group schedule entries by course
    const courses: ProcessedCourse[] = rawCourses.map(course => ({
      ...course,
      scheduleEntries: scheduleEntries.filter(entry => entry.courseId === course.id)
    }));

    return { courses, scheduleEntries };
  }

  private buildWeeklySchedule(
    scheduleEntries: ProcessedScheduleEntry[],
    timeSlots: ProcessedTimeSlot[]
  ): WeeklySchedule {
    const weeklySchedule: WeeklySchedule = {};

    for (let day = 1; day <= 7; day++) {
      const dayEntries = scheduleEntries.filter(entry => entry.day === day);
      const freeSlots = this.calculateFreeSlots(dayEntries, timeSlots);

      weeklySchedule[day] = {
        day,
        entries: dayEntries,
        freeSlots
      };
    }

    return weeklySchedule;
  }

  private calculateFreeSlots(
    dayEntries: ProcessedScheduleEntry[],
    timeSlots: ProcessedTimeSlot[]
  ): TimeRange[] {
    if (timeSlots.length === 0) return [];

    const occupiedRanges = dayEntries
      .map(entry => ({
        startNode: entry.startNode,
        endNode: entry.endNode,
        startTime: entry.startTime,
        endTime: entry.endTime
      }))
      .sort((a, b) => a.startNode - b.startNode);

    const freeSlots: TimeRange[] = [];
    let currentNode = timeSlots[0].node;

    for (const occupied of occupiedRanges) {
      if (currentNode < occupied.startNode) {
        const startSlot = timeSlots.find(ts => ts.node === currentNode);
        const endSlot = timeSlots.find(ts => ts.node === occupied.startNode - 1);
        
        if (startSlot && endSlot) {
          freeSlots.push({
            startNode: currentNode,
            endNode: occupied.startNode - 1,
            startTime: startSlot.startTime,
            endTime: endSlot.endTime
          });
        }
      }
      currentNode = Math.max(currentNode, occupied.endNode + 1);
    }

    // Add final free slot if needed
    const lastSlot = timeSlots[timeSlots.length - 1];
    if (currentNode <= lastSlot.node) {
      const startSlot = timeSlots.find(ts => ts.node === currentNode);
      if (startSlot) {
        freeSlots.push({
          startNode: currentNode,
          endNode: lastSlot.node,
          startTime: startSlot.startTime,
          endTime: lastSlot.endTime
        });
      }
    }

    return freeSlots;
  }

  calculateFreeTimeIntersections(schedules: ProcessedSchedule[]): FreeTimeIntersection[] {
    if (schedules.length === 0) return [];

    const intersections: FreeTimeIntersection[] = [];

    for (let day = 1; day <= 7; day++) {
      const dayFreeSlots = schedules.map(schedule => 
        schedule.weeklySchedule[day]?.freeSlots || []
      );

      const intersectedRanges = this.intersectTimeRanges(dayFreeSlots);
      
      if (intersectedRanges.length > 0) {
        intersections.push({
          day,
          timeRanges: intersectedRanges
        });
      }
    }

    return intersections;
  }

  private intersectTimeRanges(allDayFreeSlots: TimeRange[][]): TimeRange[] {
    if (allDayFreeSlots.length === 0) return [];
    if (allDayFreeSlots.some(slots => slots.length === 0)) return [];

    let intersectedRanges = allDayFreeSlots[0];

    for (let i = 1; i < allDayFreeSlots.length; i++) {
      intersectedRanges = this.intersectTwoRangeSets(intersectedRanges, allDayFreeSlots[i]);
    }

    return intersectedRanges;
  }

  private intersectTwoRangeSets(ranges1: TimeRange[], ranges2: TimeRange[]): TimeRange[] {
    const intersections: TimeRange[] = [];

    for (const range1 of ranges1) {
      for (const range2 of ranges2) {
        const intersection = this.intersectTwoRanges(range1, range2);
        if (intersection) {
          intersections.push(intersection);
        }
      }
    }

    return intersections;
  }

  private intersectTwoRanges(range1: TimeRange, range2: TimeRange): TimeRange | null {
    const startTime = new Date(Math.max(range1.startTime.getTime(), range2.startTime.getTime()));
    const endTime = new Date(Math.min(range1.endTime.getTime(), range2.endTime.getTime()));

    if (startTime >= endTime) return null;

    return {
      startTime,
      endTime,
      startNode: Math.max(range1.startNode, range2.startNode),
      endNode: Math.min(range1.endNode, range2.endNode)
    };
  }

  calculateVisualizationBounds(schedules: ProcessedSchedule[]): VisualizationBounds {
    if (schedules.length === 0) {
      const defaultStart = new Date();
      defaultStart.setHours(8, 0, 0, 0);
      const defaultEnd = new Date();
      defaultEnd.setHours(18, 0, 0, 0);
      
      return {
        earliestStart: defaultStart,
        latestEnd: defaultEnd,
        totalMinutes: 600 // 10 hours
      };
    }

    let earliestStart = new Date('2099-12-31T23:59:59');
    let latestEnd = new Date('1900-01-01T00:00:00');

    schedules.forEach(schedule => {
      schedule.timeSlots.forEach(slot => {
        if (slot.startTime < earliestStart) {
          earliestStart = new Date(slot.startTime);
        }
        if (slot.endTime > latestEnd) {
          latestEnd = new Date(slot.endTime);
        }
      });
    });

    // 应用时间范围限制：早于8点的起始时间fallback到8点，晚于23点的结束时间fallback到23点
    const fallbackStart = new Date(earliestStart);
    fallbackStart.setHours(8, 0, 0, 0);
    
    const fallbackEnd = new Date(latestEnd);
    fallbackEnd.setHours(23, 0, 0, 0);
    
    // 如果计算出的起始时间早于8点，则使用8点作为起始时间
    if (earliestStart < fallbackStart) {
      earliestStart = fallbackStart;
    }
    
    // 如果计算出的结束时间晚于23点，则使用23点作为结束时间
    if (latestEnd > fallbackEnd) {
      latestEnd = fallbackEnd;
    }

    const totalMinutes = (latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60);

    return {
      earliestStart,
      latestEnd,
      totalMinutes
    };
  }

  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private generateWeekRange(startWeek: number, endWeek: number): number[] {
    const weeks = [];
    for (let week = startWeek; week <= endWeek; week++) {
      weeks.push(week);
    }
    return weeks;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}