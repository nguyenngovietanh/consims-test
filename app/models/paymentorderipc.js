const senserver = require("../models/senserver.js");
// paymentorderipc.js
/*
    "Data": [
        {
            "PaymentId": 1021,
            "PaymentDate": "2026-03-07T10:57:31.157",
            "POCode": "IPC 26",
            "POName": "( Docs: 0)",
            "SubmittedAmount": null,
            "RemarksOnSubmisison": null,
            "IsAssigned": "Yes",
            "ApprovalStatus": "Chưa làm",
            "ApprovedAmount": 1115000,
            "RemarksOnPOApproval": null,
            "Type": null
        }
    ]
IPC detail
            {
            "Type": null,
            "SubmissionId": null,
            "WBS": null,
            "PaymentDate": null,
            "WorkName": "PERFORMED WORKS",
            "WorkCat": null,
            "Unit": null,
            "Qnty": null,
            "UnitPrice": 0,
            "Amount": null,
            "TaxRate": null,
            "VAT": null,
            "Total": null,
            "Remarks": null,
            "VATInvoice": null
            }
  
            
IPC Print
"Data": {
        "AllPerformedAmount": 19154592936,
        "AllPaidAmount": 0,
        "AllDeductedAmount": 95280000,
        "AllAdvPaymentDeduction": 0,
        "AllRetentionAmount": 0,
        "AllOtherDeduct": 95280000,
        "AllAddedAmount": 3880000,
        "AllAdvPayment": 1680000,
        "AllRetentionAmountRecovery": 2200000,
        "AllOtherAdd": 0,
        "AllPayableAmount": 19063192936,
        "CummPerformedAmount": 1233145000,
        "CummPaidAmount": 0,
        "CummDeductedAmount": 47640000,
        "CummAdvPaymentDeduction": 0,
        "CummRetentionAmount": 0,
        "CummOtherDeduct": 47640000,
        "CummAddedAmount": 1940000,
        "CummAdvPayment": 840000,
        "CummRetentionAmountRecovery": 1100000,
        "CummOtherAdd": 0,
        "PerformedAmount": 16688302936,
        "PaidAmount": 0,
        "DeductedAmount": 0,
        "AdvPaymentDeduction": 0,
        "RetentionAmount": 0,
        "OtherDeduct": 0,
        "AddedAmount": 0,
        "AdvPayment": 0,
        "RetentionAmountRecovery": 0,
        "OtherAdd": 0,
        "PayableAmount": 23310851860,
        "Remarks": null,
        "POCode": null,
        "IPCName": null,
        "IsProceed": "No",
        "VAT": 6622548924
    }
IPC assignee
        {
      "RoleInWord": "Trình",
      "FullName": "Vũ Hoàng Duy Khánh",
      "ActualFinish": "2026-03-17T10:11:35.837",
      "ApprovalStatus": "Đã trình",
      "Remarks": "Trình"
    }

      "Data": [
        {
            "WorkType": "construction_work",
            "SubmissionId": 187689,
            "Blank": "",
            "Code": "2.1.1.1.18",
            "SubmissionDate": "2025-12-10T00:00:00",
            "WorkName": "Cốt thép bệ máy, bể nước mái, S12.02",
            "SubmissionName": "[work] Subm.#113:of [2.1.1.1.18]  (Docs: 2)",
            "Unit": "kg",
            "ApprovedWorkCat": "contracted_quantity",
            "SubmittedQnty": 2000,
            "SubmittedUnitPrice": 0,
            "SubmittedAmount": 0,
            "ApprovedQnty": 2000,
            "ApprovedUnitPrice": 2030,
            "ApprovedAmount": 4060000,
            "RemarksOnApproval": ""
        }
      ]

*/

class IPC {
  constructor({ PaymentId, PaymentDate, POCode, POName, SubmittedAmount, RemarksOnSubmisison, IsAssigned, ApprovalStatus, ApprovedAmount, RemarksOnPOApproval, Type, PORemarks, ContractName, ContractCode, CreatedBy } = {}) {
    this.PaymentId = PaymentId ?? 0;
    this.PaymentDate = PaymentDate ?? new Date();
    this.POCode = POCode ?? '';
    this.POName = POName ?? '';
    this.SubmittedAmount = SubmittedAmount ?? 0;
    this.RemarksOnSubmisison = RemarksOnSubmisison ?? '';
    this.IsAssigned = IsAssigned ?? 'Yes';
    this.ApprovalStatus = ApprovalStatus ?? '';
    this.ApprovedAmount = ApprovedAmount ?? 0;
    this.RemarksOnPOApproval = RemarksOnPOApproval ?? '';
    this.ContractName = ContractName ?? '';
    this.ContractCode = ContractCode ?? '';
    this.PORemarks = PORemarks ?? '';
    this.Type = Type ?? '';
    this.CreatedBy = CreatedBy ?? '';
  }
}

class IPCLine {
  constructor({ Type, SubmissionId, WBS, PaymentDate, WorkName, WorkCat, Unit, Qnty, UnitPrice, Amount, TaxRate, VAT, Total, Remarks, VATInvoice } = {}) {
    this.Type = Type ?? '';
    this.SubmissionId = SubmissionId ?? 0;
    this.WBS = WBS ?? '';
    this.PaymentDate = PaymentDate ?? new Date();
    this.WorkName = WorkName ?? '';
    this.WorkCat = WorkCat ?? '';
    this.Unit = Unit ?? '';
    this.Qnty = Qnty ?? 0;
    this.UnitPrice = UnitPrice ?? 0;
    this.Amount = Amount ?? 0;
    this.TaxRate = TaxRate ?? 0;
    this.VAT = VAT ?? 0;
    this.Total = Total ?? 0;
    this.Remarks = Remarks ?? '';
    this.VATInvoice = VATInvoice ?? '';
  }
}

