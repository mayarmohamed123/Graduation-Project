// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { authService } from "@/Services/authService";

const normalizeRoles = (roles?: string[] | string) => {
  if (!roles) return [];
  return Array.isArray(roles) ? roles : [roles];
};

type UserMeta = {
  roles?: string[];
  accessToken?: string;
};

type TokenMeta = JWT & {
  roles?: string[];
  accessToken?: string;
};

const withUserMeta = <T extends object>(user: T) => user as T & UserMeta;
const withTokenMeta = (token: JWT) => token as TokenMeta;

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
          const roles = normalizeRoles(response.user.roles);

          return {
            id: response.user.email,
            email: response.user.email,
            name: response.user.userName,
            roles,
            accessToken: response.token,
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
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign in (Google/Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Call your .NET API - no parameters needed since your API doesn't require them
          const response =
            account.provider === "google"
              ? await authService.googleLogin()
              : await authService.facebookLogin();

          // Store the token in cookies
          authService.setToken(response.token);
          const roles = normalizeRoles(response.user.roles);

          // Update user object with data from your API
          user.id = response.user.email;
          user.email = response.user.email;
          user.name = response.user.userName;
          const metaUser = withUserMeta(user);
          metaUser.roles = roles;
          metaUser.accessToken = response.token;

          return true;
        } catch (error) {
          console.error("OAuth signin error:", error);
          return false;
        }
      }
      return true; // For credentials, return true
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      const tokenWithMeta = withTokenMeta(token);

      if (account && user) {
        if (account.provider === "credentials") {
          // For credentials login
          const metaUser = withUserMeta(user);
          tokenWithMeta.accessToken = metaUser.accessToken;
          tokenWithMeta.roles = metaUser.roles ?? [];
        }
        // For OAuth, we've already handled the token in signIn callback
        else if (
          account.provider === "google" ||
          account.provider === "facebook"
        ) {
          const metaUser = withUserMeta(user);
          tokenWithMeta.accessToken = metaUser.accessToken;
          tokenWithMeta.roles = metaUser.roles ?? [];
        }

        return {
          ...tokenWithMeta,
          ...user,
        };
      }

      // Handle session update in client
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      // Always ensure we have the latest token from cookies
      const cookieToken = authService.getToken();
      if (cookieToken && cookieToken !== tokenWithMeta.accessToken) {
        tokenWithMeta.accessToken = cookieToken;
      }

      return tokenWithMeta;
    },

    async session({ session, token }) {
      const tokenWithMeta = withTokenMeta(token);
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: token.picture as string,
        roles: tokenWithMeta.roles ?? [],
      };
      session.accessToken = tokenWithMeta.accessToken as string;

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
