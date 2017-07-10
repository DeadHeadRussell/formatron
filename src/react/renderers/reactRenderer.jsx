import Renderer from '~/renderers/renderer';

import reactRenderers from './';
import FormatronPropTypes from '~/react/propTypes';

export default class ReactRenderer extends Renderer {
  constructor(FormField, StaticField, TableFilter, TableCell, StaticTableCell) {
    super();
    this.FormField = FormField;
    this.StaticField = StaticField;
    this.TableFilter = TableFilter;
    this.TableCell = TableCell;
    this.StaticTableCell = StaticTableCell;
  }

  renderFormField(viewType, renderData, renderers) {
    return <this.FormField
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderFormField'
    />;
  }

  renderStaticField(viewType, renderData, renderers) {
    return <this.StaticField
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderStaticField'
    />;
  }

  renderFilter(viewType, renderData, renderers) {
    return this.TableFilter ? (
      <this.TableFilter
        viewType={viewType}
        renderData={renderData}
        renderers={renderers}
        rendererMethod='renderFilter'
      />
    ) : (
      <div className='formatron-table-filterable-empty' />
    );
  }

  renderTableCell(viewType, renderData, renderers) {
    return <this.TableCell
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderTableCell'
    />;
  }

  renderStaticTableCell(viewType, renderData, renderers) {
    return <this.StaticTableCell
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderStaticTableCell'
    />;
  }

  getKey(viewType) {
    return `${viewType.constructor.typeName}-${viewType.uniqueId}`;
  }
}

const ReactRendererPropTypes = ViewType => ({
  viewType: FormatronPropTypes.viewType.instanceOf(ViewType).isRequired,
  renderData: FormatronPropTypes.renderData.isRequired
});

ReactRenderer.register = (ViewType, ...components) => () => {
  const propTypes = ReactRendererPropTypes(ViewType);
  components
    .filter(component => component)
    .forEach(component => component.propTypes = propTypes);

  reactRenderers.register(ViewType.typeName, new ReactRenderer(...components));
};

