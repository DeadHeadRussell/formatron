import editableTable from './editable';
import exportableTable from './exportable';
import filterableTable from './filterable';
import editableColumnsTable from './editableColumns';
import sortableTable from './sortable';
import viewableTable from './viewable';
import Table from './table';

// TODO:
// * Exportable: Add export buttons to the toolbar
// * Editable Columns: Allow resizing / dragging / adding / removing of columns
// The below classes for the above todos are just placeholders.

export {editableTable};
export {exportableTable};
export {filterableTable};
export {editableColumnsTable};
export {sortableTable};
export {viewableTable};
export {Table};

export default exportableTable(
  //sortableTable(
    editableTable(
      //editableColumnsTable(
        //filterableTable(
          viewableTable(
            Table
          )
        )
      //)
    //)
  //)
);

