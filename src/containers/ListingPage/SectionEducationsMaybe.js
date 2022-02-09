import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';
import config from '../../config';

const SectionEducationsMaybe = props => {
  const { publicData, filterConfig, educationConfig } = props;
  if (!publicData) {
    return null;
  }

  const subjectsName = publicData && publicData.subjectName;
  const selectedOption = publicData && publicData.educationType ? publicData.educationType : '';

  const selectedSubOption = publicData.educationLevel
    ? publicData.educationLevel
    : publicData.educationClass;

  let subOptionTitleId = '';

  switch (selectedOption) {
    case educationConfig.EDUCATION_CLASS:
      subOptionTitleId = 'ListingPage.educationClass';
      break;
    case educationConfig.EDUCATION_LEVEL:
      subOptionTitleId = 'ListingPage.educationLevel';
      break;
    default:
      subOptionTitleId = 'ListingPage.invalidEducationOption';
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
            <FormattedMessage id="ListingPage.subject" />
          </h3>
          <FormattedMessage id={`ListingPage.${selectedOption}`} />
        </div>
        <div>
          <h3 className={css.featuresSubTitle}>
            <FormattedMessage id={subOptionTitleId} />
          </h3>
          <FormattedMessage id={`ListingPage.${selectedSubOption}`} />
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
