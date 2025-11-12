import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { authService } from "@/Services/authService";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { user, token } = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            accessToken: token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers, you might want to create/link accounts with your .NET API
        if (account.provider !== "credentials") {
          // Handle OAuth sign in - you'll need to implement this based on your .NET API
          try {
            // This is where you'd call your .NET API to handle OAuth
            // const response = await authService.oauthSignIn(account.provider, account.access_token);
            // token.accessToken = response.token;
          } catch (error) {
            console.error("OAuth error:", error);
          }
        } else {
          // For credentials login, we already have the token from authorize
          token.accessToken = (user as any).accessToken;
        }

        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: token.picture as string,
      };
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
