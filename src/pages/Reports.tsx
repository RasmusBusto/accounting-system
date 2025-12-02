import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeneralLedger } from '../components/GeneralLedger';

type TabType = 'reports' | 'ledger';

function Reports() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('ledger');

  return (
    <div>
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('reports.title')}
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ledger'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('ledger.title')}
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'reports' && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('reports.title')}</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('reports.title')}</h2>
            <p className="text-gray-600 mb-4">{t('reports.description')}</p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                {t('reports.plReport')}
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {t('reports.balanceSheet')}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && <GeneralLedger />}
    </div>
  );
}

export default Reports;
