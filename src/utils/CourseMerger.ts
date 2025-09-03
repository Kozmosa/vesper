import { ProcessedScheduleEntry } from "../types";

// 定义合并后的课程块接口
export interface MergedCourseBlock {
  startTime: Date;
  endTime: Date;
  courses: ProcessedScheduleEntry[];
}

// 检查两个时间范围是否重叠
function timeRangesOverlap(range1: { startTime: Date; endTime: Date }, range2: { startTime: Date; endTime: Date }): boolean {
  return range1.startTime < range2.endTime && range2.startTime < range1.endTime;
}

// 合并重叠的课程块
export function mergeOverlappingCourses(courses: ProcessedScheduleEntry[]): MergedCourseBlock[] {
  if (courses.length === 0) return [];

  // 按开始时间排序
  const sortedCourses = [...courses].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const mergedBlocks: MergedCourseBlock[] = [];
  let currentBlock: MergedCourseBlock | null = null;

  for (const course of sortedCourses) {
    if (currentBlock === null) {
      // 创建第一个块
      currentBlock = {
        startTime: new Date(course.startTime),
        endTime: new Date(course.endTime),
        courses: [course]
      };
    } else {
      // 检查当前课程是否与当前块重叠
      if (timeRangesOverlap(currentBlock, course)) {
        // 合并到当前块
        currentBlock.courses.push(course);
        // 更新块的时间范围
        if (course.startTime < currentBlock.startTime) {
          currentBlock.startTime = new Date(course.startTime);
        }
        if (course.endTime > currentBlock.endTime) {
          currentBlock.endTime = new Date(course.endTime);
        }
      } else {
        // 保存当前块并开始新块
        mergedBlocks.push(currentBlock);
        currentBlock = {
          startTime: new Date(course.startTime),
          endTime: new Date(course.endTime),
          courses: [course]
        };
      }
    }
  }

  // 添加最后一个块
  if (currentBlock !== null) {
    mergedBlocks.push(currentBlock);
  }

  return mergedBlocks;
}

// 获取合并块的显示名称
export function getMergedBlockDisplayName(block: MergedCourseBlock): string {
  if (block.courses.length === 1) {
    return block.courses[0].courseName;
  }
  
  // 对于多个课程，显示所有课程名称（去重）
  const courseNames = block.courses.map(course => course.courseName);
  const uniqueCourseNames = Array.from(new Set(courseNames));
  return uniqueCourseNames.join(', ');
}

// 获取合并块的显示地点（对于合并块不显示地点）
export function getMergedBlockDisplayRoom(block: MergedCourseBlock): string {
  if (block.courses.length === 1) {
    return block.courses[0].room;
  }
  
  // 对于多个课程的合并块，不显示地点
  return "";
}

// 获取合并块的颜色（使用第一个课程的颜色）
export function getMergedBlockColor(block: MergedCourseBlock): string {
  return block.courses[0].color;
}