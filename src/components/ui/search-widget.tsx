'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './input';
import { Button } from './button';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { FerrisWheel, Bed, Building2, Send } from 'lucide-react';

interface SearchWidgetProps {
    className?: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function SearchWidget({ className, activeTab, setActiveTab }: SearchWidgetProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [location, setLocation] = useState(searchParams.get('location'));
    const [dateRange, setDateRange] = useState(searchParams.get('dateRange'));
    const [showPromoCode, setShowPromoCode] = useState(false);
    const [promoCode, setPromoCode] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (dateRange) params.set('dateRange', dateRange);
        if (promoCode) params.set('promoCode', promoCode);
        router.push(`/search/${activeTab}?${params.toString()}`);
    };

    return (
        <div className={`w-full max-w-5xl mx-auto p-6 bg-[#FFFAFA] rounded-lg shadow-lg ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="bg-transparent">
                        <TabsTrigger 
                            value="attivita" 
                            className="text-sm sm:text-base font-semibold text-black bg-transparent hover:bg-transparent group data-[state=active]:bg-transparent data-[state=active]:text-black"
                        >
                            <FerrisWheel className="w-4 h-4 mr-2" />
                            <span className="relative">
                                Attività
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left group-data-[state=active]:scale-x-100"></span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="strutture" 
                            className="text-sm sm:text-base font-semibold text-black bg-transparent hover:bg-transparent group data-[state=active]:bg-transparent data-[state=active]:text-black"
                        >
                            <Bed className="w-4 h-4 mr-2" />
                            <span className="relative">
                                Strutture
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left group-data-[state=active]:scale-x-100"></span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="workspace" 
                            className="text-sm sm:text-base font-semibold text-black bg-transparent hover:bg-transparent group data-[state=active]:bg-transparent data-[state=active]:text-black"
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            <span className="relative">
                                Workspace
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFD144] to-[#FF903C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left group-data-[state=active]:scale-x-100"></span>
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                    <Input
                        type="text"
                        id="luogo"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Inserisci il luogo"
                        value={location ?? ''}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <label
                        htmlFor="luogo"
                        className="absolute text-xs text-gray-500 bg-white px-1 left-2 -top-2"
                    >
                        Luogo
                    </label>
                </div>
                <div className="flex-1 relative">
                    <Input
                        type="text"
                        id="periodo"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Seleziona le date"
                        value={dateRange ?? ''}
                        onChange={(e) => setDateRange(e.target.value)}
                    />
                    <label
                        htmlFor="periodo"
                        className="absolute text-xs text-gray-500 bg-white px-1 left-2 -top-2"
                    >
                        Periodo
                    </label>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setShowPromoCode(!showPromoCode)}
                    className="text-gray-600 hover:text-gray-800 font-light text-sm"
                >
                    + Aggiungi Codice Promo
                </button>
                <Button
                    onClick={handleSearch}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-regular"
                >
                    <Send className="mr-2 h-4 w-4" />
                    {activeTab === 'attivita' ? 'Mostra Attività' : activeTab === 'strutture' ? 'Mostra Strutture' : 'Mostra Workspace'}
                </Button>
            </div>
            {showPromoCode && (
                <Input
                    type="text"
                    placeholder="Codice Promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="mt-4 bg-[#FFFAFA]"
                />
            )}
        </div>
    );
}