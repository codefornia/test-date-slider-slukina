import { ChangeEvent, JSX } from 'react';
import './date-form.scss';
import { datesType } from './types';

type DateFormProps = {
  dates: datesType;
  setDates: (dates: datesType) => void;
  setIsVisiblyForm: (isVisibly: boolean) => void;
};

export default function DateForm({ dates, setDates, setIsVisiblyForm }: DateFormProps): JSX.Element {
  const { dateStart, datePeriodStart, datePeriodFinish, dateFinish } = dates;

  const onButtonClick = (): void => {
    const roundedDateStart: string = dateStart.toString().substring(0, 8) + '01';
    const finishDate: Date = new Date(dateFinish);
    const lastDayOfMonth: number = new Date(finishDate.getFullYear(), finishDate.getMonth() + 1, 0).getDate();
    const roundedDateFinish: string = dateFinish.substring(0, 8) + lastDayOfMonth.toString();
    const isCondition =
      roundedDateStart < datePeriodStart && datePeriodStart < datePeriodFinish && datePeriodFinish < roundedDateFinish;

    if (!isCondition) {
      alert(
        'ОШИБКА! Убедитесь что даты верны: дата начала диапазон раньше даты окончания диапазон, а выбранный период входит в выбранный диапазон.'
      );
      return;
    }

    setDates({
      dateStart: roundedDateStart,
      dateFinish: roundedDateFinish,
      datePeriodStart: datePeriodStart,
      datePeriodFinish: datePeriodFinish,
    });
    setIsVisiblyForm(false);
  };

  return (
    <div className="date-form">
      <ul className="date-form_ul">
        <li className="date-form_li">
          <label htmlFor="data-start">Начало диапазона:</label>
          <input
            type="date"
            id="data-start"
            name="data-start"
            value={dateStart}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setDates({ ...dates, dateStart: event.target.value })}
          />
        </li>
        <li className="date-form_li">
          <label htmlFor="data-finish">Конец диапазона:</label>
          <input
            type="date"
            id="data-finish"
            name="data-finish"
            value={dateFinish}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setDates({ ...dates, dateFinish: event.target.value })}
          />
        </li>
        <li className="date-form_li">
          <label htmlFor="data-period-start">Начало выделенного периода:</label>
          <input
            type="date"
            id="data-period-start"
            name="data-period-start"
            value={datePeriodStart}
            onChange={(event) => setDates({ ...dates, datePeriodStart: event.target.value })}
          />
        </li>
        <li className="date-form_li">
          <label htmlFor="data-period-finish">Окончание выделенного периода:</label>
          <input
            type="date"
            id="data-period-finish"
            name="data-period-finish"
            value={datePeriodFinish}
            onChange={(event) => setDates({ ...dates, datePeriodFinish: event.target.value })}
          />
        </li>
      </ul>
      <button className="date-form_button" onClick={onButtonClick}>
        ОТОБРАЗИТЬ КОМПОНЕНТ
      </button>
    </div>
  );
}
