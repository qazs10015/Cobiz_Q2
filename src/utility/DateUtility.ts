// 日期工具函數
export const dateFns = {
  // 取得指定年月的天數
  getDaysInMonth: (year: number, month: number) => new Date(year, month, 0).getDate(),
  // 取得指定年月的第一天是星期幾
  getFirstDayIndex: (year: number, month: number) => new Date(`${year}/${month}/01`).getDay(),
  // 取得指定年月的最後一天是星期幾
  getLastDayIndex: (year: number, month: number) => new Date(`${year}/${month}/${dateFns.getDaysInMonth(year, month)}`).getDay(),
  // 取得當前日期
  getCurrentDate: () => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, date: now.getDate() };
  },
  // 判斷兩個日期是否相同
  isSameDate: (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  },
};
