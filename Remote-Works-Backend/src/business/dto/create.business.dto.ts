export interface CreateBusinessDto {
    id_?: string;
    name?: string;
    email: string;
    password: string;
    img?: any;
    cv?: any;
    website?: string;
    permissionFlags?: number;
    job_postings?: Array<any>;
}