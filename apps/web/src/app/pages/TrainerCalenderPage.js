import { Meta } from '@athena/web-shared/ui';
import React, { useState, useEffect } from 'react';
import { apiRequest ,requireAuth,useAuth} from '@athena/web-shared/utils';
import { TrainerCalender } from '@athena/web-shared/components';

export const TrainerCalenderPage =()=>{
    const auth = useAuth();
    const [profileData, setprofileData] = useState(null);
    useEffect(() => {
        if (auth && auth.user) {
          getProfiledata();
        }
      }, [auth]);
    
      const getProfiledata = async () => {
        const getProfilesetdataResponse = await apiRequest(
          `api/users/profiles/${
            auth?.user
              ? parseInt(auth?.user?.id)
              : props && props.user_id
              ? parseInt(props.user_id)
              : ''
          }`
        );
        setprofileData(getProfilesetdataResponse);
        console.log(getProfilesetdataResponse, 'getProfilesetdataResponse');
      };
return(
    <>
    <Meta title="Calendar" />
    <TrainerCalender profileData={profileData}/>
</>
)
}
export default requireAuth(TrainerCalenderPage)