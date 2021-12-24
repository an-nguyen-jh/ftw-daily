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
import { Button, FieldTextInput, Form, CustomSelectField } from '../../components';
import css from './EditListingFeaturesForm.module.css';
import { composeValidators, required } from '../../util/validators';

const EditListingFeaturesFormComponent = props => {
  const { onSubmit, educationConfig } = props;

  const handleSubmitSubjects = values => {
    let { type, educationLevel, educationClass } = values;
    if (type === educationConfig.EDUCATION_LEVEL) {
      educationClass = '';
    } else {
      educationLevel = '';
    }
    onSubmit({ ...values, educationClass, educationLevel });
  };

  return (
    <FinalForm
      {...props}
      onSubmit={handleSubmitSubjects}
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
        const educationClassOptions = findOptionsForSelectFilter(
          educationConfig.EDUCATION_CLASS,
          filterConfig
        );
        const educationLevelOptions = findOptionsForSelectFilter(
          educationConfig.EDUCATION_LEVEL,
          filterConfig
        );

        const educationTypeLabel = intl.formatMessage({
          id: 'EditListingFeaturesForm.educationTypeLabel',
        });
        const educationTypePlaceholder = intl.formatMessage({
          id: 'EditListingFeaturesForm.educationTypePlaceholder',
        });
        const educationTypeRequired = required(
          intl.formatMessage({
            id: 'EditListingFeaturesForm.educationTypeRequired',
          })
        );

        const handleLevelSelectFieldAppearance = () => {
          switch (values.type) {
            case educationConfig.EDUCATION_LEVEL: {
              const educationLevelLabel = intl.formatMessage({
                id: 'EditListingFeaturesForm.educationLevelLabel',
              });
              const educationLevelPlaceholder = intl.formatMessage({
                id: 'EditListingFeaturesForm.educationLevelPlaceholder',
              });
              const educationLevelRequired = required(
                intl.formatMessage({
                  id: 'EditListingFeaturesForm.educationLevelRequired',
                })
              );
              return (
                <CustomSelectField
                  id={educationConfig.EDUCATION_LEVEL}
                  name={educationConfig.EDUCATION_LEVEL}
                  options={educationLevelOptions}
                  intl={intl}
                  placeholder={educationLevelPlaceholder}
                  label={educationLevelLabel}
                  validate={educationLevelRequired}
                ></CustomSelectField>
              );
            }
            case educationConfig.EDUCATION_CLASS: {
              const educationClassLabel = intl.formatMessage({
                id: 'EditListingFeaturesForm.educationClassLabel',
              });
              const educationClassPlaceholder = intl.formatMessage({
                id: 'EditListingFeaturesForm.educationClassPlaceholder',
              });
              const educationClassRequired = required(
                intl.formatMessage({
                  id: 'EditListingFeaturesForm.educationClassRequired',
                })
              );
              return (
                <CustomSelectField
                  id={educationConfig.EDUCATION_CLASS}
                  name={educationConfig.EDUCATION_CLASS}
                  options={educationClassOptions}
                  intl={intl}
                  placeholder={educationClassPlaceholder}
                  label={educationClassLabel}
                  validate={educationClassRequired}
                ></CustomSelectField>
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

            <CustomSelectField
              id="type"
              name="type"
              options={educationTypeOptions}
              intl={intl}
              placeholder={educationTypePlaceholder}
              label={educationTypeLabel}
              validate={educationTypeRequired}
            ></CustomSelectField>

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
};

EditListingFeaturesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
  educationConfig: config.custom.education,
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
