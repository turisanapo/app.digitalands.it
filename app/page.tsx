'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FerrisWheel, Bed, Building2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SearchWidget } from "@/src/components/ui/search-widget";
import { Card } from "@/src/components/ui/card";
import { CardSkeleton } from "@/src/components/ui/card-skeleton";
import { NewsletterSubscription } from "@/src/components/ui/newsletter-subscription";
import { getLocations, type Location } from '@/src/lib/supabase/locations';
import { getActivities, type Activity } from '@/src/lib/supabase/activities';
import { getWorkspaces, type Workspace } from '@/src/lib/supabase/workspaces';
import { useAuth } from '@/src/components/providers/auth-provider'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [activeTab, setActiveTab] = useState('strutture');
    const [locations, setLocations] = useState<Location[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const membershipSectionRef = useRef<HTMLDivElement>(null);
    const { user, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const [locationsData, activitiesData, workspacesData] = await Promise.all([
                    getLocations(),
                    getActivities(),
                    getWorkspaces()
                ]);
                setLocations(locationsData);
                setActivities(activitiesData);
                setWorkspaces(workspacesData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const scrollToMembership = () => {
        membershipSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white text-black p-4">
                <nav className="flex flex-col lg:flex-row items-center justify-between px-4 py-2 space-y-4 lg:space-y-0">
                    <div className="hidden lg:flex flex-wrap justify-center lg:justify-start items-center space-x-2 lg:space-x-4 w-full lg:w-auto">
                        <Button
                            variant="gradientHover"
                            className={`font-semibold group ${activeTab === 'attivita' ? 'active' : ''} text-xs sm:text-sm`}
                            onClick={() => setActiveTab('attivita')}
                        >
                            <FerrisWheel className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="relative">
                                Attività
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] transition-transform duration-300 origin-left ${activeTab === 'attivita' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </span>
                        </Button>
                        <Button
                            variant="gradientHover"
                            className={`font-semibold group ${activeTab === 'strutture' ? 'active' : ''} text-xs sm:text-sm`}
                            onClick={() => setActiveTab('strutture')}
                        >
                            <Bed className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="relative">
                                Strutture
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] transition-transform duration-300 origin-left ${activeTab === 'strutture' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </span>
                        </Button>
                        <Button
                            variant="gradientHover"
                            className={`font-semibold group ${activeTab === 'workspace' ? 'active' : ''} text-xs sm:text-sm`}
                            onClick={() => setActiveTab('workspace')}
                        >
                            <Building2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="relative">
                                Workspace
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] transition-transform duration-300 origin-left ${activeTab === 'workspace' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </span>
                        </Button>
                    </div>
                    <div className="flex justify-between items-center w-full lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-auto">
                        <div className="flex-shrink-0">
                            <Image 
                                src="/logo.png" 
                                alt="Digital Lands" 
                                width={120} 
                                height={32}
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>
                        <div className="flex items-center space-x-2 lg:hidden">
                            {user ? (
                                <Button
                                    variant="secondary"
                                    className="text-xs sm:text-sm"
                                    onClick={signOut}
                                >
                                    Esci
                                </Button>
                            ) : (
                                <Button
                                    className="bg-yellow-400 text-black text-xs sm:text-sm"
                                    onClick={() => router.push('/login')}
                                >
                                    Accedi
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-2">
                        <Button
                            variant="secondary"
                            className="underline text-xs sm:text-sm"
                            onClick={scrollToMembership}
                        >
                            Ottieni la tua tessera
                        </Button>
                        {user ? (
                            <Button
                                variant="secondary"
                                className="text-xs sm:text-sm"
                                onClick={signOut}
                            >
                                Esci
                            </Button>
                        ) : (
                            <Button
                                className="bg-yellow-400 text-black text-xs sm:text-sm"
                                onClick={() => router.push('/login')}
                            >
                                Accedi
                            </Button>
                        )}
                    </div>
                </nav>
            </header>
            <main className="w-full">
                <section className="text-center py-16 relative w-full h-[65vh] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/homepage-header-img.webp')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[#FFC107] to-[#FFA100] text-transparent bg-clip-text">RAGUSA</span>
                            <br />VIVI E LAVORA
                        </h1>
                        <p className="text-lg mb-8 text-white">La prima città completamente dedicata ai nomadi digitali</p>
                    </div>
                </section>

                {/* SearchWidget positioned between sections */}
                <div className="relative z-20 -mt-16 mb-16">
                    <Suspense>
                        <SearchWidget
                            className="max-w-2xl mx-auto"
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </Suspense>
                </div>

                <div className="container mx-auto px-4">
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Guarda le strutture!</h2>
                            <Button variant="outlineYellow">Mostra più strutture</Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                locations.map((location) => (
                                    <Card
                                        key={location.id}
                                        images={location.images}
                                        all_images={location.all_images}
                                        imageAlt={location.title}
                                        title={location.title}
                                        location={location.location}
                                        description={location.description}
                                        whatsappUrl={location.whatsapp_url || undefined}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Guarda le attività convenzionate!</h2>
                            <Button variant="outlineYellow">Mostra più attività</Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                activities.map((activity) => (
                                    <Card
                                        key={activity.id}
                                        images={activity.images}
                                        all_images={activity.all_images}
                                        imageAlt={activity.title}
                                        title={activity.title}
                                        location={activity.location}
                                        description={activity.description}
                                        whatsappUrl={activity.whatsapp_url || undefined}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Prenota un posto nei nostri workspace!</h2>
                            <Button variant="outlineYellow">Mostra più workspace</Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {isLoading ? (
                                Array.from({ length: 2 }).map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            ) : (
                                workspaces.map((workspace) => (
                                    <Card
                                        key={workspace.id}
                                        images={workspace.images}
                                        all_images={workspace.all_images}
                                        imageAlt={workspace.title}
                                        title={workspace.title}
                                        location={workspace.location}
                                        description={workspace.description}
                                        whatsappUrl={workspace.whatsapp_url || undefined}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                    <section ref={membershipSectionRef} className="mb-12 flex flex-col items-center max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-600 w-full text-center">Ottieni la tua tessera per accedere alle <span className="text-[#FF6E00]">attività</span> e <span className="text-[#FF6E00]">strutture</span> convenzionate!</h2>
                        <div className="flex flex-col md:flex-row w-full justify-center">
                            <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0 text-center">
                                <p className="text-lg text-gray-500">Grazie alla tessera Lavoratore in Remoto, potrai usufruire di tutte le offerte e convenzioni presenti in piattaforma! Tantissime attività e strutture ti aspettano finito il tuo lavoro!</p>
                            </div>
                        </div>
                    </section>
                    <section className="relative z-20 -mb-16 mt-16">
                        <NewsletterSubscription />
                    </section>
                </div>
            </main>

            <footer className="bg-black p-16">
                <div className="container mx-auto flex items-center justify-center">
                    <div className="flex items-center gap-8">
                        <Image 
                            src="/logo-black.png" 
                            alt="Digital Lands Logo" 
                            width={120} 
                            height={30}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <a 
                            href="https://www.instagram.com/digitalands.it" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <svg 
                                className="w-5 h-5 text-white" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <p className="text-white text-sm">Tutti i diritti riservati.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
