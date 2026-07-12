export interface PartoUserInfoDto {
    ID: number;

    userName: string;

    firstName: string;

    lastName: string;

    isAgent: boolean;

    birthdate: string;

    businessTypeId: number;

    companyName: string | null;

    customerId: number | null;

    department: string | null;

    directPhone: string | null;

    enabled: boolean;

    factionsJson: string | null;

    genderId: number;

    internalPhone: string | null;

    loginEnabled: boolean;

    nationalCode: string | null;

    offices: unknown;

    phone: string | null;

    roles: unknown;
}

export interface PartoLoginResponseDto {
    token: string;

    refreshToken: string;

    userInfo: PartoUserInfoDto;
}
