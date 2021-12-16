import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditListingFeaturesForm.module.css';

const CustomEducationSelectField = props => {
  const { name, id, options, intl, placeholderId, labelId, requiredId } = props;

  const optionLabel = intl.formatMessage({
    id: labelId,
  });
  const optionPlaceholder = intl.formatMessage({
    id: placeholderId,
  });
  const optionRequired = required(
    intl.formatMessage({
      id: requiredId,
    })
  );
  return options ? (
    <FieldSelect
      className={css.option}
      name={name}
      id={id}
      label={optionLabel}
      validate={optionRequired}
    >
      <option disabled value="">
        {optionPlaceholder}
      </option>
      {options.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomEducationSelectField;
