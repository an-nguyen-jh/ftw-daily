import React from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import moment from 'moment';
import { LINE_ITEM_NIGHT, DATE_TYPE_DATE, propTypes } from '../../util/types';
import { dateFromAPIToLocalNoon } from '../../util/dates';

import css from './BookingBreakdown.module.css';

const BookingPeriod = props => {
  const { startTime, endTime } = props;

  const timeFormatOptions = {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  };

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSection}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingStart" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={startTime} {...timeFormatOptions} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={startTime} {...dateFormatOptions} />
          </div>
        </div>

        <div className={css.bookingPeriodSectionRigth}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingEnd" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={endTime} {...timeFormatOptions} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={endTime} {...dateFormatOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

const LineItemBookingPeriod = props => {
  const { booking, unitType, dateType } = props;

  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { startTime, endTime, displayStart, displayEnd } = booking.attributes;
  const localStartTime = displayStart || startTime;
  const localEndTime = displayEnd || endTime;

  return (
    <>
      <div className={css.lineItem}>
        <BookingPeriod startTime={localStartTime} endTime={localEndTime} />
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};
LineItemBookingPeriod.defaultProps = { dateType: null };

LineItemBookingPeriod.propTypes = {
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,
};

export default LineItemBookingPeriod;
