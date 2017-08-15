import classNames from 'classnames';
import {List} from 'immutable';

import Label from '~/react/components/label';
import GridType from '~/types/view/display/grid';

import ReactRenderer from '../reactRenderer';

function GridImpl({viewType, renderData, renderers, rendererMethod}) {
  return (
    <div className='formatron-grid-outer'>
      {viewType.getChildren()
        .map((viewType, i) => List.isList(viewType) ? (
          <div
            key={i}
            className='formatron-grid-inner'
          >
            {viewType
              .map((viewType, j) => (
                <div key={j}>
                  {renderers[rendererMethod](viewType, renderData)}
                </div>
              ))
            }
          </div>
        ) : (
          <div key={i}>
            {renderers[rendererMethod](viewType, renderData)}
          </div>
        ))
      }
    </div>
  );
}

const Grid = ({viewType, renderData, renderers, rendererMethod}) => {
  const orientationClass = `formatron-orientation-${viewType.getOrientation()}`;
  return (
    <div className={classNames('formatron-grid', orientationClass)}>
      <Label>{viewType.getLabel(renderData)}</Label>
      <GridImpl
        viewType={viewType}
        renderData={renderData}
        renderers={renderers}
        rendererMethod={rendererMethod}
      />
    </div>
  );
};

const TableGrid = (props) => {
  const orientationClass = `formatron-orientation-${props.viewType.getOrientation()}`;
  return (
    <div className={classNames('formatron-grid', orientationClass)}>
      <GridImpl {...props} />
    </div>
  );
};

export default ReactRenderer.register(
  GridType,
  Grid,
  Grid,
  null,
  TableGrid,
  TableGrid
);

