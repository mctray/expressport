import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from './ui/Button';

interface ShareTrackingProps {
  trackingNumber: string;
}

export default function ShareTracking({ trackingNumber }: ShareTrackingProps) {
  const [message, setMessage] = useState('');
  const trackingUrl = new URL('/track', window.location.origin);
  trackingUrl.searchParams.set('tracking', trackingNumber);
  const shareUrl = trackingUrl.toString();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage('Tracking link copied. Share it with anyone who needs an update.');
    } catch {
      setMessage('Copy was blocked by your browser. Select and copy the link below.');
    }
  };

  const shareLink = async () => {
    setMessage('');
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Track shipment ${trackingNumber}`,
          text: `Follow shipment ${trackingNumber} with Express Port.`,
          url: shareUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setMessage('Could not open the share menu. You can copy the tracking link below.');
        }
      }
      return;
    }

    await copyLink();
  };

  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-5 shadow-lg shadow-teal-900/5 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3 sm:mb-0 sm:flex-1">
        <span className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold text-slate-900">Keep someone in the loop</h2>
          <p className="mt-1 text-sm text-slate-600">
            Share a link that opens this shipment’s live tracking.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          onClick={() => void shareLink()}
          className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 sm:w-auto"
        >
          <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Share tracking
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void copyLink()}
          className="w-full rounded-xl border-teal-200 text-teal-800 hover:bg-teal-50 sm:w-auto"
        >
          {message.startsWith('Tracking link copied') ? (
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Copy link
        </Button>
      </div>
      <div className="mt-4 w-full sm:mt-0">
        <label htmlFor="share-tracking-link" className="sr-only">
          Shareable tracking link
        </label>
        <input
          id="share-tracking-link"
          readOnly
          value={shareUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
        />
        <p className="mt-2 min-h-5 text-sm text-teal-800" role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </section>
  );
}
