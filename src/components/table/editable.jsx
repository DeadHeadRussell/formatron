import {Map} from 'immutable';
import Portal from 'react-portal';
import Column from 'react-virtualized/dist/commonjs/Table/Column';

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
      this.state = this.createInitialState();
    }

    createInitialState() {
      return {
        changes: Map(),
        blurs: Map(),
        dirty: Map()
      };
    }

    createRenderCallbacks(column, model) {
      const index = model.get('id');

      let callbacks;
      return callbacks = {
        onBlur: ref => {
          if (this.state.dirty.getIn([index, ref]) || this.state.changes.getIn([index, ref])) {
            this.setState({blurs: this.state.blurs.setIn([index, ref], true)});
            this.forceUpdateGrid();
          }
        },

        onButtonClick: (...args) => {
          if (this.props.onButtonClick) {
            const index = model.get(this.naturalIndex);
            this.props.onButtonClick(index, model, ...args);
          }
        },

        onChange: (ref, value) => {
          this.setState({
            changes: this.state.changes.setIn([index, ref], value),
            dirty: this.state.dirty.setIn([index, ref], true)
          });

          // TODO: See if there is a way to just update the contents of the
          // cell.
          this.forceUpdateGrid();

          if (this.props.onChange) {
            this.props.onChange(index, this.props.schema.resolveChanges(
              model,
              Map().set(ref, value),
              Map(),
              Map()
            ));
          }
        }
      };
    }

    isValid() {
      // TODO: Figure out how to properly show errors.
      return true;
    }

    onSubmit = (index, model, e) => {
      e.preventDefault();

      if (!this.props.onSubmit) {
        return;
      }

      if (this.isValid(model)) {
        this.props.onSubmit(index, model);
      }
    }

    saveRenderer = props => {
      const onSave = this.onSubmit.bind(this, props.rowIndex, props.rowData);
      const content = this.props.saveRenderer?
        this.props.saveRenderer(props) :
        'Save';

      return <button
        type='button'
        className='table-editable-save-row'
        onClick={onSave}
      >{content}</button>;
    }

    columnsRenderer = columns => {
      return columns
        .push(<Column
          label='Save Button'
          dataKey=''
          width={100}
          flexGrow={0}
          flexShrink={0}
          cellDataGetter={() => null}
          cellRenderer={this.saveRenderer}
          headerRenderer={() => null}
        />);
    }

    rowGetter = getter => {
      return props => {
        const model = getter(props);
        return this.props.schema.resolveChanges(
          model,
          this.state.changes.get(model.get('id'), Map()),
          Map(),
          Map()
        );
      };
    }

    cellRenderer = renderer => {
      return (column, {isScrolling, rowData}) => {
        return column
          .getEditableCell(
            rowData,
            {preferQuick: this.props.isScrolling},
            this.createRenderCallbacks(column, rowData)
          );
      };
    }

    render() {
      if (this.props.editable) {
        return <Table
          ref={table => this.table = table}
          {...this.mergeProps({
            columnsRenderer: this.columnsRenderer,
            rowGetter: this.rowGetter,
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