class IPCPrint {
  constructor({
    AllPerformedAmount,
    AllPaidAmount,
    AllDeductedAmount,
    AllAdvPaymentDeduction,
    AllRetentionAmount,
    AllOtherDeduct,
    AllAddedAmount,
    AllAdvPayment,
    AllRetentionAmountRecovery,
    AllOtherAdd,
    AllPayableAmount,
    CummPerformedAmount,
    CummPaidAmount,
    CummDeductedAmount,
    CummAdvPaymentDeduction,
    CummRetentionAmount,
    CummOtherDeduct,
    CummAddedAmount,
    CummAdvPayment,
    CummRetentionAmountRecovery,
    CummOtherAdd,
    PerformedAmount,
    PaidAmount,
    DeductedAmount,
    AdvPaymentDeduction,
    RetentionAmount,
    OtherDeduct,
    AddedAmount,
    AdvPayment,
    RetentionAmountRecovery,
    OtherAdd,
    PayableAmount,
    Remarks,
    POCode,
    IPCName,
    IsProceed,
    VAT
  } = {}) {
    this.AllPerformedAmount = AllPerformedAmount ?? 0;
    this.AllPaidAmount = AllPaidAmount ?? 0;
    this.AllDeductedAmount = AllDeductedAmount ?? 0;
    this.AllAdvPaymentDeduction = AllAdvPaymentDeduction ?? 0;
    this.AllRetentionAmount = AllRetentionAmount ?? 0;
    this.AllOtherDeduct = AllOtherDeduct ?? 0;
    this.AllAddedAmount = AllAddedAmount ?? 0;
    this.AllAdvPayment = AllAdvPayment ?? 0;
    this.AllRetentionAmountRecovery = AllRetentionAmountRecovery ?? 0;
    this.AllOtherAdd = AllOtherAdd ?? 0;
    this.AllPayableAmount = AllPayableAmount ?? 0;

    this.CummPerformedAmount = CummPerformedAmount ?? 0;
    this.CummPaidAmount = CummPaidAmount ?? 0;
    this.CummDeductedAmount = CummDeductedAmount ?? 0;
    this.CummAdvPaymentDeduction = CummAdvPaymentDeduction ?? 0;
    this.CummRetentionAmount = CummRetentionAmount ?? 0;
    this.CummOtherDeduct = CummOtherDeduct ?? 0;
    this.CummAddedAmount = CummAddedAmount ?? 0;
    this.CummAdvPayment = CummAdvPayment ?? 0;
    this.CummRetentionAmountRecovery = CummRetentionAmountRecovery ?? 0;
    this.CummOtherAdd = CummOtherAdd ?? 0;

    this.PerformedAmount = PerformedAmount ?? 0;
    this.PaidAmount = PaidAmount ?? 0;
    this.DeductedAmount = DeductedAmount ?? 0;
    this.AdvPaymentDeduction = AdvPaymentDeduction ?? 0;
    this.RetentionAmount = RetentionAmount ?? 0;
    this.OtherDeduct = OtherDeduct ?? 0;
    this.AddedAmount = AddedAmount ?? 0;
    this.AdvPayment = AdvPayment ?? 0;
    this.RetentionAmountRecovery = RetentionAmountRecovery ?? 0;
    this.OtherAdd = OtherAdd ?? 0;
    this.PayableAmount = PayableAmount ?? 0;

    this.Remarks = Remarks ?? null;
    this.POCode = POCode ?? null;
    this.IPCName = IPCName ?? null;
    this.IsProceed = IsProceed ?? 'No';
    this.VAT = VAT ?? 0;
  }
}

class IPCAssignee {
  constructor({ RoleInWord, FullName, ActualFinish, ApprovalStatus, Remarks } = {}) {
    this.RoleInWord = RoleInWord ?? '';
    this.FullName = FullName ?? '';
    this.ActualFinish = ActualFinish ?? null;
    this.ApprovalStatus = ApprovalStatus ?? '';
    this.Remarks = Remarks ?? '';
  }
}
class IPCContractInfo {
  constructor({
    IPCName,
    ContractorName,
    PaymentDate,
    ContractName,
    ContractCode,
    ContractAmount,
    ApprovalStatus,
    PaymentApprovalStatus
  } = {}) {
    this.IPCName = IPCName ?? null;
    this.ContractorName = ContractorName ?? '';
    this.PaymentDate = PaymentDate ?? null;
    this.ContractName = ContractName ?? '';
    this.ContractCode = ContractCode ?? '';
    this.ContractAmount = ContractAmount ?? 0;
    this.ApprovalStatus = ApprovalStatus ?? 'All';
    this.PaymentApprovalStatus = PaymentApprovalStatus ?? 'Not-Started';
  }
}

class IPCTax {
  constructor({ Invoice, Amount, TaxAmount, TotalAmount } = {}) {
    this.Invoice = Invoice ?? '';
    this.Amount = Amount ?? 0;
    this.TaxAmount = TaxAmount ?? 0;
    this.TotalAmount = TotalAmount ?? 0;
  }
}

//thêm trường isnullable vào meta
// để xác định trường nào có thể để trống
// và trường nào là bắt buộc
const meta = [
  { field: 'ContractCode', type: 'string', description: 'Contract Code', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ContractName', type: 'string', description: 'Contract Name', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'PaymentId', type: 'bigint', description: 'Payment Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: false, show: true, visible: true },
  { field: 'POCode', type: 'string', description: 'PO Code', isnullable: true, show: true, visible: true },
  { field: 'POName', type: 'string', description: 'Description', isnullable: true, show: true, visible: true },
  { field: 'SubmittedAmount', type: 'number', description: 'Submitted Amount', isnullable: true, show: false, visible: false },
  { field: 'RemarksOnSubmisison', type: 'string', description: 'Remarks On Submisison', isnullable: true, show: true, visible: true },
  { field: 'IsAssigned', type: 'string', description: 'Is Assigned', isnullable: true, show: true, visible: true },
  { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: true },
  { field: 'ApprovedAmount', type: 'number', description: 'Approved Amount', isnullable: true, show: false, visible: false },
  { field: 'RemarksOnPOApproval', type: 'string', description: 'Remarks On PO Approval', isnullable: true, show: true, visible: true },
  { field: 'Type', type: 'string', description: 'Type', isnullable: true, show: true, visible: true },

  { field: 'PORemarks', type: 'string', description: 'Remarks', isnullable: true, show: false, visible: false },
  { field: 'ContractId', type: 'bigint', description: 'Contract Id', isnullable: true, show: false, visible: false },

  // { field: 'IPCCode', type: 'string', description: 'IPC Code', isnullable: true, show: true, visible: false, readonly: true },
  // // { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: false, readonly: true },
  // { field: 'ContractorName', type: 'string', description: 'Contractor Name', isnullable: true, show: true, visible: false, readonly: true },
  // { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: false, readonly: true },

  // { field: 'ContractAmount', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: false, readonly: true },
  // { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: false, readonly: true },
  // { field: 'PaymentApprovalStatus', type: 'string', description: 'Review Status', isnullable: true, show: true, visible: false, readonly: true }

  { field: 'CreatedBy', type: 'string', description: 'Created By', isnullable: true, show: false, visible: true, readonly: true },
];

