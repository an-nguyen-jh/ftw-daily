import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';

import css from './ListingPage.module.css';
import config from '../../config';

const SectionEducationsMaybe = props => {
  const { options, publicData, filterConfig, educationConfig } = props;
  if (!publicData) {
    return null;
  }
  const isSubjectExists = publicData && publicData.subjects;

  const subjectsName = isSubjectExists && publicData.subjects.name;
  const selectedOption =
    isSubjectExists && publicData.subjects.type ? publicData.subjects.type : '';

  const findOptionLabel = (options, key) => {
    const cat = options.find(option => option.key === key);
    return cat ? cat.label : key;
  };

  const selectedOptionLabel = findOptionLabel(options, selectedOption);
  const selectedSubOption = isSubjectExists
    ? publicData.subjects.educationLevel
      ? publicData.subjects.educationLevel
      : publicData.subjects.educationClass
    : '';

  const subOptions = findOptionsForSelectFilter(selectedOption, filterConfig);

  const selectedSubOptionLabel = findOptionLabel(subOptions, selectedSubOption);
  let subOptionTitleId = '';

  switch (selectedOption) {
    case educationConfig.EDUCATION_CLASS:
      subOptionTitleId = 'ListingPage.educationClass';
      break;
    case educationConfig.EDUCATION_LEVEL:
      subOptionTitleId = 'ListingPage.educationLevel';
      break;
    default:
      return '';
  }

  return (
    <div className={css.sectionFeatures}>
      <div className={css.featuresName}>
        <h2 className={css.featuresTitle}>
          <FormattedMessage id="ListingPage.featuresTitle" />
        </h2>
        {subjectsName}
      </div>
      <div className={css.featuresWrapper}>
        <div>
          <h3 className={css.featuresSubTitle}>
            <FormattedMessage id="ListingPage.subjects" />
          </h3>
          {selectedOptionLabel}
        </div>
        <div>
          <h3 className={css.featuresSubTitle}>
            <FormattedMessage id={subOptionTitleId} />
          </h3>
          {selectedSubOptionLabel}
        </div>
      </div>
    </div>
  );
};

SectionEducationsMaybe.defaultProps = {
  filterConfig: config.custom.filters,
  educationConfig: config.custom.education,
};

export default SectionEducationsMaybe;
