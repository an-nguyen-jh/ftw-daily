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
import { START_DATE, END_DATE, createDateWithSpecificTime } from '../../util/dates';
import { propTypes } from '../../util/types';
import { ValidationError } from '../../components';

import css from './FieldDateAndTimeInput.module.css';
import FieldSelect from '../FieldSelect/FieldSelect';
import FieldDateInput from '../FieldDateInput/FieldDateInput';
import { bookingDateRequired, required } from '../../util/validators';
import { intlShape } from '../../util/reactIntl';
import FieldTextInput from '../FieldTextInput/FieldTextInput';

const MAX_MOBILE_SCREEN_WIDTH = 768;

const availableStartTimes = [
  { timeOfDay: '06:00', timestamp: createDateWithSpecificTime(1, 6) },
  { timeOfDay: '07:00', timestamp: createDateWithSpecificTime(1, 7) },
  { timeOfDay: '08:00', timestamp: createDateWithSpecificTime(1, 8) },
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
      startDateId,
      startDateLabel,
      endDateId,
      endDateLabel,
      meta,
      useMobileMargins,
      startDateInputProps,
      values,
      intl,
      timeSlots,
    } = this.props;
    /* eslint-disable no-unused-vars */

    if (startDateLabel && !startDateId) {
      throw new Error('startDateId required when a startDateLabel is given');
    }

    if (endDateLabel && !endDateId) {
      throw new Error('endDateId required when a endDateLabel is given');
    }

    const bookingStartDate = values && values.startDate ? values.startDate : null;

    const startTimeDisabled = !bookingStartDate;

    const classes = classNames(rootClassName || css.root, className);
    const errorClasses = classNames({ [css.mobileMargins]: useMobileMargins });

    const startTimeLabel = intl.formatMessage({ id: 'FieldDateTimeInput.startTime' });
    const endTimeLabel = intl.formatMessage({ id: 'FieldDateTimeInput.endTime' });

    return (
      <div className={classes}>
        <div className={css.formRow}>
          <div className={classNames(css.field, css.startDate)}>
            <FieldDateInput
              className={css.fieldDateInput}
              name="startDate"
              id={'bookingDate.startDate'}
              label={startDateInputProps.label}
              placeholderText={startDateInputProps.placeholderText}
              format={v => (v && v.date ? { date: v.date } : v)}
              parse={v => (v && v.date ? { date: v.date } : v)}
              timeSlots={timeSlots}
              useMobileMargins
              showErrorMessage={false}
              validate={bookingDateRequired('Required')}
            />
          </div>
        </div>
        <div className={classNames(css.formRow, css.zIndex1)}>
          <div className={css.field}>
            <FieldSelect
              name="bookingStartTime"
              id="bookingStartTime"
              className={bookingStartDate ? css.fieldSelect : css.fieldSelectDisabled}
              selectClassName={bookingStartDate ? css.select : css.selectDisabled}
              label={startTimeLabel}
              disabled={startTimeDisabled}
            >
              {bookingStartDate ? (
                availableStartTimes.map(p => (
                  <option key={p.timeOfDay} value={p.timestamp}>
                    {p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>06:00</option>
              )}
            </FieldSelect>
          </div>

          <div className={bookingStartDate ? css.lineBetween : css.lineBetweenDisabled}>-</div>

          <div className={css.field}>
            <FieldTextInput
              id="bookingEndTime"
              name="bookingEndTime"
              type="text"
              readOnly
              disabled
              label={endTimeLabel}
              placeholder={'15:00'}
              validate={required('required')}
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
