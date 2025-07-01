
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { DocumentUpload } from "@/components/sections/DocumentUpload";
import { ProcessingSection } from "@/components/sections/ProcessingSection";
import { QuestionsSection } from "@/components/sections/QuestionsSection";
import { CustomQuestionSection } from "@/components/sections/CustomQuestionSection";
import { ThreeBackground } from "@/components/three/ThreeBackground";
import { useState } from "react";

export type ProcessingStep = 'upload' | 'processing' | 'questions' | 'chat';

export interface DocumentState {
  file: File | null;
  isProcessing: boolean;
  isProcessed: boolean;
  generatedQuestions: string[];
  customQuestions: { question: string; answer: string }[];
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload');
  const [documentState, setDocumentState] = useState<DocumentState>({
    file: null,
    isProcessing: false,
    isProcessed: false,
    generatedQuestions: [],
    customQuestions: []
  });

  const handleFileUpload = (file: File) => {
    setDocumentState(prev => ({ ...prev, file }));
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    setDocumentState(prev => ({ 
      ...prev, 
      isProcessing: false, 
      isProcessed: true,
      generatedQuestions: [
        "What is the main topic of this document?",
        "What are the key points discussed?",
        "Who is the target audience for this content?",
        "What conclusions can be drawn from this document?"
      ]
    }));
    setCurrentStep('questions');
  };

  const handleCustomQuestion = (question: string, answer: string) => {
    setDocumentState(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, { question, answer }]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-slate-50 relative overflow-hidden">
      <ThreeBackground isProcessing={documentState.isProcessing} />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          
          <div className="max-w-4xl mx-auto space-y-12">
            {currentStep === 'upload' && (
              <DocumentUpload onFileUpload={handleFileUpload} />
            )}
            
            {currentStep === 'processing' && (
              <ProcessingSection 
                fileName={documentState.file?.name || ''}
                onProcessingComplete={handleProcessingComplete}
              />
            )}
            
            {(currentStep === 'questions' || currentStep === 'chat') && (
              <>
                <QuestionsSection 
                  questions={documentState.generatedQuestions}
                  onQuestionSelect={(question) => {
                    console.log('Selected question:', question);
                    setCurrentStep('chat');
                  }}
                />
                
                <CustomQuestionSection 
                  onQuestionSubmit={handleCustomQuestion}
                  previousQuestions={documentState.customQuestions}
                />
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
