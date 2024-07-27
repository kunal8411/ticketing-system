import mongoose from "mongoose";

//interface to create new user everytime
interface UserAttrs {
  email: string;
  password: string;
}

//interface to describe the user Model
interface UserModel extends mongoose.Model<UserDoc>{
    build(attr:UserAttrs):UserDoc
}

// interface that describes the properties thsat user document returns
interface UserDoc extends mongoose.Document{
    email:string;
    password:string
    createdAt?:string
    updatedAt?:string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, //capital S in the String because mongodb has its own constructor
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.buid = (attr: UserAttrs) => {
  return new User(attr);
};

// angle bracket syntax is generic syntax in typescript
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({
    email:'dfasf',
    password:'dsfas'
})

export {User}


// ************
// everytime we create user use this function so we wil ladd type checking for typescript inside this
// we can use the same also but for this approach we need to export 2 seperate function instead we need to pass single USER
// const buildUser = (attr: UserAttrs) => {
//   return new User(attr);
// };

// export { User, buildUser };
