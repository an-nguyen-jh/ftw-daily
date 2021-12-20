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

const EDUCATION_LEVEL = 'educationLevel';
const EDUCATION_CLASS = 'educationClass';

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
        values,
        invalid,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

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

      const educationTypeOptions = findOptionsForSelectFilter('educationType', filterConfig);
      const educationClassOptions = findOptionsForSelectFilter(EDUCATION_CLASS, filterConfig);
      const educationLevelOptions = findOptionsForSelectFilter(EDUCATION_LEVEL, filterConfig);

      const educationTypeLabel = 'EditListingFeaturesForm.educationTypeLabel';
      const educationTypePlaceholder = 'EditListingFeaturesForm.educationTypePlaceholder';

      const handleLevelSelectFieldAppearance = () => {
        switch (values.type) {
          case EDUCATION_LEVEL: {
            return (
              <CustomEducationSelectField
                id={EDUCATION_LEVEL}
                name={EDUCATION_LEVEL}
                options={educationLevelOptions}
                intl={intl}
                placeholderId={`EditListingFeaturesForm.educationLevelPlaceholder`}
                labelId={`EditListingFeaturesForm.educationLevelLabel`}
                requiredId={`EditListingFeaturesForm.educationLevelRequired`}
              ></CustomEducationSelectField>
            );
          }
          case EDUCATION_CLASS: {
            return (
              <CustomEducationSelectField
                id={EDUCATION_CLASS}
                name={EDUCATION_CLASS}
                options={educationClassOptions}
                intl={intl}
                placeholderId={`EditListingFeaturesForm.educationClassPlaceholder`}
                labelId={`EditListingFeaturesForm.educationClassLabel`}
                requiredId={`EditListingFeaturesForm.educationClassRequired`}
              ></CustomEducationSelectField>
            );
          }
          default:
            return null;
        }
      };

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
            requiredId={`EditListingFeaturesForm.educationTypeRequired`}
          ></CustomEducationSelectField>

          {handleLevelSelectFieldAppearance()}

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
