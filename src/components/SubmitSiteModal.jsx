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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-primary/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-primary border-4 border-accent p-8 sm:p-10 rounded-[2rem] max-w-lg w-full shadow-[12px_12px_0_0] shadow-accent relative transform transition-all" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-accent hover:scale-110 transition-transform bg-primary border-2 border-accent rounded-full p-1 z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="mb-8">
          <h3 className="text-3xl md:text-4xl font-black text-accent mb-3 tracking-tight uppercase">Submit Site</h3>
          <div className="h-1.5 w-20 bg-accent mb-4"></div>
          <p className="text-accent/80 font-medium text-sm md:text-base leading-relaxed">
            Found something mind-blowing? Drop the details below and we'll review it for the curated collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-accent text-sm font-bold mb-2 uppercase tracking-wide">Website Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-primary border-2 border-accent/60 rounded-xl px-4 py-3 text-accent focus:outline-none focus:border-accent focus:shadow-[4px_4px_0_0] focus:shadow-accent transition-all font-medium placeholder-accent/30" placeholder="e.g. 100,000 Stars" />
          </div>
          
          <div>
            <label className="block text-accent text-sm font-bold mb-2 uppercase tracking-wide">Website URL</label>
            <input required name="url" value={formData.url} onChange={handleChange} type="url" className="w-full bg-primary border-2 border-accent/60 rounded-xl px-4 py-3 text-accent focus:outline-none focus:border-accent focus:shadow-[4px_4px_0_0] focus:shadow-accent transition-all font-medium placeholder-accent/30" placeholder="https://..." />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-accent text-sm font-bold mb-2 uppercase tracking-wide">Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-primary border-2 border-accent/60 rounded-xl px-4 py-3 text-accent focus:outline-none focus:border-accent focus:shadow-[4px_4px_0_0] focus:shadow-accent transition-all font-medium appearance-none cursor-pointer">
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-primary">{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-accent text-sm font-bold mb-2 uppercase tracking-wide">Your Name</label>
              <input name="submitter_name" value={formData.submitter_name} onChange={handleChange} type="text" className="w-full bg-primary border-2 border-accent/60 rounded-xl px-4 py-3 text-accent focus:outline-none focus:border-accent focus:shadow-[4px_4px_0_0] focus:shadow-accent transition-all font-medium placeholder-accent/30" placeholder="Dadang Kopling" />
            </div>
          </div>

          <div>
            <label className="block text-accent text-sm font-bold mb-2 uppercase tracking-wide">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-primary border-2 border-accent/60 rounded-xl px-4 py-3 text-accent focus:outline-none focus:border-accent focus:shadow-[4px_4px_0_0] focus:shadow-accent transition-all font-medium resize-none placeholder-accent/30" placeholder="Why should people visit this site?"></textarea>
          </div>
          
          <button type="submit" className="mt-4 w-full py-4 bg-accent border-4 border-accent text-primary font-black text-lg uppercase tracking-widest rounded-xl hover:bg-primary hover:text-accent hover:shadow-[6px_6px_0_0] hover:shadow-accent transition-all duration-200">
            Submit Now
          </button>
        </form>
      </div>
    </div>
}
