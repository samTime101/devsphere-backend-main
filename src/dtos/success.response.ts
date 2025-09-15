interface SuccessResponseData<T = any> {
    success: true;
    message: string;
    data?: T;
    code: number;
}

export default function SuccessResponse<T = any>(
    code: number,
    message: string,
    data?: T
): SuccessResponseData<T> {
    const response: SuccessResponseData<T> = {
        success: true,
        message,
        code,
    };
    
    if (data !== undefined) {
        response.data = data;
    }
    
    return response;
}