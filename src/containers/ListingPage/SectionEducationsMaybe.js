import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.module.css';
import config from '../../config';
import { object } from 'prop-types';

const SectionEducationsMaybe = props => {
  const { publicData, educationConfig } = props;
  if (!publicData) {
    return null;
  }

  const { subjectName, educationType: selectedOption } = publicData;
  const selectedSubOption = publicData[selectedOption];

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
        {subjectName}
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
  educationConfig: config.custom.education,
};

SectionEducationsMaybe.propTypes = {
  publicData: object.isRequired,
};

export default SectionEducationsMaybe;
