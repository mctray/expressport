import { AlertCircle, Package, RotateCw, Search } from 'lucide-react';
import { Button } from './ui/Button';

type TrackingFeedbackKind = 'empty' | 'not-found' | 'service-error';

interface TrackingFeedbackProps {
  kind: TrackingFeedbackKind;
  onAction?: () => void;
}

const feedbackContent = {
  empty: {
    title: 'Your tracking updates will appear here',
    description: 'Enter the tracking number from your shipment confirmation to get started.',
    action: null,
  },
  'not-found': {
    title: 'We couldn’t find that tracking number',
    description: 'Check the letters and numbers, then try again. Your entry is still in the box.',
    action: 'Edit tracking number',
  },
  'service-error': {
    title: 'Tracking is temporarily unavailable',
    description: 'Please try again in a moment, or contact our support team for help.',
    action: 'Try again',
  },
} satisfies Record<TrackingFeedbackKind, { title: string; description: string; action: string | null }>;

export default function TrackingFeedback({ kind, onAction }: TrackingFeedbackProps) {
  const content = feedbackContent[kind];
  const Icon = kind === 'empty' ? Package : kind === 'not-found' ? Search : AlertCircle;

  return (
    <section
      role={kind === 'empty' ? 'status' : 'alert'}
      className={`rounded-2xl border p-5 sm:p-6 ${
        kind === 'service-error'
          ? 'border-red-200 bg-red-50'
          : kind === 'not-found'
            ? 'border-amber-200 bg-amber-50'
            : 'border-teal-100 bg-gradient-to-br from-white to-teal-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`rounded-xl p-3 ${
            kind === 'service-error'
              ? 'bg-red-100 text-red-700'
              : kind === 'not-found'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-teal-100 text-teal-700'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-slate-900">{content.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{content.description}</p>
          {kind !== 'empty' && (
            <p className="mt-2 text-sm text-slate-600">
              Need a hand?{' '}
              <a
                href="mailto:expressport.support@gmail.com"
                className="font-semibold text-teal-800 underline underline-offset-2 hover:text-teal-950"
              >
                Contact Express Port support
              </a>
              .
            </p>
          )}
          {content.action && onAction && (
            <Button
              type="button"
              variant={kind === 'service-error' ? 'outline' : 'ghost'}
              onClick={onAction}
              className="mt-4 rounded-lg"
            >
              {kind === 'service-error' ? (
                <RotateCw className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : null}
              {content.action}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
