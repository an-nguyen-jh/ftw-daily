import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionSimilarClassMaybe.module.css';

const SectionSimilarClassMaybe = props => {
  const { className, rootClassName, similarClasses } = props;
  const classes = classNames(rootClassName || css.root, className);
  return similarClasses ? <div className={classes}></div> : null;
};

SectionSimilarClassMaybe.defaultProps = { className: null, rootClassName: null };

SectionSimilarClassMaybe.propTypes = {
  className: string,
  rootClassName: string,
};

export default SectionSimilarClassMaybe;
