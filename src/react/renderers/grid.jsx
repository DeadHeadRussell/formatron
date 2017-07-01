import classNames from 'classnames';
import {List} from 'immutable';

import Label from '~/react/components/label';
import GridType from '~/types/view/display/grid';

import ReactRenderer from './reactRenderer';

const Grid = ({viewType, renderData, renderers, rendererMethod}) => {
  const orientationClass = `formatron-orientation-${viewType.getOrientation()}`;
  return (
    <div className={classNames('formatron-grid', orientationClass)}>
      <Label>{viewType.getLabel()}</Label>
      <div className='formatron-grid-outer'>
        {viewType.getChildren()
          .map((viewType, i) => List.isList(viewType) ? (
            <div className='formatron-grid-inner'>
              {viewType.map((viewType, j) =>
                renderers[rendererMethod](viewType, renderData)
              )}
            </div>
          ) : (
            renderers[rendererMethod](viewType, renderData)
          ))
        }
      </div>
    </div>
  );
};

export default ReactRenderer.register(GridType, Grid, Grid);

