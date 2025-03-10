import jwt from 'jsonwebtoken';

export const generateToken = ( userId , res ) => {

    const token = jwt.sign({userId} , process.env.JWT_SECRET , {
        expiresIn: "30d"
    });

    //  send jwt cookies

    res.cookie("jwt" , token , {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
    })

    return token;

};