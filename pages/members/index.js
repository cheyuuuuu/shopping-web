
import SinginBtn from '../../components/singinbtn';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <SinginBtn>
        </SinginBtn>
        <br/>
        <Link href="/members/register">尚未註冊請先註冊</Link>
      </div>
    );
  }
  
  return (
    <div>
      <h1>歡迎, {session.user.name}</h1>
      {session.user.role === 'admin' ? (
        <div>
          <h2>管理員控制台</h2>
          <p>這裡是只有管理員可以看到的內容。</p>
        </div>
      ) : (
        <div>
          <p>這裡可以瀏覽您的個人資料。</p>
          <Link href="/shoppingCart">查看購物車</Link>
        </div> 
      )}
      <button onClick={() => signOut()}>登出</button>
    </div>
  );
}
