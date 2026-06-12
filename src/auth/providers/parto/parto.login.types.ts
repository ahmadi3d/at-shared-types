export interface PartoUserInfoDTO {
    ID: number;

    userName: string;

    firstName: string;

    lastName: string;

    isAgent: boolean;

    birthdate: string;

    businessTypeID: number;

    companyName: string | null;

    customerID: number | null;

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

export interface PartoLoginResponseDTO {
    token: string;

    refreshToken: string;

    userInfo: PartoUserInfoDTO;
}
