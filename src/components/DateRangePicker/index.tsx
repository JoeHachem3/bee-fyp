import classes from './date-range-picker.module.css';
import { DateRangePicker as Picker } from 'react-date-range';
import DateRangePickerModel from './date-range-picker.model';

const DateRangePicker = (props: DateRangePickerModel) => {
  props = new DateRangePickerModel(props);

  const handleSelect = (ranges: {
    selection: { startDate: Date; endDate: Date };
  }) => {
    props = {
      ...props,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    };
    props.onDateRangeChanged({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  return (
    <div
      className={`${classes['date-range-picker']} ${
        props.isResponsive ? 'responsive-date-picker' : ''
      }`}
    >
      <Picker
        ranges={[{ ...props, key: 'selection' }]}
        onChange={handleSelect}
      />
    </div>
  );
};

export default DateRangePicker;
