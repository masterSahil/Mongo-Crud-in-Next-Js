import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../model/user";

export async function GET(){
    try {
        await connectDB();

        const userData = await User.find();

        return NextResponse.json({
            success: true,
            user: userData,
        }, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: true,
            message: error.message,
        }, {status: 500});
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const {username, email, age} = await req.json();
        const newUser = await User.create({username, email, age});

        return NextResponse.json({
            success: true,
            user: newUser,
        }, 
        {status: 201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, 
        {status: 500})
    }
}