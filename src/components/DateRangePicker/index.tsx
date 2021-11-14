import classes from './date-range-picker.module.css';
import { DateRangePicker as Picker } from 'react-date-range';
import { useEffect, useState } from 'react';
import DateRangePickerModel from './date-range-picker.model';
import moment from 'moment';

const DateRangePicker = (props: DateRangePickerModel) => {
  const [propState, setPropState] = useState<DateRangePickerModel>({});

  useEffect(() => {
    setPropState(new DateRangePickerModel(props));
  }, [props]);

  const handleSelect = (ranges: {
    selection: { startDate: Date; endDate: Date };
  }) => {
    setPropState({
      ...propState,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
    props.onDateRangeChanged({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  return (
    <div
      className={`${classes['date-range-picker']} ${
        propState.isResponsive ? 'responsive-date-picker' : ''
      }`}
    >
      <Picker
        ranges={[{ ...propState, key: 'selection' }]}
        onChange={handleSelect}
      />
    </div>
  );
};

export default DateRangePicker;
