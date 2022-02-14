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
import { START_DATE, END_DATE, dateTimeFromSpecificMoment } from '../../util/dates';
import { propTypes } from '../../util/types';
import { ValidationError } from '../../components';

import css from './FieldDateAndTimeInput.module.css';
import FieldSelect from '../FieldSelect/FieldSelect';
import FieldDateInput from '../FieldDateInput/FieldDateInput';
import { bookingDateRequired, required } from '../../util/validators';
import FieldTextInput from '../FieldTextInput/FieldTextInput';

const MAX_MOBILE_SCREEN_WIDTH = 768;

const availableStartTimes = [
  { timeOfDay: '06:00', startHour: 6 },
  { timeOfDay: '07:00', startHour: 7 },
  { timeOfDay: '08:00', startHour: 8 },
];

class FieldDateAndTimeInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      meta,
      useMobileMargins,
      values,
      timeSlots,
      startDateInputProps,
      startTimeInputProps,
      endTimeInputProps,
    } = this.props;
    /* eslint-disable no-unused-vars */

    const bookingStartDate = values && values.startDate ? values.startDate : null;

    const startTimeDisabled = !bookingStartDate;

    const classes = classNames(rootClassName || css.root, className);
    const errorClasses = classNames({ [css.mobileMargins]: useMobileMargins });

    return (
      <div className={classes}>
        <div className={css.formRow}>
          <div className={classNames(css.field, css.startDate)}>
            <FieldDateInput
              className={css.fieldDateInput}
              name="startDate"
              id="startDate"
              label={startDateInputProps.label}
              placeholderText={startDateInputProps.placeholderText}
              format={v => (v && v.date ? { date: v.date } : v)}
              parse={v => (v && v.date ? { date: v.date } : v)}
              timeSlots={timeSlots}
              useMobileMargins
              showErrorMessage={true}
              validate={bookingDateRequired(startDateInputProps.requiredMessage)}
              showErrorMessage={false}
            />
          </div>
        </div>
        <div className={classNames(css.formRow, css.zIndex1)}>
          <div className={css.field}>
            <FieldSelect
              name="startHour"
              id="startHour"
              className={bookingStartDate ? css.fieldSelect : css.fieldSelectDisabled}
              selectClassName={bookingStartDate ? css.select : css.selectDisabled}
              label={startTimeInputProps.label}
              disabled={startTimeDisabled}
              validate={required(startTimeInputProps.requiredMessage)}
              showErrorMessage={false}
            >
              {bookingStartDate ? (
                availableStartTimes.map(p => (
                  <option key={p.timeOfDay} value={p.startHour}>
                    {p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>{availableStartTimes[0].timeOfDay}</option>
              )}
            </FieldSelect>
          </div>

          <div className={bookingStartDate ? css.lineBetween : css.lineBetweenDisabled}>-</div>

          <div className={css.field}>
            <FieldTextInput
              id="endTime"
              name="endTime"
              type="text"
              readOnly
              disabled
              label={endTimeInputProps.label}
              placeholder={endTimeInputProps.placeholder}
              validate={required(endTimeInputProps.requiredMessage)}
              showErrorMessage={false}
            />
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

FieldDateAndTimeInputComponent.defaultProps = {
  className: null,
  rootClassName: null,
  useMobileMargins: false,
  values: null,
  timeSlots: null,
};

FieldDateAndTimeInputComponent.propTypes = {
  className: string,
  rootClassName: string,
  unitType: propTypes.bookingUnitType.isRequired,
  useMobileMargins: bool,
  timeSlots: arrayOf(propTypes.timeSlot),
  input: object.isRequired,
  meta: object.isRequired,
  startDateInputProps: object.isRequired,
  endTimeInputProps: object.isRequired,
  startTimeInputProps: object.isRequired,
};

const FieldDateAndTimeInput = props => {
  return <Field component={FieldDateAndTimeInputComponent} {...props} />;
};

export default FieldDateAndTimeInput;
