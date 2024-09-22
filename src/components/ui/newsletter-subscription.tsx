'use client';

import { useState } from 'react';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the email to your API
    console.log('Submitted email:', email);
    setEmail('');
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
            />
            <Button variant="secondaryDark" type="submit">
              Iscriviti
            </Button>
          </form>
        </div>
        <div className="hidden md:block w-1/3 relative">
          <div className="relative z-10 w-full h-full overflow-hidden rounded-lg">
            <img
              src="/mailbox-img.png?height=200&width=200"
              alt="Newsletter visual"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}