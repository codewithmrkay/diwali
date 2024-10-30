import { useState, useEffect } from 'react'
import { Card, CardContent } from './components/ui/card';
import './index.css'
import { useNavigate } from 'react-router-dom';

// Diwali date (adjust as needed)
// const DIWALI_DATE = new Date('2024-11-01T00:00:00')
const DIWALI_DATE = new Date('2024-10-31T00:22:10')

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

export default function Page1() {
    const [name, setName] = useState('');
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
    const [_, setCurrentIndex] = useState(0);
    const [audio] = useState(new Audio('../public/gun.mp3')); // Add the path to your audio file
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % DAILY_CONTENT.length);
        }, 5000);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        // Set the audio to loop
        audio.loop = true;

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0 && !isPlaying) {
                audio.play();
                setIsPlaying(true); // Ensure audio plays only once
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [audio, isPlaying]);
    const handleNext = () => {
        if (name.trim() !== '') {
            navigate('/display', { state: { name } });
        } else {
            alert('Please enter your name.');
        }
    };
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
    return (
        <div className='relative w-full h-screen'>
            <div
                className="absolute inset-0 z-10 w-full h-screen pointer-events-none"
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 min-h-screen bg-transparent flex flex-col items-center justify-center p-4 overflow-hidden">
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
                            <CardContent className="p-1">
                                <div className="flex flex-col items-center justify-center min-h-[20vh] bg-gray-900 text-white rounded-lg p-2">
                                    <h1 className="text-3xl font-bold mb-6">Enter Your Name</h1>
                                    <input
                                        type="text"
                                        placeholder="Your name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="px-4 py-2 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleNext}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Collect Gift🎁
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Fireworks */}
                {/* Diya */}
            </div>
        </div>
    )
}