import TetheredComponent from 'react-tether';

import BaseTable from './base';

export default function exportableTable(Table) {
  return class ExportableTable extends BaseTable {
    static propTypes = {
      onExport: React.PropTypes.func,
      exportTypes: React.PropTypes.arrayOf(
        React.PropTypes.string.isRequired
      )
    }

    constructor(props) {
      super(props);
      this.state = {
        menuOpen: false
      };
    }

    getToolbarButtons = buttons => {
      if (this.props.onExport) {
        return buttons
          .push(<TetheredComponent
            classes={{
              element: 'element-top'
            }}
            renderElementTo='body'
            attachment='top center'
            targetAttachment='bottom center'
            constraints={[{
              to: 'window',
              attachment: 'together',
              pin: ['top']
            }]}
          >
            <button
              key='export-toggle'
              ref={this.setButton}
              type='button'
              className='table-button table-exportable-export'
              onClick={this.popup}
            >
              Export
            </button>
            <div
              style={{
                display: this.state.menuOpen ?
                  'initial' : 'none'
              }}
            >
              <div className='table-exportable-export-list'>
                {this.props.exportTypes.map(type => <button
                  key={type}
                  type='button'
                  className='table-button table-exportable-export-type'
                  onClick={this.export.bind(this, type)}
                >
                  {type}
                </button>)}
              </div>
            </div>
          </TetheredComponent>);
      } else {
        return buttons;
      }
    }

    setButton = button => {
      this.button = button;
    }

    popup = () => {
      this.setState({menuOpen: !this.state.menuOpen});
    }

    export = action => {
      const columns = this.table.getColumns();
      const models = this.table.getRows();
      this.props.onExport(action, columns, models);
      this.setState({
        menuOpen: false
      });
    }

    render() {
      return <Table
        ref={table => this.table = table}
        {...this.mergeProps({
          getToolbarButtons: this.getToolbarButtons
        })}
      />;
    }
  };
}
