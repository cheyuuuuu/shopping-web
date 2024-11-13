import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Register() {
  const [user, setUser] = useState({ name: '', email: '', password: '', role:'user' });
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for( let i in user ){
        if (user[i] === ""){
          alert("還有空格沒輸入！");
          return;
        }else break;
      }
    

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('用戶創建成功:', data);
      setUser({ name: '', email: '', password: '',role:'user' });
      alert("註冊成功！ 按下確認跳轉至登入")
      router.push('/members/login');
    } else {
      console.error('錯誤:', data);
      alert(data.message + "！");
    }
  };

  return (
    <div>
      <h1>會員註冊</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="姓名"
          value={user.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="電子郵件"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="密碼"
          value={user.password}
          onChange={handleChange}
        />
        <button type="submit">註冊</button>
      </form>
      <Link href="/members">回上一頁</Link>
    </div>
  );
}
