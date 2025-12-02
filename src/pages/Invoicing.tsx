import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';

type DocumentType = 'invoice' | 'receipt' | 'other' | null;
type ItemType = 'goods' | 'service';
type VatRate = 0 | 12 | 25;
type PaymentMethod = 'bankTransfer' | 'cash' | 'card' | 'vipps' | 'other';
type PaymentTerms = 'immediate' | 'net10' | 'net15' | 'net30' | 'net45' | 'net60';

interface FormData {
  documentType: DocumentType;
  name: string;
  file: File | null;
  unitPrice: string;
  quantity: string;
  vatRate: VatRate;
  itemType: ItemType;
  description: string;
  paymentMethod: PaymentMethod;
  accountNumber: string;
  invoiceDate: string;
  paymentTerms: PaymentTerms;
  reference: string;
  notes: string;
}

function Invoicing() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    documentType: null,
    name: '',
    file: null,
    unitPrice: '',
    quantity: '1',
    vatRate: 25,
    itemType: 'service',
    description: '',
    paymentMethod: 'bankTransfer',
    accountNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: 'net30',
    reference: '',
    notes: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    console.log('Lagrer dokument:', formData);
    setIsComplete(true);
  };

  const handleReset = () => {
    setFormData({
      documentType: null,
      name: '',
      file: null,
      unitPrice: '',
      quantity: '1',
      vatRate: 25,
      itemType: 'service',
      description: '',
      paymentMethod: 'bankTransfer',
      accountNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentTerms: 'net30',
      reference: '',
      notes: '',
    });
    setCurrentStep(1);
    setIsComplete(false);
  };

  const unitPrice = parseFloat(formData.unitPrice) || 0;
  const quantity = parseFloat(formData.quantity) || 0;
  const totalExVat = unitPrice * quantity;
  const vatAmount = totalExVat * (formData.vatRate / 100);
  const totalIncVat = totalExVat + vatAmount;

  const getDueDate = () => {
    const invoiceDate = new Date(formData.invoiceDate);
    const daysMap: Record<PaymentTerms, number> = {
      immediate: 0,
      net10: 10,
      net15: 15,
      net30: 30,
      net45: 45,
      net60: 60,
    };
    invoiceDate.setDate(invoiceDate.getDate() + daysMap[formData.paymentTerms]);
    return invoiceDate.toISOString().split('T')[0];
  };

  const canProceedFromStep1 = formData.documentType !== null && formData.name.trim() !== '';
  const canProceedFromStep2 = formData.unitPrice !== '' && parseFloat(formData.unitPrice) > 0;

  const getDocumentTypeLabel = () => {
    switch (formData.documentType) {
      case 'invoice':
        return t('invoicing.step1.invoice');
      case 'receipt':
        return t('invoicing.step1.receipt');
      case 'other':
        return t('invoicing.step1.otherDocument');
      default:
        return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount);
  };

  if (isComplete) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('invoicing.title')}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('invoicing.step3.successMessage')}
            </h2>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('invoicing.step3.registerAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t('invoicing.title')}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-8">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('invoicing.step1.title')}
              </h2>
              <p className="text-gray-600 mb-6">{t('invoicing.step1.subtitle')}</p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setFormData({ ...formData, documentType: 'invoice' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.documentType === 'invoice'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      formData.documentType === 'invoice' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('invoicing.step1.invoice')}</h3>
                      <p className="text-sm text-gray-500">{t('invoicing.step1.invoiceDescription')}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, documentType: 'receipt' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.documentType === 'receipt'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      formData.documentType === 'receipt' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('invoicing.step1.receipt')}</h3>
                      <p className="text-sm text-gray-500">{t('invoicing.step1.receiptDescription')}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, documentType: 'other' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.documentType === 'other'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      formData.documentType === 'other' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('invoicing.step1.otherDocument')}</h3>
                      <p className="text-sm text-gray-500">{t('invoicing.step1.otherDocumentDescription')}</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('invoicing.step1.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('invoicing.step1.namePlaceholder')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formData.documentType === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('invoicing.step1.uploadFile')}
                  </label>
                  {!formData.file ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">{t('invoicing.step1.dragDropOrClick')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('invoicing.step1.supportedFormats')}</p>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                            <p className="text-xs text-gray-500">{t('invoicing.step1.selectedFile')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, file: null });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {t('invoicing.step1.changeFile')}
                        </button>
                      </div>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('invoicing.step2.title')}</h2>
              <p className="text-gray-600 mb-6">{t('invoicing.step2.subtitle')}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('invoicing.step2.goodsOrService')}</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFormData({ ...formData, itemType: 'goods' })}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      formData.itemType === 'goods' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t('invoicing.step2.goods')}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, itemType: 'service' })}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      formData.itemType === 'service' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t('invoicing.step2.service')}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step2.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('invoicing.step2.descriptionPlaceholder')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step2.quantity')}</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step2.unitPrice')} *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    placeholder="0,00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('invoicing.step2.vatRate')}</label>
                <div className="flex space-x-2">
                  {([0, 12, 25] as VatRate[]).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setFormData({ ...formData, vatRate: rate })}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-colors ${
                        formData.vatRate === rate ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {rate === 0 ? t('invoicing.step2.noVat') : rate === 12 ? t('invoicing.step2.lowVat') : t('invoicing.step2.standardVat')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('invoicing.step2.totalExVat')}</span>
                  <span className="font-medium">{formatCurrency(totalExVat)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('invoicing.step2.vatAmount')} ({formData.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                  <span>{t('invoicing.step2.totalIncVat')}</span>
                  <span className="text-blue-600">{formatCurrency(totalIncVat)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('invoicing.step3.title')}</h2>
              <p className="text-gray-600 mb-6">{t('invoicing.step3.subtitle')}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('invoicing.step3.paymentMethod')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bankTransfer', 'cash', 'card', 'vipps', 'other'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      className={`py-2 px-3 rounded-lg border-2 text-sm transition-colors ${
                        formData.paymentMethod === method ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t(`invoicing.step3.${method}`)}
                    </button>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'bankTransfer' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step3.accountNumber')}</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder={t('invoicing.step3.accountNumberPlaceholder')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step3.invoiceDate')}</label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step3.paymentTerms')}</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as PaymentTerms })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="immediate">{t('invoicing.step3.immediate')}</option>
                    <option value="net10">{t('invoicing.step3.net10')}</option>
                    <option value="net15">{t('invoicing.step3.net15')}</option>
                    <option value="net30">{t('invoicing.step3.net30')}</option>
                    <option value="net45">{t('invoicing.step3.net45')}</option>
                    <option value="net60">{t('invoicing.step3.net60')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">{t('invoicing.step3.dueDate')}</span>
                  <span className="font-semibold text-blue-900">{getDueDate()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step3.reference')}</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder={t('invoicing.step3.referencePlaceholder')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('invoicing.step3.notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('invoicing.step3.notesPlaceholder')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">{t('invoicing.step3.summary')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('invoicing.step3.documentType')}</span>
                    <span className="font-medium">{getDocumentTypeLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('invoicing.step3.customerName')}</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('invoicing.step2.goodsOrService')}</span>
                    <span className="font-medium">{formData.itemType === 'goods' ? t('invoicing.step2.goods') : t('invoicing.step2.service')}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-900 font-medium">{t('invoicing.step2.totalIncVat')}</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(totalIncVat)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('invoicing.previous')}
          </button>

          <div className="text-sm text-gray-500">
            {t('invoicing.step')} {currentStep} {t('invoicing.of')} 3
          </div>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedFromStep1) ||
                (currentStep === 2 && !canProceedFromStep2)
              }
              className={`px-6 py-2 rounded-lg transition-colors ${
                (currentStep === 1 && !canProceedFromStep1) ||
                (currentStep === 2 && !canProceedFromStep2)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {t('invoicing.next')}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('invoicing.finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invoicing;
