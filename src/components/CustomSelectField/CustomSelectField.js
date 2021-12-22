import React from 'react';
import { FieldSelect } from '..';

import css from './CustomSelectField.module.css';

const CustomSelectField = props => {
  const { name, id, options, placeholder, label, validate } = props;

  return options ? (
    <FieldSelect className={css.root} name={name} id={id} label={label} validate={validate}>
      <option disabled value="">
        {placeholder}
      </option>
      {options.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomSelectField;
