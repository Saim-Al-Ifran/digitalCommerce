import mongoose, {Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/models.type';


const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  image:{
    type: String,
    default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  password: {
    type: String,
    required: true,
    minlength: 6 
  },
  isActive:{
     type:Boolean,
     default:true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshTokens: [
    {
     token: String,
    }
  ]
});

userSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
