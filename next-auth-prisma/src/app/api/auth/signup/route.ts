import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, name, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });
        return new Response(JSON.stringify({ message: "User registered successfully", data: user }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to register" }), { status: 500 });
    }
}


export async function DELETE(request: Request) {
    const { email } = await request.json();
    try {
        const user = await prisma.user.delete({
            where: {
                email
            }
        });
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to delete" }), { status: 500 });
    }
}