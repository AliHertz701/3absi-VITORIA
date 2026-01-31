// hooks/usePrintInvoice.ts
import { useCallback } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

interface InvoiceItem {
  id: string | number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: string | number;
  discount_percentage: number;
  image?: string;
}

interface InvoiceData {
  id: string | number;
  invoice_number?: string;
  created_at: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  payment_method?: string;
  notes?: string;
}

export const usePrintInvoice = () => {
  const { t } = useLocale();

  const printInvoice = useCallback((invoice: InvoiceData | null) => {
    if (!invoice) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 
                      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    // Format numbers
    const formatNumber = (num: number) => {
      return num.toFixed(3);
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'pending': return 'معلق';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    };

    const getPaymentMethodText = (method?: string) => {
      switch (method) {
        case 'cod': return 'نقدي عند الاستلام';
        case 'bank_transfer': return 'تحويل بنكي';
        case 'card': return 'بطاقة ائتمان';
        default: return method || 'غير محدد';
      }
    };

    const invoiceNumber = invoice.invoice_number || `INV-${String(invoice.id).padStart(6, '0')}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة #${invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 8mm;
            margin-top: 12mm;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', sans-serif;
          }
          
          body {
            width: 210mm;
            min-height: 297mm;
            padding: 0;
            margin: 0;
            background: white;
            color: #000;
            font-size: 9pt;
            line-height: 1.3;
          }
          
          .invoice {
            padding: 10mm;
            page-break-inside: avoid;
          }
          
          /* Header - Compact */
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-name {
            font-size: 20pt;
            font-weight: 900;
            color: #000;
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          
          .company-desc {
            font-size: 8pt;
            color: #444;
            margin-bottom: 4px;
          }
          
          .invoice-info {
            text-align: left;
          }
          
          .invoice-title {
            font-size: 14pt;
            font-weight: 700;
            color: #000;
            margin-bottom: 4px;
          }
          
          .invoice-meta {
            font-size: 8pt;
          }
          
          .meta-row {
            margin-bottom: 1px;
          }
          
          .label {
            font-weight: 600;
            display: inline-block;
            min-width: 60px;
          }
          
          /* Customer Info - Compact */
          .customer-info {
            display: flex;
            gap: 15px;
            margin-bottom: 12px;
            font-size: 8pt;
          }
          
          .info-block {
            flex: 1;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #f9f9f9;
          }
          
          .info-title {
            font-weight: 700;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #ccc;
            font-size: 9pt;
          }
          
          .info-row {
            margin-bottom: 2px;
            display: flex;
            justify-content: space-between;
          }
          
          /* Items Table - Ultra Compact */
          .items-section {
            margin-bottom: 10px;
          }
          
          .section-title {
            font-size: 10pt;
            font-weight: 700;
            background: #f0f0f0;
            padding: 4px 8px;
            margin-bottom: 4px;
            border-radius: 2px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
          }
          
          .items-table th {
            background: #e9e9e9;
            border: 1px solid #000;
            padding: 5px 3px;
            font-weight: 700;
            text-align: center;
            font-size: 8pt;
          }
          
          .items-table td {
            border: 1px solid #ddd;
            padding: 4px 3px;
            text-align: center;
            vertical-align: top;
          }
          
          .product-cell {
            text-align: right;
            padding-right: 6px !important;
          }
          
          .product-name {
            font-weight: 600;
            margin-bottom: 1px;
          }
          
          .product-attr {
            font-size: 7pt;
            color: #555;
          }
          
          .color-box {
            display: inline-block;
            width: 10px;
            height: 10px;
            border: 1px solid #999;
            margin-left: 3px;
            vertical-align: middle;
          }
          
          .discount-badge {
            display: inline-block;
            background: #4CAF50;
            color: white;
            font-size: 6pt;
            padding: 1px 4px;
            border-radius: 2px;
            margin-top: 1px;
          }
          
          /* Totals - Compact */
          .totals-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 12px;
          }
          
          .totals {
            width: 200px;
            border: 1px solid #000;
            padding: 8px;
            background: #f8f8f8;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px dotted #ccc;
          }
          
          .total-row:last-child {
            border-bottom: none;
          }
          
          .total-label {
            font-weight: 600;
          }
          
          .total-value {
            font-weight: 600;
            text-align: left;
          }
          
          .grand-total {
            font-size: 10pt;
            font-weight: 900;
            color: #000;
            padding-top: 4px;
            margin-top: 4px;
            border-top: 2px solid #000;
          }
          
          /* Footer - Compact */
          .footer {
            border-top: 2px solid #000;
            padding-top: 8px;
            margin-top: 8px;
            text-align: center;
            font-size: 7pt;
            color: #444;
          }
          
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 6px;
          }
          
          .footer-col {
            text-align: center;
          }
          
          .footer-title {
            font-weight: 700;
            color: #000;
            margin-bottom: 2px;
            font-size: 8pt;
          }
          
          /* Notes */
          .notes-section {
            background: #fff8dc;
            border: 1px solid #ffd700;
            padding: 5px;
            margin-top: 8px;
            font-size: 8pt;
            border-radius: 2px;
          }
          
          .notes-title {
            font-weight: 700;
            margin-bottom: 2px;
          }
          
          /* Compact QR */
          .qr-section {
            text-align: center;
            margin: 6px 0;
          }
          
          .qr-code {
            display: inline-block;
            width: 70px;
            height: 70px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            font-size: 6pt;
            padding: 3px;
            text-align: center;
            word-break: break-all;
          }
          
          /* Print buttons */
          .print-controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          
          .print-btn {
            background: #000;
            color: white;
            border: none;
            padding: 8px 20px;
            margin: 0 5px;
            border-radius: 3px;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            font-size: 9pt;
            cursor: pointer;
          }
          
          .close-btn {
            background: #666;
            color: white;
            border: none;
            padding: 8px 20px;
            margin: 0 5px;
            border-radius: 3px;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            font-size: 9pt;
            cursor: pointer;
          }
          
          /* Page break prevention */
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Compact spacing */
          .compact-spacing {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <div class="company-name">VITORIA</div>
              <div class="company-desc">ملابس وأزياء فاخرة</div>
              <div style="font-size: 7pt; color: #666;">
                طرابلس - ليبيا | هاتف: 0912345678<br>
                السجل التجاري: 123456 | الرقم الضريبي: 123-456-789
              </div>
            </div>
            
            <div class="invoice-info">
              <div class="invoice-title">فاتورة </div>
              <div class="invoice-meta">
                <div class="meta-row">
                  <span class="label">رقم:</span> ${invoiceNumber}
                </div>
                <div class="meta-row">
                  <span class="label">التاريخ:</span> ${formatDate(invoice.created_at)}
                </div>
                <div class="meta-row">
                  <span class="label">الحالة:</span> ${getStatusText(invoice.status)}
                </div>
                <div class="meta-row">
                  <span class="label">الدفع:</span> ${getPaymentMethodText(invoice.payment_method)}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Customer Info -->
          <div class="customer-info">
            <div class="info-block">
              <div class="info-title">العميل</div>
              <div class="info-row">
                <span>الاسم:</span>
                <span>${invoice.name}</span>
              </div>
              <div class="info-row">
                <span>الهاتف:</span>
                <span>${invoice.phone}</span>
              </div>
            </div>
            
            <div class="info-block">
              <div class="info-title">التوصيل</div>
              <div class="info-row">
                <span>المدينة:</span>
                <span>${invoice.city}</span>
              </div>
              <div class="info-row">
                <span>العنوان:</span>
                <span style="text-align: left; max-width: 120px;">${invoice.address}</span>
              </div>
            </div>
          </div>
          
          <!-- Items -->
          <div class="items-section page-break-avoid">
            <div class="section-title">تفاصيل المنتجات</div>
<table class="items-table" style="font-size: 7pt;">
  <thead>
    <tr>
      <th style="width: 40%; padding: 3px 2px;">المنتج</th>
      <th style="width: 8%; padding: 3px 2px;">لون</th>
      <th style="width: 8%; padding: 3px 2px;">مقاس</th>
      <th style="width: 8%; padding: 3px 2px;">كمية</th>
      <th style="width: 18%; padding: 3px 2px;">السعر</th>
      <th style="width: 18%; padding: 3px 2px;">المجموع</th>
    </tr>
  </thead>
  <tbody>
    ${invoice.items?.slice(0, 25).map((item) => {
      const unitPrice = parseFloat(String(item.price));
      const qty = item.quantity;
      const discount = item.discount_percentage || 0;
      const total = unitPrice * qty * (1 - discount / 100);
      
      return `
        <tr style="height: 18px;">
          <td style="text-align: right; padding: 2px;">${item.name}</td>
          <td style="padding: 2px;">${item.color?.charAt(0) || '-'}</td>
          <td style="padding: 2px;">${item.size || '-'}</td>
          <td style="padding: 2px;">${qty}</td>
          <td style="padding: 2px;">
            ${formatNumber(unitPrice)} ${discount > 0 ? `(-${discount}%)` : ''}
          </td>
          <td style="padding: 2px; font-weight: 700;">${formatNumber(total)}</td>
        </tr>
      `;
    }).join('')}
  </tbody>
</table>
          </div>
          
          <!-- Totals -->
          <div class="totals-wrapper page-break-avoid">
            <div class="totals">
              <div class="total-row">
                <span class="total-label">المجموع الفرعي:</span>
                <span class="total-value">${formatNumber(invoice.subtotal)} د.ل</span>
              </div>
              
              ${invoice.discount_amount > 0 ? `
                <div class="total-row" style="color: #4CAF50;">
                  <span class="total-label">الخصم:</span>
                  <span class="total-value">-${formatNumber(invoice.discount_amount)} د.ل</span>
                </div>
              ` : ''}
              
              <div class="total-row">
                <span class="total-label">الشحن:</span>
                <span class="total-value">${formatNumber(invoice.delivery_fee)} د.ل</span>
              </div>
              
              <div class="total-row grand-total">
                <span class="total-label">الإجمالي النهائي:</span>
                <span class="total-value">${formatNumber(invoice.total)} د.ل</span>
              </div>
              
              <div style="font-size: 7pt; text-align: center; margin-top: 4px; color: #666;">
                شاملاً جميع الضرائب (إن وجدت)
              </div>
            </div>
          </div>
          
          ${invoice.notes ? `
            <div class="notes-section page-break-avoid">
              <div class="notes-title">ملاحظات:</div>
              <div>${invoice.notes}</div>
            </div>
          ` : ''}
          
          <!-- QR Code -->
          <div class="qr-section">
            <div class="qr-code">
              فاتورة رقم<br>
              ${invoiceNumber}<br>
              <div style="margin-top: 3px; font-size: 5pt;">(مسح للتحقق)</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer page-break-avoid">
            <div class="footer-grid">
              <div class="footer-col">
                <div class="footer-title">تواصل معنا</div>
                <div>0912345678</div>
                <div>info@vitoria.ly</div>
              </div>
              
              <div class="footer-col">
                <div class="footer-title">شروط</div>
                <div>لا استرجاع بعد 7 أيام</div>
                <div>التوصيل خلال 2-3 أيام</div>
              </div>
              
              <div class="footer-col">
                <div class="footer-title">التوقيع</div>
                <div style="height: 20px; border-bottom: 1px dashed #999; margin: 3px 0;"></div>
                <div>المسؤول</div>
              </div>
            </div>
            
            <div style="margin-top: 4px; font-size: 6pt; color: #777;">
              هذه وثيقة رسمية صادرة من شركة فيتوريا | تاريخ الطباعة: ${new Date().toLocaleDateString('ar-LY')}
            </div>
          </div>
        </div>
        
        <!-- Print Controls -->
        <div class="print-controls no-print">
          <button class="print-btn" onclick="window.print()">🖨️ طباعة</button>
          <button class="close-btn" onclick="window.close()">إغلاق</button>
        </div>
        
        <script>
          // Auto-print after a short delay
          setTimeout(() => {
            window.focus();
            // Uncomment for auto-print
            // window.print();
          }, 500);
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
    
    // Focus window
    setTimeout(() => {
      printWindow.focus();
    }, 300);
  }, [t]);

  return { printInvoice };
};

export default usePrintInvoice;