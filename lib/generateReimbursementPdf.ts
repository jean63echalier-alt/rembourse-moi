import * as Print from 'expo-print';

import type { FamilyMember, Reimbursement } from '@/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function generateReimbursementPdf(
  member: Pick<FamilyMember, 'name'>,
  reimbursements: Reimbursement[]
): Promise<string> {
  const totalDepense = reimbursements.reduce((sum, r) => sum + r.amount, 0);
  const totalRembourse = reimbursements
    .filter((r) => r.status === 'reimbursed')
    .reduce((sum, r) => sum + r.reimbursedAmount, 0);
  const resteACharge = totalDepense - totalRembourse;

  const rows = reimbursements
    .map(
      (r) => `
        <tr>
          <td>${escapeHtml(r.provider)}</td>
          <td>${escapeHtml(r.category)}</td>
          <td>${formatDate(r.date)}</td>
          <td>${r.amount.toFixed(2)} €</td>
          <td>${r.status === 'reimbursed' ? `${r.reimbursedAmount.toFixed(2)} €` : '—'}</td>
        </tr>`
    )
    .join('');

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Helvetica, sans-serif; padding: 24px; color: #1F2937; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p.subtitle { color: #6B7280; margin-top: 0; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
          th { color: #6B7280; font-weight: 600; }
          .totals { display: flex; gap: 16px; }
          .total-box { flex: 1; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; }
          .total-label { font-size: 12px; color: #6B7280; margin-bottom: 4px; }
          .total-value { font-size: 18px; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>Récapitulatif des remboursements</h1>
        <p class="subtitle">${escapeHtml(member.name)} — généré le ${formatDate(
          new Date().toISOString()
        )}</p>

        <table>
          <thead>
            <tr><th>Praticien</th><th>Catégorie</th><th>Date</th><th>Payé</th><th>Remboursé</th></tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5">Aucun remboursement enregistré.</td></tr>'}</tbody>
        </table>

        <div class="totals">
          <div class="total-box">
            <div class="total-label">Total dépensé</div>
            <div class="total-value">${totalDepense.toFixed(2)} €</div>
          </div>
          <div class="total-box">
            <div class="total-label">Total remboursé</div>
            <div class="total-value">${totalRembourse.toFixed(2)} €</div>
          </div>
          <div class="total-box">
            <div class="total-label">Reste à charge</div>
            <div class="total-value">${resteACharge.toFixed(2)} €</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}