// Meta cho dữ liệu trả về ở chế độ print_ipc_detail.
const metaline = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'Type', type: 'string', description: 'Type', isnullable: true, show: false, visible: false, readonly: true },
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', isnullable: true, show: false, visible: true, readonly: true },
  { field: 'WBS', type: 'string', description: 'WBS', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'WorkName', type: 'string', description: 'Work Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'WorkCat', type: 'string', description: 'Work Cat.', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Unit', type: 'string', description: 'Unit', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Qnty', type: 'number', description: 'Qnty', isnullable: true, show: true, visible: true, readonly: true, allowsummary: true },
  { field: 'UnitPrice', type: 'number', description: 'Unit Price', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Amount', type: 'number', description: 'Amount', isnullable: true, show: true, visible: true, readonly: true, allowsummary: true },
  { field: 'TaxRate', type: 'number', description: 'Tax Rate', isnullable: true, show: true, visible: true, edit: true },
  { field: 'VAT', type: 'number', description: 'VAT', isnullable: true, show: true, visible: true, readonly: true, allowsummary: true },
  { field: 'Total', type: 'number', description: 'Total', isnullable: true, show: true, visible: true, readonly: true, allowsummary: true },
  { field: 'Remarks', type: 'string', description: 'Remarks', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'VATInvoice', type: 'string', description: 'VAT Invoice', isnullable: true, show: true, visible: true, edit: true },
];

const metaprint = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'AllPerformedAmount', type: 'number', description: 'All Performed Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllPaidAmount', type: 'number', description: 'All Paid Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllDeductedAmount', type: 'number', description: 'All Deducted Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllAdvPaymentDeduction', type: 'number', description: 'All Adv Payment Deduction', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllRetentionAmount', type: 'number', description: 'All Retention Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllOtherDeduct', type: 'number', description: 'All Other Deduct', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllAddedAmount', type: 'number', description: 'All Added Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllAdvPayment', type: 'number', description: 'All Adv Payment', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllRetentionAmountRecovery', type: 'number', description: 'All Retention Recovery', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllOtherAdd', type: 'number', description: 'All Other Add', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AllPayableAmount', type: 'number', description: 'All Payable Amount', isnullable: true, show: true, visible: true, readonly: true },

  { field: 'CummPerformedAmount', type: 'number', description: 'Cumm Performed Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummPaidAmount', type: 'number', description: 'Cumm Paid Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummDeductedAmount', type: 'number', description: 'Cumm Deducted Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummAdvPaymentDeduction', type: 'number', description: 'Cumm Adv Payment Deduction', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummRetentionAmount', type: 'number', description: 'Cumm Retention Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummOtherDeduct', type: 'number', description: 'Cumm Other Deduct', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummAddedAmount', type: 'number', description: 'Cumm Added Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummAdvPayment', type: 'number', description: 'Cumm Adv Payment', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummRetentionAmountRecovery', type: 'number', description: 'Cumm Retention Recovery', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'CummOtherAdd', type: 'number', description: 'Cumm Other Add', isnullable: true, show: true, visible: true, readonly: true },

  { field: 'PerformedAmount', type: 'number', description: 'Performed Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaidAmount', type: 'number', description: 'Paid Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'DeductedAmount', type: 'number', description: 'Deducted Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AdvPaymentDeduction', type: 'number', description: 'Adv Payment Deduction', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'RetentionAmount', type: 'number', description: 'Retention Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'OtherDeduct', type: 'number', description: 'Other Deduct', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AddedAmount', type: 'number', description: 'Added Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AdvPayment', type: 'number', description: 'Adv Payment', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'RetentionAmountRecovery', type: 'number', description: 'Retention Recovery', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'OtherAdd', type: 'number', description: 'Other Add', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PayableAmount', type: 'number', description: 'Payable Amount', isnullable: true, show: true, visible: true, readonly: true },

  { field: 'Remarks', type: 'string', description: 'Remarks', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'POCode', type: 'string', description: 'PO Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'IsProceed', type: 'boolean', description: 'Is Proceed', isnullable: true, show: true, visible: true, readonly: true, inputtype: 'checkbox' },
  { field: 'VAT', type: 'number', description: 'VAT', isnullable: true, show: true, visible: true, readonly: true },

  { field: 'IPCCode', type: 'string', description: 'IPC Code', isnullable: true, show: true, visible: false, readonly: true },
  // { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ContractorName', type: 'string', description: 'Contractor Name', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ContractName', type: 'string', description: 'Contract Name', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ContractCode', type: 'string', description: 'Contract Code', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ContractAmount', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'PaymentApprovalStatus', type: 'string', description: 'Review Status', isnullable: true, show: true, visible: false, readonly: true }
];


const metaprintcumulative = [
  /*
                  "Perform": 0,
                "AccumulatedPerform": -4386860000,
                "AccumulatedRetention": 0,
                "AccumulatedPayed": -4386860000,
                "AccumulatedAdvancePayment": 0,
                "AccumulatedAdvancePaymentRecovery": 100000000,
                "AccumulatedTotalRecoveryAmount": 0,
                "AccumulatedHoldAmount": 0,
                "AccumulatedPayable": -4486860000,
                "Total": 0
  */
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'Perform', type: 'number', description: 'Perform', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedPerform', type: 'number', description: 'Accumulated Perform', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedRetention', type: 'number', description: 'Accumulated Retention', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedPayed', type: 'number', description: 'Accumulated Payed', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedAdvancePayment', type: 'number', description: 'Accumulated Advance Payment', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedAdvancePaymentRecovery', type: 'number', description: 'Accumulated Advance Payment Recovery', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedTotalRecoveryAmount', type: 'number', description: 'Accumulated Total Recovery Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedHoldAmount', type: 'number', description: 'Accumulated Hold Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'AccumulatedPayable', type: 'number', description: 'Accumulated Payable', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Total', type: 'number', description: 'Total', isnullable: true, show: true, visible: true, readonly: true },
  /*                "IPCName": "ipc 27.3",
                  "IPCCode": "IPC 2",
                  "ContractAmount_": null,
                  "ChangedContractAmount": null,
                  "SumContractAmount": null,
                  "ContractorName": "Công Ty CP Vinhomes",
                  "PaymentDate": "2026-03-27",
                  "ContractName": "Hợp đồng CĐT Demo",
                  "ContractCode": "CC1000225.09/001",
                  "ContractAmount": 0,
                  "ContractDate": "2025-09-18",
                  "PaymentApprovalStatus": "Not-Started" */

  { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'IPCCode', type: 'string', description: 'IPC Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractAmount_', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ChangedContractAmount', type: 'number', description: 'Changed Contract Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SumContractAmount', type: 'number', description: 'Sum Contract Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractorName', type: 'string', description: 'Contractor Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractName', type: 'string', description: 'Contract Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractCode', type: 'string', description: 'Contract Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractAmount', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractDate', type: 'date', description: 'Contract Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaymentApprovalStatus', type: 'string', description: 'Payment Approval Status', isnullable: true, show: true, visible: true, readonly: true }


];


const metaipctax = [
  { field: 'Id', type: 'bigint', description: 'Id', key: true, isnullable: true, show: false, visible: false },
  { field: 'Invoice', type: 'string', description: 'Invoice Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Amount', type: 'number', description: 'Before Tax Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'TaxAmount', type: 'number', description: 'Tax Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'TotalAmount', type: 'number', description: 'After Tax Amount', isnullable: true, show: true, visible: true, readonly: true }
];

const metaassignee = [
  { field: 'RoleInWord', type: 'string', description: 'Role In Word', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'FullName', type: 'string', description: 'Full Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ActualFinish', type: 'date', description: 'Actual Finish', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Remarks', type: 'string', description: 'Remarks', isnullable: true, show: true, visible: true, readonly: true }
];

const metacontractinfo = [
  { field: 'IPCCode', type: 'string', description: 'IPC Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractorName', type: 'string', description: 'Contractor Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractName', type: 'string', description: 'Contract Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractCode', type: 'string', description: 'Contract Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ContractAmount', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'PaymentApprovalStatus', type: 'string', description: 'Payment Approval Status', isnullable: true, show: true, visible: true, readonly: true }
];


class IPCDraft {
  constructor({
    WorkType,
    SubmissionId,
    Blank,
    Code,
    SubmissionDate,
    WorkName,
    SubmissionName,
    Unit,
    ApprovedWorkCat,
    SubmittedQnty,
    SubmittedUnitPrice,
    SubmittedAmount,
    ApprovedQnty,
    ApprovedUnitPrice,
    ApprovedAmount,
    RemarksOnApproval
  } = {}) {
    this.WorkType = WorkType ?? '';
    this.SubmissionId = SubmissionId ?? 0;
    this.Blank = Blank ?? '';
    this.Code = Code ?? '';
    this.SubmissionDate = SubmissionDate ?? new Date();
    this.WorkName = WorkName ?? '';
    this.SubmissionName = SubmissionName ?? '';
    this.Unit = Unit ?? '';
    this.ApprovedWorkCat = ApprovedWorkCat ?? '';
    this.SubmittedQnty = SubmittedQnty ?? 0;
    this.SubmittedUnitPrice = SubmittedUnitPrice ?? 0;
    this.SubmittedAmount = SubmittedAmount ?? 0;
    this.ApprovedQnty = ApprovedQnty ?? 0;
    this.ApprovedUnitPrice = ApprovedUnitPrice ?? 0;
    this.ApprovedAmount = ApprovedAmount ?? 0;
    this.RemarksOnApproval = RemarksOnApproval ?? '';
  }
}

const metadraft = [
  { field: 'Id', type: 'bigint', description: 'Id', isnullable: true, show: false, visible: false },
  { field: 'SubmissionId', type: 'bigint', description: 'Submission Id', isnullable: true, key: true, show: false, visible: true, readonly: true },
  { field: 'WorkType', type: 'string', description: 'Work Type', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Blank', type: 'string', description: 'Blank', isnullable: true, show: false, visible: false, readonly: true },
  { field: 'Code', type: 'string', description: 'Code', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmissionDate', type: 'date', description: 'Submission Date', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'WorkName', type: 'string', description: 'Work Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmissionName', type: 'string', description: 'Submission Name', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'Unit', type: 'string', description: 'Unit', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedWorkCat', type: 'string', description: 'Approved Work Cat.', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedQnty', type: 'number', description: 'Submitted Qnty', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedUnitPrice', type: 'number', description: 'Submitted Unit Price', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'SubmittedAmount', type: 'number', description: 'Submitted Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedQnty', type: 'number', description: 'Approved Qnty', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedUnitPrice', type: 'number', description: 'Approved Unit Price', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'ApprovedAmount', type: 'number', description: 'Approved Amount', isnullable: true, show: true, visible: true, readonly: true },
  { field: 'RemarksOnApproval', type: 'string', description: 'Remarks On Approval', isnullable: true, show: true, visible: true, readonly: true }
];

class IPCAssigneeApproval {
  constructor({ UserId, Account, FullName, RoleAction, Role, RoleLevel, IsAssigned } = {}) {
    this.UserId = UserId ?? 0;
    this.Account = Account ?? '';
    this.FullName = FullName ?? '';
    this.RoleAction = RoleAction ?? '';
    this.Role = Role ?? '';
    this.RoleLevel = RoleLevel ?? 0;
    this.IsAssigned = IsAssigned ?? 'No';
  }
}

const metaassigneeapproval = [
  { field: 'Id', type: 'bigint', description: 'Id', isnullable: true, show: false, visible: false, key: true },
  { field: 'UserId', type: 'bigint', description: 'User Id', isnullable: true, show: false, visible: false, readonly: true },
  { field: 'Account', type: 'string', description: 'Account', isnullable: true, show: true, visible: true, readonly: true, width: 200 },
  { field: 'FullName', type: 'string', description: 'Full Name', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'RoleAction', type: 'string', description: 'Role Action', isnullable: true, show: true, visible: true, readonly: true, width: 180 },
  { field: 'Role', type: 'string', description: 'Role', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'RoleLevel', type: 'number', description: 'Role Level', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'IsAssigned', type: 'string', description: 'Is Assigned', isnullable: true, show: true, visible: false, readonly: true },
  { field: 'Remarks', type: 'string', description: 'Remarks', isnullable: true, show: true, visible: true, edit: true }
];


const datas = []; // Lưu trữ các role trong bộ nhớ

const getDatas = async ({ req }) => {
  // Lấy tất cả các role từ mô hình theo phân trang
  const page = parseInt(req.query.page) || 1;
  const pagesize = parseInt(req.query.pagesize) || 10;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  let keyword = '';
  //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
  if (Object.keys(filterConditions).length > 0) {
    //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    if (Array.isArray(filterConditions.conditions)) {
      //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
      const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'searchTerm');
      //nếu keywordCondition có thì gán giá trị cho keyword
      if (keywordCondition) { keyword = keywordCondition.value; }
    }
  }
  /*
  params:{
  "LogIn": "lotusviet@lotusviet.vn",
  "SessionId": "CDA36C14-CD70-4D4C-9C0A-65B651657C20",
  "Language":"vi",
  "ApprovalStatus":"All",
  "ContractId":304,
  "FromDate":"2026-03-07",
  "ToDate":"2026-03-07",
  "PageSize":1000,
  "Keyword":"",
  "CreatedBy":"All",
  "DisplayMode":"po_list"
  }
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || 'en',
    "ApprovalStatus": req.query.filterapprovalstatus || "All",
    "ContractId": req.query.filtercontractid || 0,
    "FromDate": req.query.filterfromdate || "",
    "ToDate": req.query.filtertodate || "",
    "PageNum": page,
    "PageSize": pagesize,
    "Keyword": req.query.filterkeyword || "",
    "CreatedBy": req.query.filtercreatedby || "All",
    "DisplayMode": req.query.filterdisplaymode || "po_list"
  });
  const url = `${req.app.locals.env.api.host}/api/get-ipc-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apipara: para, apiurl: url };

};

const getDatasAll = async ({ req }) => {
  // Lấy tất cả các role từ mô hình theo phân trang
  const page = parseInt(req.query.page) || 1;
  const pagesize = parseInt(req.query.pagesize) || 10;
  const filterConditions = req.query.filter ? JSON.parse(req.query.filter) : {};
  let keyword = '';
  //nếu filterConditions không là đối tượng rỗng thì thêm vào điều kiện lọc
  if (Object.keys(filterConditions).length > 0) {
    //nếu filterConditions.Conditions là mảng thì thêm vào điều kiện lọc
    if (Array.isArray(filterConditions.conditions)) {
      //tìm điều kiện trường searchTerm có thì gán nếu không thì cho =''
      const keywordCondition = filterConditions.conditions.find(cond => cond.field === 'searchTerm');
      //nếu keywordCondition có thì gán giá trị cho keyword
      if (keywordCondition) { keyword = keywordCondition.value; }
    }
  }
  /*
https://consims.com/api/get-ipc-list?params=
{
"LogIn":"lotusviet@lotusviet.vn",
"SessionId": "7D6CAB7C-4DE1-4155-B72E-6F615C7AA9CA",
"Language":"vi",
"ApprovalStatus":"All",
"ContractId":null,
"FromDate":"",
"ToDate":"",
"PageSize":10,
"Keyword":"",
"CreatedBy":"All",
"DisplayMode":"po_list_by_web"
}
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || 'en',

    "ApprovalStatus": req.query.filterstatus || "All",
    "ContractId": req.query.filtercontractid || null,
    "FromDate": req.query.filterfromdate || "",
    "ToDate": req.query.filtertodate || "",
    "PageNum": page,
    "PageSize": pagesize,
    "Keyword": req.query.filterkeyword || "",
    "CreatedBy": req.query.filtercreatedby || "All",
    "DisplayMode": req.query.filterdisplaymode || "po_list_by_web"
  });
  const url = `${req.app.locals.env.api.host}/api/get-ipc-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  //tạm không phân trang
  const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], page, pagesize, total, totalpages: Math.ceil(total / pagesize), apipara: para, apiurl: url };

};

// Hàm để tìm theo trường tùy chỉnh
const findByField = (field, value) => {
  return datas.find(data => data[field] === value);
};
// Hàm tìm theo khóa
const findByKey = async ({ req }) => {
  const id = req.query.RoleId || 0;
  const para = JSON.stringify({
    "ActiveRoleOnly": null,
    "DisplayMode": "full_list",
    "Language": "vi",
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Keyword": "",
    "RoleId": id
  });
  const url = `${req.app.locals.env.api.host}/api/get-role-list?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  const result = data.Data && data.Data.length > 0 ? data.Data[0] : null;
  return result || {};

}

// Hàm để thêm mới 
const addData = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  //chuyên đổi req.body sang Object
  const newObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: newObject, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  // const { contractid, poname, remarks, paymentdate } = req.body;
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "ContractId": newObject.ContractId || 0,
      "Language": req.app.locals.env.lang || "en",
      "PaymentDate": newObject.PaymentDate || "",
      "UpdateMode": "create_payment_order_from_draft",
      "POName": newObject.POName || "",
      "Remarks": newObject.PORemarks || ""
    }
  });
  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {}, apiurl: url, apipara: para };

};

// Hàm để cập nhật role
const updateData = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updateObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updateObject, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "SessionId": req.session.sessionid,
      "LogIn": req.session.user.username,
      "WSId": req.app.locals.env.api.WSId,
      "UpdateMode": "update",
      "Roles": [
        {
          "RoleId": updateObject.RoleId,
          "Code": updateObject.Code,
          "RoleName": updateObject.RoleName,
          "Alias": updateObject.Alias,
          "IsActive": updateObject.IsActive,
          //"RoleType": updateObject.RoleType,
          "WorkingPlace": updateObject.WorkingPlace || "",
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-role-list`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    resdata.status = 0;
    resdata.message = data.Message;
    resdata.errors = data.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
};

// Hàm để xóa data
const deleteData = async (req) => {
  //api
  /**
   https://consims.com/api/create-ipc
   {
      "params": {
          "LogIn": "khanhvuday@gmail.com",
          "SessionId": "F90DB9DA-1036-4D2E-84DA-D9F1DE345A58",
          "UpdateMode": "delete_ipc_",
          "PaymentId": 1189
      }
    }
   */

  const id = req.params.id;

  const para = JSON.stringify({
    "params":
      { "LogIn": req.session.user.username, "SessionId": req.session.sessionid, "UpdateMode": "delete_ipc_", "PaymentId": id || 0 }
  });

  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data.Data || {} };
};

const validateApplyTax = async ({ req, meta }) => {
  /*
  {{baseURL}}/api/apply-vat-tax/
  {
      "params": {
          "LogIn": "lotusviet@lotusviet.vn",
          "SessionId": "7B304816-29FC-41A4-8134-ACF6C890CAF6",
          "Language": "en",
          "DisplayMode": "print_ipc_detail",
          "PaymentId": 1482180,
          "DisplayTempoNum": "No",
          "PageSize": 1000
      }
  }
  */

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "Language": req.app.locals.env.lang || "en",
      "DisplayMode": req.query.displaymode || "print_ipc_detail",
      "PaymentId": req.body.paymentid || 0,
      "DisplayTempoNum": req.query.displaytemponum || "No",
      "PageSize": req.query.pagesize || 10000
    }
  });
  const url = `${req.app.locals.env.api.host}/api/apply-vat-tax`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    return { status: 0, message: data.Message, row: data || {}, apiurl: url, apipara: para };
    // throw new Error(`${data.Message}`); 
  }
  return { status: 1, message: data.Message, row: data || {}, apiurl: url, apipara: para };

};

