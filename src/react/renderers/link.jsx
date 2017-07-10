import TextType from '~/types/data/text';
import LinkType from '~/types/view/data/link';

import {withDataRenderer, withStaticRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import FormatronPropTypes from '~/react/propTypes';
import ReactRenderer from './reactRenderer';

const LinkFilter = ({renderData}) => (
  <input
    className='formatron-text-input'
    type='text'
    value={renderData.dataValue}
    onChange={renderData.options.onChange}
    onBlur={renderData.options.onBlur}
  />
);

const Link = withDataRenderer(({field, value, disabled, placeholder, onChange, onBlur}) => (
  <div className='formatron-url-input'>
    <input
      className='formatron-text-input'
      type='url'
      disabled={disabled}
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
    />
    <a className='formatron-input-link' href={value} _target='blank'>
      Open URL
    </a>
  </div>
));

const StaticLink = withStaticRenderer(({value}) => (
  <p className='formatron-static-value'>
    <a className='formatron-link' href={value} _target='blank'>
      {value}
    </a>
  </p>
));

const LinkField = withFormLabel(Link);
const StaticLinkField = withStaticLabel(StaticLink);

export default ReactRenderer.register(
  LinkType,
  LinkField,
  StaticLinkField,
  LinkFilter,
  Link,
  StaticLink
);

