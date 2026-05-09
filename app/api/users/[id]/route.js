import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../model/user";

export async function PUT(req, {params}) {
    try {
        await connectDB();

        const {id} = await params;
        const {username, email, age} = await req.json();
        const updated = await User.findByIdAndUpdate(id, {username, email, age}, {new: true});

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: "User Not Found to Update",
            }, {status: 404});
        }
        return NextResponse.json({
            success: true,
            user: updated,
        }, 
        {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, 
        {status: 500})
    }
}

export async function DELETE(req, {params}){
    try {
        await connectDB();

        const {id} = await params;
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: "User Not Found to Delete",
            })
        }

        return NextResponse.json({
            success: true,
            user: deleted,
        }, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, {status: 500});
    }
}