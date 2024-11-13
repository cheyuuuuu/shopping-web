import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // 使用 Google 驗證
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: '信箱',
      credentials: {
        email: { label: '信箱', type: 'email', placeholder:'example@example.com' },
        password: { label: '密碼', type: 'password' },
      },
      authorize: async (credentials) => {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();
        if (res.ok && user.user) {
          
          return user.user; // 回傳資料庫中已驗證的使用者資料
        }
        return null; // 驗證失敗
      },
    }),
  ],
  callbacks:{
    async jwt({ token, user }) {
      // 確認 JWT 回調時是否有 user 物件
      
      if (user) {
        // 檢查使用者的電子郵件，並根據電子郵件設定角色
        if (user.email === 'fl64330786@gmail.com' || user.email === 'admin@admin.com') {
          token.role = 'admin';
        } else {
          token.role = 'user';
        }
      }
      return token;
    },
    async session({ session, token }) {
      // 使用 token 中的角色來設定 session 中的角色
      session.user.role = token.role;
      session.user.name = token.name;
      
      
      return session;
    },
  },

  // 如果需要將使用者的資料儲存在資料庫中，可以在 database 這個參數加上 url
  // database: process.env.DATABASE_URL,
});