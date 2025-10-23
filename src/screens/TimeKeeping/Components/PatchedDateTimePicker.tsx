import React from 'react';
import DateTimePicker, {
  DateTimePickerProps,
} from 'react-native-ui-datepicker';
import CalendarHeader from 'react-native-ui-datepicker/src/components/CalendarHeader';
import dayjs from 'dayjs';

interface PatchedDateTimePickerProps extends DateTimePickerProps {
  onMonthChange?: (date: { month: number; year: number }) => void;
}

const PatchedDateTimePicker: React.FC<PatchedDateTimePickerProps> = ({
  onMonthChange,
  ...rest
}) => {
  const CustomHeader: React.FC<any> = (props) => {
    const { onPrev, onNext, month: currentMonth, year: currentYear } = props;

    const handlePrev = () => {
      onPrev?.();
      const newDate = dayjs(new Date(currentYear, currentMonth, 1)).subtract(
        1,
        'month',
      );
      onMonthChange?.({ month: newDate.month(), year: newDate.year() });
    };

    const handleNext = () => {
      onNext?.();
      const newDate = dayjs(new Date(currentYear, currentMonth, 1)).add(
        1,
        'month',
      );
      onMonthChange?.({ month: newDate.month(), year: newDate.year() });
    };

    return (
      <CalendarHeader {...props} onPrev={handlePrev} onNext={handleNext} />
    );
  };

  return (
    <DateTimePicker {...rest} components={{ CalendarHeader: CustomHeader }} />
  );
};

export default PatchedDateTimePicker;
