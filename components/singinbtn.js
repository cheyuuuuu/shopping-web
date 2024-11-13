import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (!session) {
    return (
      <>
        您還沒登入 <br/>
        <button  onClick={() => signIn()}>點此登入</button>
      </>
    )
  }
}