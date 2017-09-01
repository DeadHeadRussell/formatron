import FormatronPropTypes from '~/react/propTypes';
import TextType from '~/types/data/text';
import LinkType from '~/types/view/data/link';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {withChangeOnBlurRenderer, withStaticRenderer} from './';

const LinkFilter = ({renderData}) =>
  <input
    className="formatron-input formatron-text"
    type="text"
    value={renderData.dataValue}
    onChange={renderData.options.onChange}
    onBlur={renderData.options.onBlur}
  />;

const Link = withChangeOnBlurRenderer(
  ({field, value, disabled, placeholder, onChange, onBlur}) =>
    <div className="formatron-url-input">
      <input
        className="formatron-input formatron-text"
        type="url"
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <a className="formatron-input-link" href={value} _target="blank">
        Open URL
      </a>
    </div>
);

const StaticLink = withStaticRenderer(({value}) =>
  <p className="formatron-static-value">
    <a className="formatron-link" href={value} _target="blank">
      {value}
    </a>
  </p>
);

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