const acceptApplyTax = async ({ req, meta }) => {
  /*
  {{baseURL}}/api/apply-vat-tax/
  {
      "params": {
          "LogIn": "lotusviet@lotusviet.vn",
          "SessionId": "8A431B7A-878C-446D-AC2B-E859D2C418A7",
          "Language": "en",
          "DisplayMode": "print_ipc_detail",
          "PaymentId": 938,
          "DisplayTempoNum": "No",
          "PageSize": 1000,
          "OverrideTax": "Yes"
      }
  }
  */

  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "Language": req.app.locals.env.lang || "en",
      "DisplayMode": req.query.displaymode || "print_ipc_detail",
      "PaymentId": req.body.paymentid || 0,
      "DisplayTempoNum": req.query.displaytemponum || "No",
      "OverrideTax": req.query.overridetax || "Yes",
      "PageSize": req.query.pagesize || 10000
    }
  });
  const url = `${req.app.locals.env.api.host}/api/apply-vat-tax`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') { throw new Error(`${data.Message}`); }
  return { status: 1, message: data.Message, row: data || {}, apiurl: url, apipara: para };

};

const getIPCLine = async ({ req }) => {
  /* 
  {{baseURL}}/api/get-ipc-detail?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"850FA97C-9510-4D4F-8557-0CDDDBEA230D","Language":"en","DisplayMode":"print_ipc_detail","PaymentId":1010,"DisplayTempoNum":"No","PageSize":1000}
  */
  const para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.displaymode || "print_ipc_detail",
    "PaymentId": req.query.paymentid || 0,
    "DisplayTempoNum": req.query.displaytemponum || "No",
    "PageSize": req.query.pagesize || 10000
  });
  const url = `${req.app.locals.env.api.host}/api/get-ipc-detail?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }

  //cập nhật lại Id cho mỗi line để làm key khi render table
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((line, index) => {
      line.Id = index + 1; // Gán Id bắt đầu từ 1
      line.TaxRate = (parseFloat(line.TaxRate) || 0) * 100; // Đảm bảo TaxRate là số
      if (!line.SubmissionId) {
        line.UnitPrice = "";
        line.TaxRate = null;
      }
    });
  }

  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  return { datas: data.Data || [], apiurl: url, apipara: encodeURIComponent(para) };

};

const updateIPCLineTax = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updateObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  // resdata.errors = senserver.utils.validmodel({ model: updateObject, meta: meta || [] });
  // if (Object.keys(resdata.errors).length > 0) {
  //   resdata.status = 0;
  //   resdata.message = 'validation error';
  //   return resdata;
  // }

  /* 
  {{baseURL}}/api/upsert-vat-invoice
  {
    "LogIn": "lotusviet@lotusviet.vn",
    "SessionId": "8E33E7DF-68FF-451A-A72F-864F504C6F8E",
    "UseTempoVATInvoiceNum": "No",
    "PaymentId": 970,
    "UpdateMode": "update_vat_invoice",
    "Invoices": [
        {
            "Type": "construction_work",
            "SubmissionId": 187746,
            "TaxRate": 0.08,
            "InvoiceNo": "Thuế A"
        },
        {
            "Type": "construction_work",
            "SubmissionId": 187749,
            "TaxRate": 0.08,
            "InvoiceNo": "Thuế A"
        },
        {
            "Type": "construction_work",
            "SubmissionId": 187770,
            "TaxRate": 0.1,
            "InvoiceNo": "Thuế B"
        }
    ]
}
  */


  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "LogIn": req.session.user.username,
      "SessionId": req.session.sessionid,
      "UseTempoVATInvoiceNum": req.query.UseTempoVATInvoiceNum || "No",
      "PaymentId": req.query.paymentid || 0,
      "UpdateMode": req.query.updatemode || "update_vat_invoice",
      "Invoices": [
        {
          "Type": updateObject.Type,
          "SubmissionId": updateObject.SubmissionId,
          "TaxRate": (parseFloat(updateObject.TaxRate) || 0) / 100,
          "InvoiceNo": updateObject.VATInvoice
        }
      ]
    }
  });
  const url = `${req.app.locals.env.api.host}/api/upsert-vat-invoice`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    resdata.status = 0;
    resdata.message = data.Message;
    resdata.errors = data.Errors || {};
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
};

const getIPCPrint = async ({ req }) => {
  /* 
  https://consims.com/api/get-ipc-summary?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"2C4BD467-00F4-4FB1-8D0B-8967DA513740","Language":"en","SummaryMode":"print_ipc","PaymentId":1052}
  */
  let para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "SummaryMode": req.query.summarymode || "print_ipc",
    "PaymentId": req.query.paymentid || 0
  });
  let url = `${req.app.locals.env.api.host}/api/get-ipc-summary?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }

  // //cập nhật lại Id cho mỗi line để làm key khi render table
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((line, index) => {
  //     line.Id = index + 1; // Gán Id bắt đầu từ 1
  //   });
  // }

  //lấy phân công
  /*
  https://consims.com/api/get-ipc-asignee?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"5068A3EB-8295-4A4E-9DBD-BEB44A502E0B","Language":"en","DisplayMode":"by_ipc","PageSize":1000,"Keyword":"","PaymentId":1021}
  */
  para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.displaymode || "by_ipc",
    "PageSize": req.query.pagesize || 10000,
    "Keyword": req.query.keyword || "",
    "PaymentId": req.query.paymentid || 0
  });
  url = `${req.app.locals.env.api.host}/api/get-ipc-asignee?params=${encodeURIComponent(para)}`;
  const response1 = await fetch(url);
  const data1 = await response1.json();


  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  const result = data.Data || null;
  if (result) {
    result.dataext = { contractinfo: data.ContractInfo, asignee: data1.Data, apiurl: url, apipara: encodeURIComponent(para) };
  }
  return result || {};
  // return { datas: data.Data[0] || [], data: data, data1: data1, apiurl: url, apipara: encodeURIComponent(para) };

};


