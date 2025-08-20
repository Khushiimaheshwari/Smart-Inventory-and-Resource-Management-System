import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Smart Inventory System</h1>
      <Link href="/login">Go to Login</Link> <br />
      <Link href="/signup">Go to Signup</Link>
    </div>
  );
}
