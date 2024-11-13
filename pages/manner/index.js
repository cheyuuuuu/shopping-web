import { useSession } from 'next-auth/react';
import Link from 'next/link';


export default function Manner(){
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>載入中...</div>;
  }
  if(session.user.role === 'admin' ){
    return(
      <div>
        <h3>這是管理員區</h3>
        <Link href="/manner/upload">新增商品</Link>
        <Link href="/manner/edit">修改商品</Link>
      </div>
    )
  }
  return(
    <div>來錯地方囉~</div>
  );
}