//in lũy kế
const getIPCPrintCumulative = async ({ req }) => {
  /* 
  https://consims.com/api/get-ipc-summary?params=
  {"LogIn":"lotusviet@lotusviet.vn","SessionId":"6CF52A03-4A9E-4DCC-86ED-87C9D99D0507","Language":"en","SummaryMode":"print_ipc_cum","PaymentId":1246}
  */
  let para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "SummaryMode": req.query.summarymode || "print_ipc_cum",
    "PaymentId": req.query.paymentid || 0
  });
  let url = `${req.app.locals.env.api.host}/api/get-ipc-summary?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }

  // //cập nhật lại Id cho mỗi line để làm key khi render table
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((line, index) => {
  //     line.Id = index + 1; // Gán Id bắt đầu từ 1
  //   });
  // }

  //lấy phân công
  /*
  https://consims.com/api/get-ipc-asignee?params={"LogIn":"lotusviet@lotusviet.vn","SessionId":"6CF52A03-4A9E-4DCC-86ED-87C9D99D0507","Language":"vi","DisplayMode":"by_ipc","PageSize":1000,"Keyword":"","PaymentId":1073}
  */
  para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.displaymode || "by_ipc",
    "PageSize": req.query.pagesize || 10000,
    "Keyword": req.query.keyword || "",
    "PaymentId": req.query.paymentid || 0
  });
  url = `${req.app.locals.env.api.host}/api/get-ipc-asignee?params=${encodeURIComponent(para)}`;
  const response1 = await fetch(url);
  const data1 = await response1.json();


  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  let result = data.Data[0] || null;
  if (result) {
      //trộn trường lại với result để trả về cho dễ dùng khi render table
    result= {...result, ...data.Data[0].ContractInfo, ...data.Data[0].PaymentInfo};

    result.dataext = {paymentinfo: data.Data[0].PaymentInfo,contractinfo: data.Data[0].ContractInfo, asignee: data1.Data };
  }
  return result || {};
  // return { datas: data.Data[0] || [], data: data, data1: data1, apiurl: url, apipara: encodeURIComponent(para) };

};


const getIPCTax = async ({ req }) => {
  /* 
  {{baseURL}}/api/get-vat-invoice?params={  "LogIn": "lotusviet@lotusviet.vn", "SessionId":"C3E5E973-D5A2-4243-90A8-32A4654F7F4A", "Language": "en", "DisplayMode": "vat_list_from_sheet", "PaymentId": 970,"PageSize": 1000}
  */
  let para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.displaymode || "vat_list_from_sheet",
    "PaymentId": req.query.paymentid || 0,
    "PageSize": req.query.pagesize || 1000
  });
  let url = `${req.app.locals.env.api.host}/api/get-vat-invoice?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') {
    // throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); 
    return { datas: [], meta: metaipctax, apiurl: url, apipara: encodeURIComponent(para) };
  }

  //cập nhật lại Id cho mỗi line để làm key khi render table
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((line, index) => {
      line.Id = index + 1; // Gán Id bắt đầu từ 1
    });
  }

  return { datas: data.Data || [], meta: metaipctax, apiurl: url, apipara: encodeURIComponent(para) };

};

