import './DataTableComponent.css';
import DataTable from 'react-data-table-component';
import { useEffect, useContext } from 'react';
import { SortingIcon } from '@athena/web-shared/ui';
//  import { userContext } from 'libs/web-shared/components/src/lib/CreateBatch/CreateBatch';


export const DataTableComponent = (props) => {
  // const usercontext = useContext(userContext);
  // useEffect(() => {
  //   console.log("22", usercontext);
  // }, [usercontext])

  return (
    <DataTable
      className="dataTable-content"
      columns={props.columns}
      selectableRowDisabled={props.selectableRowDisabled}
      data={props.data}
      onRowClicked={props.onRowClicked}
      selectableRows={props.selectableRows}
      onSelectedRowsChange={props.handleRowSelected ?? props.onSelectedRowsChange}
      subHeader={props.subHeader}
      subHeaderAlign={props.subHeaderAlign}
      subHeaderWrap={props.subHeaderWrap}
      subHeaderComponent={props.subHeaderComponent}
      sortIcon={<SortingIcon />}
      persistTableHead
      pagination={props.pagination}
      paginationResetDefaultPage={props.paginationResetDefaultPage}
      paginationComponent={props.paginationComponent}
      selectableRowsHighlight
      // selectedRows={props.selectedRows}
      selectableRowSelected={props.selectableRowSelected}
      // clearSelectedRows={true}
      noDataComponent={props?.noDataComponent}
      {...props}

    />
  );
}
export default DataTableComponent;
