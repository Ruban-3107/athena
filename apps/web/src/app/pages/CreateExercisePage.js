import { CreateExercise } from "@athena/web-shared/components";
import { HeaderComponent } from "@athena/web-shared/ui";
import { requireAuth, useParams } from '@athena/web-shared/utils';
import { Span } from '@athena/web-shared/ui';
import { useState } from 'react';
import { Button } from "react-bootstrap";

const CreateExercisePage = (props) => {

    const params = useParams();
    const { id } = params;
    const [isEdit, setIsEdit] = useState(true);
    const handleEdit = () => {
        setIsEdit(!isEdit);
    }

    return (
        <>
            {id ? (
                <div className="d-flex  justify-content-end mt-4">
                    <Button
                        variant="none"
                        className="f-16 d-flex align-items-center gap-3 text-info"
                        onClick={() => { handleEdit(isEdit ? false : true) }}> <Span className="text-info">{isEdit ? "Edit Exercise" : "View Exercise"}</Span></Button>
                </div>
            ) : (null)}
            <HeaderComponent title={id && isEdit ? "View Exercise" : id && !isEdit ? "Edit Exercise" : "Create Exercise"} hidebreadcumb />
            <CreateExercise isEdit={isEdit} handleEdit={() => { handleEdit(true) }} />
        </>
    )
}

export default requireAuth(CreateExercisePage);

