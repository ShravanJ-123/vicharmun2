/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Users, 
  Globe, 
  Scale, 
  Zap, 
  Camera, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Menu,
  X,
  Trophy,
  Star,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Upload,
  QrCode
} from "lucide-react";
import React, { useState, useEffect, ChangeEvent } from "react";

// --- Types ---
interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  committee: string;
  experience: string;
  transactionId: string;
  screenshot: string;
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsdDqz7h-toKWII0pLW02eDvU3Q5d2tHdd93OETA_fE7IDiQ_BPQA7wC2L3_iq_LBwmA/exec";

// --- Razorpay Declaration ---
declare global {
  interface Window {
    Razorpay: any;
  }
}

const committees = [
  { 
    name: "UN Women", 
    topic: "Reviewing the Legal Status of Women associated with Non-State Armed Groups with a Special Emphasis on DDR Programs.", 
    icon: <Users className="w-6 h-6" />,
    eb: [
      { name: "Abuzar Shaikh", role: "Co-Chairperson", image: "https://i.pravatar.cc/150?u=abuzar" },
      { name: "Srujan Kutte", role: "Co-Chairperson", image: "https://i.pravatar.cc/150?u=srujan" }
    ]
  },
  { 
    name: "JCC", 
    topic: "Discussing Coordinated International Responses to a Sudden and Unanticipated Global Development of System-Wide Consequence.", 
    icon: <Zap className="w-6 h-6" />,
    eb: [
      { name: "Aditya Kiran", role: "Chairperson", image: "https://i.pravatar.cc/150?u=aditya" }
    ]
  },
  { 
    name: "UNSC", 
    topic: "The Situation in Libya. Freeze Date: 5th April 2019.", 
    icon: <Globe className="w-6 h-6" />,
    eb: [
      { name: "Darshan Kamat", role: "Chairperson", image: "https://i.pravatar.cc/150?u=darshan" }
    ]
  },
  { 
    name: "FIA", 
    topic: "Addressing Competitive Inequality and Financial Sustainability in Formula One Across Generations. [SCHOOL COMMITTEE]", 
    icon: <Scale className="w-6 h-6" />,
    eb: [
      { name: "Tasya Sawant", role: "President", image: "https://i.pravatar.cc/150?u=tasya" },
      { name: "Divit Jagatram", role: "Analyst", image: "https://i.pravatar.cc/150?u=divit" },
      { name: "Siddharth Dhawan", role: "Vice-President", image: "https://i.pravatar.cc/150?u=siddharth" }
    ]
  },
  { 
    name: "International Press", 
    topic: "Journalism & Photography.", 
    icon: <Camera className="w-6 h-6" />,
    eb: [
      { name: "Ishan Khare", role: "Head of Journalism", image: "https://i.pravatar.cc/150?u=ishan" },
      { name: "Sujal Gaikwad", role: "Head of Photography", image: "https://i.pravatar.cc/150?u=sujal" }
    ]
  },
];

