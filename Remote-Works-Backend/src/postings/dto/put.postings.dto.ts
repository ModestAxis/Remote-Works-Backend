export interface PutPostingsDto {
    _id?: string,
    job_title: string,
    timezone: string,
    field: string,
    country: string,
    create_date: Date,
    description: string,
    salary: string,
    start_date: Date,
    isContract: Boolean,
    contract_length_in_months: Number,
    isRenewable: Boolean,
    isPromoted: Boolean,
    requirement: string
    business_id?: string,
    business_name?: string,
    applicants_id: Array<string>

}