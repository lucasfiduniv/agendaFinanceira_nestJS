import { UserType } from "src/user/enum/user-type.enum";


export class LoginDto {
    email: string | null;
    phone: string | null;
    senha: string;
    typeUser: UserType;
}