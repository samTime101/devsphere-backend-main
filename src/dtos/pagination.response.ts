interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface PaginationResponseData<T = any> {
    success: true;
    message: string;
    code: number;
    data: T[];
    pagination: PaginationMeta;
}

export default function PaginationResponse<T = any>(
    code: number,
    message: string,
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginationResponseData<T> {
    const totalPages = Math.ceil(total / limit);

    return {
        success: true,
        message,
        code,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
        },
    };
}
