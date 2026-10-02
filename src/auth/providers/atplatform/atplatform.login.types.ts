export interface AtPlatformLoginResponseDto {
    session_id?: string;

    token: string;

    refresh_token: string;

    user_id: string;

    username: string;

    first_name: string;

    last_name: string;
}
