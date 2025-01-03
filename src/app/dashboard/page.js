// app/dashboard/page.js
import SignOutButton from "./SignOutButton";
import { cookies } from 'next/headers';

async function getUser(session) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session }),
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  }
  
  export default async function Dashboard() {
    const session = cookies().get('session')?.value;
    const user = session ? await getUser(session) : null;
  
    if (!user) {
      redirect('/signin');
    }
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {user.email}!</p>
        <SignOutButton />
      </div>
    );
  }
  