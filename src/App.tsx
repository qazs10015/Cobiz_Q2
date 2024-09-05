import React, { useEffect, useReducer } from 'react';
import './App.scss';
import { IDay } from './interfaces/IDay';
import { dateFns } from './utility/DateUtility';
import { useCalendar } from './hooks/useCalendar';

type ACTIONTYPE =
  | { type: 'pre' }
  | { type: 'next' }
  | { type: 'range', payload: Date };

function reducer(state: { month: number, range: Date[] }, action: ACTIONTYPE) {
  switch (action.type) {
    case 'pre':
      if (state.month === 1) return { ...state, month: 1 };
      return { ...state, month: state.month - 1 };
    case 'next':
      if (state.month === 12) return { ...state, month: 12 };
      return { ...state, month: state.month + 1 };
    case 'range':
      if (state.range.length >= 2) return { ...state, range: [action.payload] };
      return { ...state, range: state.range.concat(action.payload) };
    default:
      throw new Error();
  }
}
// 日曆的 Header 元件
const CalendarHeader: React.FC<{ currentMonth: number, dispatch: React.Dispatch<ACTIONTYPE> }> = React.memo(({ currentMonth, dispatch }) => {
  return (
    <div className='calendarHeader'>
      <a className='prev' onClick={() => dispatch({ type: 'pre' })}>▼</a>
      <strong>{currentMonth} 月</strong>
      <a className='next' onClick={() => dispatch({ type: 'next' })}>▼</a>
    </div>
  );
})

// 日期元件
const DayItem: React.FC<{ day: IDay, dispatch: React.Dispatch<ACTIONTYPE>, isBetween: boolean }> = React.memo(({ day, dispatch, isBetween }) => {

  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (isBetween) ref.current?.classList.add('selected');
    else ref.current?.classList.remove('selected');

    if (day.isToday) ref.current?.classList.add('today');
    else ref.current?.classList.remove('today');

    if (day.isOutOfMonth) ref.current?.classList.add('canNotSelect');
    else ref.current?.classList.remove('canNotSelect');
  }, [day.isOutOfMonth, day.isToday, ref, isBetween]);

  const handleClick = () => {
    ref.current?.classList.toggle('selected');
    dispatch({ type: 'range', payload: day.date });
  }

  return (
    <div ref={ref} className='day' onClick={handleClick}>
      {new Date(day.date).getDate()}
    </div>
  );
})

const App: React.FC = () => {
  const { year, month } = dateFns.getCurrentDate();
  const [state, dispatch] = useReducer(reducer, { month, range: [] });

  const { preMonthDates, currentMonthDates, nextMonthDates } = useCalendar(year, state.month);

  const isBetween = (day: IDay) => {
    if (state.range.length === 2) {

      return new Date(state.range[0]).getTime() <= new Date(day.date).getTime() && new Date(day.date).getTime() <= new Date(state.range[1]).getTime();
    }
    return false;
  }


  return (
    <section className='calendarContainer'>
      <h1>React Calendar</h1>
      <div>
        <CalendarHeader currentMonth={state.month} dispatch={dispatch} />
        <div className='calendarBody'>
          {[...preMonthDates, ...currentMonthDates, ...nextMonthDates].map((day, index) => (
            <DayItem key={index} day={day} dispatch={dispatch} isBetween={isBetween(day)} />
          ))}
        </div>
      </div>
      <pre>{JSON.stringify(state.range)}</pre>
    </section>
  );
}

export default App;