import { useFirebaseUser } from "./firebase";

interface IProtectedprops {
  children: React.ReactNode;
  redirect: React.ReactNode;
}

export const ProtectedPath = ({ children, redirect }: IProtectedprops) => {
  const user = useFirebaseUser();
  return <>{user ? children : redirect}</>;
};
