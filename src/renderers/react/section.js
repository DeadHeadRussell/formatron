import classNames from 'classnames';
import {Map} from 'immutable';
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs';

// This is an out of date file before schemas split the old types into
// separate data and form types. We will like to update this into a data
// type at some point but have not yet spent time architecturing it uyet.

import DataType from './dataType';

export default new class SectionType extends DataType {
  constructor() {
    super('section');

    this.errors = {
      type: 'This field must be a generic set of key:value pairs'
    };
  }

  get defaultValue() {
    return Map();
  }

  hasValue(field, value) {
    return value && value.size > 0;
  }

  parse(field, value) {
    return value;
  }

  validate(value) {
    if (!Map.isMap(value)) {
      return this.errors.type;
    }
  }

  asString(field, value) {
    return JSON.stringify(value.toJS());
  }

  asFormField(field, getters, callbacks) {
    const name = field.get('name');

    const properties = field.getIn(['options', 'properties']);
    const values = getters.getDataValue(name);

    return <div className='form-section'>
      {properties.map(field => {
        return <label className='form-data'>
          <span className='form-label-text'>{field.get('name')}</span>
          <div className={classNames('form-input-wrapper', field.get('type').name)}>
            {field.get('type').asFormField(field, {
              getValue: () => values.get(field.get('name')),
              getDisabled: () => getters.getDisabled(name),
              getError: () => null
            }, {
              onChange: (_, value) => callbacks
                .onChange(name, values.set(field.get('name'), value)),
              onBlur: () => callbacks.onBlur(name)
            })}
          </div>
        </label>;
      })}
    </div>;

    function renderChildren() {
      const childrenList = children.toList();
      return <div>
        {schema.getIn(['options', 'tabs']) ? (
          <Tabs>
            <TabList>
              {childrenList.map(child => <Tab key={child.key}>{child.key.split('.').pop()}</Tab>)}
            </TabList>
            {childrenList.map(child => <TabPanel key={child.key}>{child}</TabPanel>)}
          </Tabs>
        ) : childrenList}
      </div>;
    }
  }
}();

