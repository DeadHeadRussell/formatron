import NumberType from '~/types/data/number';

import CurrencyType from '~/types/view/data/currency';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {withDataRenderer, withDisplayRenderer} from './';

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
    this.state = this.createInitialState(props);
  }

  createInitialState(props) {
    return {
      input: props.viewType.getDisplay(props.renderData)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.renderData != this.props.renderData) {
      this.setState(this.createInitialState(newProps));
    }
  }

  onChange = e => {
    this.setState({input: e.target.value});
  }

  onBlur = () => {
    const {viewType, renderData} = this.props;
    const ref = viewType.getRef();
    const input = viewType.parseInput(this.state.input);
    renderData.options.onChange(ref, input, viewType.getLabel(renderData));
    renderData.options.onBlur(ref);
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

