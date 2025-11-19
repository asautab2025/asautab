import React, { useState, useRef } from 'react';
import { INITIAL_DATA } from './constants';
import { AppealData, AppStatus } from './types';
import { FormInput } from './components/FormInput';
import { generateAppealPdf } from './services/pdfService';
import { extractDataFromImage, fileToBase64 } from './services/geminiService';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Wand2, Globe } from 'lucide-react';

function App() {
  const [data, setData] = useState<AppealData>(INITIAL_DATA);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(AppStatus.ANALYZING);
    setErrorMessage(null);

    try {
      const base64 = await fileToBase64(file);
      const extracted = await extractDataFromImage(base64);
      
      setData(prev => ({
        ...prev,
        organo: extracted.organo || prev.organo,
        expediente: extracted.expediente || prev.expediente,
        infringement: extracted.infringement || prev.infringement,
        fact: extracted.fact || prev.fact,
      }));
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMessage("No se pudo analizar la imagen. Por favor, introduce los datos manualmente.");
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerate = () => {
    setStatus(AppStatus.GENERATING);
    try {
      generateAppealPdf(data);
      setStatus(AppStatus.SUCCESS);
      setTimeout(() => setStatus(AppStatus.IDLE), 2000);
    } catch (e) {
      setStatus(AppStatus.ERROR);
      setErrorMessage("Error al generar el PDF.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo Image: Ensure you have 'asautab-logo.png' in your public folder */}
            <img 
              src="/asautab-logo.png" 
              alt="ASAUTAB" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // If image fails, we still have the text next to it
                e.currentTarget.style.display = 'none'; 
              }}
            />
            <div className="hidden sm:flex flex-col justify-center border-l border-slate-200 pl-4 h-10">
              <h1 className="text-2xl font-extrabold text-[#000090] leading-none tracking-tight">asautab</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Asociación Automovilística de Albacete</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <a 
               href="https://www.asautab.org" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hidden md:flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-[#000090] transition-colors"
             >
                <Globe className="w-4 h-4" />
                <span>www.asautab.org</span>
             </a>
             <div className="hidden lg:flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Wand2 className="w-3 h-3 mr-1.5 text-purple-500" />
                IA habilitada
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Auto-fill Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">Escanear Multa</h2>
                  <p className="text-sm text-slate-500">Sube una foto de la notificación y la IA extraerá los datos principales.</p>
                </div>
                <button 
                    onClick={triggerFileInput}
                    disabled={status === AppStatus.ANALYZING}
                    className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg transition-colors border border-purple-200"
                >
                    {status === AppStatus.ANALYZING ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">Subir Foto</span>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                />
              </div>
              
              {status === AppStatus.ERROR && errorMessage && (
                  <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                  </div>
              )}
              
               {status === AppStatus.SUCCESS && !errorMessage && (
                  <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center space-x-2 animate-fade-in">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Datos extraídos correctamente.</span>
                  </div>
              )}
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-100">1. Datos del Expediente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput 
                  label="Organismo (1)" 
                  name="organo" 
                  value={data.organo} 
                  onChange={handleChange} 
                  placeholder="Ej. Jefatura Provincial de Tráfico"
                />
                <FormInput 
                  label="Nº Expediente" 
                  name="expediente" 
                  value={data.expediente} 
                  onChange={handleChange} 
                  placeholder="Ej. 2023-EXP-12345"
                />
              </div>

              <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-100">2. Datos del Interesado</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput 
                  label="Nombre Completo" 
                  name="fullName" 
                  value={data.fullName} 
                  onChange={handleChange} 
                  placeholder="Ej. Juan Pérez García"
                  className="md:col-span-2"
                />
                <FormInput 
                  label="DNI / NIE" 
                  name="dni" 
                  value={data.dni} 
                  onChange={handleChange} 
                  placeholder="12345678X"
                />
                <FormInput 
                  label="Domicilio" 
                  name="address" 
                  value={data.address} 
                  onChange={handleChange} 
                  placeholder="C/ Mayor 1, Madrid"
                />
              </div>

              <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-100">3. Detalles de la Infracción</h2>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <FormInput 
                  label="Infracción de (2)" 
                  name="infringement" 
                  value={data.infringement} 
                  onChange={handleChange} 
                  placeholder="Ej. Art. 12 del Reglamento General de Circulación"
                />
                <FormInput 
                  label="Consistente en (3)" 
                  name="fact" 
                  value={data.fact} 
                  onChange={handleChange} 
                  placeholder="Ej. No señalizar obstáculo..."
                />
                 <FormInput 
                  label="Tipo de Escrito (4)" 
                  name="allegationType" 
                  value={data.allegationType} 
                  onChange={handleChange} 
                  placeholder="ESCRITO DE ALEGACIONES"
                />
              </div>

               <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b border-slate-100">4. Firma</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Lugar" 
                  name="signPlace" 
                  value={data.signPlace} 
                  onChange={handleChange} 
                  placeholder="Ej. Madrid"
                />
                 <FormInput 
                  label="Fecha" 
                  name="signDate" 
                  type="date"
                  value={data.signDate} 
                  onChange={handleChange} 
                />
               </div>
            </div>
          </div>

          {/* Right Column: Preview & Action */}
          <div className="lg:col-span-4 space-y-6">
            {/* Updated to use specific blue color #000090 */}
            <div className="bg-[#000090] rounded-xl shadow-lg text-white p-6 sticky top-28">
                <h3 className="text-lg font-semibold mb-2">Resumen</h3>
                <p className="text-slate-200 text-sm mb-6">
                    Genera automáticamente un escrito de alegaciones argumentando la ilegalidad y falta de proporcionalidad de las balizas V16 frente a los triángulos.
                </p>

                <div className="space-y-4 text-sm border-t border-white/20 pt-4 mb-8">
                    <div className="flex justify-between">
                        <span className="text-slate-200">Expediente:</span>
                        <span className="font-medium truncate ml-2">{data.expediente || "---"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-200">Organismo:</span>
                        <span className="font-medium truncate ml-2">{data.organo || "---"}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-200">Solicitante:</span>
                        <span className="font-medium truncate ml-2">{data.fullName || "---"}</span>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!data.expediente || !data.fullName || status === AppStatus.GENERATING}
                    className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-amber-500/25"
                >
                    {status === AppStatus.GENERATING ? (
                         <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    <span>Generar Alegaciones PDF</span>
                </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-slate-600">
                Aplicación web creada por la <a href="https://www.asautab.org" target="_blank" rel="noopener noreferrer" className="font-bold text-[#000090] hover:underline">ASOCIACIÓN AUTOMOVILISTICA DE ALBACETE</a>.
            </p>
            <p className="text-slate-400 text-sm mt-2">
                <a href="https://www.asautab.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#000090] transition-colors">www.asautab.org</a>
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;