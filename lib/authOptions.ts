// lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { authService } from "@/services/authService";
import type { AuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";

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

export const authOptions: AuthOptions = {
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
    async signIn({ 
      user, 
      account 
    }: { 
      user: User | AdapterUser; 
      account: any 
    }) {
      // Handle OAuth sign in (Google/Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const response =
            account.provider === "google"
              ? await authService.googleLogin()
              : await authService.facebookLogin();

          const roles = normalizeRoles(response.user.roles);

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
      return true;
    },

    async jwt({ 
      token, 
      user, 
      account, 
      trigger, 
      session 
    }: {
      token: JWT;
      user?: User | AdapterUser;
      account?: any;
      trigger?: "signIn" | "signUp" | "update";
      session?: any;
    }) {
      const tokenWithMeta = withTokenMeta(token);

      if (account && user) {
        const metaUser = withUserMeta(user);
        tokenWithMeta.accessToken = metaUser.accessToken;
        tokenWithMeta.roles = metaUser.roles ?? [];

        return {
          ...tokenWithMeta,
          ...user,
        };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return tokenWithMeta;
    },

    async session({ 
      session, 
      token 
    }: { 
      session: Session; 
      token: JWT 
    }) {
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
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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