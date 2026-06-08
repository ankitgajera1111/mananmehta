import React, { useState } from 'react';
import { Mail, Instagram, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { composerInfo } from '../data/mock';
import { cn } from '../lib/utils';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, projectType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (will be replaced with backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', projectType: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Side - Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-amber-500" />
                </div>
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">Get in Touch</p>
              </div>
              <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
                LET'S <span className="text-amber-500">TALK</span>
              </h1>
              <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed mb-12">
                Have a project in mind? I'd love to hear about it. Fill out the form or reach out directly through email or social media.
              </p>

              {/* Contact Info */}
              <div className="space-y-6">
                <a
                  href={`mailto:${composerInfo.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#f5f5f0]/50 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-[#f5f5f0] group-hover:text-amber-500 transition-colors">{composerInfo.email}</p>
                  </div>
                </a>

                <a
                  href={composerInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Instagram className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#f5f5f0]/50 uppercase tracking-wider mb-1">Instagram</p>
                    <p className="text-[#f5f5f0] group-hover:text-amber-500 transition-colors">@{composerInfo.instagram}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#151515]">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#f5f5f0]/50 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-[#f5f5f0]">{composerInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:pl-12">
              <div className="p-8 lg:p-10 rounded-2xl bg-[#151515] border border-[#f5f5f0]/5">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-display text-2xl text-[#f5f5f0] mb-4">Message Sent!</h3>
                    <p className="text-[#f5f5f0]/60 mb-8">
                      Thank you for reaching out. I'll get back to you within 24-48 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-[#0a0a0a] rounded-full px-6"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:border-amber-500 rounded-lg h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:border-amber-500 rounded-lg h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block">
                        Project Type
                      </Label>
                      <Select value={formData.projectType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] focus:border-amber-500 rounded-lg h-12">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#151515] border-[#f5f5f0]/10">
                          <SelectItem value="feature-film">Feature Film</SelectItem>
                          <SelectItem value="documentary">Documentary</SelectItem>
                          <SelectItem value="short-film">Short Film</SelectItem>
                          <SelectItem value="tv-series">TV Series</SelectItem>
                          <SelectItem value="commercial">Commercial / Advertising</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block">
                        Tell Me About Your Project *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your project, timeline, and any specific requirements..."
                        className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:border-amber-500 rounded-lg resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full py-6 font-mono text-sm tracking-wider uppercase',
                        isSubmitting && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
                          <Send className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-[#0d0d0d]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">Common Questions</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">FAQ</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'What is your typical turnaround time?',
                a: 'Depending on the scope, most projects take 4-12 weeks. I always discuss timeline expectations during our initial consultation.'
              },
              {
                q: 'Do you work with indie filmmakers?',
                a: 'Absolutely! I love working on projects of all sizes. Budget considerations can be discussed during our initial conversation.'
              },
              {
                q: 'What does your process look like?',
                a: 'It starts with understanding your vision, followed by theme development, composition, recording, and final delivery with revisions included.'
              },
              {
                q: 'Do you handle music licensing?',
                a: 'Yes, all music I create comes with clear licensing terms. We\'ll discuss usage rights based on your distribution plans.'
              }
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-xl bg-[#151515] border border-[#f5f5f0]/5"
              >
                <h3 className="font-display text-lg text-[#f5f5f0] mb-3">{faq.q}</h3>
                <p className="text-[#f5f5f0]/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
