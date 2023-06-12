import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    fisrt_name: {
        type:String,
        required:true
    },
    last_name: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type: String,
        required:true,
        enum:["usuario","admin"],
        default: 'usuario',
    }
});

export const userModel = mongoose.model(usersCollection, usersSchema);
