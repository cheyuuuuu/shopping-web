import { Tabs, Flex } from "@chakra-ui/react"
import Link from "next/link";
import { useRouter } from "next/router";
import { FaAddressCard, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { IoHome, IoDocumentText } from "react-icons/io5";
import { CiTextAlignCenter } from "react-icons/ci";
import { PiCoffeeBeanFill } from "react-icons/pi";
import styles from "./Nav.module.css";
import {  useSession, signOut } from "next-auth/react";

export default function Nav(){
  const { data: session } = useSession();
  const router = useRouter();

  //設定對應路徑的tab value
  const pathToValueMap = {
    "/": "home",
    "/about": "about",
    "/commodity": "commodity",
    "/members": "members",
    "/shoppingCart": "shoppingCart",
  };
  
  const activeTab = pathToValueMap[router.pathname];

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // 停用 redirect，手動控制跳轉
    router.push("/"); // 手動跳轉到首頁
  };

  return (
    <Tabs.Root defaultValue={activeTab} variant="plain">
      <Flex justifyContent="flex-end" bg="bg.muted" rounded="l3" p="1" shadow="2px 2px 2px 2px gray">
        <Tabs.List  className={styles.list }> 
          <Link href="/" >
            <Tabs.Trigger value="home" padding = "3" >
            <IoHome />
            首頁
            </Tabs.Trigger>
          </Link>
          <Link href="/about" >
            <Tabs.Trigger value="about" padding = "3" >
            <CiTextAlignCenter />
            關於
            </Tabs.Trigger>
          </Link> 
          <Link href="/commodity"  >
            <Tabs.Trigger value="commodity" padding = "3" >
            <PiCoffeeBeanFill />
            商品
            </Tabs.Trigger>
          </Link>
          <Link href="/members"  >
            <Tabs.Trigger value="members" padding = "3" >
            <FaAddressCard />
            會員
            </Tabs.Trigger>
          </Link>
          <Link href="/shoppingCart" >
            <Tabs.Trigger value="shoppingCart" padding = "3">
            <FaShoppingCart />
            購物車
            </Tabs.Trigger>
          </Link>
          <Link href="/demo" >
            <Tabs.Trigger value="demo" padding = "3">
            <FaShoppingCart />
            測試
            </Tabs.Trigger>
          </Link>
          <Tabs.Indicator rounded="l3" />
          {session  ? (
            <div>
              <Tabs.Trigger value="demo" padding = "3">
              <FaSignOutAlt />
              <button onClick={handleSignOut} >登出</button>
              </Tabs.Trigger>
            </div>
          ) : (
            null
          )}
          {session  ? (
            <div>
            {session.user.role === 'admin' && (
                <Link href="/manner" >
                <Tabs.Trigger value="manner" padding = "3">
                <IoDocumentText />
                管理區
                </Tabs.Trigger>
              </Link>)}
            </div>
            ):(
              null
            )}
          
        </Tabs.List>
      </Flex>
    </Tabs.Root>
  
  )
}