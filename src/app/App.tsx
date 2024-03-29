import { useState } from 'react';
import './App.scss';
import RangeSlider from '../components/rangeSlider/range-slider';
import DateForm from '../components/dateForm/date-form';

function App() {
  const [isVisiblyForm, setIsVisiblyForm] = useState<boolean>(true);
  const [dates, setDates] = useState({
    dateStart: '2022-02-20',
    datePeriodStart: '2022-04-20',
    datePeriodFinish: '2023-05-18',
    dateFinish: '2024-05-18',
  });

  return (
    <div className="app">
      {!!isVisiblyForm && <DateForm setDates={setDates} dates={dates} setIsVisiblyForm={setIsVisiblyForm} />}
      {!isVisiblyForm && (
        <RangeSlider
          dateStart={new Date(dates.dateStart)}
          dateFinish={new Date(dates.dateFinish)}
          datePeriodStart={new Date(dates.datePeriodStart)}
          datePeriodFinish={new Date(dates.datePeriodFinish)}
        />
      )}
    </div>
  );
}

export default App;
