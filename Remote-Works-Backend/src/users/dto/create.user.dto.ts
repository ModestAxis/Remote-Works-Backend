export interface CreateUserDto {
    id_?: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    timezone?: string;
    country?: string;
    img?: any;
    cv?: any;
    website?: string;
    git_url?: string;
    permissionFlags?: number;
    experiences?: Array<any>;
    applications?: Array<any>;
    favorites?: Array<any>;
    isSubscribed?: boolean;
}