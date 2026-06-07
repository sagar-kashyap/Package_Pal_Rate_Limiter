import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since there's no custom mail backend, we construct a mailto link or simulate submission
    const subject = encodeURIComponent(`Package Pal Inquiry from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
    window.location.href = `mailto:sagarkashyap.cc@gmail.com?subject=${subject}&body=${body}`;
    setStatus('success');
  };

  return (
    <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-10 text-slate-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
          Contact Us
        </h1>
        <p className="text-sm text-slate-400">
          Have feedback, feature suggestions, or business inquiries? Drop us a line!
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <h3 className="font-semibold text-slate-100 mb-2">Direct Contact</h3>
            <p className="text-xs text-slate-400 mb-1">Developer Email:</p>
            <a href="mailto:sagarkashyap.cc@gmail.com" className="text-sky-400 hover:underline text-sm break-all font-medium">
              Email
            </a>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            <h3 className="font-semibold text-slate-100 mb-2">Based in</h3>
            <p className="text-sm text-slate-400">India 🇮🇳</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 rounded-lg py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
              placeholder="How can we help?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-slate-950 font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-sky-500/10 transition-all duration-200"
          >
            Send Message (via Email)
          </button>

          {status === 'success' && (
            <p className="text-emerald-400 text-xs text-center mt-2">
              Opening your default email client to send the message...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
