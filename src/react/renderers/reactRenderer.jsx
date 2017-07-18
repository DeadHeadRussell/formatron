import Renderer from '~/renderers/renderer';

import FormatronPropTypes from '~/react/propTypes';

import {withSimpleLabel} from './formHelpers';

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
      key={viewType.uniqueId}
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderStaticField'
    />;
  }

  renderFormFilter(viewType, renderData, renderers) {
    const Filter = withSimpleLabel(this.TableFilter);
    return this.TableFilter ? (
      <Filter
        key={viewType.uniqueId}
        viewType={viewType}
        renderData={renderData}
        renderers={renderers}
        rendererMethod='renderFormFilter'
      />
    ) : (
      null
    );
  }

  renderFilter(viewType, renderData, renderers) {
    return this.TableFilter ? (
      <this.TableFilter
        key={viewType.uniqueId}
        viewType={viewType}
        renderData={renderData}
        renderers={renderers}
        rendererMethod='renderFilter'
      />
    ) : (
      <div
        key={viewType.uniqueId}
        className='formatron-table-filterable-empty'
      />
    );
  }

  renderTableCell(viewType, renderData, renderers) {
    return <this.TableCell
      key={viewType.uniqueId}
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderTableCell'
    />;
  }

  renderStaticTableCell(viewType, renderData, renderers) {
    return <this.StaticTableCell
      key={viewType.uniqueId}
      viewType={viewType}
      renderData={renderData}
      renderers={renderers}
      rendererMethod='renderStaticTableCell'
    />;
  }
}

const ReactRendererPropTypes = ViewType => ({
  viewType: FormatronPropTypes.viewType.instanceOf(ViewType).isRequired,
  renderData: FormatronPropTypes.renderData.isRequired
});

ReactRenderer.register = (ViewType, ...components) => renderers => {
  const propTypes = ReactRendererPropTypes(ViewType);
  components
    .filter(component => component)
    .forEach(component => component.propTypes = propTypes);

  renderers.register(ViewType.typeName, new ReactRenderer(...components));
};

