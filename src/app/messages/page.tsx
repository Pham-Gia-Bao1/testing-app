
import { generateMetadata } from '@/utils';
import Image from 'next/image'
import React from 'react'
export const metadata = generateMetadata("Messages", "Check your messages and stay connected at LayRestaurant.");
export default function page() {
  return (
    <main className=" min-h-screen flex flex-col items-center justify-betwee bg-white h-full">
    <div className=" min-h-screen flex-1 bg-gray-800  w-full">
      <div className="flex h-screen bg-white text-black items-center justify-center">
          <Image src='https://img.freepik.com/premium-vector/man-with-welcome-inscription-happy-young-guy-glad-see-newcomer-workplace-emotions-gestures_118813-17709.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1719100800&semt=ais_user' alt='welcom image' width={500} height={500} />
      </div>
    </div>
  </main>
  )
}
