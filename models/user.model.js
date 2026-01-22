const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },

        surname: {
            type: String,
            required: [true, "Please enter your surname"]
        },

        email: {
            type: String,
            required: [true, "Please enter your email"]
        },

        password: {
            type: String,
            required: [true, "Please enter your password"],
            select: false // Ne vraćaj password u default queries
        },

        role: {
            type: String,
            enum: ["user", "operator", "admin"],
            default: "user"
        }, 
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const User  = mongoose.model("User", UserSchema);
module.exports = User;