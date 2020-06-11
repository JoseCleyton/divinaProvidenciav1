export class CredentialsDTO {
    public login: String;
    public password: String;
    public name: String;
    public admin: boolean
    public token: string
    constructor(login: String, password: String){
        login = login;
        password= password
    }
}