import {validationErrorResponse,conflictResponse,internalServerError} from "./Response.js";

const handleError=(res,error)=>{
    if(error.name==="ValidationError"){
        const errors = Object.values(error.errors).map((e) => e.message);
        return validationErrorResponse(res,errors);
    }

    if(error.code===11000){
        const field = Object.keys(error.keyValue)[0];
        return conflictResponse(res, `${field} already exists`);
    }
    return internalServerError(res, error.message || error);
};

export default handleError;
