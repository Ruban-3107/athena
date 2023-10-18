import React from "react";
 import {Fullcalender} from "@athena/web-shared/ui";
 import { requireAuth } from '@athena/web-shared/utils';

 const FullCalenderPage =()=>{
    return(
        <div>
        <Fullcalender />
        </div>

    );
    
 

}
export default requireAuth( FullCalenderPage);