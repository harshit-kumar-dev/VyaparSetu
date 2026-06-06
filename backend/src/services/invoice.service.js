const { Invoice, PurchaseOrder, Vendor, sequelize } = require('../models');
const AppError = require('../utils/AppError');

class InvoiceService {
  async generateInvoice(poId, taxRate = 0.0) {
    const t = await sequelize.transaction();
    try {
      const po = await PurchaseOrder.findByPk(poId);
      if (!po) throw new AppError('Purchase Order not found', 404);

      const subtotal = po.totalAmount;
      const taxAmount = subtotal * taxRate;
      const grandTotal = parseFloat(subtotal) + parseFloat(taxAmount);

      const invoice = await Invoice.create({
        invoiceNumber: `INV-${Date.now()}`,
        poId: po.id,
        vendorId: po.vendorId,
        subtotal,
        taxAmount,
        grandTotal,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days due date
      }, { transaction: t });

      await t.commit();
      return this.getInvoiceById(invoice.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getInvoiceById(id) {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: PurchaseOrder, as: 'purchaseOrder' },
        { model: Vendor, as: 'vendor' }
      ]
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }
}

module.exports = new InvoiceService();
