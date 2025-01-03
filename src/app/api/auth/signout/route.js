// // app/api/auth/signout/route.js
// import { cookies } from 'next/headers';

// export async function POST() {
//   cookies().delete('session');
//   return Response.json({ success: true });
// }



// app/api/auth/signout/route.js
import { cookies } from 'next/headers';

export async function POST() {
  // Await the cookies function
  const cookiesList = await cookies();
  
  // Delete the 'session' cookie
  cookiesList.delete('session');

  return Response.json({ success: true });
}
