import React, { Component } from 'react';
import { string, bool, arrayOf, array, func } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import moment from 'moment';
import config from '../../config';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { dateTimeFromSpecificMoment } from '../../util/dates';
import { propTypes } from '../../util/types';
import { Form, IconSpinner, PrimaryButton, FieldDateAndTimeInput } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

import css from './BookingDatesForm.module.css';

const CLASS_DURATION = 8; //hours

const generateStartTimeAndEndTimeOfClass = (startDate, startHour, classDuration, breakTime) => {
  if (!startDate) {
    return {};
  }
  const startTime = dateTimeFromSpecificMoment(startDate, 0, startHour);
  const endTime = dateTimeFromSpecificMoment(startDate, 0, startHour + classDuration + breakTime);
  return startTime && endTime ? { startTime, endTime } : {};
};

export class BookingDatesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { startTime: null, endTime: null, startDate: null, endDate: null };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values) {
    const { startTime, endTime, startDate, endDate } = this.state;
    const updatedValues = {
      startDate,
      startTime,
      endTime,
      endDate,
    };
    this.props.onSubmit(updatedValues);
  }
  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(form, formValues) {
    const { startDate, startHour } = formValues.values ? formValues.values : {};
    const { listingId, isOwnListing, onFetchTransactionLineItems } = this.props;
    const { startTime, endTime } = generateStartTimeAndEndTimeOfClass(
      startDate?.date,
      parseInt(startHour),
      CLASS_DURATION,
      0
    );

    const endTimeOfClass = endTime && endTime.clone().format('HH:mm');
    if (startHour && endTimeOfClass !== 'Invalid date') {
      form.change('endTime', endTimeOfClass);
    }

    if (startHour && startTime && endTime && !this.props.fetchLineItemsInProgress) {
      const endDate = dateTimeFromSpecificMoment(startDate.date, 1, 0).toDate();
      const bookingStartDate = moment(startDate.date)
        .startOf('day')
        .toDate();
      //time object in UTC format for Estimated breakdown

      onFetchTransactionLineItems({
        bookingData: { startDate: bookingStartDate, endDate }, //from Moment to Date object
        listingId,
        isOwnListing,
      });
      this.setState({
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        endDate: endDate,
        startDate: bookingStartDate,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            startDatePlaceholder,
            formId,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitType,
            values,
            timeSlots,
            fetchTimeSlotsError,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
            form,
          } = fieldRenderProps;
          const { startTime, endTime, startDate, endDate } = this.state;

          const bookingStartLabel = intl.formatMessage({
            id: 'BookingDatesForm.bookingStartTitle',
          });

          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.timeSlotsError" />
            </p>
          ) : null;

          const startTimeInputProps = {
            label: intl.formatMessage({ id: 'BookingDatesForm.startTime' }),
            requiredMessage: intl.formatMessage({ id: 'BookingDatesForm.startTimeRequired' }),
          };
          const endTimeInputProps = {
            label: intl.formatMessage({ id: 'BookingDatesForm.endTime' }),
            requiredMessage: intl.formatMessage({ id: 'BookingDatesForm.endTimeRequired' }),
            placeholder: intl.formatMessage({ id: 'BookingDatesForm.endTimePlaceholder' }),
          };
          // This is the place to collect breakdown estimation data.
          // Note: lineItems are calculated and fetched from FTW backend
          // so we need to pass only booking data that is needed otherwise
          // If you have added new fields to the form that will affect to pricing,
          // you need to add the values to handleOnChange function
          const bookingData =
            startDate && endTime && startTime && endDate
              ? {
                  unitType,
                  startDate,
                  startTime,
                  endDate,
                  endTime,
                }
              : null;

          const showEstimatedBreakdown =
            bookingData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;
          //customer start booking from tomorrow
          const fixedTimeSlots = timeSlots && timeSlots.slice(1);

          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} lineItems={lineItems} />
            </div>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.fetchLineItemsError" />
            </span>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const tomorrow = moment()
            .startOf('day')
            .add(1, 'days')
            .toDate();
          const startDatePlaceholderText =
            startDatePlaceholder || intl.formatDate(tomorrow, dateFormatOptions);

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          const startDateInputProps = {
            label: bookingStartLabel,
            placeholderText: startDatePlaceholderText,
            requiredMessage: intl.formatMessage({
              id: 'BookingDatesForm.startDateRequiredMessage',
            }),
          };

          const inputProps = { startDateInputProps, startTimeInputProps, endTimeInputProps };
          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              {timeSlotsError}
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(form, values);
                }}
              />

              <FieldDateAndTimeInput
                {...inputProps}
                formId={formId}
                className={css.bookingDate}
                name="bookingDate"
                intl={intl}
                unitType={unitType}
                values={values}
                timeSlots={fixedTimeSlots}
                useMobileMargins
                form={form}
                disabled={fetchLineItemsInProgress}
              />

              {bookingInfoMaybe}
              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}

              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingDatesForm.ownListing'
                      : 'BookingDatesForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingDatesForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingDatesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingDatesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingDatesForm = compose(injectIntl)(BookingDatesFormComponent);
BookingDatesForm.displayName = 'BookingDatesForm';

export default BookingDatesForm;
