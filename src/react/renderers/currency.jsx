import NumberType from '~/types/data/number';

import CurrencyType from '~/types/view/data/currency';

import {withDataRenderer, withDisplayRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';

const CurrencyFilter = ({viewType, renderData}) => (
  <CurrencyInput
    viewType={viewType}
    renderData={renderData}
  />
);

const Currency = props => (
  <CurrencyInput {...props} />
);

const StaticCurrency = withDisplayRenderer(({value}) => (
  <p className='formatron-static-value'>{value}</p>
));

const CurrencyField = withFormLabel(Currency);
const StaticCurrencyField = withStaticLabel(StaticCurrency);

class CurrencyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: this.getInputValue(props)};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.renderData != this.props.renderData) {
      this.setState({input: this.getInputValue(newProps)});
    }
  }

  getInputValue = (props) => {
    return props.viewType.getDisplay(props.renderData);
  }

  onChange = e => {
    this.setState({input: e.target.value});
  }

  onBlur = () => {
    const ref = this.props.viewType.getRef();
    const input = this.props.viewType.parseInput(this.state.input);
    this.props.renderData.options.onChange(ref, input);
    this.props.renderData.options.onBlur(ref);
  }

  render() {
    const placeholder = this.props.viewType.getPlaceholder();
    const {isDisabled} = this.props.renderData.options;
    const disabled = isDisabled(this.props.viewType.getRef());

    return (
      <input
        className='formatron-input formatron-number formatron-currency'
        disabled={disabled}
        value={this.state.input}
        placeholder={placeholder}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}

export default ReactRenderer.register(
  CurrencyType,
  CurrencyField,
  StaticCurrencyField,
  CurrencyFilter,
  Currency,
  StaticCurrency
);

