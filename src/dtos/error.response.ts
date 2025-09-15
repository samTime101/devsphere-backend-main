interface ErrorResponseData<D = any> {
    success: false;
    error: string;
    details?: D;
    code: number;
}

export default function ErrorResponse<D = any>(
    code: number,
    error: string,
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