import { CheckCircle, Clock, MapPin, Package, Plane } from 'lucide-react';

interface ShipmentProgressProps {
  status: string;
  currentLocation?: string | null;
  origin?: string | null;
  destination?: string | null;
  estimatedDelivery?: string | null;
}

const progressSteps = [
  { label: 'Order placed', icon: Package },
  { label: 'Picked up', icon: CheckCircle },
  { label: 'In transit', icon: Plane },
  { label: 'Out for delivery', icon: MapPin },
  { label: 'Delivered', icon: CheckCircle },
];

const statusProgress: Record<string, number> = {
  pending: 0,
  created: 0,
  picked_up: 1,
  in_transit: 2,
  out_for_delivery: 3,
  delivered: 4,
  failed: 2,
  returned: 2,
};

export default function ShipmentProgress({
  status,
  currentLocation,
  origin,
  destination,
  estimatedDelivery,
}: ShipmentProgressProps) {
  const currentStep = statusProgress[status] ?? 0;
  const progress = (currentStep / (progressSteps.length - 1)) * 100;
  const isDelivered = status === 'delivered';
  const hasException = status === 'failed' || status === 'returned';
  const formattedDelivery = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <section className="tracking-progress-card animate-fadeInUp" aria-label="Shipment progress">
      <div className="tracking-progress-glow" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-100">
              <span className="tracking-live-dot" aria-hidden="true" />
              Shipment progress
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {isDelivered ? 'Your package has arrived!' : 'Your package is on its way'}
            </h2>
            <p className="mt-2 text-sm text-teal-50 sm:text-base">
              {hasException
                ? `There is an update to your delivery: ${status.replace(/_/g, ' ')}.`
                : currentLocation
                  ? `Last scanned near ${currentLocation}.`
                  : 'Follow every step of its journey right here.'}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs font-medium text-teal-100">
              {isDelivered ? 'Delivered' : 'Estimated delivery'}
            </p>
            <p className="mt-1 text-lg font-bold text-white">
              {isDelivered ? 'Successfully' : formattedDelivery ?? 'We’ll update you soon'}
            </p>
          </div>
        </div>

        <div className="mt-8 px-1 sm:mt-10 sm:px-3">
          <div className="relative">
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="tracking-progress-fill h-full rounded-full bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="tracking-plane-marker absolute -top-7 text-lime-200"
              style={{ left: `${progress}%` }}
              aria-hidden="true"
            >
              <Plane className="h-6 w-6 -translate-x-1/2" />
            </div>
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between" aria-hidden="true">
              {progressSteps.map((step, index) => (
                <span
                  key={step.label}
                  className={`h-4 w-4 rounded-full border-[3px] ${
                    index <= currentStep
                      ? 'border-lime-200 bg-teal-500'
                      : 'border-white/50 bg-teal-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-1">
            {progressSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCurrent = index === currentStep && !isDelivered;
              const isComplete = index <= currentStep;

              return (
                <div
                  key={step.label}
                  className={`flex flex-col items-center text-center ${
                    isComplete ? 'text-white' : 'text-teal-100/55'
                  }`}
                >
                  <StepIcon
                    className={`mb-1 h-4 w-4 sm:h-5 sm:w-5 ${
                      isCurrent ? 'tracking-current-step' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-semibold leading-tight sm:text-xs">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {(origin || destination || currentLocation) && (
          <div className="mt-7 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2 text-teal-50">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime-200" />
              <span className="truncate">{origin || 'Shipment origin'}</span>
            </div>
            {currentLocation && (
              <div className="flex min-w-0 items-start gap-2 text-white sm:justify-center">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-lime-200" />
                <span className="truncate">{currentLocation}</span>
              </div>
            )}
            <div className="flex min-w-0 items-start gap-2 text-teal-50 sm:justify-end">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime-200" />
              <span className="truncate">{destination || 'Delivery destination'}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
