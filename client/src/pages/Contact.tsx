// In your Contact.tsx page
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useBranches } from "@/hooks/use-branches";
import { contactApi, type ContactFormData } from "@/api";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  ArrowRight,
  Send,
  Calendar,
  Navigation as NavigationIcon,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Sparkles,
  Heart
} from "lucide-react";

export default function Contact() {
  const { t, isRTL } = useLocale();
  const { branches, primaryBranch, otherBranches, isLoading: branchesLoading } = useBranches();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message should be at least 10 characters long';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors in the form.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    try {
      const response = await contactApi.sendMessage(formData);
      
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.message || t('contact.form.success'));
        setShowSuccessDialog(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.message || 'Failed to send message');
        
        // Handle field-specific errors from API
        if (response.errors) {
          setFormErrors(response.errors);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatOpeningHours = (branch: any) => {
    if (branch.day_from && branch.day_to && branch.opening_hours && branch.closing_hours) {
      return `${branch.day_from} - ${branch.day_to}: ${branch.opening_hours} - ${branch.closing_hours}`;
    }
    return branch.opening_hours || 'Contact for hours';
  };

  const SuccessDialog = () => (
    <AnimatePresence>
      {showSuccessDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSuccessDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-b from-cream to-ivory-50 border border-ivory-200 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-burgundy to-gold"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-burgundy/5 to-transparent rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-gold/5 to-transparent rounded-full"></div>
            
            {/* Close button */}
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="absolute top-4 right-4 z-10 p-2 text-ivory-400 hover:text-ivory-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative z-10 p-8 md:p-10 text-center">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative mx-auto w-24 h-24 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-gold rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-cream" />
                </div>
                {/* Sparkles animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4"
                >
                  <Sparkles className="w-8 h-8 text-gold absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <Sparkles className="w-6 h-6 text-burgundy/60 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />
                  <Sparkles className="w-5 h-5 text-gold/60 absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2" />
                </motion.div>
              </motion.div>
              
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`font-display text-2xl md:text-3xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}
              >
                {t('contact.form.success')}
              </motion.h3>
              
              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-ivory-600 font-sans mb-6 leading-relaxed"
              >
                {isRTL ? 'شكراً لك على رسالتك. سيتصل بك فريقنا خلال ٢٤-٤٨ ساعة.' : 'Thank you for your message. Our team will get back to you within 24-48 hours.'}
              </motion.p>
              
              {/* Additional info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-ivory-100/50 border border-ivory-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-ivory-600 font-sans mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{isRTL ? 'تم إرسال تأكيد إلى بريدك الإلكتروني' : 'A confirmation has been sent to your email'}</span>
                </div>
                <p className="text-xs text-ivory-500">
                  {isRTL ? 'رقم المرجع: #' : 'Reference #:'} {Date.now().toString().slice(-8)}
                </p>
              </motion.div>
              
              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={() => setShowSuccessDialog(false)}
                  className="flex-1 bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream py-3 px-6 text-sm uppercase tracking-[0.1em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg rounded-lg flex items-center justify-center gap-2 group"
                >
                  <span>{isRTL ? 'متابعة' : 'Continue Browsing'}</span>
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => window.location.href = '/shop'}
                  className="flex-1 border-2 border-gold text-gold hover:bg-gold/5 py-3 px-6 text-sm uppercase tracking-[0.1em] transition-all duration-300 font-serif rounded-lg flex items-center justify-center gap-2 group"
                >
                  <Heart className="w-4 h-4" />
                  <span>{isRTL ? 'تصفح المجموعة' : 'Explore Collection'}</span>
                </button>
              </motion.div>
              
              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-ivory-400 mt-6 pt-4 border-t border-ivory-200"
              >
                {isRTL ? 'فريق هيريتيج ثريدس' : 'The Heritage Threads Team'}
                <span className="block text-[10px] mt-1">
                  ❦ {isRTL ? 'تأسست ١٩٢٤' : 'Est. 1924'} ❦
                </span>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-b from-ivory-50 to-cream/30 ${isRTL ? 'rtl' : ''}`}>
      <Navigation />
      
      {/* Success Dialog */}
      <SuccessDialog />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-ivory-900/90 to-burgundy/90 text-cream">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold text-4xl font-display block mb-6">❦</span>
            <h1 className={`font-display text-4xl md:text-6xl lg:text-7xl mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('contact.title')}
            </h1>
            <p className={`font-serif text-xl md:text-2xl text-cream/90 mb-8 max-w-3xl mx-auto leading-relaxed ${isRTL ? 'font-arabic leading-loose' : ''}`}>
              {t('contact.subtitle')}
            </p>
            <p className={`text-cream/80 font-sans max-w-2xl mx-auto ${isRTL ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
              {t('contact.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Status Messages (for non-dialog errors) */}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-sans">{submitMessage || t('contact.form.error')}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Loading State for Branches */}
        {branchesLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-ivory-400 animate-spin" />
            <span className="ml-3 text-ivory-600 font-sans">
              {isRTL ? 'جاري تحميل معلومات الفروع...' : 'Loading branch information...'}
            </span>
          </div>
        )}

        {/* Primary Branch */}
        {!branchesLoading && primaryBranch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-px bg-gold"></div>
              <h2 className={`font-display text-2xl md:text-3xl text-ivory-900 ${isRTL ? 'font-arabic' : ''}`}>
                {t('contact.primary_branch')}
              </h2>
              <div className="flex-1 h-px bg-ivory-300"></div>
            </div>
            
            <div className="bg-white border border-ivory-200 shadow-lg overflow-hidden rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Branch Info */}
                <div className="p-8 md:p-12">
                  <div className="mb-6">
                    <h3 className={`font-serif text-2xl md:text-3xl text-ivory-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                      {primaryBranch.name}
                    </h3>
                    <p className={`text-ivory-600 font-sans text-sm leading-relaxed mb-6 ${isRTL ? 'font-arabic leading-loose' : ''}`}>
                      {t('contact.heritage_note')}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {primaryBranch.address && (
                      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="p-2 bg-ivory-100 rounded-full flex-shrink-0">
                          <MapPin className="w-5 h-5 text-ivory-700" />
                        </div>
                        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                          <h4 className="text-sm uppercase tracking-wider text-ivory-500 font-sans mb-1">
                            {t('contact.address')}
                          </h4>
                          <p className={`text-ivory-800 font-sans ${isRTL ? 'font-arabic' : ''}`}>
                            {primaryBranch.address}
                          </p>
                          {primaryBranch.latitude && primaryBranch.longitude && (
                            <a
                              href={`https://maps.google.com/?q=${primaryBranch.latitude},${primaryBranch.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-colors text-sm mt-2"
                            >
                              <NavigationIcon className="w-4 h-4" />
                              <span>{t('contact.get_directions')}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl-text' : ''}`}>
                      {primaryBranch.phone_number && (
                        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="p-2 bg-ivory-100 rounded-full flex-shrink-0">
                            <Phone className="w-5 h-5 text-ivory-700" />
                          </div>
                          <div>
                            <h4 className="text-sm uppercase tracking-wider text-ivory-500 font-sans mb-1">
                              {t('contact.phone')}
                            </h4>
                            <a 
                              href={`tel:${primaryBranch.phone_number}`}
                              className="text-ivory-800 font-sans hover:text-burgundy transition-colors block"
                            >
                              {primaryBranch.phone_number}
                            </a>
                            <button className="text-burgundy hover:text-burgundy/80 transition-colors text-sm mt-1">
                              {t('contact.call_now')}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {primaryBranch.Email_Adress && (
                        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="p-2 bg-ivory-100 rounded-full flex-shrink-0">
                            <Mail className="w-5 h-5 text-ivory-700" />
                          </div>
                          <div>
                            <h4 className="text-sm uppercase tracking-wider text-ivory-500 font-sans mb-1">
                              {t('contact.email')}
                            </h4>
                            <a 
                              href={`mailto:${primaryBranch.Email_Adress}`}
                              className="text-ivory-800 font-sans hover:text-burgundy transition-colors block"
                            >
                              {primaryBranch.Email_Adress}
                            </a>
                            <button className="text-burgundy hover:text-burgundy/80 transition-colors text-sm mt-1">
                              {t('contact.send_email')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {primaryBranch.opening_hours && (
                      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="p-2 bg-ivory-100 rounded-full flex-shrink-0">
                          <Clock className="w-5 h-5 text-ivory-700" />
                        </div>
                        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                          <h4 className="text-sm uppercase tracking-wider text-ivory-500 font-sans mb-1">
                            {t('contact.opening_hours')}
                          </h4>
                          <p className="text-ivory-800 font-sans">
                            {formatOpeningHours(primaryBranch)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Social Media Links */}
                    {(primaryBranch.facbook_link || primaryBranch.instagram_link || primaryBranch.twitter_link || primaryBranch.linkdin_link) && (
                      <div className="pt-6 border-t border-ivory-200">
                        <h4 className={`text-sm uppercase tracking-wider text-ivory-500 font-sans mb-4 ${isRTL ? 'text-right' : ''}`}>
                          {t('contact.follow_us')}
                        </h4>
                        <div className={`flex gap-3 ${isRTL ? 'justify-end' : ''}`}>
                          {primaryBranch.facbook_link && (
                            <a 
                              href={primaryBranch.facbook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-ivory-100 hover:bg-burgundy/10 rounded-full transition-colors group"
                              aria-label={t('social.facebook')}
                            >
                              <Facebook className="w-5 h-5 text-ivory-700 group-hover:text-burgundy transition-colors" />
                            </a>
                          )}
                          {primaryBranch.instagram_link && (
                            <a 
                              href={primaryBranch.instagram_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-ivory-100 hover:bg-burgundy/10 rounded-full transition-colors group"
                              aria-label={t('social.instagram')}
                            >
                              <Instagram className="w-5 h-5 text-ivory-700 group-hover:text-burgundy transition-colors" />
                            </a>
                          )}
                          {primaryBranch.twitter_link && (
                            <a 
                              href={primaryBranch.twitter_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-ivory-100 hover:bg-burgundy/10 rounded-full transition-colors group"
                              aria-label={t('social.twitter')}
                            >
                              <Twitter className="w-5 h-5 text-ivory-700 group-hover:text-burgundy transition-colors" />
                            </a>
                          )}
                          {primaryBranch.linkdin_link && (
                            <a 
                              href={primaryBranch.linkdin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-ivory-100 hover:bg-burgundy/10 rounded-full transition-colors group"
                              aria-label={t('social.linkedin')}
                            >
                              <Linkedin className="w-5 h-5 text-ivory-700 group-hover:text-burgundy transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group mt-8">
                      <Calendar className="w-4 h-4" />
                      <span>{t('contact.book_appointment')}</span>
                      <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Map/Image Placeholder */}
                <div className="bg-ivory-100 min-h-[400px] lg:min-h-full relative">
                  {primaryBranch.latitude && primaryBranch.longitude ? (
                    <iframe
                      title={primaryBranch.name || "Branch Location"}
                      className="absolute inset-0 w-full h-full border-0"
                      src={`https://maps.google.com/maps?q=${primaryBranch.latitude},${primaryBranch.longitude}&z=15&output=embed`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <MapPin className="w-16 h-16 text-ivory-400 mx-auto mb-4" />
                        <p className="text-ivory-600 font-serif italic">
                          {primaryBranch.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Other Branches */}
        {!branchesLoading && otherBranches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            {/* ... (existing other branches code - keep your existing code here) ... */}
          </motion.div>
        )}
        
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-gold"></div>
            <h2 className={`font-display text-2xl md:text-3xl text-ivory-900 ${isRTL ? 'font-arabic' : ''}`}>
              {t('contact.contact_form')}
            </h2>
            <div className="flex-1 h-px bg-ivory-300"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white border border-ivory-200 shadow-lg p-6 md:p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm uppercase tracking-wider text-ivory-600 font-sans mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.placeholder.name')}
                  className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-300' : 'border-ivory-300'} bg-white focus:border-ivory-500 focus:ring-1 focus:ring-ivory-500 focus:outline-none transition-all font-sans`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm uppercase tracking-wider text-ivory-600 font-sans mb-2">
                  {t('contact.form.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.placeholder.email')}
                  className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-300' : 'border-ivory-300'} bg-white focus:border-ivory-500 focus:ring-1 focus:ring-ivory-500 focus:outline-none transition-all font-sans`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm uppercase tracking-wider text-ivory-600 font-sans mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.placeholder.phone')}
                  className={`w-full px-4 py-3 border ${formErrors.phone ? 'border-red-300' : 'border-ivory-300'} bg-white focus:border-ivory-500 focus:ring-1 focus:ring-ivory-500 focus:outline-none transition-all font-sans`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm uppercase tracking-wider text-ivory-600 font-sans mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.placeholder.subject')}
                  className="w-full px-4 py-3 border border-ivory-300 bg-white focus:border-ivory-500 focus:ring-1 focus:ring-ivory-500 focus:outline-none transition-all font-sans"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm uppercase tracking-wider text-ivory-600 font-sans mb-2">
                {t('contact.form.message')} *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder={t('contact.form.placeholder.message')}
                className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-300' : 'border-ivory-300'} bg-white focus:border-ivory-500 focus:ring-1 focus:ring-ivory-500 focus:outline-none transition-all font-sans resize-none`}
                required
              />
              {formErrors.message && (
                <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream py-4 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isRTL ? 'جاري الإرسال...' : 'Sending...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t('contact.form.send')}</span>
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
            
            <p className="text-xs text-ivory-500 text-center mt-4 font-sans">
              * {isRTL ? 'الحقول المطلوبة' : 'Required fields'}
            </p>
          </form>
        </motion.div>
      </div>
      
    </div>
  );
}