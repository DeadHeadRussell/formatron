import {List, Map} from 'immutable';

import Select from '~/react/components/tetheredSelect';

export const TableDropDownFilter = ({renderData, multi, options}) => {
  const {dataType, dataValue} = renderData;
  const {onChange, onBlur} = renderData.options;

  const defaultValue = multi ? [] : null;
  multi = typeof multi != 'undefined' ? multi : true;

  const value = List.isList(dataValue) ? dataValue.toArray() : dataValue;

  return (
    <Select
      className='formatron-input formatron-dropdown formatron-multi'
      value={typeof value == 'undefined' ? defaultValue : value}
      multi={multi}
      options={options}
      onChange={options => onChange(multi ? (
        options
          .map(parseOption)
          .filter(option => option)
        ) : (
          parseOption(options)
        )
      )}
      onBlur={onBlur}
    />
  );
};

function parseOption(option) {
  if (!option || typeof option.value == 'undefined') {
    return null;
  }
  return option.value;
}

export const TableSimpleFilter = ({renderData}) => {
  const {dataType, dataValue} = renderData;
  const {onChange, onBlur} = renderData.options;

  return (
    <input
      className='formatron-input formatron-text'
      value={dataValue || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
};

export const TableRangeFilter = ({viewType, renderData, parse, Component}) => {
  const {dataType, dataValue} = renderData;
  const {onChange, onBlur} = renderData.options;

  const value = dataValue || Map();

  return (
    <div className='formatron-range'>
      <Component
        field={dataType}
        value={value.get('lower')}
        onChange={newValue => onChange(value.set('lower', parse ? parse(newValue) : newValue))}
        onBlur={onBlur}
      />
      <div className='formatron-range-sep'>-</div>
      <Component
        field={dataType}
        value={value.get('upper')}
        onChange={newValue => onChange(value.set('upper', parse ? parse(newValue) : newValue))}
        onBlur={onBlur}
      />
    </div>
  );
};

