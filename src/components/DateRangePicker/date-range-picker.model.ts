const onDateRangeChanged = (range: { startDate: Date; endDate: Date }) => {
  console.log(
    'No function assigned to DateRangePickerModel.onDateRangeChanged',
  );
};

class DateRangePickerModel {
  startDate?: Date;
  endDate?: Date;
  isResponsive?: boolean;
  onDateRangeChanged?: (range: { startDate: Date; endDate: Date }) => void;

  constructor(props: DateRangePickerModel) {
    return {
      startDate: props.startDate || new Date(),
      endDate: props.endDate || new Date(),
      isResponsive: !!props.isResponsive,
      onDateRangeChanged: props.onDateRangeChanged || onDateRangeChanged,
    };
  }
}

export default DateRangePickerModel;
