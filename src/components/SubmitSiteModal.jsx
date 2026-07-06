import React, { useState } from 'react';
import { CATEGORIES } from '../data';

export default function SubmitSiteModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'Simulation',
    description: '',
    submitter_name: '',
  });

  const categories = CATEGORIES.filter(c => c !== "All");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-primary border border-accent/20 p-8 rounded-2xl max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-accent hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h3 className="text-2xl font-bold text-accent mb-4">Submit a Site</h3>
        <p className="text-accent/80 leading-relaxed mb-6 text-sm">
          Found an interesting website? Submit it here, and we'll review it for addition to our curated directory!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-accent text-sm font-bold mb-1">Website Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-black/20 border border-accent/30 rounded-lg px-4 py-2 text-accent focus:outline-none focus:border-accent" placeholder="e.g. 100,000 Stars" />
          </div>
          <div>
            <label className="block text-accent text-sm font-bold mb-1">Website URL</label>
            <input required name="url" value={formData.url} onChange={handleChange} type="url" className="w-full bg-black/20 border border-accent/30 rounded-lg px-4 py-2 text-accent focus:outline-none focus:border-accent" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-accent text-sm font-bold mb-1">Category</label>
            <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/20 border border-accent/30 rounded-lg px-4 py-2 text-accent focus:outline-none focus:border-accent">
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-primary">{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-accent text-sm font-bold mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-black/20 border border-accent/30 rounded-lg px-4 py-2 text-accent focus:outline-none focus:border-accent resize-none" placeholder="What makes this site special?"></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-accent text-sm font-bold mb-1">Your Name (Optional)</label>
              <input name="submitter_name" value={formData.submitter_name} onChange={handleChange} type="text" className="w-full bg-black/20 border border-accent/30 rounded-lg px-4 py-2 text-accent focus:outline-none focus:border-accent" placeholder="Dadang Kopling" />
            </div>
          </div>
          <button type="submit" className="mt-2 w-full py-2.5 bg-accent text-primary font-bold rounded-lg hover:scale-[1.02] transition-transform">
            Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
}
