import courierLogoUrl from '../../favicon.svg';

export interface InvoiceShipment {
  tracking_number: string;
  status: string;
  sender_name?: string | null;
  sender_email?: string | null;
  sender_phone?: string | null;
  sender_address?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  receiver_name?: string | null;
  receiver_email?: string | null;
  receiver_phone?: string | null;
  receiver_address?: string | null;
  recipient_name?: string | null;
  recipient_email?: string | null;
  recipient_phone?: string | null;
  recipient_address?: string | null;
  origin?: string | null;
  destination?: string | null;
  package_type?: string | null;
  package_description?: string | null;
  package_weight?: number | null;
  service_type?: string | null;
  declared_value?: number | null;
  price?: number | null;
  actual_delivery?: string | null;
  estimated_delivery?: string | null;
  created_at?: string | null;
}

const clean = (value: string | null | undefined) => value?.trim() || 'Not provided';

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'Not provided';
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Not provided'
    : parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

async function loadCourierLogo(): Promise<string> {
  const image = new Image();
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not load the courier logo for the invoice.'));
  });
  image.src = courierLogoUrl;
  await loaded;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not prepare the courier logo for the invoice.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

export async function downloadShipmentInvoice(shipment: InvoiceShipment): Promise<void> {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), loadCourierLogo()]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 54;

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 43, 'F');
  doc.addImage(logo, 'PNG', margin, 9, 22, 22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Express Port', margin + 28, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Courier and delivery services', margin + 28, 25);
  doc.text('expressport.support@gmail.com', margin + 28, 31);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.text('DELIVERY INVOICE', pageWidth - margin, 17, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Invoice: EP-${shipment.tracking_number}`, pageWidth - margin, 25, { align: 'right' });
  doc.text(`Issued: ${formatDate(shipment.actual_delivery || new Date().toISOString())}`, pageWidth - margin, 31, {
    align: 'right',
  });

  const ensureSpace = (height: number) => {
    if (y + height > 277) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionTitle = (title: string) => {
    ensureSpace(14);
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, contentWidth, 9, 2, 2, 'F');
    doc.setTextColor(15, 118, 110);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), margin + 3, y + 6);
    y += 14;
  };

  const field = (label: string, value: string, x = margin, width = contentWidth) => {
    const lines = doc.splitTextToSize(value, width - 4);
    const height = Math.max(11, lines.length * 4.5 + 6);
    ensureSpace(height);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(lines, x, y + 5);
    y += height;
  };

  const senderName = shipment.sender_name || shipment.customer_name;
  const senderAddress = shipment.sender_address || shipment.origin;
  const receiverName = shipment.receiver_name || shipment.recipient_name;
  const receiverAddress = shipment.receiver_address || shipment.destination || shipment.recipient_address;

  sectionTitle('Shipment');
  field('Tracking number', shipment.tracking_number);
  field('Delivery status', 'Delivered');
  field('Delivery date', formatDate(shipment.actual_delivery));
  field('Service', clean(shipment.service_type));
  field('Shipment created', formatDate(shipment.created_at));
  field('Estimated delivery', formatDate(shipment.estimated_delivery));

  sectionTitle('Sender');
  field('Name', clean(senderName));
  field('Address', clean(senderAddress));
  field('Phone', clean(shipment.sender_phone || shipment.customer_phone));
  field('Email', clean(shipment.sender_email || shipment.customer_email));

  sectionTitle('Recipient');
  field('Name', clean(receiverName));
  field('Address', clean(receiverAddress));
  field('Phone', clean(shipment.receiver_phone || shipment.recipient_phone));
  field('Email', clean(shipment.receiver_email || shipment.recipient_email));

  sectionTitle('Parcel details');
  field('Package type', clean(shipment.package_type));
  field('Description', clean(shipment.package_description));
  field(
    'Weight',
    shipment.package_weight == null ? 'Not provided' : `${shipment.package_weight} kg`,
  );
  field('Declared value', shipment.declared_value == null ? 'Not provided' : `$${shipment.declared_value.toFixed(2)}`);

  if (shipment.price != null) {
    ensureSpace(18);
    y += 2;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Shipping total', margin, y);
    doc.setTextColor(15, 118, 110);
    doc.text(`$${shipment.price.toFixed(2)} USD`, pageWidth - margin, y, { align: 'right' });
    y += 9;
  }
  ensureSpace(18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for choosing Express Port.', margin, y + 4);
  doc.text('For delivery questions, contact expressport.support@gmail.com.', margin, y + 9);

  const safeTrackingNumber = shipment.tracking_number.replace(/[^A-Za-z0-9_-]/g, '_');
  doc.save(`Express-Port-Invoice-${safeTrackingNumber}.pdf`);
}
