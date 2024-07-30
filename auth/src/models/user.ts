import mongoose from "mongoose";
import { Password } from "../services/password";

//interface to create new user everytime
interface UserAttrs {
  email: string;
  password: string;
}

//interface to describe the user Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttrs): UserDoc;
}

// interface that describes the properties thsat user document returns
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, //capital S in the String because mongodb has its own constructor
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id= ret._id
        delete ret._id
        delete ret.password;  //whenever we return the user schme to user e.g. after creating user we return user then password will not be in return of the user
        delete ret.__v
      },
    },
  }
);
// everytime this pre hook will gets calles by mongoose
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// angle bracket syntax is generic syntax in typescript
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

// ************
// everytime we create user use this function so we will add type checking for typescript inside this
// we can use the same also but for this approach we need to export 2 seperate function instead we need to pass single USER
// const buildUser = (attr: UserAttrs) => {
//   return new User(attr);
// };

// export { User, buildUser };
