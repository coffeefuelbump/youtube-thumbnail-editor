import React, { useState, useRef, useEffect } from 'react';
import { editImage } from './services/geminiService';
import { UploadIcon, SendIcon, ImageIcon, SparklesIcon, DownloadIcon, PaperclipIcon, XIcon, UndoIcon, RedoIcon } from './components/Icons';
import type { ChatMessage } from './types';

interface ImageState {
    imageUrl: string;
    mimeType: string;
}

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [historyStack, setHistoryStack] = useState<ImageState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [contextImage, setContextImage] = useState<{ file: File, url: string, mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialFileInputRef = useRef<HTMLInputElement>(null);
  const contextFileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

  const handleInitialImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const dataUrl = await fileToDataUrl(file);
        const newImageState = { imageUrl: dataUrl, mimeType: file.type };
        setHistoryStack([newImageState]);
        setHistoryIndex(0);
        setChatHistory([{
          id: `bot-${Date.now()}`,
          type: 'bot',
          imageUrl: dataUrl,
          mimeType: file.type
        }]);
        setPrompt('');
        setContextImage(null);
      } catch (err) {
        setError("Failed to read the uploaded file.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleContextImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for context.');
        return;
      }
      setContextImage({
        file,
        url: URL.createObjectURL(file),
        mimeType: file.type,
      });
      event.target.value = ''; // Allow re-uploading the same file
    }
  };

  const handleEdit = async () => {
    const currentImage = historyStack[historyIndex];
    if (!currentImage || !prompt.trim()) {
      setError('Cannot edit without a base image and a prompt.');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      prompt: prompt,
      contextImageUrl: contextImage?.url,
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const baseImage = {
        base64: dataUrlToBase64(currentImage.imageUrl),
        mimeType: currentImage.mimeType,
      };

      let contextImg: { base64: string, mimeType: string } | undefined = undefined;
      if (contextImage) {
        const contextDataUrl = await fileToDataUrl(contextImage.file);
        contextImg = {
          base64: dataUrlToBase64(contextDataUrl),
          mimeType: contextImage.mimeType,
        };
      }

      const result = await editImage(baseImage, prompt, contextImg);
      const newImageUrl = `data:${result.newMimeType};base64,${result.newBase64}`;

      const newBotMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        imageUrl: newImageUrl,
        mimeType: result.newMimeType,
      };

      const newHistoryStack = historyStack.slice(0, historyIndex + 1);
      const newImageState = { imageUrl: newImageUrl, mimeType: result.newMimeType };
      setHistoryStack([...newHistoryStack, newImageState]);
      setHistoryIndex(newHistoryStack.length);
      
      setChatHistory(prev => [...prev, newBotMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setChatHistory(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
      setPrompt('');
      if (contextImage) {
        URL.revokeObjectURL(contextImage.url);
      }
      setContextImage(null);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  const currentImageUrl = historyStack[historyIndex]?.imageUrl;

  const downloadImage = () => {
    const currentImage = historyStack[historyIndex];
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.imageUrl;
      link.download = `thumbnail-${Date.now()}.${currentImage.mimeType.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col font-sans">
      <header className="w-full text-center p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          Gemini Thumbnail Editor
        </h1>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-3/5 flex flex-col items-center justify-center bg-gray-900 p-4 border-r border-gray-700">
          {currentImageUrl ? (
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <div className='w-full flex-1 flex items-center justify-center p-2'>
                <img src={currentImageUrl} alt="Current thumbnail" className="max-w-full max-h-full rounded-md object-contain shadow-2xl shadow-purple-900/20" style={{ aspectRatio: '16/9' }}/>
              </div>
              <div className='flex gap-2 mt-4'>
                 <button
                    onClick={() => initialFileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <UploadIcon className="w-5 h-5" />
                    New
                </button>
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UndoIcon className="w-5 h-5 -scale-x-100" />
                    Undo
                </button>
                 <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RedoIcon className="w-5 h-5" />
                    Redo
                </button>
                <button
                    onClick={downloadImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4">
               <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-lg font-semibold">Upload a Thumbnail</h2>
                  <p className="text-sm">Select a 16:9 image to start editing.</p>
                  <button
                    onClick={() => initialFileInputRef.current?.click()}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <UploadIcon className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>
            </div>
          )}
           <input type="file" ref={initialFileInputRef} onChange={handleInitialImageUpload} accept="image/*" className="hidden" />
        </div>

        <div className="w-2/5 flex flex-col bg-gray-800/50">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'bot' && <SparklesIcon className="w-6 h-6 text-purple-400 self-start" />}
                <div className={`rounded-lg p-3 max-w-sm ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {msg.type === 'bot' && msg.imageUrl && (
                    <img src={msg.imageUrl} alt="AI response" className="rounded-md max-w-full h-auto" />
                  )}
                  {msg.prompt && <p className="text-white">{msg.prompt}</p>}
                  {msg.contextImageUrl && (
                    <img src={msg.contextImageUrl} alt="User context" className="rounded-md mt-2 max-w-full h-auto" />
                  )}
                </div>
              </div>
            ))}
             <div ref={chatEndRef} />
          </div>
          <div className='p-4 border-t border-gray-700'>
             {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-center mb-2" role="alert">
                <p><span className="font-bold">Error:</span> {error}</p>
              </div>
            )}
             <div className="bg-gray-700 rounded-lg p-2 flex items-center gap-2">
                <button
                    onClick={() => contextFileInputRef.current?.click()}
                    disabled={historyStack.length === 0 || isLoading}
                    className="p-2 text-gray-400 hover:text-white disabled:text-gray-600"
                    aria-label="Attach context image"
                >
                    <PaperclipIcon className="w-6 h-6" />
                </button>
                <input type="file" ref={contextFileInputRef} onChange={handleContextImageSelect} accept="image/*" className="hidden" />
                
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleEdit()}
                    placeholder="Describe your edit..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    disabled={historyStack.length === 0 || isLoading}
                />
                <button
                    onClick={handleEdit}
                    disabled={historyStack.length === 0 || isLoading || !prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed"
                    aria-label="Submit edit"
                >
                    {isLoading ? (
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ) : (
                    <SendIcon className="w-6 h-6" />
                    )}
                </button>
            </div>
             {contextImage && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                <img src={contextImage.url} alt="Context preview" className="w-12 h-12 rounded-md object-cover" />
                <p className="text-sm text-gray-300 flex-1 truncate">{contextImage.file.name}</p>
                <button
                  onClick={() => {
                    if (contextImage) {
                      URL.revokeObjectURL(contextImage.url);
                    }
                    setContextImage(null);
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;