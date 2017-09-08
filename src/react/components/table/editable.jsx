import {Map} from 'immutable';
import Column from 'react-virtualized/dist/commonjs/Table/Column';

import reactRenderers from '~/react/renderers';
import RenderData from '~/renderers/renderData';

import BaseTable from './base';

export default function editableTable(Table) {
  return class EditableTable extends BaseTable {
    static propTypes = {
      editable: React.PropTypes.bool,
      onSubmit: React.PropTypes.func,
      onChange: React.PropTypes.func,
      onButtonClick: React.PropTypes.func
    }

    constructor(props) {
      super(props);
      this.state = this.createInitialState(props);
    }

    componentWillReceiveProps(newProps) {
      if (newProps.models && newProps.models != this.props.models) {
        this.setState(this.createInitialState(newProps));
      }
    }

    createInitialState(props) {
      return {
        changes: Map(),
        blurs: Map(),
        dirty: Map(),
        errors: Map(),
        models: this.cacheModels(props),
        callbacks: this.cacheCallbacks(props)
      };
    }

    cacheModels(props) {
      return props.editable ? (
        props.models
          .map(model => props.dataType
            .getValue(model)
            .update(updateValues(model, props.defaultValue))
            .update(updateValues(model, props.disabled))
          )
      ) : (
        props.models
      );

      function updateValues(model, values) {
        if (!values || !Immutable.isImmutable(values)) {
          return model => model;
        } else {
          return model => values
            .reduce(
              (model, value, ref) => {
                if (typeof value != 'undefined') {
                  return props.dataType.setValue(model, ref, value);
                }
                return model
              },
              model
            );
        }
      }
    }

    cacheCallbacks(props) {
      return props.models
        .map((model, index) => this.createRenderCallbacks(index));
    }

    createRenderCallbacks = (index) => {
      return {
        isDisabled: ref => {
          // TODO: Recursively check parent refs?
          return this.props.loading ||
            this.props.disabled === true ||
            (this.props.disabled && this.props.disabled.getIn([index, ref], false));
        },

        getError: ref => {
          return this.state.errors.getIn([index, ref]);
        },

        onBlur: ref => {
          if (this.state.dirty.getIn([index, ref]) || this.state.changes.getIn([index, ref])) {
            const errors = this.props.dataType.validateSingle(this.state.models.get(index), ref);
            const errorMap = errors.size == 0 ?
              this.state.errors
                .removeIn([index, ref]) :
              errors
                .reduce(
                  (errors, error) => errors
                    .setIn([index, ref], error),
                  this.state.errors
                );

            this.setState({
              blurs: this.state.blurs
                .setIn([index, ref], true),
              errors: errorMap
            });

            // this.forceUpdateGrid();
          }
        },

        onButtonClick: (...args) => {
          if (this.props.onButtonClick) {
            this.props.onButtonClick(index, this.state.models.get(index), ...args);
          }
        },

        onChange: (ref, value) => {
          const newModel = this.props.dataType
            .setValue(this.state.models.get(index), ref, value);

          this.setState({
            changes: this.state.changes.setIn([index, ref], value),
            dirty: this.state.dirty.setIn([index, ref], true),
            models: this.state.models.set(index, newModel)
          });

          // TODO: See if there is a way to just update the contents of the
          // cell.
          this.forceUpdateGrid();

          if (this.props.onChange) {
            this.props.onChange(index, newModel);
          }
        }
      };
    }

    isValid(index) {
      const model = this.state.models.get(index);
      const validationErrors = this.props.dataType.validate(model);

      if (validationErrors.size != 0) {
        console.error(index, validationErrors.toJS());

        this.setState({
          errors: this.state.errors
            .set(index, validationErrors
              .toMap()
              .mapEntries(([i, error]) => [
                error.ref,
                error
              ])
            ),

          blurs: this.state.blurs
            .set(index, validationErrors
              .map(error => error.ref)
              .reduce(
                (blurs, ref) => blurs
                  .set(ref, true),
                this.state.blurs
              )
            )
        });
      } else {
        this.setState({
          errors: this.state.errors
            .remove(index)
        });
      }

      return validationErrors.size == 0;
    }

    onSubmit = (index, e) => {
      e.preventDefault();

      if (!this.props.onSubmit) {
        return;
      }

      if (this.isValid(index)) {
        const model = this.state.models.get(index);
        this.props.onSubmit(index, model);
      }
    }

    saveRenderer = props => {
      const rowIndex = props.rowData.get(BaseTable.naturalIndex);

      const onSave = this.onSubmit.bind(this, rowIndex);
      const content = this.props.saveRenderer ?
        this.props.saveRenderer(props) :
        'Save';

      return (
        <button
          type='button'
          className='formatron-table-save-row'
          onClick={onSave}
        >
          {content}
        </button>
      );
    }

    columnsRenderer = columns => {
      return columns
        .push((
          <Column
            key='table-editable-edit'
            label='Save Button'
            dataKey=''
            width={100}
            flexGrow={0}
            flexShrink={0}
            cellDataGetter={() => null}
            cellRenderer={this.saveRenderer}
            headerRenderer={() => null}
          />
        ));
    }

    cellRenderer = renderer => {
      return (column, {rowData}) => {
        const rowIndex = rowData.get(BaseTable.naturalIndex);
        const model = this.state.models.get(rowIndex);

        const renderData = new RenderData(this.props.dataType, model, {
          ...this.state.callbacks.get(rowIndex),
          viewTypes: this.props.viewTypes,
          ...this.props.renderOptions
        });

        return reactRenderers.renderTableCell(column, renderData);
      };
    }

    render() {
      if (this.props.editable) {
        return <Table
          ref={table => this.table = table}
          {...this.mergeProps({
            columnsRenderer: this.columnsRenderer,
            cellRenderer: this.cellRenderer
          })}
        />;
      } else {
        return <Table
          ref={table => this.table = table}
          {...this.props}
        />;
      }
    }
  }
}

