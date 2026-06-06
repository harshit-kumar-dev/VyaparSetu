const { ApprovalWorkflow, ApprovalStep, User, sequelize } = require('../models');
const AppError = require('../utils/AppError');

class ApprovalService {
  async initiateApproval(data, initiatorId) {
    const t = await sequelize.transaction();
    try {
      const { rfqId, quotationId, approvers } = data; // approvers: [{ approverId, stepOrder }]
      
      const workflow = await ApprovalWorkflow.create({
        rfqId,
        quotationId,
        initiatorId
      }, { transaction: t });

      if (approvers && approvers.length > 0) {
        const stepData = approvers.map(a => ({
          workflowId: workflow.id,
          approverId: a.approverId,
          stepOrder: a.stepOrder
        }));
        await ApprovalStep.bulkCreate(stepData, { transaction: t });
      }

      await t.commit();
      return workflow;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new ApprovalService();
