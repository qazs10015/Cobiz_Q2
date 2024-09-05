import { useMemo } from 'react';
import { IDay } from '../interfaces/IDay';
import { dateFns } from '../utility/DateUtility';

// 計算日期資料
export const useCalendar = (year: number, month: number) => {
  return useMemo(() => {
    // 今天日期
    const currentDate = dateFns.getCurrentDate();
    // 本月有幾天
    const daysInMonth = dateFns.getDaysInMonth(year, month);
    // 本月第一天是星期幾
    const firstDayIndex = dateFns.getFirstDayIndex(year, month);
    // 本月最後一天是星期幾
    const lastDayIndex = dateFns.getLastDayIndex(year, month);
    // 上個月的天數
    const preMonthDays = dateFns.getDaysInMonth(year, month - 1);

    // 上個月的剩餘日期
    const preMonthDates: IDay[] = Array.from({ length: firstDayIndex }, (_, i) => ({
      date: new Date(`${year}/${month}/${preMonthDays - firstDayIndex + i + 1}`),
      isOutOfMonth: true,
    }));

    // 本月的日期
    const currentMonthDates: IDay[] = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(`${year}/${month}/${i + 1}`),
      isToday: dateFns.isSameDate(new Date(`${year}/${month}/${i + 1}`), new Date()),
      isOutOfMonth: false,
    }));

    // 下個月的剩餘日期

    const nextMonthDates: IDay[] = Array.from({ length: 6 - lastDayIndex }, (_, i) => {
      if (month === 12) {
        return {
          date: new Date(`${year + 1}/1/${i + 1}`),
          isOutOfMonth: true,
        };
      }
      return {
        date: new Date(`${year}/${month + 1}/${i + 1}`),
        isOutOfMonth: true,
      };
    });

    return { preMonthDates, currentMonthDates, nextMonthDates, currentDate };
  }, [year, month]);
};
