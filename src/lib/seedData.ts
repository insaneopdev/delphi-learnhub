import {
    saveUser,
    saveModule,
    saveQuestion,
    saveTest,
    markInitialized,
    isInitialized,
    type User,
    type Module,
    type Question,
    type Test
} from './storage';
import { assets } from './assetsMap';
// @ts-ignore
import rawModules from '../../modules-export.json';

import { hashPassword } from './storage';

export async function initializeSeedData() {
    console.log('🌱 initializeSeedData() called');

    if (isInitialized()) {
        console.log('ℹ️ Data already initialized and version matches, skipping seed...');
        return;
    }

    console.log('🚀 Seeding initial data with 11 Expanded EHS Modules...');

    // Create admin user
    const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        username: 'admin',
        employeeId: 'ADMIN001',
        department: 'EHS',
        role: 'admin',
        passwordHash: await hashPassword('admin123'),
        language: 'en',
        joinedAt: new Date().toISOString()
    };

    saveUser(adminUser);

    // Create demo trainee
    const traineeUser: User = {
        id: 'user-1',
        name: 'John Doe',
        username: 'trainee1',
        employeeId: 'EMP001',
        department: 'Production',
        role: 'trainee',
        passwordHash: await hashPassword('pass1'),
        language: 'en',
        joinedAt: new Date().toISOString()
    };

    saveUser(traineeUser);

    // Map filename (from JSON) to assets object key (from assetsMap.ts)
    const filenameToKey: Record<string, keyof typeof assets> = {
        'worker_orientation.png': 'workerOrientation',
        'hazard.png': 'hazard',
        'quiz_oil_puddle.png': 'oilPuddle',
        'slip_trip_hazard.png': 'slipTrip',
        'machine_guard.png': 'machineGuard',
        'loto_lock.png': 'lotoLock',
        'ppe_equipment.png': 'ppeEquipment',
        'electrical_ppe.png': 'electricalPpe',
        'fire_triangle_diagram_1766741681721.png': 'fireTriangle',
        'fire_extinguisher.png': 'fireExtinguisher',
        'safe_lifting.png': 'safeLifting',
        'electrical_danger.png': 'electricalDanger',
        'chemical_label.png': 'chemicalLabel',
        'chemical_hazards.png': 'chemicalHazards',
        'waste_bins.png': 'wasteBins',
        'environmental_impact.png': 'envImpact',
        'emergency.png': 'emergency',
        'first_aid_scene.png': 'firstAidScene',
        'quiz_blocked_exit.png': 'quizBlockedExit',
        'quiz_awkward_lift.png': 'quizAwkwardLift',
        'quiz_exposed_wire.png': 'quizExposedWire',
        'quiz_unlabeled_bottle.png': 'quizUnlabeledBottle',
        'hazard_symbols_grid_1766741715124.png': 'hazardSymbols',
        'ppe_safety_gear_1766741743509.png': 'ppeGear',
        'assembly_point.png': 'assemblyPoint',
        'fire_evacuation.png': 'fireEvacuation',
        'first_aid_kit.png': 'firstAidKit',
        'heat_exhaustion.png': 'heatExhaustion',
        'heat_illness_care.png': 'heatIllnessCare',
        'housekeeping_5s.png': 'housekeeping5s',
        'rights_responsibilities.png': 'rightsResponsibilities',
        'recycling_bins.png': 'recyclingBins',
        'waste.png': 'waste',
        'loto_group_work.png': 'lotoGroupWork',
        'loto_energy_control.png': 'lotoEnergyControl',
        'confined_space.png': 'confinedSpace',
        'material_handling_intro.png': 'materialHandlingIntro',
        'hierarchy.png': 'hierarchy',
        'electrical_voltage.png': 'electricalVoltage',
        'oil_spill.png': 'oilSpill',
        'fire.png': 'fire',
        'mascot.png': 'mascot'
    };

    const hydrateModules = (modules: any[]): Module[] => {
        return modules.map(m => {
            const replacePath = (path: string | undefined) => {
                if (!path) return undefined;
                const filename = path.split('/').pop();
                if (filename && filenameToKey[filename]) {
                    return assets[filenameToKey[filename]];
                }
                return path;
            };

            return {
                ...m,
                thumbnail: replacePath(m.thumbnail),
                imageUrl: replacePath(m.imageUrl),
                icon: m.icon,
                steps: m.steps.map((s: any) => ({
                    ...s,
                    imageUrl: replacePath(s.imageUrl),
                    interactive: s.interactive ? {
                        ...s.interactive,
                        image: replacePath(s.interactive.image)
                    } : undefined
                }))
            };
        });
    };

    const modules: Module[] = hydrateModules(rawModules);

    // Seed questions for each module
    const questions: Question[] = [
        // Module 1
        {
            id: 'q-1-1', moduleId: 'ehs-001', stepId: 'step-1-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'What is our "Zero Accident" vision?', ta: 'எங்கள் "பூஜ்ஜிய விபத்து" பார்வை என்ன?', hi: 'हमारा "शून्य दुर्घटना" दृष्टिकोण क्या है?', te: 'మా "జీరో యాక్సిడెంట్" విజన్ ఏమిటి?' },
            options: {
                en: ['No Major Accidents only', 'Zero Accidents of ANY kind', 'Less than 10 accidents'],
                ta: ['பெரிய விபத்துக்கள் மட்டும் இல்லை', 'எந்த விதமான விபத்துக்களையும் இல்லை', '10 விபத்துக்களுக்கு குறைவாக'],
                hi: ['केवल बड़ी दुर्घटनाएं नहीं', 'किसी भी प्रकार की शून्य दुर्घटनाएं', '10 से कम दुर्घटनाएं'],
                te: ['పెద్ద ప్రమాదాలు మాత్రమే లేవు', 'ఎటువంటి ప్రమాదాలు లేవు', '10 కంటే తక్కువ ప్రమాదాలు']
            },
            answer: 1
        },
        {
            id: 'q-1-2', moduleId: 'ehs-001', stepId: 'step-1-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'Who is responsible for Safety?', ta: 'பாதுகாப்புக்கு யார் பொறுப்பு?', hi: 'सुरक्षा के लिए कौन जिम्मेदार है?', te: 'భద్రతకు ఎవరు బాధ్యత వహిస్తారు?' },
            options: {
                en: ['Safety Officer Only', 'Everyone', 'Manager Only'],
                ta: ['பாதுகாப்பு அதிகாரி மட்டும்', 'அனைவரும்', 'மேலாளர் மட்டும்'],
                hi: ['केवल सुरक्षा अधिकारी', 'हर कोई', 'केवल प्रबंधक'],
                te: ['సేఫ్టీ ఆఫీసర్ మాత్రమే', 'ప్రతి ఒక్కరూ', 'మేనేజర్ మాత్రమే']
            },
            answer: 1
        },

        // Module 2 - Note: Module 2 uses interactive quiz (step-2-quiz)
        {
            id: 'q-2-1', moduleId: 'ehs-002', stepId: 'step-2-1', type: 'single', difficulty: 'simple',
            text: { en: 'What is the first step to Safety?', ta: 'பாதுகாப்பிற்கான முதல் படி என்ன?', hi: 'सुरक्षा का पहला कदम क्या है?', te: 'భద్రతకు మొదటి అడుగు ఏమిటి?' },
            options: {
                en: ['Control the Risk', 'Identify the Hazard', 'Ignore it'],
                ta: ['ஆபத்தை கட்டுப்படுத்துதல்', 'ஆபத்தை அடையாளம் காணுதல்', 'புறக்கணித்தல்'],
                hi: ['जोखिम को नियंत्रित करें', 'खतरे को पहचानें', 'इसे अनदेखा करें'],
                te: ['ప్రమాదాన్ని నియంత్రించండి', 'ప్రమాదాన్ని గుర్తించండి', 'దాన్ని విస్మరించండి']
            },
            answer: 1
        },

        // Module 3
        {
            id: 'q-3-1', moduleId: 'ehs-003', stepId: 'step-3-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'According to Heinrich, 1 Major accident is preceded by how many Near Misses?', ta: '1 பெரிய விபத்துக்கு முன் எத்தனை நூலிழை தவறுகள்?', hi: '1 बड़ी दुर्घटना से पहले कितनी निकट चूक?', te: '1 పెద్ద ప్రమాదానికి ముందు ఎన్ని దగ్గరగా తప్పిపోయిన సంఘటనలు?' },
            options: {
                en: ['300', '29', '100'],
                ta: ['300', '29', '100'],
                hi: ['300', '29', '100'],
                te: ['300', '29', '100']
            },
            answer: 0
        },

        // Module 4
        {
            id: 'q-4-1', moduleId: 'ehs-004', stepId: 'step-4-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'What is the function of a Safety Light Curtain?', ta: 'பாதுகாப்பு ஒளி திரைச்சீலையின் செயல்பாடு என்ன?', hi: 'सेफ्टी लाइट कर्टन का क्या काम है?', te: 'సేఫ్టీ లైట్ కర్టెన్ పని ఏమిటి?' },
            options: {
                en: ['To light up the area', 'Stops machine if body part enters', 'To look good'],
                ta: ['பகுதியை ஒளிரச் செய்ய', 'உடல் பாகம் நுழைந்தால் இயந்திரத்தை நிறுத்தும்', 'நன்றாக இருக்க'],
                hi: ['क्षेत्र को रोशन करने के लिए', 'यदि शरीर का अंग प्रवेश करता है तो मशीन को रोकता है', 'अच्छा दिखने के लिए'],
                te: ['ప్రాంతాన్ని వెలిగించడానికి', 'శరీర భాగం ప్రవేశిస్తే యంత్రాన్ని ఆపివేస్తుంది', 'బాగుంది కనిపించడానికి']
            },
            answer: 1
        },

        // Module 5
        {
            id: 'q-5-1', moduleId: 'ehs-005', stepId: 'step-5-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'Which PPE is for Ear Protection?', ta: 'காது பாதுகாப்புக்கான PPE எது?', hi: 'कान की सुरक्षा के लिए कौन सा पीपीई है?', te: 'చెవి రక్షణ కోసం ఏ PPE?' },
            options: {
                en: ['Goggles', 'Ear Plugs', 'Helmet'],
                ta: ['கண்ணாடி', 'காது பிளக்குகள்', 'தலைக்கவசம்'],
                hi: ['चश्मा', 'ईयर प्लग', 'हेलमेट'],
                te: ['కళ్లద్దాలు', 'చెవి ప్లగ్స్', 'హెల్మెట్']
            },
            answer: 1
        },

        // Module 6
        {
            id: 'q-6-1', moduleId: 'ehs-006', stepId: 'step-6-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'Class A fire involves?', ta: 'வகுப்பு A தீ எதை உள்ளடக்கியது?', hi: 'क्लास A आग में क्या शामिल है?', te: 'క్లాస్ A మంటల్లో ఏమి ఉంటాయి?' },
            options: {
                en: ['Oil & Petrol', 'Wood, Paper, Cloth', 'Gas'],
                ta: ['எண்ணெய் & பெட்ரோல்', 'மரம், காகிதம், துணி', 'எரிவாயு'],
                hi: ['तेल और पेट्रोल', 'लकड़ी, कागज, कपड़ा', 'गैस'],
                te: ['చమురు & పెట్రోల్', 'చెక్క, కాగితం, వస్త్రం', 'గ్యాస్']
            },
            answer: 1
        },

        // Module 7 - Note: Module 7 uses interactive quiz (step-7-quiz)
        {
            id: 'q-7-1', moduleId: 'ehs-007', stepId: 'step-7-1', type: 'single', difficulty: 'simple',
            text: { en: 'Ideal max lifting weight for men?', ta: 'ஆண்களுக்கான சிறந்த அதிகபட்ச எடை?', hi: 'पुरुषों के लिए आदर्श अधिकतम भार?', te: 'పురుషులకు ఆదర్శవంతమైన గరిష్ట బరువు?' },
            options: {
                en: ['50 kg', '25 kg', '40 kg'],
                ta: ['50 kg', '25 kg', '40 kg'],
                hi: ['50 kg', '25 kg', '40 kg'],
                te: ['50 kg', '25 kg', '40 kg']
            },
            answer: 1
        },

        // Module 8 - Note: Module 8 uses interactive quiz (step-8-quiz)  
        {
            id: 'q-8-1', moduleId: 'ehs-008', stepId: 'step-8-1', type: 'single', difficulty: 'simple',
            text: { en: 'Before working on Electrical Panel?', ta: 'மின்சார பலகையில் வேலை செய்வதற்கு முன்?', hi: 'इलेक्ट्रिकल पैनल पर काम करने से पहले?', te: 'ఎలక్ట్రికల్ ప్యానెల్‌పై పని చేయడానికి ముందు?' },
            options: {
                en: ['Wear Gloves Only', 'Apply LOTO', 'Just Switch Off'],
                ta: ['கையுறைகளை மட்டும் அணியவும்', 'LOTO பயன்படுத்தவும்', 'வெறுமனே அணைக்கவும்'],
                hi: ['केवल दस्ताने पहनें', 'LOTO लागू करें', 'बस स्विच ऑफ करें'],
                te: ['చేతి తొడుగులు మాత్రమే ధరించండి', 'LOTO ని వర్తించండి', 'జస్ట్ స్విచ్ ఆఫ్ చేయండి']
            },
            answer: 1
        },

        // Module 9 - Note: Module 9 uses interactive quiz (step-9-quiz)
        {
            id: 'q-9-1', moduleId: 'ehs-009', stepId: 'step-9-1', type: 'single', difficulty: 'simple',
            text: { en: 'Blue color in NFPA Diamond?', ta: 'NFPA வைரத்தில் நீல நிறம்?', hi: 'NFPA डायमंड में नीला रंगá', te: 'NFPA డైమండ్‌లో నీలం రంగు?' },
            options: {
                en: ['Fire Hazard', 'Health Hazard', 'Reactivity'],
                ta: ['தீ ஆபத்து', 'சுகாதார ஆபத்து', 'வினைத்திறன்'],
                hi: ['आग का खतरा', 'स्वास्थ्य खतरा', 'प्रतिक्रियाशीलता'],
                te: ['అగ్ని ప్రమాదం', 'ఆరోగ్య ప్రమాదం', 'రియాక్టివిటీ']
            },
            answer: 1
        },

        // Module 10
        {
            id: 'q-10-1', moduleId: 'ehs-010', stepId: 'step-10-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'Which bin is for food waste?', ta: 'உணவு கழிவுகளுக்கான தொட்டி?', hi: 'खाद्य अपशिष्ट के लिए कौन सा डिब्बा?', te: 'आहార వ్యర్థాలకు ఏ డబ్బా?' },
            options: {
                en: ['Red Bin', 'Green Bin', 'Blue Bin'],
                ta: ['சிவப்பு தொட்டி', 'பச்சை தொட்டி', 'நீல தொட்டி'],
                hi: ['लाल डिब्बा', 'हरा डिब्बा', 'नीला डिब्बा'],
                te: ['ఎరుపు డబ్బా', 'ఆకుపచ్చ డబ్బా', 'నీలం డబ్బా']
            },
            answer: 1
        },

        // Module 11
        {
            id: 'q-11-1', moduleId: 'ehs-011', stepId: 'step-11-quiz', type: 'single', difficulty: 'simple',
            text: { en: 'Who to report Near Miss to?', ta: 'நூலிழை தவறை யாரிடம் புகாரளிக்க வேண்டும்?', hi: 'निकट चूक की रिपोर्ट किसे करें?', te: 'నియర్ మిస్‌ను ఎవరికి నివేదించాలి?' },
            options: {
                en: ['No one', 'Supervisor', 'Friend'],
                ta: ['யாரும் இல்லை', 'மேற்பார்வையாளர்', 'நண்பர்'],
                hi: ['कोई नहीं', 'पर्यवेक्षक', 'दोस्त'],
                te: ['ఎవరూ కాదు', 'పర్యవేక్షకుడు', 'స్నేహితుడు']
            },
            answer: 1
        }
    ];



    modules.forEach(saveModule);
    questions.forEach(saveQuestion);

    // Create Tests for each Module
    modules.forEach(module => {
        // Basic test creation - will be updated when questions are added
        const moduleQuestions = questions.filter(q => q.moduleId === module.id);
        const test: Test = {
            id: `test-${module.id}`,
            title: { en: `${module.title.en} Quiz`, ta: `${module.title.ta} வினாடி வினா`, hi: `${module.title.hi} प्रश्नोत्तरी`, te: `${module.title.te} క్విజ్` },
            moduleId: module.id,
            questionIds: moduleQuestions.map(q => q.id),
            timeLimitMinutes: 10,
            passScore: 60
        };
        saveTest(test);
    });

    console.log('Seeding completed successfully with 11 Modules and Tests.');
    markInitialized();

    // Force reload to reflect changes
    window.location.reload();
}
