'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Iscrizione avvenuta con successo!');
        setEmail('');
      } else {
        throw new Error(data.message || 'Errore durante l\'iscrizione');
      }
    } catch (error) {
      toast.error('Si è verificato un errore. Riprova più tardi.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-300 to-orange-400">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 md:w-2/3">
          <h2 className="text-3xl font-bold tracking-tighter text-black">Iscriviti alla Newsletter</h2>
          <p className="text-xl font-semibold text-black">Digital Lands</p>
          <p className="text-black">
            Lasciati ispirare! Ricevi sconti di viaggio, consigli e storie dietro le quinte.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              type="email"
              placeholder="Il tuo indirizzo email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white text-black"
              required
              disabled={isLoading}
            />
            <Button variant="secondaryDark" type="submit" disabled={isLoading}>
              {isLoading ? 'Invio in corso...' : 'Iscriviti'}
            </Button>
          </form>
        </div>
        <div className="hidden md:block w-1/3 relative">
          <div className="relative z-10 w-full h-full overflow-hidden rounded-lg">
            <Image
              src="/mailbox-img.png"
              alt="Newsletter visual"
              width={200}
              height={200}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}