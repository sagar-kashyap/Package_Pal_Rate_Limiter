import React from 'react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  // Effect for handling the Escape key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4 text-slate-300 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="info-modal-title" className="text-2xl font-bold text-sky-400">About Package Pal</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-lg text-slate-100 mb-1">Usage Limit (Default Backend)</h3>
            <p>
              To ensure fair use for everyone, the app's shared backend service has a usage limit. Each user (identified by IP address)
              can make up to <strong className="text-sky-400">10 requests per minute</strong>.
            </p>
            <p className="mt-1">
              If you exceed this limit, you will see an error message. Please wait for a minute before trying your search again.
            </p>
            <p className="mt-1">
              If the model's limit is reached, you may also experience temporary unavailability. In such cases, please try again later.
              We are working on improving capacity to better serve all users. Fell free to reach out to us if you want to support the project for increasing the limit. <a href="mailto:sagarkashyap.cc@gmail.com" className="text-sky-400 hover:underline">Email</a>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100 mb-1">AI Model Information</h3>
            <p>
              Package Pal is powered by Google's <strong className="text-sky-400">Gemini 2.5 Flash</strong> model. This is a powerful and fast model provided
              for developers to build applications like this one. The shared backend uses a common API key with its own quotas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100 mb-1">Using Your Own Gemini API Key</h3>
            <p>
              The "Your Gemini API Key" field is optional. If you provide your own key, API requests will be made directly from your browser to the Gemini API, bypassing our shared backend.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li><strong className="text-slate-200">Bypass Rate Limits:</strong> You won't be subject to our backend's 10 requests/minute limit. Your usage will be based on your own Google AI Platform quotas.</li>
              <li><strong className="text-slate-200">Privacy:</strong> Your API key is only used in your browser and is never sent to our servers.</li>
              <li>You can get your own free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google AI Studio</a>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;