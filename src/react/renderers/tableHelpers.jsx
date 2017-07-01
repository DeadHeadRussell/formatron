import Select from '~/react/components/tetheredSelect';

export const TableDropDownFilter = ({renderData, options}) => {
  const {dataType, dataValue} = renderData;
  const {onChange, onBlur} = renderData.options;

  const value = dataValue || [];

  return (
    <Select
      className='formatron-table-filter formatron-dropdown formatron-multi'
      value={value}
      multi={true}
      options={options}
      onChange={options => onChange(options)}
      onBlur={onBlur}
    />
  );
};

