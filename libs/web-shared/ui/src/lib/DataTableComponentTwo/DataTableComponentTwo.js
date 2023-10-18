import './DataTableComponentTwo.css';
import DataTable from 'react-data-table-component';
import React, { useEffect, useRef, useState } from 'react';
import {SortingIcon} from '@athena/web-shared/ui';

export const DataTableComponentTwo=(props) =>{
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState(false);
  const [newUpdatedvalues, setNewUpdatedValues] = useState([]);
  const inputRef = useRef([]);

  // useEffect(() => {
  //   console.log("ppppppppp", props?.data);
  //   let ids = props.data.map((e) => e.id)
  //   props?.methods?.setValue("final_users", ids);
  // }, [props.data])


  
  const handleRowSelected = React.useCallback((state) => {
    console.log("selectedrows", state, props?.data, props?.data?.length,props?.methods?.getValues());
    // console.log("uyuyuyuy", props?.finaluser, props?.finaluser?.filtertext.length, props?.finaluser?.userlength===0, props?.finaluser?.filtertext.length!==0 && props?.finaluser?.userlength === 0)
    // if (props?.finaluser?.filtertext.length !== 0 && Number(props?.finaluser?.userlength) === 0 && props?.finaluser?.users && props?.finaluser?.users.length>0) {
    //   console.log("iouy", props?.finaluser?.users)
    //   props?.methods?.setValue("final_users", props?.finaluser?.users);
    // }
    if (state?.selectedRows?.length === 0) {
      console.log("iouy", props?.methods?.getValues()['initial_selected_users'])
      props?.methods?.setValue("final_users", props?.methods?.getValues()['initial_selected_users']);
    }
    else {
      let ids = state.selectedRows.map((e) => e.id)
      props?.methods?.setValue("final_users", ids);
      setSelectedRows(ids)
    }
     
      }, []);

  return (
    <DataTable
      // ref={ inputRef }
      className="dataTable-content"
      columns={props.columns}
      data={props.data}
      selectableRows={props.selectableRows}
      onSelectedRowsChange={handleRowSelected}
      subHeader={props.subHeader}
      subHeaderAlign={props.subHeaderAlign}
      subHeaderWrap={props.subHeaderWrap}
      subHeaderComponent={props.subHeaderComponent}
      sortIcon={<SortingIcon />}
      persistTableHead
      pagination={props.pagination}
      paginationResetDefaultPage={props.paginationResetDefaultPage}
      paginationComponent={props.paginationComponent}
      selectedRows
      selectableRowSelected={props.selectableRowSelected}
      clearSelectedRows={props.clearSelectedRows}
    />
  );
}
export default DataTableComponentTwo;
