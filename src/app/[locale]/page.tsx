'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import ConfigurationForm from '../../components/ConfigurationForm';
import FileUploadForm from '../../components/FileUploadForm';
import ProgressIndicator from '../../components/ProgressIndicator';
import ResultsTable from '../../components/ResultsTable';
import LogDisplay from '../../components/LogDisplay';
import { ProcessedCompany } from '@/types/company';
import { createExcelFile, readCompaniesFromExcel } from '@/utils/excelParser';
import { processCompany } from '@/app/actions/searchCompanies';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function Home() {
  const [apiKey, setApiKey] = useState( '' );
  const [searchEngineId, setSearchEngineId] = useState( '' );
  const [maxLinksPerCompany, setMaxLinksPerCompany] = useState( 4 );
  const [searchDelay, setSearchDelay] = useState( 500 );

  const [selectedFile, setSelectedFile] = useState<File | null>( null );

  const [status, setStatus] = useState<'waiting' | 'processing' | 'complete' | 'error' | 'paused'>( 'waiting' );
  const [currentIndex, setCurrentIndex] = useState( 0 );
  const [totalCompanies, setTotalCompanies] = useState( 0 );

  const [results, setResults] = useState<ProcessedCompany[]>([]);

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [processingController, setProcessingController] = useState<AbortController | null>(null);

  const t = useTranslations();

  const handleConfigChange = ( config: {
    apiKey: string;
    searchEngineId: string;
    maxLinksPerCompany: number;
    searchDelay: number;
  }) => {
    console.log("handleConfigChange", config)
    setApiKey( config.apiKey );
    setSearchEngineId( config.searchEngineId );
    setMaxLinksPerCompany( config.maxLinksPerCompany );
    setSearchDelay( config.searchDelay );

    addLog( 'Configuration updated', 'info' );
  };

  const handleFileSelect = ( file: File ) => {
    setSelectedFile( file );
    setStatus( 'waiting' );
    setCurrentIndex( 0 );
    setResults([]);

    addLog( `File selected: ${file.name}`, 'info' );
  };

  const addLog = ( message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info' ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    setLogs( prev => [...prev, { timestamp, message, type }]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const processCompanies = async (companies: string[]) => {
    const controller = new AbortController();
    setProcessingController(controller);

    try {
      const processedResults: ProcessedCompany[] = [];
      setStatus('processing');

      for (let i = 0; i < companies.length; i++) {
        if (controller.signal.aborted) {
          break;
        }

        if (status === 'paused') {
          await new Promise(resolve => {
            const checkInterval = setInterval(() => {
              if (status !== 'paused') {
                clearInterval(checkInterval);
                resolve(true);
              }
            }, 100);
          });
        }

        const company = companies[i];
        addLog(`Processing company: ${company}`, 'info');

        try {
          const result = await processCompany(
            company,
            apiKey,
            searchEngineId,
            maxLinksPerCompany
          );

          processedResults.push(result);
          setResults([...processedResults]);
          setCurrentIndex(i + 1);
          
          if (i < companies.length - 1) { // Don't delay after the last company
            await new Promise(resolve => setTimeout(resolve, searchDelay));
          }
        } catch (error) {
          addLog(`Error processing company ${company}: ${error}`, 'error');
          processedResults.push({
            empresa: company,
            links: [],
            status: 'error',
            message: error instanceof Error ? error.message : String(error)
          });
        }
      }

      if (processedResults.length > 0) {
        setStatus('complete');
        addLog(`Search completed. Processed ${processedResults.length} companies.`, 'success');
      } else {
        setStatus('error');
        addLog('No companies were processed successfully.', 'error');
      }
    } catch (error) {
      setStatus('error');
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setProcessingController(null);
    }
  };

  const handleStart = async () => {
    if (!selectedFile || !apiKey || !searchEngineId) {
      addLog('Missing file or configuration', 'error');
      return;
    }

    try {
      setStatus('processing');
      addLog('Starting search process', 'info');

      const companies = await readCompaniesFromExcel(selectedFile);
      
      if (companies.length === 0) {
        throw new Error('No companies found in the Excel file');
      }

      setTotalCompanies(companies.length);
      addLog(`Found ${companies.length} companies to process`, 'info');

      await processCompanies(companies);
    } catch (error) {
      setStatus('error');
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const handlePause = () => {
    setStatus('paused');
    addLog('Processing paused', 'warning');
  };

  const handleStop = () => {
    processingController?.abort();
    setStatus('waiting');
    setCurrentIndex(0);
    addLog('Processing stopped', 'warning');
  };

  const handleDownloadResults = () => {
    if ( results.length === 0 ) {return;}

    try {
      const excelData = results.map( company => {
        const linksText = company.links.map( link => link.link ).join( ',' );

        return {
          ...company,
          links: linksText,
        };
      });

      const excelFile = createExcelFile( excelData );

      const url = URL.createObjectURL( excelFile );
      const a = document.createElement( 'a' );
      a.href = url;
      a.download = 'prospeccao_com_links.xlsx';
      document.body.appendChild( a );
      a.click();

      URL.revokeObjectURL( url );
      document.body.removeChild( a );

      addLog( 'Results downloaded as Excel file', 'success' );
    } catch ( error ) {
      addLog( `Error downloading results: ${error instanceof Error ? error.message : String( error )}`, 'error' );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ConfigurationForm
            apiKey={apiKey}
            searchEngineId={searchEngineId}
            maxLinksPerCompany={maxLinksPerCompany}
            searchDelay={searchDelay}
            onConfigChange={handleConfigChange}
          />

          <FileUploadForm
            onFileSelect={handleFileSelect}
            isProcessing={status === 'processing'}
          />
        </div>

        <div className="mb-6">
          <ProgressIndicator
            current={currentIndex}
            total={totalCompanies}
            status={status}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            isEnabled={!!selectedFile && !!apiKey && !!searchEngineId}
          />
        </div>

        {results.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{t( 'results.title' )}</h2>

              <button
                onClick={handleDownloadResults}
                className="flex items-center px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-md font-medium text-sm"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                {t( 'results.download' )}
              </button>
            </div>

            <ResultsTable results={results} />
          </div>
        )}

        <div className="mb-6">
          <LogDisplay
            logs={logs}
            onClearLogs={handleClearLogs}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          {t( 'app.footer' )}
        </div>
      </footer>
    </div>
  );
}
