import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { compose } from 'redux';
import { findOptionsForSelectFilter } from '../../util/search';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Button, FieldTextInput, Form } from '../../components';
import CustomEducationSelectField from './CustomEducationSelectField.js';
import css from './EditListingFeaturesForm.module.css';
import { composeValidators, required } from '../../util/validators';

const EditListingFeaturesFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        name,
        rootClassName,
        className,
        intl,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = disabled || submitInProgress;

      const subjectNameMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.title' });
      const subjectNamePlaceholderMessage = intl.formatMessage({
        id: 'EditListingFeaturesForm.subjectNamePlaceholder',
      });
      const subjectNameRequiredMessage = intl.formatMessage({
        id: 'EditListingFeaturesForm.subjectNameRequired',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.showListingFailed" />
        </p>
      ) : null;

      const educationTypeOptions = findOptionsForSelectFilter(
        'educationType',
        config.custom.filters
      );

      const educationClassOptions = findOptionsForSelectFilter('educationClass', filterConfig);
      const educationStageOptions = findOptionsForSelectFilter('educationStage', filterConfig);

      const educationTypeLabel = 'EditListingFeaturesForm.educationTypeLabel';
      const educationTypePlaceholder = 'EditListingFeaturesForm.educationTypePlaceholder';
      const educationTypeRequired = 'EditListingFeaturesForm.educationTypeRequired';

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}

          <FieldTextInput
            id="name"
            name="name"
            className={css.features}
            type="text"
            label={subjectNameMessage}
            placeholder={subjectNamePlaceholderMessage}
            validate={composeValidators(required(subjectNameRequiredMessage))}
            autoFocus
          />

          <CustomEducationSelectField
            id="type"
            name="type"
            options={educationTypeOptions}
            intl={intl}
            placeholderId={educationTypePlaceholder}
            labelId={educationTypeLabel}
            requiredId={educationTypeRequired}
          ></CustomEducationSelectField>
          {/* <CustomEducationSelectField></CustomEducationSelectField>
          <CustomEducationSelectField></CustomEducationSelectField> */}

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingFeaturesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingFeaturesFormComponent.propTypes = {
  rootClassName: string,
  intl: intlShape.isRequired,
  className: string,
  name: string.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
};

const EditListingFeaturesForm = EditListingFeaturesFormComponent;

export default compose(injectIntl)(EditListingFeaturesForm);
