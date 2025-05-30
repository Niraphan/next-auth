import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    console.log('session', session);


    return Response.json({ message: "User profile", session });
}