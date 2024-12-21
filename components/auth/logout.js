import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function Logout() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return <button onClick={handleLogout}>Sair</button>;
}