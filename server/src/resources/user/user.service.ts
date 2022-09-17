import UserModel from "@/resources/user/user.model";
import token from '@/utils/token';

class UserServices {
    private user = UserModel;
     /**
     * Attempt to singUp of a new user
     */
      public async signUp(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({email, password});

            const accessToken = token.createToken(user);
            return accessToken;
            
        }catch (err) {
            throw new Error('Unable to create new user');
        }
    } 

    /**
     * Attempt to signIn of a user
     */
    public async signIn (
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({email});
            if(!user) {
                throw new Error('Unable to find user with that email address');
            }
            if(await user.isValidPassword(password)) {
               return token.createToken(user);
            } else {
                throw new Error('Password is incorrect');
            }
        }catch (err) {
            throw new Error('Unable to login user');
        }
    }
}
export default UserServices;