import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('columns', {
    parseOptions(options, parseField) {
      return options
        .update('columns', columns => columns
          .map(column => column
            .map(parseField)
          )
        );
    },
    Component: ColumnsComponent
  });
}

const ColumnsComponent = ({options, getters, callbacks}) => {
  return <div className='form-columns'>
    <Label>{options.get('label')}</Label>
    <div className='form-columns-wrapper'>
      {options.get('columns').map((column, i) => <div key={i} className='form-column'>
        {column.map((field, i) =>
          <field.Component key={i} getters={getters} callbacks={callbacks} />
        )}
      </div>)}
    </div>
  </div>;
};

ColumnsComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    columns: ImmutablePropTypes.listOf(
      ImmutablePropTypes.listOf(
        FormPropTypes.display.isRequired
      ).isRequired
    ).isRequired
  }),
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

