import { ChangeEvent, JSX, MutableRefObject, useEffect, useRef, useState } from 'react';
import { months } from './const';
import { arrPointType, sliderValueType } from './types';
import './range-slider.scss';

type RangeSliderProps = {
  dateStart: Date;
  dateFinish: Date;
  datePeriodStart: Date;
  datePeriodFinish: Date;
};

export default function RangeSlider({
  dateStart,
  dateFinish,
  datePeriodStart,
  datePeriodFinish,
}: RangeSliderProps): JSX.Element {
  const sliderStart = useRef<HTMLInputElement | null>(null);
  const sliderFinish = useRef<HTMLInputElement | null>(null);
  const range1 = useRef<HTMLInputElement | null>(null);
  const range2 = useRef<HTMLInputElement | null>(null);
  const sliderTrack = useRef<HTMLDivElement | null>(null);
  const divValueStart = useRef<HTMLDivElement | null>(null);
  const divValueFinish = useRef<HTMLDivElement | null>(null);
  const sliderScale = useRef<HTMLDivElement | null>(null);

  const [sliderView, setSliderView] = useState<string>('years');

  const [sliderStartValue, setSliderStartValue] = useState<sliderValueType>({
    month: datePeriodStart.getMonth(),
    year: datePeriodStart.getFullYear(),
    time: datePeriodStart.getTime(),
  });

  const [sliderFinishValue, setSliderFinishValue] = useState<sliderValueType>({
    month: datePeriodFinish.getMonth(),
    year: datePeriodFinish.getFullYear(),
    time: datePeriodFinish.getTime(),
  });

  function fillColor(percent1: number, percent2: number): void {
    sliderTrack.current?.style.setProperty(
      'background',
      `linear-gradient(to right, #EDF1F8 ${percent1}% , #5CADEA ${percent1}% , #5CADEA ${percent2}%, #EDF1F8 ${percent2}%)`
    );
  }

  function moveValueTultip(tultip: MutableRefObject<HTMLDivElement | null>, percent: number): void {
    const sliderSize = (20 * percent) / 100;
    tultip.current?.style.setProperty('left', `calc(${percent}% - ${sliderSize}px`);
  }
  const dateStartTime: number = dateStart.getTime();
  const dateFinishTime: number = dateFinish.getTime();
  const rangeLength: number = dateFinishTime - dateStartTime;
  let percentStart: number = ((sliderStartValue.time - dateStartTime) / rangeLength) * 100;
  let percentFinish: number = ((sliderFinishValue.time - dateStartTime) / rangeLength) * 100;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(+event.target.value);
    if (event.target.id === 'slider-1') {
      setSliderStartValue({
        month: date.getMonth(),
        year: date.getFullYear(),
        time: +event.target.value,
      });
      percentStart = Math.round(((+event.target.value - dateStartTime) / rangeLength) * 100);
      percentFinish = ((sliderFinishValue.time - dateStartTime) / rangeLength) * 100;
      moveValueTultip(divValueStart, percentStart);
    } else {
      setSliderFinishValue({
        month: date.getMonth(),
        year: date.getFullYear(),
        time: +event.target.value,
      });
      percentStart = ((sliderStartValue.time - dateStartTime) / rangeLength) * 100;
      percentFinish = ((+event.target.value - dateStartTime) / rangeLength) * 100;
      moveValueTultip(divValueFinish, percentFinish);
    }
    fillColor(percentStart, percentFinish);
  };

  const arrPoint: arrPointType[] = [];
  let year: number = dateStart.getFullYear();
  let month: number = dateStart.getMonth();
  while (year <= dateFinish.getFullYear()) {
    while (year === dateFinish.getFullYear() ? month <= dateFinish.getMonth() : month < 12) {
      arrPoint.push({
        yearPoint: year,
        monthPoint: month,
        labelPoint: month === 0 ? year.toString() : months[month].toString().toLowerCase().slice(0, 3),
      });
      month++;
    }
    month = 0;
    year++;
  }

  useEffect(() => {
    fillColor(percentStart, percentFinish);
    moveValueTultip(divValueStart, percentStart);
    moveValueTultip(divValueFinish, percentFinish);
  }, []);

  return (
    <div className="slider">
      <div className="slider_buttons">
        <button
          onClick={() => setSliderView('years')}
          className={`slider_button ${sliderView === 'years' ? 'slider_button--active' : ''}`}
        >
          Все года
        </button>
        <button
          onClick={() => setSliderView('months')}
          className={`slider_button ${sliderView === 'months' ? 'slider_button--active' : ''}`}
        >
          Все месяца
        </button>
      </div>
      <div className="slider_wrapper">
        <div className="slider_container">
          <div className="slider_track" ref={sliderTrack}></div>
          <input
            ref={sliderStart}
            type="range"
            min={dateStartTime}
            max={dateFinishTime}
            value={sliderStartValue.time}
            id="slider-1"
            onChange={handleChange}
          />
          <div>
            <div className="slider_tooltip slider_tooltip--start" ref={divValueStart}>
              <p ref={range1} id="range1">
                {months[sliderStartValue.month]}
                <br />
                {sliderStartValue.year}
              </p>
            </div>
          </div>
          <input
            ref={sliderFinish}
            type="range"
            min={dateStartTime}
            max={dateFinishTime}
            value={sliderFinishValue.time}
            id="slider-2"
            onChange={handleChange}
          />
          <div className="slider_tooltip slider_tooltip--finish" ref={divValueFinish}>
            <p ref={range2} id="range2">
              {months[sliderFinishValue.month]}
              <br />
              {sliderFinishValue.year}
            </p>
          </div>
        </div>
        <div ref={sliderScale} className="slider_scale">
          {arrPoint.map((point) => {
            const isHidden = sliderView === 'years' && point.labelPoint.toString() !== point.yearPoint.toString();
            const isSecondColor = sliderView === 'months' && point.labelPoint.toString() === point.yearPoint.toString();
            const classes = `${isHidden ? 'scale_point--hidden' : ''} ${isSecondColor ? 'scale_point--second-color' : ''} scale_point`;
            return (
              <p key={point.yearPoint + point.monthPoint.toString()} className={classes}>
                {point.labelPoint}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
