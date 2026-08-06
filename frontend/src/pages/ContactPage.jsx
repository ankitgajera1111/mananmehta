import React, { useState } from 'react';
import { Mail, Instagram, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
import { useSection } from '../context/ContentContext';
import AccentHeading from '../components/AccentHeading';
import { submitContact, errorMessage } from '../lib/api';
import { cn } from '../lib/utils';

const ContactPage = () => {
  const composerInfo = useSection('settings');
  const page = useSection('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
    setSubmitError(null);

    try {
      await submitContact(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', projectType: '', message: '' });
    } catch (err) {
      // Keep what they typed on screen so a failure never costs them the message.
      setSubmitError(errorMessage(err, 'Could not send your message.'));
    } finally {
      setIsSubmitting(false);
    }
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
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">{page.kicker}</p>
              </div>
              <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
                <AccentHeading text={page.heading} accent={page.accentWord} />
              </h1>
              <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed mb-12">
                {page.intro}
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
                    <h3 className="font-display text-2xl text-[#f5f5f0] mb-4">{page.successHeading}</h3>
                    <p className="text-[#f5f5f0]/60 mb-8">
                      {page.successBody}
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
                    {submitError && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-200 text-sm">
                          {submitError} You can also email{' '}
                          <a
                            href={`mailto:${composerInfo.email}`}
                            className="underline hover:text-red-100"
                          >
                            {composerInfo.email}
                          </a>
                          .
                        </p>
                      </div>
                    )}

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
                          {(page.projectTypeOptions || []).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
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
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">{page.faqKicker}</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">{page.faqHeading}</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {(page.faqs || []).map((faq) => (
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
