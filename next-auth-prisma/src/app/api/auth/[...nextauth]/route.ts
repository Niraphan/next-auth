import NextAuth, { AuthOptions, User, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LineProvider from "next-auth/providers/line";

const prisma = new PrismaClient();

// Extend the default User type
type AppUser = User & {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

// Extend the Session type to include id and role
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      id: string;
      role: string | null;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type to include id and role
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: { params: { scope: "email,public_profile" } },
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      authorization: { params: { scope: "profile openid email" } }, // Request email scope
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
      },
      async authorize(credentials, req): Promise<AppUser | null> {
        if (!credentials) return null;
      
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
      
        if (!user) {
          // Generate a dummy email if it's missing
          const generatedEmail = credentials.id + "@line.com";
      
          user = await prisma.user.create({
            data: {
              name: credentials?.name,
              email: credentials?.email || generatedEmail,
              image: credentials?.image,
              role: "member",
            },
          });
        }
      
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || null,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Type user as AppUser explicitly
      const typedUser = user as AppUser | undefined;
      if (typedUser?.id) {
        token.id = typedUser.id;
        token.role = typedUser.role || null; // Safe access with fallback
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role || null;
        session.user.image = token.picture; // Add role to session
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };