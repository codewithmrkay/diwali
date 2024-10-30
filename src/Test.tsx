import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from './components/ui/card';
import  './index.css'

// Diwali date (adjust as needed)
const DIWALI_DATE = new Date('2024-11-01T00:00:00')

// Sample daily content (expand this with more content)
const DAILY_CONTENT = [
  { type: 'tip', content: 'Start cleaning your home to prepare for Diwali. Watch out for those cobwebs in the corners!' },
  { type: 'tip', content: 'Try making traditional Diwali sweets like Gulab Jamun. Warning: May cause extreme sweetness!' },
  { type: 'trivia', content: 'Diwali is also known as the Festival of Lights. Get ready to shine bright like a diya!' },
  { type: 'tip', content: 'Decorate your home with colorful rangoli designs. Just don’t trip over them!' },
  { type: 'tip', content: 'Prepare savory snacks like Chakli or Murukku. Perfect for munching while chatting with guests!' },
  { type: 'situation', content: 'When you realize you’ve eaten too many sweets but can’t stop reaching for more. 🤤' },
  { type: 'situation', content: 'Trying to light fireworks with a matchstick while praying it doesn’t fizzle out. 🕯️' },
  { type: 'tip', content: 'Use eco-friendly fireworks to celebrate Diwali. Mother Earth will thank you!' },
  { type: 'situation', content: 'When your rangoli looks more like a modern art piece than a traditional design. 🎨' },
  { type: 'tip', content: 'Gift your loved ones something special this Diwali. Homemade sweets always win hearts!' },
  { type: 'situation', content: 'When you hear the sound of firecrackers and wonder if it’s time to run or enjoy the show. 💥' },
  { type: 'tip', content: 'Light diyas in every corner of your home for a warm and festive ambiance. Watch out for the wind!' },
  { type: 'situation', content: 'When you accidentally step on a firecracker and do an impromptu dance. 💃' },
  { type: 'tip', content: 'Wear traditional attire for Diwali celebrations. It’s the perfect occasion to flaunt your style!' },
  { type: 'situation', content: 'When the power goes out, and you realize you’re surrounded by a sea of diyas. 🌟' },
  { type: 'tip', content: 'Create a playlist of your favorite festive songs to set the mood. Don’t forget to dance!' },
  { type: 'situation', content: 'When you try to take a perfect selfie with fireworks in the background and end up with a blurry mess. 📸' },
  { type: 'tip', content: 'Make a list of people you want to wish Happy Diwali. Spread the joy far and wide!' },
  { type: 'situation', content: 'When you realize you’ve bought enough sweets to last until the next Diwali. 🍬' },
  { type: 'tip', content: 'Organize a Diwali potluck with friends and family. It’s the best way to share delicious food!' },
  { type: 'situation', content: 'Trying to untangle fairy lights and questioning your life choices. 🌟' },
  { type: 'tip', content: 'Write down your goals for the upcoming year. Diwali is a time for new beginnings!' },
  { type: 'situation', content: 'When the kids insist on bursting crackers, and you’re left supervising with earplugs. 🎧' },
  { type: 'tip', content: 'Make sure to have a first-aid kit handy. Safety first while celebrating!' },
  { type: 'situation', content: 'When the rangoli powder gets everywhere except on the design. 🖌️' },
  { type: 'tip', content: 'Share stories and memories of past Diwalis with your loved ones. It’s a great way to bond!' },
  { type: 'situation', content: 'When you try to be a rangoli artist and end up creating a unique abstract piece. 🎨' },
  { type: 'tip', content: 'Plan a Diwali game night with family and friends. From cards to charades, keep the fun rolling!' },
  { type: 'situation', content: 'When you light a diya and forget about it, causing a mini heart attack when you remember. 🕯️' },
  { type: 'tip', content: 'Thank your neighbors for their festive spirit. Diwali is all about community and togetherness!' },
];
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DiwaliCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % DAILY_CONTENT.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  function calculateTimeLeft(): TimeLeft {
    const difference = +DIWALI_DATE - +new Date()
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return timeLeft
  }

  const handleFireworks = ()=>{

  }
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <Card className="w-full max-w-md bg-gray-200/20 backdrop-blur-sm relative z-10">
        <CardContent className="p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-center text-orange-500 mb-4">Diwali Countdown</h1>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-orange-500">
              {timeLeft.days}
              <span className="text-2xl"> days </span>
              {timeLeft.hours}
              <span className="text-2xl"> hrs </span>
              {timeLeft.minutes}
              <span className="text-2xl"> min </span>
              {timeLeft.seconds}
              <span className="text-2xl"> sec</span>
            </div>
          </div>
          <Card className="bg-orange-50 border-white border-2 rounded-lg mb-6">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2 text-orange-700">Daily {DAILY_CONTENT[currentIndex].type}</h2>
              <p className="text-orange-800">{DAILY_CONTENT[currentIndex].content}</p>
            </CardContent>
          </Card>
          <div className="text-lg font-bold flex justify-center items-center flex-col gap-3 text-center">
            <h3 onClick={handleFireworks} className="px-3 py-1 rounded-sm w-fit bg-yellow-500 hover:bg-yellow-600 text-white">
              Click Screen for Fireworks!
            </h3>
            <h3 onClick={handleFireworks} className="px-3 py-1 rounded-sm w-fit bg-yellow-500 hover:bg-yellow-600 text-white" >
              You Received Your Gift🎁 <br /> After CountDown Complete
            </h3>
            {/* <Button onClick={() => setIsDiyaLit(!isDiyaLit)} id='diya' className="bg-orange-500 hover:bg-orange-600 text-white">
              {isDiyaLit ? 'Extinguish' : 'Light'} Diya
            </Button> */}
          </div>
        </CardContent>
      </Card>
      
      {/* Fireworks */}
      {/* Diya */}
    </div>
  )
}