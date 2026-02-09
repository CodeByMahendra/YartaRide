import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Captain from '@/models/Captain';
import connectToDb from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserFromToken(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;

        const decoded: any = jwt.verify(token, JWT_SECRET);
        await connectToDb();
        const user = await User.findById(decoded._id);
        return user;
    } catch (error) {
        return null;
    }
}

export async function getCaptainFromToken(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
        if (!token) return null;

        const decoded: any = jwt.verify(token, JWT_SECRET);
        await connectToDb();
        const captain = await Captain.findById(decoded._id);
        return captain;
    } catch (error) {
        return null;
    }
}
