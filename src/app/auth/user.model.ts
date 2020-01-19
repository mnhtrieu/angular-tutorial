export class User {
  constructor(public email: string, public id: string, private _token: string, private _tokenExpirationDate: Date){ }

  get token(){ 
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
      return null;
    }
    console.log(new Date());
    console.log(this._tokenExpirationDate);
    console.log(new Date() > this._tokenExpirationDate);
    return this._token; 
  }
}