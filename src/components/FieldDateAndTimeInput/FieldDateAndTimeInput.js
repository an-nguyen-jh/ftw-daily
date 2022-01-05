/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */

import React, { Component } from 'react';
import { bool, func, object, oneOf, string, arrayOf } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { START_DATE, END_DATE } from '../../util/dates';
import { propTypes } from '../../util/types';
import { ValidationError } from '../../components';

import css from './FieldDateAndTimeInput.module.css';
import FieldSelect from '../FieldSelect/FieldSelect';
import FieldDateInput from '../FieldDateInput/FieldDateInput';
import { bookingDateRequired } from '../../util/validators';
import { intlShape } from '../../util/reactIntl';

const MAX_MOBILE_SCREEN_WIDTH = 768;

class FieldDateAndTimeInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.onBookingStartDateChange = this.onBookingStartDateChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (this.props.focusedInput && this.props.focusedInput !== prevProps.focusedInput) {
      this.setState({ focusedInput: this.props.focusedInput });
    }
  }

  handleBlur(focusedInput) {
    this.setState({ focusedInput: null });
    this.props.input.onBlur(focusedInput);
    // Notify the containing component that the focused
    // input has changed.
    if (this.props.onFocusedInputChange) {
      this.props.onFocusedInputChange(null);
    }
  }

  handleFocus(focusedInput) {
    this.setState({ focusedInput });
    this.props.input.onFocus(focusedInput);
  }

  onBookingStartDateChange = value => {
    const { monthlyTimeSlots, timeZone, intl, form } = this.props;
    if (!value || !value.date) {
      form.batch(() => {
        form.change('bookingStartTime', null);
        form.change('bookingEndDate', { date: null });
        form.change('bookingEndTime', null);
      });
      // Reset the currentMonth too if bookingStartDate is cleared
      //this.setState({ currentMonth: getMonthStartInTimeZone(TODAY, timeZone) });

      return;
    }
    console.log(value);

    // This callback function (onBookingStartDateChange) is called from react-dates component.
    // It gets raw value as a param - browser's local time instead of time in listing's timezone.
    // const startDate = timeOfDayFromLocalToTimeZone(value.date, timeZone);
    // const timeSlots = getMonthlyTimeSlots(monthlyTimeSlots, this.state.currentMonth, timeZone);
    // const timeSlotsOnSelectedDate = getTimeSlots(timeSlots, startDate, timeZone);

    // const { startTime, endDate, endTime } = getAllTimeValues(
    //   intl,
    //   timeZone,
    //   timeSlotsOnSelectedDate,
    //   startDate
    // );

    // form.batch(() => {
    //   form.change('bookingStartTime', startTime);
    //   form.change('bookingEndDate', { date: endDate });
    //   form.change('bookingEndTime', endTime);
    // });
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      unitType,
      startDateId,
      startDateLabel,
      endDateId,
      endDateLabel,
      input,
      meta,
      useMobileMargins,
      formId,
      startDateInputProps,
      values,
      intl,
      format,
      timeSlots,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */

    if (startDateLabel && !startDateId) {
      throw new Error('startDateId required when a startDateLabel is given');
    }

    if (endDateLabel && !endDateId) {
      throw new Error('endDateId required when a endDateLabel is given');
    }

    const bookingStartDate =
      values.bookingStartDate && values.bookingStartDate.date ? values.bookingStartDate.date : null;
    const bookingStartTime = values.bookingStartTime ? values.bookingStartTime : null;
    const bookingEndDate =
      values.bookingEndDate && values.bookingEndDate.date ? values.bookingEndDate.date : null;

    const startTimeDisabled = !bookingStartDate;

    const endTimeDisabled = !bookingStartDate || !bookingStartTime || !bookingEndDate;
    // If startDate is valid label changes color and bottom border changes color too
    // const startDateIsValid = value && value.startDate instanceof Date;

    // const startDateBorderClasses = classNames(css.input, {
    //   [css.inputSuccess]: startDateIsValid,
    //   [css.inputError]: touched && !startDateIsValid && typeof error === 'string',
    //   [css.hover]: this.state.focusedInput === START_DATE,
    // });

    // If endDate is valid label changes color and bottom border changes color too
    // const endDateIsValid = value && value.endDate instanceof Date;

    // const endDateBorderClasses = classNames(css.input, {
    //   [css.inputSuccess]: endDateIsValid,
    //   [css.inputError]: touched && !endDateIsValid && typeof error === 'string',
    //   [css.hover]: this.state.focusedInput === END_DATE,
    // });

    // eslint-disable-next-line no-unused-vars
    const { onBlur, onFocus, type, checked, ...restOfInput } = input;
    // const inputProps = {
    //   unitType,
    //   onBlur: this.handleBlur,
    //   onFocus: this.handleFocus,
    //   useMobileMargins,
    //   readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
    //   ...restOfInput,
    //   ...rest,
    //   focusedInput: this.state.focusedInput,
    //   startDateId,
    //   endDateId,
    // };
    const classes = classNames(rootClassName || css.root, className);
    const errorClasses = classNames({ [css.mobileMargins]: useMobileMargins });

    const startTimeLabel = intl.formatMessage({ id: 'FieldDateTimeInput.startTime' });
    const endTimeLabel = intl.formatMessage({ id: 'FieldDateTimeInput.endTime' });
    const placeholderTime = intl.formatTime();
    console.log(values);

    return (
      <div className={classes}>
        <div className={css.formRow}>
          <div className={classNames(css.field, css.startDate)}>
            <FieldDateInput
              className={css.fieldDateInput}
              name="bookingStartDate"
              id={formId ? `${formId}.bookingStartDate` : 'bookingStartDate'}
              label={startDateInputProps.label}
              placeholderText={startDateInputProps.placeholderText}
              format={format}
              timeSlots={timeSlots}
              // isDayBlocked={isDayBlocked}
              onChange={this.onBookingStartDateChange}
              // onPrevMonthClick={() => this.onMonthClick(prevMonthFn)}
              // onNextMonthClick={() => this.onMonthClick(nextMonthFn)}
              // navNext={<Next currentMonth={this.state.currentMonth} timeZone={timeZone} />}
              // navPrev={<Prev currentMonth={this.state.currentMonth} timeZone={timeZone} />}
              useMobileMargins
              showErrorMessage={false}
              validate={bookingDateRequired('Required')}
              // onClose={event =>
              //   this.setState({
              //     currentMonth: getMonthStartInTimeZone(event?.date ?? TODAY, this.props.timeZone),
              //   })
              // }
            />
          </div>
        </div>
        <div className={css.formRow}>
          <div className={css.field}>
            <FieldSelect
              name="bookingStartTime"
              id={formId ? `${formId}.bookingStartTime` : 'bookingStartTime'}
              className={bookingStartDate ? css.fieldSelect : css.fieldSelectDisabled}
              // selectClassName={bookingStartDate ? css.select : css.selectDisabled}
              label={startTimeLabel}
              disabled={startTimeDisabled}
              onChange={this.onBookingStartTimeChange}
            >
              {bookingStartDate ? (
                availableStartTimes.map(p => (
                  <option key={p.timeOfDay} value={p.timestamp}>
                    {p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>{placeholderTime}</option>
              )}
            </FieldSelect>
          </div>

          <div className={bookingStartDate ? css.lineBetween : css.lineBetweenDisabled}>-</div>

          <div className={css.field}>
            <FieldSelect
              name="bookingEndTime"
              id={formId ? `${formId}.bookingEndTime` : 'bookingEndTime'}
              className={bookingStartDate ? css.fieldSelect : css.fieldSelectDisabled}
              // selectClassName={bookingStartDate ? css.select : css.selectDisabled}
              label={endTimeLabel}
              disabled={endTimeDisabled}
            >
              {bookingStartDate && (bookingStartTime || startTime) ? (
                availableEndTimes.map(p => (
                  <option key={p.timeOfDay === '00:00' ? '24:00' : p.timeOfDay} value={p.timestamp}>
                    {p.timeOfDay === '00:00' ? '24:00' : p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>{placeholderTime}</option>
              )}
            </FieldSelect>
          </div>
        </div>
        <div
          className={classNames(css.inputBorders, {
            [css.mobileMargins]: useMobileMargins && !this.state.focusedInput,
          })}
        ></div>
        <ValidationError className={errorClasses} fieldMeta={meta} />
      </div>
    );
  }
}

// FieldDateAndTimeInputComponent.defaultProps = {
//   className: null,
//   rootClassName: null,
//   useMobileMargins: false,
//   endDateId: null,
//   endDateLabel: null,
//   endDatePlaceholderText: null,
//   startDateId: null,
//   startDateLabel: null,
//   startDatePlaceholderText: null,
//   focusedInput: null,
//   onFocusedInputChange: null,
//   timeSlots: null,
// };

// FieldDateAndTimeInputComponent.propTypes = {
//   className: string,
//   rootClassName: string,
//   unitType: propTypes.bookingUnitType.isRequired,
//   useMobileMargins: bool,
//   endDateId: string,
//   endDateLabel: string,
//   endDatePlaceholderText: string,
//   startDateId: string,
//   startDateLabel: string,
//   startDatePlaceholderText: string,
//   timeSlots: arrayOf(propTypes.timeSlot),
//   input: object.isRequired,
//   meta: object.isRequired,
//   focusedInput: oneOf([START_DATE, END_DATE]),
//   onFocusedInputChange: func,
//   // from injectIntl
//   intl: intlShape.isRequired,
// };

const FieldDateAndTimeInput = props => {
  return <Field component={FieldDateAndTimeInputComponent} {...props} />;
};

export default FieldDateAndTimeInput;
