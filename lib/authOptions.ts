// lib/authOptions.ts
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
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          // Set token in cookies
          authService.setToken(response.token);

          return {
            id: response.user.email, // Using email as ID since user ID isn't in response
            email: response.user.email,
            name: response.user.userName,
            roles: response.user.roles,
            accessToken: response.token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers
        if (account.provider !== "credentials") {
          try {
            let response;
            if (account.provider === "google") {
              response = await authService.googleLogin(account.access_token!);
            } else if (account.provider === "facebook") {
              response = await authService.facebookLogin(account.access_token!);
            } else {
              throw new Error(`Unsupported OAuth provider: ${account.provider}`);
            }
            
            token.accessToken = response.token;
            token.roles = response.user.roles;

            // Set token in cookies
            authService.setToken(response.token);
          } catch (error) {
            console.error("OAuth error:", error);
            return token;
          }
        } else {
          // For credentials login
          token.accessToken = (user as { accessToken?: string }).accessToken;
          token.roles = (user as { roles?: string[] }).roles;
        }

        return {
          ...token,
          ...user,
        };
      }

      // Handle session update in client
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: token.picture as string,
        roles: token.roles as string[],
      };
      session.accessToken = token.accessToken as string;

      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, we handle the token in the jwt callback
      return true;
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