const getIPCDraft = async ({ req }) => {
  /* 
  {{baseURL}}/api/get-submission-for-po?params={"LogIn":"lotusviet@lotusviet.vn", "SessionId": "87F9F0E5-7084-49E8-8655-6DB0EB58C06E","ContractId":17243,"Language":"vi","DisplayMode":"get_submission_drafting","PageSize":1000,"Keyword":"","Stage":"implement","FromDate":"","ToDate":"","WorkGroup":"all"}
  */
  let para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "ContractId": req.query.contractid || 0,
    "DisplayMode": req.query.displaymode || "get_submission_drafting",
    "PageSize": req.query.pagesize || 1000,
    "Keyword": req.query.keyword || "",
    "Stage": req.query.stage || "implement",

    "FromDate": req.query.fromdate || "",
    "ToDate": req.query.todate || "",
    "WorkGroup": req.query.workgroup || "all"

  });
  let url = `${req.app.locals.env.api.host}/api/get-submission-for-po?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }

  //cập nhật lại Id cho mỗi line để làm key khi render table
  if (data.Data && Array.isArray(data.Data)) {
    data.Data.forEach((line, index) => {
      line.Id = index + 1; // Gán Id bắt đầu từ 1
    });
  }

  return { datas: data.Data || [], meta: metaipctax, apiurl: url, apipara: encodeURIComponent(para) };

};

const getIPCApproval = async ({ req }) => {
  /* 
  {{baseURL}}/api/get-ipc-summary?params={"LogIn":"lotusviet@lotusviet.vn", "SessionId": "2723062C-BC43-4690-AA17-806CBD77CB60","DisplayMode":"payment_order_info","ContractId":17243,"SummaryMode":"ipc_amount","PaymentId":1047}
  */
  let para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "DisplayMode": req.query.displaymode || "payment_order_info",
    "ContractId": req.query.contractid || 0,
    "SummaryMode": req.query.summarymode || "ipc_amount",
    "PaymentId": req.query.paymentid || 0
  });
  let url = `${req.app.locals.env.api.host}/api/get-ipc-summary?params=${encodeURIComponent(para)}`;
  const response = await fetch(url);
  const data = await response.json();
  // xử lý tiếp
  if (data.Success !== 'true') { throw new Error(`${data.Message} apiurl: ${url} apipara: ${para}`); }

  // //cập nhật lại Id cho mỗi line để làm key khi render table
  // if (data.Data && Array.isArray(data.Data)) {
  //   data.Data.forEach((line, index) => {
  //     line.Id = index + 1; // Gán Id bắt đầu từ 1
  //   });
  // }

  //lấy phân công
  /*
  {{baseURL}}/api/get-typical-assignment?params={"LogIn":"lotusviet@lotusviet.vn", "SessionId": "23899B42-9DFD-4E6B-A1F2-B0BB7CA7DEC7","DisplayMode":"with_account_and_name_for_creating","WorkType":"payment_order","ItemId":17243,"Inherited":"No"}
  */
  para = JSON.stringify({
    "LogIn": req.session.user.username,
    "SessionId": req.session.sessionid,
    "Language": req.app.locals.env.lang || "en",
    "DisplayMode": req.query.displaymode || "with_account_and_name_for_creating",
    "WorkType": req.query.worktype || "payment_order",
    "ItemId": req.query.contractid || 0,
    "Inherited": "No"
  });
  url = `${req.app.locals.env.api.host}/api/get-typical-assignment?params=${encodeURIComponent(para)}`;
  const response1 = await fetch(url);
  const data1 = await response1.json();


  //tạm không phân trang
  // const total = data.TotalRows || 0;
  // Trả về dữ liệu phân trang
  const result = data.Data || null;
  if (result) {

    //cập nhật lại Id cho mỗi line để làm key khi render table
    if (data1.Data && Array.isArray(data1.Data)) {
      data1.Data.forEach((line, index) => {
        line.Id = index + 1; // Gán Id bắt đầu từ 1
        line.Remarks = ""; // Thêm trường Remarks để lưu ý kiến phân công khi duyệt
      });
    }

    //map giá trị contractinfo sang contractid để dễ sử dụng
    if (data.ContractInfo) {
      /*
        { field: 'IPCCode', type: 'string', description: 'IPC Code', isnullable: true, show: true, visible: false, readonly: true },
        // { field: 'IPCName', type: 'string', description: 'IPC Name', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'ContractorName', type: 'string', description: 'Contractor Name', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'PaymentDate', type: 'date', description: 'Payment Date', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'ContractName', type: 'string', description: 'Contract Name', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'ContractCode', type: 'string', description: 'Contract Code', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'ContractAmount', type: 'number', description: 'Contract Amount', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'ApprovalStatus', type: 'string', description: 'Approval Status', isnullable: true, show: true, visible: false, readonly: true },
        { field: 'PaymentApprovalStatus', type: 'string', description: 'Payment Approval Status', isnullable: true, show: true, visible: false, readonly: true }
      */
      result.IPCCode = data.ContractInfo.IPCCode;
      result.ContractorName = data.ContractInfo.ContractorName;
      result.PaymentDate = data.ContractInfo.PaymentDate;
      result.ContractName = data.ContractInfo.ContractName;
      result.ContractCode = data.ContractInfo.ContractCode;
      result.ContractAmount = data.ContractInfo.ContractAmount;
      result.ApprovalStatus = data.ContractInfo.ApprovalStatus;
      result.PaymentApprovalStatus = data.ContractInfo.PaymentApprovalStatus;

      result.IsProceed = data.Data.IsProceed === "Yes" ? true : false;

    }


    result.dataext = { contractinfo: data.ContractInfo, asigneeapproval: data1.Data, apiurl: url, apipara: encodeURIComponent(para) };
  }
  return result || {};
  // return { datas: data.Data[0] || [], data: data, data1: data1, apiurl: url, apipara: encodeURIComponent(para) };

};

const updateIPCApproval = async ({ req, meta }) => {
  const resdata = { status: 1, message: 'completed', data: {}, errors: {} };
  const updateObject = senserver.utils.convertReqBodyToObject(req.body, meta);
  // Quét qua từng trường trong meta để kiểm tra tính hợp lệ
  resdata.errors = senserver.utils.validmodel({ model: updateObject, meta: meta || [] });
  if (Object.keys(resdata.errors).length > 0) {
    resdata.status = 0;
    resdata.message = 'validation error';
    return resdata;
  }

  let Assignment = [];
  if (req.body['Assignment'] && Array.isArray(req.body['Assignment']) && updateObject.IsProceed === true) {
    //chỉ gán khi Description được nhập
    // Assignment = req.body['Assignment'].filter(item => item.Description && item.Description.trim() !== '').map(item => ({
    Assignment = req.body['Assignment'].map(item => ({
      UserId: parseInt(item.UserId),
      Role: item.Role,
      Description: item.Remarks || ''
    }));
  }

  /*
  https://consims.com/api/create-ipc
  {
    "params": {
        "POName": "IPC tạo trên sheet",
        "PaymentDate": "2026-03-12",
        "Remarks": "",
        "LogIn": "khanhvuday@gmail.com",
        "WorkType": "payment_order",
        "SessionId": "AB50DB95-0BFE-4647-8026-A265E4E9F770",
        "Language": "vi",
        "UpdateMode": "start_ipc",
        "PaymentId": 1047,
        "ApplyDefinedAssignment": "No",
        "StartProcessNow": "Yes",
        "Assignment": [
            {
                "UserId": 176524,
                "Role": "C",
                "Description": ""
            },
            {
                "UserId": 176117,
                "Role": "A",
                "Description": ""
            }
        ]

                "POName": "IPC tạo trên sheet",
        "PaymentDate": "2026-03-12",
        "Remarks": "",
        "LogIn": "khanhvuday@gmail.com",
        "WorkType": "payment_order",
        "SessionId": "AB50DB95-0BFE-4647-8026-A265E4E9F770",
        "Language": "vi",
        "UpdateMode": "start_ipc",
        "PaymentId": 1047,
        "ApplyDefinedAssignment": "No",
        "StartProcessNow": "Yes",
    }
}
  */


  //cập nhật bằng api
  const para = JSON.stringify({
    "params": {
      "POName": updateObject.IPCName || "",
      "PaymentDate": updateObject.PaymentDate || "",
      "Remarks": updateObject.Remarks || "",
      "LogIn": req.session.user.username,
      "WorkType": "payment_order",
      "SessionId": req.session.sessionid,
      "Language": req.app.locals.env.lang || "en",
      "UpdateMode": "start_ipc",
      "PaymentId": req.body.PaymentId || 0,
      "ApplyDefinedAssignment": "No",
      "StartProcessNow": updateObject.IsProceed == true ? "Yes" : "No",
      "Assignment": Assignment
    }
  });
  const url = `${req.app.locals.env.api.host}/api/create-ipc`;
  const response = await fetch(url, { method: "POST", headers: req.app.locals.env.api.headerpost, body: para });
  const data = await response.json();
  if (data.Success !== 'true') {
    resdata.status = 0;
    resdata.message = data.Message;
    resdata.errors = data.Errors || {};
    resdata.apiurl = url;
    resdata.apipara = para;
    return resdata;
  }
  //kết thúc //cập nhật bằng api
  if (!resdata.data) { return { status: 0, message: "Object not found", errors: "Object not found" }; }
  return resdata;
};

module.exports = {
  data: IPC,
  dataline: IPCLine,
  dataprint: IPCPrint,
  dataassignee: IPCAssignee,
  datacontractinfo: IPCContractInfo,
  dataipctax: IPCTax,
  dataipcdraft: IPCDraft,
  dataassigneeapproval: IPCAssigneeApproval,
  metadraft,
  metaipctax,
  metacontractinfo,
  meta,
  metaline,
  metaprint,
  metaprintcumulative,
  metaassignee,
  metaassigneeapproval,
  datas,
  getDatas,
  getDatasAll,
  addData,
  findByKey,
  findByField,
  updateData,
  deleteData,
  validateApplyTax,
  acceptApplyTax,
  getIPCLine,
  getIPCPrint,
  getIPCPrintCumulative,
  updateIPCLineTax,
  getIPCTax,
  getIPCDraft,
  getIPCApproval,
  updateIPCApproval


};

