export const API_CONFIG = {
    // local

    /* 
    baseUrl: 'http://localhost:8080',
    tokenUrl: 'http://localhost:8080/oauth/token?grant_type=password',
    refresh_tokenUrl: 'http://localhost:8080/oauth/token?grant_type=refresh_token&refresh_token',
     */
   
    // heroku
    
    
    baseUrl: 'https://bbp-backend.herokuapp.com',
    tokenUrl: 'https://bbp-backend.herokuapp.com/oauth/token?grant_type=password',
    refresh_tokenUrl: 'https://bbp-backend.herokuapp.com/oauth/token?grant_type=refresh_token&refresh_token',
     

    // googleClound
    // ???

    baseUrlCEP: 'https://viacep.com.br/ws',
}