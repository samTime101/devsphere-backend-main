interface ErrorResponseData<D = any> {
    success: false;
    error: any;
    details?: D;
    code: number;
}

export default function ErrorResponse<D = any>(
    code: number,
    error: any,
    details?: D
): ErrorResponseData<D> {
    const response: ErrorResponseData<D> = {
        success: false,
        error,
        code,
    };
    
    if (details !== undefined) {
        response.details = details;
    }
    
    return response;
}