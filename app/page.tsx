'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FerrisWheel, Bed, Building2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SearchWidget } from "@/src/components/ui/search-widget";
import { Card } from "@/src/components/ui/card";
import { NewsletterSubscription } from "@/src/components/ui/newsletter-subscription";

export default function Home() {
    const [activeTab, setActiveTab] = useState('strutture');

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white text-black p-4">
                <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-2 space-y-4 md:space-y-0">
                    <div className="flex flex-wrap justify-center md:justify-start items-center space-x-2 md:space-x-4 w-full md:w-auto">
                        <Button
                            variant="gradientHover"
                            className={`font-semibold group ${activeTab === 'attivita' ? 'active' : ''} text-xs sm:text-sm`}
                            onClick={() => setActiveTab('attivita')}
                        >
                            <FerrisWheel className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="relative">
                                Trova Attività
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
                                Trova Strutture
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
                                Trova Workspace
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] transition-transform duration-300 origin-left ${activeTab === 'workspace' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </span>
                        </Button>
                    </div>
                    <div className="flex-shrink-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                        <Image src="/logo.png" alt="Digital Lands" width={150} height={40} />
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end items-center space-x-2 md:space-x-4 w-full md:w-auto mt-4 md:mt-0">
                        <Button variant="secondary" className="text-xs sm:text-sm">Accedi</Button>
                        <Button className="bg-yellow-400 text-black text-xs sm:text-sm">Iscriviti</Button>
                        <Button variant="secondary" className="underline text-xs sm:text-sm">Ottieni la tua tessera</Button>
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
                    <SearchWidget
                        className="max-w-2xl mx-auto"
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                <div className="container mx-auto px-4">
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Guarda le strutture!</h2>
                            <Button variant="outlineYellow">Mostra più alloggi</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-location-1.png?height=192&width=384"
                                imageAlt="Alloggio a Ragusa"
                                title="Marina di Ragusa"
                                description="50€ / Notte · 2 persone"
                            />
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-location-2.png?height=192&width=384"
                                imageAlt="Altro alloggio a Ragusa"
                                title="Centro Storico"
                                description="70€ / Notte · 3 persone"
                            />
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Guarda le attività convenzionate!</h2>
                            <Button variant="outlineYellow">Mostra più attività</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-activity-1.jpg?height=128&width=384"
                                imageAlt="Attività a Ragusa"
                                title="Esperienza di Windsurf"
                                description="A partire da 30€ / persona"
                                className="h-auto"
                            />
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-activity-2.jpg?height=128&width=384"
                                imageAlt="Altra attività a Ragusa"
                                title="Escursione in barca"
                                description="A partire da 45€ / persona"
                                className="h-auto"
                            />
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-activity-3.jpg?height=128&width=384"
                                imageAlt="Terza attività a Ragusa"
                                title="Visita guidata"
                                description="A partire da 20€ / persona"
                                className="h-auto"
                            />
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Prenota un posto nei nostri workspace!</h2>
                            <Button variant="outlineYellow">Mostra più workspace</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-coworking-1.png?height=192&width=384"
                                imageAlt="Workspace a Ragusa"
                                title="Coworking Centro"
                                description="15€ / giorno · Postazione flessibile"
                            />
                            <Card
                                href="/location/ragusa"
                                imageSrc="/sample-coworking-2.png?height=192&width=384"
                                imageAlt="Altro workspace a Ragusa"
                                title="Ufficio privato"
                                description="30€ / giorno · Ufficio per 4 persone"
                            />
                        </div>
                    </section>
                    <section className="mb-12 flex flex-col items-start max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-600 w-full text-center">Ottieni la tua tessera per accedere alle <span className="text-[#FF6E00]">attività</span> e <span className="text-[#FF6E00]">strutture</span> convenzionate!</h2>
                        <div className="flex flex-col md:flex-row w-full">
                            <div className="md:w-1/3 flex flex-col items-center">
                                <Image src="/logo.png" alt="Digital Lands Logo" width={200} height={50} className="mb-4" />
                                <Button className="bg-yellow-400 text-black text-sm">Scopri di più</Button>
                            </div>
                            <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                                <p className="text-lg text-gray-500">Grazie alla tessera Lavoratore in Remoto, potrai usufruire di tutte le offerte e convenzioni presenti in piattaforma! Tantissime attività e strutture ti aspettano finito il tuo lavoro!</p>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12 text-center">
                        <h2 className="text-2xl font-semibold mb-6 text-black">Partners che credono in noi</h2>
                        <div className="flex justify-center">
                            <Image
                                src="/sample-partner-1.png"
                                alt="Partner Logo"
                                width={200}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                    </section>
                    <section className="relative z-20 -mb-16 mt-16">
                        <NewsletterSubscription />
                    </section>
                </div>
            </main>

            <footer className="bg-black p-8 pt-24">
                <div className="container mx-auto flex flex-wrap justify-between gap-8">
                <div className="pt-8">
                    <Image src="/logo-black.png" alt="Digital Lands Logo" width={100} height={25} className="mb-4" />
                    <div className="flex space-x-4">
                        <Facebook className="w-6 h-6 text-white" />
                        <Twitter className="w-6 h-6 text-white" />
                        <Instagram className="w-6 h-6 text-white" />
                        <Linkedin className="w-6 h-6 text-white" />
                    </div>
                </div>
                    <div className="pt-8">
                        <h3 className="font-semibold mb-2 text-white">Our Destinations</h3>
                        <ul className="text-sm text-white">
                            <li>Canada</li>
                            <li>Alaska</li>
                            <li>France</li>
                            <li>Iceland</li>
                        </ul>
                    </div>
                    <div className="pt-8">
                        <h3 className="font-semibold mb-2 text-white">About Us</h3>
                        <ul className="text-sm text-white">
                            <li>Our Story</li>
                            <li>Team</li>
                            <li>Careers</li>
                            <li>Press</li>
                        </ul>
                    </div>
                    <div className="pt-8">
                        <h3 className="font-semibold mb-2 text-white">Contact</h3>
                        <ul className="text-sm text-white">
                            <li>Support</li>
                            <li>FAQ</li>
                            <li>Partnerships</li>
                            <li>Advertising</li>
                        </ul>
                    </div>
                    <div className="pt-8">
                        <h3 className="font-semibold mb-2 text-white">Legal</h3>
                        <ul className="text-sm text-white">
                            <li>Terms of Service</li>
                            <li>Privacy Policy</li>
                            <li>Cookie Policy</li>
                            <li>GDPR</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
