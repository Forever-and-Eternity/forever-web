'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Camera, Lock, Users, Clock, BookOpen, Shield, Sparkles } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 py-20 lg:py-32">
            {/* Background gradient accent */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 -right-20 h-72 w-72 rounded-full bg-gradient-ig opacity-10 blur-3xl animate-gradient" />
                <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-gradient-ig opacity-5 blur-3xl animate-gradient" style={{ animationDelay: '2s' }} />
            </div>

            <div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Left: Text content */}
                <div className="flex-1 text-center lg:text-left animate-fade-in">
                    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>Preserve what matters most</span>
                    </div>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        Your Family&apos;s Story,{' '}
                        <span className="text-gradient-ig">Preserved Forever</span>
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                        Create private havens to gather photos, stories, and memories. Lock time capsules for future milestones.
                        Build a legacy your family will treasure for generations.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/register">
                            <Button size="lg" className="bg-gradient-ig text-white hover:opacity-90 px-8 font-semibold shadow-lg w-full sm:w-auto">
                                Start Free
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button size="lg" variant="outline" className="px-8 font-semibold w-full sm:w-auto">
                                Learn More
                            </Button>
                        </a>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">500 MB free — No credit card required</p>
                </div>

                {/* Right: Icon illustration */}
                <div className="flex-1 hidden lg:flex justify-center">
                    <div className="relative w-80 h-80">
                        {/* Central heart */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-2xl bg-gradient-ig flex items-center justify-center shadow-xl animate-pulse">
                            <Heart className="h-10 w-10 text-white" />
                        </div>
                        {/* Orbiting icons */}
                        <div className="absolute top-4 left-8 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '200ms', animation: 'float 6s ease-in-out infinite' }}>
                            <Camera className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="absolute top-8 right-6 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '400ms', animation: 'float 6s ease-in-out infinite 1s' }}>
                            <Lock className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="absolute bottom-16 left-2 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '600ms', animation: 'float 6s ease-in-out infinite 2s' }}>
                            <Users className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="absolute bottom-4 right-12 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '800ms', animation: 'float 6s ease-in-out infinite 3s' }}>
                            <Clock className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '1000ms', animation: 'float 6s ease-in-out infinite 4s' }}>
                            <BookOpen className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-14 w-14 rounded-xl bg-card border shadow-md flex items-center justify-center animate-fade-in" style={{ animationDelay: '1200ms', animation: 'float 6s ease-in-out infinite 5s' }}>
                            <Shield className="h-7 w-7 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
