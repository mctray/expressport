import { useState } from 'react';
import { Download, Loader2, ReceiptText } from 'lucide-react';
import { Button } from './ui/Button';
import { InvoiceShipment, downloadShipmentInvoice } from '../lib/shipmentInvoice';

interface DeliveredInvoiceProps {
  shipment: InvoiceShipment;
}

export default function DeliveredInvoice({ shipment }: DeliveredInvoiceProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  if (shipment.status !== 'delivered') return null;

  const handleDownload = async () => {
    setGenerating(true);
    setError('');
    try {
      await downloadShipmentInvoice(shipment);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Could not generate the shipment invoice.',
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-lg shadow-emerald-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <ReceiptText className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold text-slate-900">Your delivery invoice is ready</h2>
          <p className="mt-1 text-sm text-slate-600">
            Download a PDF with the shipment, sender, and recipient details.
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <Button
          type="button"
          onClick={handleDownload}
          disabled={generating}
          className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-600 sm:w-auto"
        >
          {generating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {generating ? 'Preparing PDF...' : 'Download invoice'}
        </Button>
        {error && (
          <p role="alert" className="mt-2 max-w-xs text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
