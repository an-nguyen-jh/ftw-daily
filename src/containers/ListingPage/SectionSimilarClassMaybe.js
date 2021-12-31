import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionSimilarClassMaybe.module.css';
import { ListingCard } from '../../components';

const SectionSimilarClassMaybe = props => {
  const { className, rootClassName, similarClasses, fetchSimilarClassError } = props;
  const classes = classNames(rootClassName || css.root, className);
  const similarClassError = (
    <FormattedMessage id="ListingPage.similarClassesError"></FormattedMessage>
  );

  const similarClassTitle = (
    <FormattedMessage id="ListingPage.similarClassesTitle"></FormattedMessage>
  );

  const panelMediumWidth = 50;
  const panelLargeWidth = 62.5;
  const cardRenderSizes = [
    '(max-width: 767px) 100vw',
    `(max-width: 1023px) ${panelMediumWidth}vw`,
    `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
    `${panelLargeWidth / 3}vw`,
  ].join(', ');

  return similarClasses && similarClasses.length > 0 ? (
    <div className={classes}>
      <h2 className={css.title}>{similarClassTitle}</h2>
      <div className={css.classWrapper}>
        {similarClasses.map(cls => (
          <ListingCard
            className={css.listingCard}
            key={cls.id.uuid}
            listing={cls}
            renderSizes={cardRenderSizes}
          />
        ))}
        {fetchSimilarClassError ? similarClassError : null}
      </div>
    </div>
  ) : null;
};

SectionSimilarClassMaybe.defaultProps = { className: null, rootClassName: null };

SectionSimilarClassMaybe.propTypes = {
  className: string,
  rootClassName: string,
};

export default SectionSimilarClassMaybe;
