"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Moon, Cloud, Heart, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define sound paths instead of imports
const lullabySound = "/sounds/hush-little-baby.mp3"
const midnightBeachSound = "/sounds/moonlit-beach-soundscape.mp3"
const calmingRainSound = "/sounds/nature-rain-medium-heavy-consistent.mp3"
const sweetLullabySound = "/sounds/sweet-lullaby.mp3"

interface SoundButton {
  id: string
  name: string
  activity: string
  icon: React.ReactNode
  soundSrc: string
}

export default function BabySoundApp() {
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Updated sound buttons with file paths
  const soundButtons: SoundButton[] = [
    {
      id: "lullaby",
      name: "Lullaby",
      activity: "Sleeping",
      icon: <Cloud className="h-10 w-10" />,
      soundSrc: lullabySound
    },
    {
      id: "midnight-beach",
      name: "Midnight Beach",
      activity: "Chill Nights",
      icon: <Moon className="h-10 w-10" />,
      soundSrc: midnightBeachSound
    },
    {
      id: "calming-rain",
      name: "Calming Rain",
      activity: "Comfort",
      icon: <Cloud className="h-10 w-10" />,
      soundSrc: calmingRainSound
    },
    {
      id: "sweet-lullaby",
      name: "Sweet Lullaby",
      activity: "Resting",
      icon: <Cloud className="h-10 w-10 rotate-180" />,
      soundSrc: sweetLullabySound
    },
  ]

  // Stop any currently playing sound
  const stopCurrentSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const toggleSound = (id: string) => {
    // If this sound is already active, stop it
    if (activeSound === id) {
      stopCurrentSound();
      setActiveSound(null);
      return;
    }

    // Stop any currently playing sound
    stopCurrentSound();

    // Start the new sound
    const button = soundButtons.find((b) => b.id === id);
    if (!button) return;

    // Create or get audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    audioRef.current.src = button.soundSrc;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Moderate volume
    
    // Play the audio file
    const playPromise = audioRef.current.play();
    
    // Handle potential play() promise rejection (browser policy)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Audio playback failed:", error);
      });
    }

    setActiveSound(id);
  }

  // Play a random sound
  const playRandomSound = () => {
    const randomIndex = Math.floor(Math.random() * soundButtons.length);
    const randomSoundId = soundButtons[randomIndex].id;
    toggleSound(randomSoundId);
  }

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentSound();
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mt-8 mb-2 text-purple-800">Baby Sleep Sounds</h1>

        <p className="text-center text-slate-600 mb-6 px-4">
          Soothing audio tracks to help your little one relax, sleep, and feel secure.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={playRandomSound}
          className="mb-8 flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200"
        >
          <Shuffle className="h-4 w-4" />
          <span>Random Track</span>
        </Button>

        {/* Updated to 2x2 grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {soundButtons.map((button) => (
            <Button
              key={button.id}
              variant="outline"
              size="lg"
              onClick={() => toggleSound(button.id)}
              className={cn(
                "h-36 flex flex-col items-center justify-center gap-2 rounded-xl transition-all border-purple-100",
                activeSound === button.id
                  ? "bg-purple-100 border-purple-200 shadow-inner"
                  : "bg-white hover:bg-blue-50",
              )}
            >
              <div
                className={cn(
                  "transition-colors mb-1",
                  activeSound === button.id ? "text-purple-700" : "text-purple-400",
                )}
              >
                {button.icon}
              </div>
              <span
                className={cn(
                  "font-medium text-base",
                  activeSound === button.id ? "text-purple-800" : "text-purple-600",
                )}
              >
                {button.name}
              </span>
              <span className={cn("text-sm", activeSound === button.id ? "text-purple-600" : "text-purple-400")}>
                For {button.activity}
              </span>
            </Button>
          ))}
        </div>

        {activeSound && (
          <Button
            variant="ghost"
            className="mt-8 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
            onClick={() => {
              stopCurrentSound()
              setActiveSound(null)
            }}
          >
            Stop Audio
          </Button>
        )}
      </div>
    </main>
  )
}
