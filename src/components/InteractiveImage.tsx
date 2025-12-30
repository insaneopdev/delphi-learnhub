import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { InteractiveStep } from '../lib/storage';

interface InteractiveImageProps {
    step: InteractiveStep;
    language: string;
    onComplete: () => void;
}

export const InteractiveImage: React.FC<InteractiveImageProps> = ({ step, language, onComplete }) => {
    const [showHazards, setShowHazards] = useState(false);
    const [revealedHazards, setRevealedHazards] = useState<Set<string>>(new Set());
    const [foundHazards, setFoundHazards] = useState<Set<string>>(new Set());

    // Reset state when step changes
    useEffect(() => {
        setShowHazards(false);
        setRevealedHazards(new Set());
        setFoundHazards(new Set());
    }, [step.image]); // Reset when image changes (i.e., different step)

    const handleHazardClick = (hazardId: string) => {
        if (showHazards) return; // Don't allow clicking when answers are revealed

        const newFound = new Set(foundHazards);
        newFound.add(hazardId);
        setFoundHazards(newFound);

        const newRevealed = new Set(revealedHazards);
        newRevealed.add(hazardId);
        setRevealedHazards(newRevealed);

        // Check if all hazards are found
        if (newFound.size === step.hazards.length) {
            setShowHazards(true);
            onComplete();
        }
    };

    const toggleHazards = () => {
        setShowHazards(!showHazards);
        if (!showHazards) {
            // Reveal all for learning purposes when toggled
            const allIds = new Set(step.hazards.map(h => h.id));
            setRevealedHazards(allIds);
            onComplete();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {language === 'ta' ? 'அபாயங்களைக் கண்டறியவும்' :
                        language === 'hi' ? 'खतरों को पहचानें' :
                            language === 'te' ? 'ప్రమాదాలను గుర్తించండి' :
                                'Spot the Hazards'}
                    <span className="ml-2 text-sm font-normal text-slate-500">
                        ({foundHazards.size}/{step.hazards.length})
                    </span>
                </h3>
                <button
                    onClick={toggleHazards}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showHazards
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    {showHazards ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showHazards
                        ? (language === 'ta' ? 'விடைகளை மறை' : language === 'hi' ? 'उत्तर छिपाएं' : language === 'te' ? 'సమాధానాలను దాచండి' : 'Hide Answers')
                        : (language === 'ta' ? 'விடைகளை காட்டு' : language === 'hi' ? 'उत्तर दिखाएं' : language === 'te' ? 'సమాధానాలను చూపించు' : 'Show Answers')}
                </button>
            </div>

            <div className="relative w-full overflow-hidden rounded-lg border-2 border-slate-100 bg-slate-50">
                <img
                    src={step.image}
                    alt="Spot the hazards"
                    className="w-full h-auto object-contain max-h-[600px]"
                />

                {/* Hazard markers */}
                {step.hazards.map((hazard, index) => {
                    const isRevealed = revealedHazards.has(hazard.id);
                    const isFound = foundHazards.has(hazard.id);

                    return (
                        <button
                            key={hazard.id}
                            onClick={() => handleHazardClick(hazard.id)}
                            disabled={showHazards}
                            className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm transition-all transform -translate-x-1/2 -translate-y-1/2 ${isFound
                                    ? 'bg-green-500 border-white shadow-lg scale-100 hover:scale-110'
                                    : showHazards
                                        ? 'bg-amber-500 border-white shadow-lg scale-100'
                                        : 'bg-red-500/70 border-white/70 scale-75 hover:scale-90 pulse'
                                } ${!showHazards && !isFound ? 'cursor-pointer' : 'cursor-default'}`}
                            style={{
                                left: `${hazard.x}%`,
                                top: `${hazard.y}%`,
                            }}
                            title={isRevealed ? (hazard.description[language] || hazard.description['en']) : 'Click to reveal'}
                        >
                            {isFound ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </button>
                    );
                })}
            </div>

            {!showHazards && foundHazards.size < step.hazards.length && (
                <p className="mt-2 text-xs text-slate-500 text-center">
                    💡 {language === 'ta' ? 'படத்தில் அபாயங்களைக் கண்டுபிடிக்க கிளிக் செய்க' :
                        language === 'hi' ? 'छवि में खतरों को खोजने के लिए क्लिक करें' :
                            language === 'te' ? 'చిత్రంలో ప్రమాదాలను కనుగొనడానికి క్లిక్ చేయండి' :
                                'Click on the image to find the hazards'}
                </p>
            )}

            <div className="mt-6 space-y-3">
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    {language === 'ta' ? 'கண்டறியப்பட்ட அபாயங்கள்:' :
                        language === 'hi' ? 'पहचाने गए खतरे:' :
                            language === 'te' ? 'గుర్తించబడిన ప్రమాదాలు:' :
                                'Identified Hazards:'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.hazards.map((hazard, index) => {
                        const isRevealed = revealedHazards.has(hazard.id);
                        const isFound = foundHazards.has(hazard.id);

                        return (
                            <div
                                key={hazard.id}
                                className={`p-3 rounded-lg border transition-all duration-500 ${isRevealed
                                        ? isFound
                                            ? 'bg-green-50 border-green-200 shadow-sm translate-y-0 opacity-100'
                                            : 'bg-amber-50 border-amber-200 shadow-sm translate-y-0 opacity-100'
                                        : 'bg-slate-50 border-slate-100 text-slate-400 translate-y-2 opacity-50 blur-[2px]'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isRevealed
                                            ? isFound
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-amber-100 text-amber-600'
                                            : 'bg-slate-200 text-slate-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${isRevealed ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {hazard.description[language] || hazard.description['en']}
                                        </p>
                                    </div>
                                    {isFound && <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                                    {isRevealed && !isFound && <XCircle className="w-4 h-4 text-amber-500 ml-auto flex-shrink-0" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
