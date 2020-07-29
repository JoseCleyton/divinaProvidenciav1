import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CredentialsDTO } from 'src/app/model/credentialsDTO'
import { URLS } from '../urls'
import { User } from 'src/app/model/user'

export class AuthLoginService {
    public idTokenDivinaProvidencia: string
    constructor(private router: Router, private http: HttpClient) { }

    public authenticateWithLoginPassword(login: string, password: string): Observable<CredentialsDTO> {
        return this.http.post<CredentialsDTO>(`${URLS.user}/auth`, { login: login, password: password })
    }
    public insertToken(token: string) {
        this.idTokenDivinaProvidencia = token;
    }
    public isAuthenticated(): boolean {
        if (this.idTokenDivinaProvidencia === undefined && localStorage.getItem('idTokenDivinaProvidencia') === null) {
            this.router.navigate(['auth'])
            return false
        } else {
            return true
        }
    }

    public logout() {
        localStorage.removeItem('idTokenDivinaProvidencia')
        this.router.navigate(['auth'])
    }

    public recoverPassword(user: User): Observable<any> {
        return this.http.post(`${URLS.user}/auth/forgetPassword`, user)
    }
    public validateLink(token: String): Observable<any> {
        return this.http.post(`${URLS.user}/auth/forgetPassword/validateLink`, token)
    }

    public updatePassword(user: User): Observable<any> {
        return this.http.post(`${URLS.user}/auth/updatePassword`, user)
    }
}