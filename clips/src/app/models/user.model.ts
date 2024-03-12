export default interface IUser {
  email: string,
  password?: string, //Given that we added type safety to the createUser function in the authentication service,
                      //it requires the password variable to be present in the dataset to be added to the Firebase "document".
                      //However, it's unsecure to store passwords in the DB and we should leave that to Frebase's authentication "AngularFireAuth",
                      // therefore we set the password variable in this interface is optional using the "?" operator, thus pacifying TS's type safety rules and errors
  name: string,
  age: number,
  phoneNumber: string
}
