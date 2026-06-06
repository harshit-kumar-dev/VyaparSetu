module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Helper for UUID columns
    const uuidId = {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    };

    // Roles
    await queryInterface.createTable('roles', {
      id: uuidId,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Users
    await queryInterface.createTable('users', {
      id: uuidId,
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' }
      },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      refreshToken: { type: Sequelize.STRING },
      resetToken: { type: Sequelize.STRING },
      resetTokenExpiry: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Vendor Categories
    await queryInterface.createTable('vendor_categories', {
      id: uuidId,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Vendors
    await queryInterface.createTable('vendors', {
      id: uuidId,
      companyName: { type: Sequelize.STRING, allowNull: false },
      registrationNumber: { type: Sequelize.STRING, unique: true },
      taxId: { type: Sequelize.STRING },
      contactEmail: { type: Sequelize.STRING, allowNull: false },
      contactPhone: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      categoryId: {
        type: Sequelize.UUID,
        references: { model: 'vendor_categories', key: 'id' }
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'BLACKLISTED'),
        defaultValue: 'PENDING'
      },
      performanceScore: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // RFQs
    await queryInterface.createTable('rfqs', {
      id: uuidId,
      rfqNumber: { type: Sequelize.STRING, unique: true, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED'),
        defaultValue: 'DRAFT'
      },
      deadline: { type: Sequelize.DATE, allowNull: false },
      documents: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Quotations
    await queryInterface.createTable('quotations', {
      id: uuidId,
      rfqId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'rfqs', key: 'id' }
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'vendors', key: 'id' }
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'),
        defaultValue: 'DRAFT'
      },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.00 },
      deliveryTimeDays: { type: Sequelize.INTEGER },
      validUntil: { type: Sequelize.DATE },
      documents: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      remarks: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Purchase Orders
    await queryInterface.createTable('purchase_orders', {
      id: uuidId,
      poNumber: { type: Sequelize.STRING, unique: true, allowNull: false },
      quotationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'quotations', key: 'id' }
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'vendors', key: 'id' }
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'ISSUED', 'ACCEPTED', 'DELIVERED', 'CLOSED'),
        defaultValue: 'DRAFT'
      },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      pdfUrl: { type: Sequelize.STRING },
      generatedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_orders');
    await queryInterface.dropTable('quotations');
    await queryInterface.dropTable('rfqs');
    await queryInterface.dropTable('vendors');
    await queryInterface.dropTable('vendor_categories');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  }
};
