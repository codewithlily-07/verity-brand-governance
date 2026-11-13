import React, { useState } from 'react';
import { MessageSquarePlus, Star, X, CheckCircle, Download } from 'lucide-react';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('Usability');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName || 'Judge / Reviewer',
          rating,
          category,
          comment
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
          setComment('');
        }, 2000);
      }
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-midnight hover:bg-navy text-gold text-xs font-semibold shadow-2xl border border-gold/40 flex items-center gap-1.5 transition-all hover:scale-105"
        title="Leave tester feedback (saved to database for Round 2 user testing pack)"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span>Give Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-midnight/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-base font-bold text-ink">User Testing Feedback</h3>
                <p className="text-[11px] text-gray-500">Recorded for the Round 2 evaluation evidence pack.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center text-teal space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto" />
                <p className="font-bold text-sm">Feedback Recorded in Database!</p>
                <p className="text-xs text-gray-500">Thank you for testing VERITY brand governance.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Rating Stars */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Your Evaluation Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 text-lg transition-transform ${star <= rating ? 'text-amber-400 scale-110' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-gray-700">{rating} / 5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Your Name / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Judge / Tester"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Feedback Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                    >
                      <option value="Usability">Usability & Flow</option>
                      <option value="Accuracy">Finding Accuracy</option>
                      <option value="Speed">Performance / Latency</option>
                      <option value="Feature Request">Feature Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Observations & Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Share what worked smoothly, any friction point, or suggestions..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-gold"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <a
                    href="/api/feedback/export.csv"
                    download="verity_user_testing_feedback.csv"
                    className="text-[11px] text-gray-500 hover:text-ink flex items-center gap-1 font-medium"
                    title="Download all collected user-testing feedback as CSV"
                  >
                    <Download className="w-3 h-3 text-gold" />
                    <span>Export CSV</span>
                  </a>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-midnight font-bold shadow-sm disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Submit Feedback'}
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
