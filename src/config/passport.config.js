import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";
import { userModel } from "../daos/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

export const initializePassport = ()=>{
    passport.use("registerStrategy", new localStrategy(
        {
            usernameField: "email",
            passReqToCallback: true
        },
        async(req, username, password, done)=>{
            try {
                const userRegisterForm = req.body;
                const user = await userModel.findOne({email:username});

                if (!user) {

                    if (userRegisterForm.email.endsWith("@coder.com") && userRegisterForm.password.startsWith("adminCod3r")) {
                        userRegisterForm.role = "admin";
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
                        console.log(userCreated);
                        return done(null, userCreated);
                    }else{
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
        
                    console.log(userCreated);
                        
                    return done(null, userCreated);
                        }
                }else{
                    return done(null, false);
                }

            } catch (error) {
                return done(error);
            }

        }
    ));
                
    //  login strategy
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField: "email"
        },
        async(username, password,done)=>{
            try {
                const userDB = await userModel.findOne({email:username});
    
                if (userDB) {
                    
                    if (isValidPassword(password, userDB)) {
                        return done(null, userDB);
                    } else{
                        return done(null,false);
                    }
    
                } else {
                    return done(null, false);
                }
    
    
            } catch (error) {
                return done(error);
            }
    
        }
    ));

// github login strategy
passport.use("githubLogin", new githubStrategy(
    {
        clientID:"Iv1.de4675ac81189e45",
        clientSecret:"a9140128fb59b0b5799ea634e3aa23989b2ad71e",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    },
    async(accesstoken, refreshtoken, profile, done)=>{
            try {
               console.log("profile: ", profile); 

               const user = await userModel.findOne({email:profile.username});
               
               if(!user){

                    const newUser = {
                        first_name: profile.username,
                        last_name:"",
                        age: null,
                        email: profile.username,
                        password: createHash(profile.id)
                    }
                    const userCreated = await userModel.create(newUser);

                    return done (null, userCreated);


               }else{
                return done(null, false);
               }

            } catch (error) {
                return done(error);
            }
    }
));

passport.serializeUser((user, done)=>{
    done(null, user._id);
});

passport.deserializeUser(async(id, done)=>{
    const userDB = await userModel.findById(id);
    done(null, userDB);
});

}
