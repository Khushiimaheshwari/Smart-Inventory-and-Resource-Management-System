import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions"; 
import LayoutClient from "./layoutClient";

export default async function TechnicianPanelLayout({ children }) {
  const session = await getServerSession(authOptions);
  
    return (
      <LayoutClient session={session}>
        {children}
      </LayoutClient>
  );
}
