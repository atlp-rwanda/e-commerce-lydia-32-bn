import jwt from 'jsonwebtoken'

const generateToken = (res: any, userId: any, email: any, firstname: any) => {
    const token = jwt.sign({userId, email, firstname}, process.env.VERIFICATION_JWT_SECRET || '', {
        expiresIn: '3d'
    })

    res.cookie('jwt', token, {
        maxAge: 3 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    }) 
    return token
}

export default generateToken