const prizes = [
  { title: "Best Delegate", amount: "10,000", rank: "1st" },
  { title: "High Commendation", amount: "7,000", rank: "2nd" },
  { title: "Special Mention", amount: "5,000", rank: "3rd", note: "*in kind" },
  { title: "Best Delegation", amount: "15,000", rank: "Overall" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
];

// --- Registration Modal Component ---
const RegistrationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    committee: "",
    experience: "",
    transactionId: "",
    screenshot: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, screenshot: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      // Since we use no-cors, we can't read the response, but we assume success if no error is thrown
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please try again or contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const totalSteps = 4;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-6 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          className="relative w-full max-w-6xl bg-[#0a0a0a] border-0 md:border md:border-white/5 rounded-none md:rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] flex flex-col lg:flex-row min-h-screen md:min-h-[700px]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Left Side: Immersive Visuals */}
          <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#d4af37]/10 via-black to-black p-16 flex-col justify-between relative overflow-hidden border-r border-white/5">
            {/* Celestial Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#d4af37]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px]" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <img src="/logo.png" alt="Vichar MUN Logo" className="w-20 h-20 object-cover rounded-full border border-[#d4af37]/30 mb-8" referrerPolicy="no-referrer" />
                <h2 className="text-6xl font-display font-bold text-[#d4af37] mb-6 leading-[0.85] tracking-tighter">
                  Join the <br />
                  <span className="italic font-script font-normal text-white">Diplomatic</span> <br />
                  Circle.
                </h2>
                <div className="w-16 h-1 bg-[#d4af37] mb-8" />
                <p className="text-gray-400 font-light leading-relaxed text-lg max-w-xs">
                  Step into the shoes of world leaders and navigate the complexities of international relations.
                </p>
              </motion.div>
            </div>

            <div className="relative z-10 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Delegate Fee</p>
                    <p className="text-3xl font-bold font-display">₹1,500 <span className="text-xs font-light text-gray-500">INR</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Event Dates</p>
                    <p className="text-xl font-medium text-gray-200">May 2nd - 3rd, 2026</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-4">Secure Payment via</p>
                <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all cursor-default">
                  <QrCode className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-xs font-bold tracking-widest uppercase font-mono">UPI QR Transfer</span>
                </div>
              </div>
            </div>

            {/* Decorative Celestial Image */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-15%] right-[-15%] opacity-10 pointer-events-none"
            >
              <img src="https://picsum.photos/seed/celestial/600/600" alt="" className="w-80 h-80 rounded-full grayscale invert" />
            </motion.div>
          </div>

          {/* Right Side: Form Content */}
          <div className="flex-1 p-6 sm:p-8 md:p-16 halftone-bg flex flex-col bg-black/40">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-3xl" 
                  />
                  <div className="relative w-28 h-28 rounded-full bg-[#d4af37] flex items-center justify-center text-black shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Welcome Aboard!</h3>
                  <p className="text-gray-400 max-w-sm mx-auto leading-relaxed text-lg">
                    Your registration for <span className="text-[#d4af37] font-medium">{formData.committee}</span> is confirmed. 
                    Check your inbox at <span className="text-white">{formData.email}</span> for the delegate guide.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-[#d4af37] text-black px-12 py-5 rounded-full font-bold hover:bg-white transition-all shadow-2xl shadow-[#d4af37]/30 text-lg"
                >
                  Return to Galaxy
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Progress Header */}
                <div className="mb-8 md:mb-12">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] mb-1">Step 0{step}</p>
                      <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                        {step === 1 && "Personal Identity"}
                        {step === 2 && "Committee Choice"}
                        {step === 3 && "Review & Confirm"}
                        {step === 4 && "UPI Payment"}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{step} / {totalSteps}</p>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                      className="h-full bg-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Form Steps */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 md:space-y-8"
                      >
                        <div className="grid grid-cols-1 gap-6">
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 group-focus-within:text-[#d4af37] transition-colors">Full Name</label>
                            <div className="relative">
                              <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#d4af37] transition-colors" />
                              <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] pl-16 pr-8 py-4 md:py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all text-base md:text-lg"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                              <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 group-focus-within:text-[#d4af37] transition-colors">Email Address</label>
                              <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name@domain.com"
                                className="w-full bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] px-8 py-4 md:py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all text-base md:text-lg"
                              />
                            </div>
                            <div className="group">
                              <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 group-focus-within:text-[#d4af37] transition-colors">Phone Number</label>
                              <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 00000 00000"
                                className="w-full bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] px-8 py-4 md:py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all text-base md:text-lg"
                              />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 group-focus-within:text-[#d4af37] transition-colors">Institution</label>
                            <input 
                              type="text" 
                              name="institution"
                              value={formData.institution}
                              onChange={handleInputChange}
                              placeholder="School or University name"
                              className="w-full bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] px-8 py-4 md:py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all text-base md:text-lg"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 md:space-y-8"
                      >
                        <div className="space-y-6">
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Preferred Committee</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {committees.map(c => (
                                <button
                                  key={c.name}
                                  onClick={() => setFormData({ ...formData, committee: c.name })}
                                  className={`p-4 md:p-5 rounded-[20px] md:rounded-3xl border text-left transition-all flex items-center gap-4 ${
                                    formData.committee === c.name 
                                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                  }`}
                                >
                                  <div className={`p-2 rounded-xl ${formData.committee === c.name ? 'bg-[#d4af37]/20' : 'bg-white/5'}`}>
                                    {c.icon}
                                  </div>
                                  <span className="font-medium text-sm md:text-base">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Previous MUN Experience</label>
                            <textarea 
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              rows={4}
                              placeholder="Tell us about your previous MUNs, awards, or why you want to join this committee..."
                              className="w-full bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] px-8 py-4 md:py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all resize-none text-base md:text-lg"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Delegate</p>
                              <p className="font-medium">{formData.fullName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Committee</p>
                              <p className="font-medium text-[#d4af37]">{formData.committee}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Contact</p>
                              <p className="font-medium">{formData.phone}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Institution</p>
                              <p className="font-medium">{formData.institution}</p>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-gray-400">Total Amount</span>
                            <span className="text-2xl font-bold font-display text-[#d4af37]">₹1,500</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/10">
                          <Zap className="w-5 h-5 text-[#d4af37] shrink-0 mt-1" />
                          <p className="text-xs text-gray-400 leading-relaxed">
                            By proceeding, you agree to the conference terms and conditions. Registration fees are non-refundable.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div 
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col items-center text-center space-y-6">
                          <div className="p-4 bg-white rounded-[32px] shadow-2xl shadow-[#d4af37]/10">
                            {/* Placeholder for UPI QR Code - User should replace with their actual QR */}
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shravanjare@okaxis%26pn=VICHAR%20MUN%202026%26am=1500%26cu=INR" 
                              alt="UPI QR Code" 
                              className="w-48 h-48"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-[#d4af37]">Scan to pay ₹1,500</p>
                            <p className="text-xs text-gray-500">UPI ID: shravanjare@okaxis</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Transaction ID / Ref Number</label>
                            <input 
                              type="text" 
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleInputChange}
                              placeholder="Enter 12-digit UPI Ref No."
                              className="w-full bg-white/5 border border-white/10 rounded-[24px] px-8 py-5 focus:border-[#d4af37]/50 focus:bg-white/[0.08] outline-none transition-all"
                            />
                          </div>
                          
                          <div className="group">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3">Payment Screenshot</label>
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="screenshot-upload"
                              />
                              <label 
                                htmlFor="screenshot-upload"
                                className="w-full bg-white/5 border border-dashed border-white/10 rounded-[24px] px-8 py-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.08] hover:border-[#d4af37]/30 transition-all"
                              >
                                {formData.screenshot ? (
                                  <div className="flex items-center gap-3 text-green-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">Screenshot Uploaded</span>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="w-6 h-6 text-gray-500" />
                                    <span className="text-sm text-gray-400">Click to upload screenshot</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                  {step > 1 ? (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
                    >
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </div>
                      <span className="text-xs uppercase tracking-widest">Back</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  
                  <div className="flex gap-4 w-full sm:w-auto">
                    {step < 4 ? (
                      <button 
                        onClick={() => setStep(step + 1)}
                        disabled={
                          (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) ||
                          (step === 2 && !formData.committee)
                        }
                        className="w-full sm:w-auto bg-[#d4af37] text-black px-12 py-5 rounded-full font-bold flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all hover:bg-white shadow-lg shadow-[#d4af37]/10"
                      >
                        {step === 3 ? "Proceed to Payment" : "Continue"} <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSubmit}
                        disabled={isProcessing || !formData.transactionId || !formData.screenshot}
                        className="w-full sm:w-auto bg-[#d4af37] text-black px-14 py-5 rounded-full font-bold flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:bg-white shadow-2xl shadow-[#d4af37]/20"
                      >
                        {isProcessing ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-5 h-5" />
                            </motion.div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Registration <CheckCircle2 className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [activeCommittee, setActiveCommittee] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textParallax = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const itemWidth = e.currentTarget.offsetWidth * 0.85; // Based on min-w-[85vw]
    const index = Math.round(scrollPosition / itemWidth);
    if (index !== activeCommittee && index >= 0 && index < committees.length) {
      setActiveCommittee(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-[#d4af37] selection:text-black relative">
      {/* Grain Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Interactive Mouse Glow */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 hidden md:block"
        animate={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.08), transparent 80%)`
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3
            }}
            animate={{ 
              y: [null, "-20%", "20%", null],
              x: [null, "10%", "-10%", null],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Atmospheric Background */}
      <div className="atmosphere">
        <div className="atmosphere-layer" />
        <div className="atmosphere-layer" />
      </div>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 rounded-full blur-[120px] animate-pulse" />
      </div>
      
      {/* Registration Modal */}
      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <img src="/logo.png" alt="Vichar MUN Logo" className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border border-[#d4af37]/30 shadow-lg shadow-[#d4af37]/10" referrerPolicy="no-referrer" />
            <h2 className="text-2xl font-black tracking-tighter text-[#d4af37] font-display">
              VICHAR <span className="text-white">MUN</span>
            </h2>
          </motion.div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em]">
            {["About", "Committees", "Prizes", "Gallery"].map((item) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                whileHover={{ y: -2, color: "#d4af37" }}
                className="transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] transition-all group-hover:w-full" />
              </motion.a>
            ))}
            <button 
              onClick={() => setIsRegModalOpen(true)}
              className="text-[#d4af37] hover:text-white transition-colors"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-10 md:hidden"
          >
            <div className="flex justify-between items-center mb-20">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Vichar MUN Logo" className="w-10 h-10 object-cover rounded-full border border-[#d4af37]/30" referrerPolicy="no-referrer" />
                <h2 className="text-2xl font-black tracking-tighter text-[#d4af37] font-display">VICHAR <span className="text-white">MUN</span></h2>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 glass rounded-full flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {["About", "Committees", "Prizes", "Gallery"].map((item, i) => (
                <motion.a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-black font-display tracking-tighter hover:text-[#d4af37] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setIsRegModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-left text-5xl font-black font-display tracking-tighter text-[#d4af37]"
              >
                Register
              </motion.button>
            </div>
            
            <div className="mt-auto pt-10 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-4">Contact Us</p>
              <p className="text-lg text-gray-400">vicharmun@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden halftone-bg py-16 md:py-0">
        {/* Floating Decorative Text */}
        <motion.div 
          style={{ y: textParallax }}
          className="absolute top-1/4 left-10 opacity-[0.02] hidden lg:block select-none pointer-events-none"
        >
          <span className="text-[10rem] font-black font-display leading-none tracking-tighter">VICHAR</span>
        </motion.div>
        <motion.div 
          style={{ y: textParallax }}
          className="absolute bottom-1/4 right-10 opacity-[0.02] hidden lg:block select-none pointer-events-none"
        >
          <span className="text-[10rem] font-black font-display leading-none tracking-tighter">2026</span>
        </motion.div>

        {/* Decorative Celestial Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.03] pointer-events-none"
        >
          <img src="https://picsum.photos/seed/sun/1000/1000" alt="" className="w-full h-full rounded-full grayscale invert" referrerPolicy="no-referrer" />
        </motion.div>

        <div className="absolute inset-0 z-0 mask-fade-bottom">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            style={{ 
              y: heroY,
              backgroundImage: "url('/hero-bg.png')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full opacity-40"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-6 md:mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute -inset-2 border border-[#d4af37]/20 rounded-full animate-spin-slow" />
              <img src="/logo.png" alt="Vichar MUN Logo" className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full border-2 border-[#d4af37]/30 mx-auto mb-4 md:mb-6 shadow-2xl shadow-[#d4af37]/20 relative z-10" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-4 h-px bg-[#d4af37]/30" />
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.6em] text-[#d4af37] font-mono">
                The Premier MUN Experience
              </span>
              <div className="w-4 h-px bg-[#d4af37]/30" />
            </div>
          </motion.div>
          
          <div className="relative mb-8 md:mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter font-display leading-[0.85] text-white uppercase">
              VICHAR <br />
              <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#d4af37] italic font-script font-normal md:-mt-4 block">MUN</span>
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-[#d4af37]/10 to-transparent blur-3xl pointer-events-none -z-10" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 mb-8 md:mb-10">
            <div className="flex flex-col items-center md:items-start gap-0.5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-mono">Location</p>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-sm md:text-base font-bold tracking-tight text-white">Pune, India</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block" />
            <div className="flex flex-col items-center md:items-start gap-0.5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-mono">Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-sm md:text-base font-bold tracking-tight text-white">May 2 - 3, 2026</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,175,55,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRegModalOpen(true)}
              className="w-full sm:w-auto bg-[#d4af37] text-black px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-lg transition-all shadow-xl shadow-[#d4af37]/10 group flex items-center justify-center gap-2"
            >
              Register Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <a 
              href="#about"
              className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg glass hover:bg-white/5 transition-all border-white/20"
            >
              Discover More
            </a>
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] uppercase tracking-[0.5em]">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#d4af37] to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="flex items-center gap-4 text-[#d4af37] mb-10">
              <div className="w-12 h-px bg-[#d4af37]" />
              <span className="text-xs uppercase tracking-[0.8em] font-mono">The Vision</span>
            </div>
            
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black mb-12 font-display leading-[0.85] tracking-tighter text-white">
              The Essence <br /> 
              <span className="text-[#d4af37] italic font-script font-normal">of Vichar</span>
            </h2>

            <div className="space-y-8 max-w-xl">
              <p className="text-xl md:text-3xl text-gray-300 leading-tight font-light">
                Vichar Model United Nations is more than a conference; it's a crucible for the leaders of tomorrow. 
              </p>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light">
                We provide a dynamic platform for delegates to engage with pressing international issues while developing negotiation, 
                public speaking, and leadership skills. Our mission is to foster meaningful dialogue and informed debate.
              </p>
            </div>

          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-[40px] md:rounded-[60px] rotate-3" />
            <div className="absolute -inset-4 border border-white/10 rounded-[40px] md:rounded-[60px] -rotate-3" />
            <div className="relative aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#d4af37]/10 mix-blend-overlay z-10" />
              <img 
                src="/Untitled design(2).png" 
                alt="Conference" 
                className="w-full h-full object-cover object-bottom grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Committees Section */}
      <section id="committees" className="py-20 md:py-32 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 mb-12 md:mb-24">
            <div className="max-w-2xl">
              <h2 className="text-xs md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] text-[#d4af37] mb-4 md:mb-6">Committees</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-bold font-display tracking-tighter leading-tight">The Arenas of <br className="hidden sm:block" /> Global Debate</h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xs md:text-right">
              Five specialized councils designed to challenge your diplomatic prowess and strategic thinking.
            </p>
          </div>

          {/* Desktop Grid / Mobile Carousel */}
          <div className="relative">
            {/* Mobile Carousel Container */}
            <div 
              onScroll={handleScroll}
              className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 no-scrollbar -mx-6 px-6"
            >
              {committees.map((committee, index) => (
                <motion.div
                  key={committee.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="min-w-[85vw] snap-center group p-8 glass rounded-[40px] relative overflow-hidden flex flex-col h-[520px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="w-14 h-14 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20">
                      {committee.icon}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-600">Council 0{index + 1}</span>
                  </div>

                  <h4 className="text-3xl font-bold mb-4 font-display tracking-tight text-[#d4af37] relative z-10">{committee.name}</h4>
                  <p className="text-gray-400 font-light mb-8 leading-relaxed text-base line-clamp-4 relative z-10">{committee.topic}</p>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                    <h5 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-6">Executive Board</h5>
                    <div className="flex flex-wrap gap-4">
                      {committee.eb.map((member) => (
                        <div key={member.name} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 overflow-hidden shrink-0">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{member.name}</span>
                            <span className="text-[8px] uppercase tracking-widest text-gray-500 font-mono">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-12 gap-8">
              {committees.map((committee, index) => (
                <motion.div
                  key={committee.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group p-10 glass rounded-[48px] relative overflow-hidden flex flex-col transition-all duration-700 hover:bg-white/[0.05] border border-white/5 hover:border-[#d4af37]/30 ${
                    index === 0 ? 'col-span-7 h-[500px]' : 
                    index === 1 ? 'col-span-5 h-[500px]' : 
                    index === 2 ? 'col-span-5 h-[500px]' : 
                    index === 3 ? 'col-span-7 h-[500px]' : 
                    'col-span-12 h-[400px]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#d4af37]/10 transition-colors duration-700" />
                  
                  <div className="flex items-start justify-between mb-10 relative z-10">
                    <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20 group-hover:scale-110 transition-transform duration-700">
                      {committee.icon}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-600">Council 0{index + 1}</span>
                  </div>

                  <h4 className="text-4xl font-black mb-6 font-display tracking-tighter text-[#d4af37] relative z-10 group-hover:translate-x-2 transition-transform duration-700">{committee.name}</h4>
                  <p className="text-gray-400 font-light mb-10 leading-relaxed text-lg line-clamp-3 relative z-10 group-hover:text-gray-300 transition-colors duration-700">{committee.topic}</p>
                  
                  <div className="mt-auto pt-10 border-t border-white/5 relative z-10">
                    <h5 className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] mb-8">Executive Board</h5>
                    <div className="flex flex-wrap gap-8">
                      {committee.eb.map((member) => (
                        <div key={member.name} className="flex items-center gap-4 group/eb">
                          <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 overflow-hidden shrink-0 group-hover/eb:border-[#d4af37] transition-colors">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover/eb:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-white group-hover/eb:text-[#d4af37] transition-colors">{member.name}</span>
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="md:hidden flex justify-center gap-3 mt-4">
              {committees.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeCommittee === i ? 'w-8 bg-[#d4af37]' : 'w-1.5 bg-white/10'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-script italic text-[#d4af37] mb-4 md:mb-6 leading-none">The Rewards <br /> of Excellence</h2>
              <p className="text-base md:text-xl text-gray-400 font-light max-w-md">Recognizing the most distinguished voices in global diplomacy and strategic negotiation.</p>
            </div>
            <div className="flex items-center gap-4 md:gap-6 glass p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-[#d4af37]/20 w-full md:w-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#d4af37]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#d4af37] shrink-0">
                <Trophy className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-1">Total Pool</p>
                <p className="text-2xl md:text-4xl font-black font-display text-white">₹30,000+</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 md:gap-8">
            {prizes.map((prize, i) => (
              <motion.div
                key={prize.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "circOut" }}
                className={`p-8 md:p-10 glass rounded-[32px] md:rounded-[48px] relative group overflow-hidden hover:bg-white/[0.05] transition-all duration-700 border border-white/5 hover:border-[#d4af37]/30 flex flex-col justify-between
                  ${i === 0 ? 'md:col-span-8 h-[350px] md:h-[450px]' : 
                    i === 3 ? 'md:col-span-12 h-[250px] md:h-[350px]' : 
                    'md:col-span-4 h-[350px] md:h-[450px]'}
                  ${i === 0 ? 'bg-gradient-to-br from-[#d4af37]/15 to-transparent' : ''}
                  ${i === 3 ? 'bg-gradient-to-tr from-[#d4af37]/10 via-transparent to-[#d4af37]/5' : ''}
                  ${i === 1 ? 'bg-gradient-to-bl from-[#d4af37]/5 to-transparent' : ''}
                  ${i === 2 ? 'bg-gradient-to-tr from-[#d4af37]/5 to-transparent' : ''}
                `}
              >
                {/* Dynamic Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#d4af37]/20 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 group-hover:bg-[#d4af37]/10 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#d4af37]">{prize.rank}</span>
                      <div className="h-[2px] w-8 bg-[#d4af37]/30 group-hover:w-12 transition-all duration-700" />
                    </div>
                    {i === 0 && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Star className="w-6 h-6 text-[#d4af37]" />
                      </motion.div>
                    )}
                  </div>
                  
                  <h4 className={`font-black font-display tracking-tighter text-white mb-2 md:mb-4 group-hover:text-[#d4af37] transition-colors duration-700 ${
                    i === 0 ? 'text-4xl md:text-7xl' : 
                    i === 3 ? 'text-4xl md:text-6xl' :
                    'text-3xl md:text-5xl'
                  }`}>
                    {prize.title}
                  </h4>
                  {prize.note && <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono mb-4">{prize.note}</p>}
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div className="flex flex-col">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-1 md:mb-2">Cash Prize</p>
                    <p className={`font-black font-display text-white ${
                      i === 0 ? 'text-4xl md:text-7xl' : 
                      i === 3 ? 'text-4xl md:text-6xl' :
                      'text-3xl md:text-5xl'
                    }`}>
                      ₹{prize.amount}
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-full glass flex items-center justify-center text-[#d4af37] border-[#d4af37]/20 group-hover:bg-[#d4af37]/10 transition-all duration-700"
                  >
                    <Trophy className="w-7 h-7 md:w-10 md:h-10" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 md:mt-16 p-8 md:p-12 glass rounded-[32px] md:rounded-[48px] border-dashed border-[#d4af37]/20 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <p className="text-gray-400 font-light italic text-base md:text-xl leading-relaxed relative z-10">
              "Diplomacy is the art of letting someone else have your way." <br />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] mt-6 block text-gray-600 font-mono">— Sir David Ormsby-Gore</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="flex items-center gap-4 text-[#d4af37] mb-8 md:mb-10">
              <div className="w-8 md:w-12 h-px bg-[#d4af37]" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-mono">The Venue</span>
            </div>
            <h3 className="text-3xl sm:text-6xl md:text-8xl font-black mb-6 md:mb-10 font-display leading-[0.9] md:leading-[0.85] tracking-tighter text-white">
              Akshara <br /> 
              <span className="text-[#d4af37]">International</span> <br />
              School
            </h3>
            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 font-light leading-relaxed max-w-lg">
              S. No. 109, Akshara Lane, Wakad, Pune, Maharashtra 411057.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex items-center gap-4 md:gap-6 group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[24px] glass flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform shrink-0">
                  <Calendar className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Schedule</p>
                  <p className="text-lg md:text-xl font-bold text-white">May 2 - 3, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[24px] glass flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform shrink-0">
                  <Globe className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Location</p>
                  <p className="text-lg md:text-xl font-bold text-white">Pune, India</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full relative group max-w-md mx-auto lg:max-w-none"
          >
            <div className="absolute -inset-2 md:-inset-4 border border-[#d4af37]/20 rounded-[40px] md:rounded-[60px] animate-pulse" />
            <div className="relative aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-float">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
              <img 
                src="/Untitled design(3).png" 
                alt="Venue"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 z-20">
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] mb-1 md:mb-2">Wakad, Pune</p>
                <h4 className="text-2xl md:text-3xl font-bold font-display text-white">Main Campus</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial from-[#d4af37]/5 to-transparent opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-xs md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] text-[#d4af37] mb-4 md:mb-6">Gallery</h2>
            <h3 className="text-3xl sm:text-6xl md:text-8xl font-black font-display tracking-tighter text-white leading-tight">Moments of <br /> <span className="text-3xl md:text-7xl text-[#d4af37] italic font-script font-normal">Brilliance</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`rounded-[24px] md:rounded-[40px] overflow-hidden group relative ${
                  i === 0 ? 'md:col-span-7 aspect-[16/9]' : 
                  i === 1 ? 'md:col-span-5 aspect-square' : 
                  'md:col-span-12 aspect-[21/9] hidden md:block'
                }`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700 z-10" />
                <div className="absolute inset-0 border border-white/10 rounded-[24px] md:rounded-[40px] z-20 pointer-events-none group-hover:border-[#d4af37]/30 transition-colors" />
                <img 
                  src={img} 
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 z-30 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#d4af37] mb-1">Archive 2025</p>
                  <h4 className="text-xl md:text-2xl font-bold font-display text-white">Vichar MUN Session</h4>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 md:mt-20 text-center">
            <button className="glass px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
              View Full Archive
            </button>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="py-20 md:py-32 relative overflow-hidden halftone-bg">
        {/* Moon Decorative Element */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] opacity-10 pointer-events-none"
        >
          <img src="https://picsum.photos/seed/moon/1000/1000" alt="" className="w-full h-full rounded-full grayscale invert" referrerPolicy="no-referrer" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-6xl md:text-8xl font-display font-bold mb-6 md:mb-10 tracking-tighter leading-tight">See you <span className="text-[#d4af37] font-script italic font-normal">soon!</span></h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 md:mb-16 font-light max-w-2xl mx-auto leading-relaxed">
              Be part of Pune's most anticipated student conference. 
              Limited slots available for delegates.
            </p>
            <button 
              onClick={() => setIsRegModalOpen(true)}
              className="group relative px-10 md:px-16 py-4 md:py-6 bg-[#d4af37] text-black rounded-full font-black text-base md:text-lg uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
            >
              Secure Your Slot
              <div className="absolute inset-0 rounded-full border border-white/50 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <img src="/logo.png" alt="Vichar MUN Logo" className="w-12 h-12 object-cover rounded-full border border-[#d4af37]/30" referrerPolicy="no-referrer" />
              <h2 className="text-3xl font-black tracking-tighter text-[#d4af37] font-display">VICHAR <span className="text-white">MUN</span></h2>
            </div>
            <p className="text-gray-500 font-light max-w-sm leading-relaxed mb-10">
              Empowering the next generation of global leaders through rigorous debate, strategic negotiation, and diplomatic excellence.
            </p>
            <div className="flex gap-6">
              {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                <a key={social} href="#" className="text-xs uppercase tracking-widest text-gray-600 hover:text-[#d4af37] transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['About', 'Committees', 'Prizes', 'Gallery'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-white transition-colors font-light">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-8">Contact</h4>
            <ul className="space-y-4">
              <li className="text-sm text-gray-500 font-light">vicharmun@gmail.com</li>
              <li className="text-sm text-gray-500 font-light">+91 98765 43210</li>
              <li className="text-sm text-gray-500 font-light">Wakad, Pune, India</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">© 2026 Vichar MUN. All Rights Reserved.</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Designed with <span className="text-[#d4af37]">Excellence</span></p>
        </div>
      </footer>

      {/* Mobile Floating Action Button */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsRegModalOpen(true)}
        className="fixed bottom-8 right-8 z-[90] md:hidden w-16 h-16 bg-[#d4af37] text-black rounded-full shadow-2xl shadow-[#d4af37]/40 flex items-center justify-center"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
