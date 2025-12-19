import { hashPassword, saveUser, saveModule, saveQuestion, saveTest, saveAttempt, isInitialized, markInitialized, type User, type Module, type Question, type Test, type TestAttempt } from './storage';

export async function initializeSeedData() {
  if (isInitialized()) {
    return;
  }

  // Seed Users
  const users: Omit<User, 'passwordHash'>[] = [
    { id: 'admin-001', username: 'admin', role: 'admin', createdAt: new Date().toISOString() },
    { id: 'trainee-001', username: 'trainee1', role: 'trainee', createdAt: new Date().toISOString() },
    { id: 'trainee-002', username: 'trainee2', role: 'trainee', createdAt: new Date().toISOString() },
  ];

  const passwords = ['admin123', 'pass1', 'pass2'];

  for (let i = 0; i < users.length; i++) {
    const passwordHash = await hashPassword(passwords[i]);
    saveUser({ ...users[i], passwordHash } as User);
  }

  // Seed Modules with multilingual content
  const modules: Module[] = [
    {
      id: 'mod-001',
      title: { en: 'Workplace Safety Fundamentals', ta: 'பணியிட பாதுகாப்பு அடிப்படைகள்', hi: 'कार्यस्थल सुरक्षा मूलभूत सिद्धांत', te: 'కార్యాలయ భద్రత ప్రాథమిక అంశాలు' },
      description: { en: 'Learn the essential safety protocols for the workplace', ta: 'பணியிடத்திற்கான அத்தியாவசிய பாதுகாப்பு நெறிமுறைகளைக் கற்றுக்கொள்ளுங்கள்', hi: 'कार्यस्थल के लिए आवश्यक सुरक्षा प्रोटोकॉल सीखें', te: 'కార్యాలయం కోసం అవసరమైన భద్రతా ప్రోటోకాల్‌లను నేర్చుకోండి' },
      icon: 'Shield',
      steps: [
        {
          id: 'step-001-1',
          type: 'intro',
          title: { en: 'Welcome to Safety Training', ta: 'பாதுகாப்பு பயிற்சிக்கு வரவேற்கிறோம்', hi: 'सुरक्षा प्रशिक्षण में आपका स्वागत है', te: 'భద్రతా శిక్షణకు స్వాగతం' },
          content: { en: 'In this module, you will learn about the fundamental safety practices that every employee must follow. Safety is our top priority at TVS.', ta: 'இந்த தொகுதியில், ஒவ்வொரு ஊழியரும் பின்பற்ற வேண்டிய அடிப்படை பாதுகாப்பு நடைமுறைகளைப் பற்றி நீங்கள் கற்றுக்கொள்வீர்கள்.', hi: 'इस मॉड्यूल में, आप उन मौलिक सुरक्षा प्रथाओं के बारे में जानेंगे जिनका हर कर्मचारी को पालन करना चाहिए।', te: 'ఈ మాడ్యూల్‌లో, ప్రతి ఉద్యోగి పాటించాల్సిన ప్రాథమిక భద్రతా పద్ధతుల గురించి మీరు నేర్చుకుంటారు.' },
        },
        {
          id: 'step-001-2',
          type: 'content',
          title: { en: 'Personal Protective Equipment (PPE)', ta: 'தனிப்பட்ட பாதுகாப்பு உபகரணங்கள்', hi: 'व्यक्तिगत सुरक्षा उपकरण', te: 'వ్యక్తిగత రక్షణ పరికరాలు' },
          content: { en: '<h3>Understanding PPE</h3><p>Personal Protective Equipment includes:</p><ul><li>Safety helmets</li><li>Safety glasses</li><li>High-visibility vests</li><li>Safety shoes</li><li>Gloves</li></ul><p>Always wear the appropriate PPE for your work area.</p>', ta: '<h3>PPE புரிந்துகொள்ளுதல்</h3><p>தனிப்பட்ட பாதுகாப்பு உபகரணங்களில் அடங்கும்:</p><ul><li>பாதுகாப்பு தொப்பிகள்</li><li>பாதுகாப்பு கண்ணாடிகள்</li></ul>', hi: '<h3>PPE को समझना</h3><p>व्यक्तिगत सुरक्षा उपकरण में शामिल हैं:</p><ul><li>सुरक्षा हेलमेट</li><li>सुरक्षा चश्मा</li></ul>', te: '<h3>PPE అర్థం చేసుకోవడం</h3><p>వ్యక్తిగత రక్షణ పరికరాలలో ఇవి ఉన్నాయి:</p><ul><li>భద్రతా హెల్మెట్లు</li></ul>' },
        },
        {
          id: 'step-001-3',
          type: 'quiz',
          title: { en: 'PPE Knowledge Check', ta: 'PPE அறிவு சோதனை', hi: 'PPE ज्ञान जांच', te: 'PPE నాలెడ్జ్ చెక్' },
          quiz: {
            question: { en: 'Which of the following is NOT considered Personal Protective Equipment?', ta: 'பின்வருவனவற்றில் எது தனிப்பட்ட பாதுகாப்பு உபகரணமாக கருதப்படவில்லை?', hi: 'निम्नलिखित में से कौन सा व्यक्तिगत सुरक्षा उपकरण नहीं माना जाता है?', te: 'కింది వాటిలో ఏది వ్యక్తిగత రక్షణ పరికరంగా పరిగణించబడదు?' },
            options: { en: ['Safety helmet', 'Mobile phone', 'Safety glasses', 'High-visibility vest'], ta: ['பாதுகாப்பு தொப்பி', 'மொபைல் போன்', 'பாதுகாப்பு கண்ணாடி', 'உயர் தெரிவுநிலை உடை'], hi: ['सुरक्षा हेलमेट', 'मोबाइल फोन', 'सुरक्षा चश्मा', 'उच्च दृश्यता बनियान'], te: ['భద్రతా హెల్మెట్', 'మొబైల్ ఫోన్', 'భద్రతా అద్దాలు', 'అధిక దృశ్యమానత వేస్ట్'] },
            correctIndex: 1,
            hint: { en: 'Think about what protects you from workplace hazards.', ta: 'பணியிட அபாயங்களிலிருந்து உங்களைப் பாதுகாப்பது எது என்று சிந்தியுங்கள்.', hi: 'सोचें कि कार्यस्थल के खतरों से आपकी रक्षा क्या करता है।', te: 'కార్యాలయ ప్రమాదాల నుండి మిమ్మల్ని ఏది రక్షిస్తుందో ఆలోచించండి.' },
          },
        },
      ],
    },
    {
      id: 'mod-002',
      title: { en: 'Fire Safety & Emergency Response', ta: 'தீ பாதுகாப்பு & அவசர பதில்', hi: 'अग्नि सुरक्षा और आपातकालीन प्रतिक्रिया', te: 'అగ్ని భద్రత & అత్యవసర స్పందన' },
      description: { en: 'Learn how to prevent fires and respond to emergencies', ta: 'தீ தடுப்பது மற்றும் அவசர நிலைகளுக்கு பதிலளிப்பது எப்படி என்று கற்றுக்கொள்ளுங்கள்', hi: 'आग को रोकने और आपात स्थितियों में प्रतिक्रिया करने का तरीका सीखें', te: 'మంటలను నివారించడం మరియు అత్యవసర పరిస్థితులకు ఎలా స్పందించాలో నేర్చుకోండి' },
      icon: 'Flame',
      steps: [
        {
          id: 'step-002-1',
          type: 'intro',
          title: { en: 'Fire Safety Introduction', ta: 'தீ பாதுகாப்பு அறிமுகம்', hi: 'अग्नि सुरक्षा परिचय', te: 'అగ్ని భద్రత పరిచయం' },
          content: { en: 'Fire safety is crucial in any workplace. This module covers fire prevention, detection, and emergency response procedures.', ta: 'எந்த பணியிடத்திலும் தீ பாதுகாப்பு முக்கியமானது.', hi: 'किसी भी कार्यस्थल में अग्नि सुरक्षा महत्वपूर्ण है।', te: 'ఏ కార్యాలయంలోనైనా అగ్ని భద్రత చాలా ముఖ్యమైనది.' },
        },
        {
          id: 'step-002-2',
          type: 'content',
          title: { en: 'Fire Extinguisher Types', ta: 'தீ அணைப்பான் வகைகள்', hi: 'अग्निशामक प्रकार', te: 'అగ్నిమాపక రకాలు' },
          content: { en: '<h3>Know Your Fire Extinguisher</h3><p>Different types of fires require different extinguishers:</p><ul><li><strong>Class A:</strong> Ordinary combustibles (wood, paper)</li><li><strong>Class B:</strong> Flammable liquids</li><li><strong>Class C:</strong> Electrical fires</li><li><strong>Class D:</strong> Metal fires</li></ul><p>Remember the PASS technique: Pull, Aim, Squeeze, Sweep</p>', ta: '<h3>உங்கள் தீ அணைப்பானை அறிந்துகொள்ளுங்கள்</h3>', hi: '<h3>अपने अग्निशामक को जानें</h3>', te: '<h3>మీ అగ్నిమాపకాన్ని తెలుసుకోండి</h3>' },
        },
        {
          id: 'step-002-3',
          type: 'quiz',
          title: { en: 'Fire Safety Quiz', ta: 'தீ பாதுகாப்பு வினாடி வினா', hi: 'अग्नि सुरक्षा प्रश्नोत्तरी', te: 'అగ్ని భద్రత క్విజ్' },
          quiz: {
            question: { en: 'What does the "P" in PASS stand for?', ta: 'PASS இல் "P" என்ன குறிக்கிறது?', hi: 'PASS में "P" का क्या मतलब है?', te: 'PASS లో "P" అంటే ఏమిటి?' },
            options: { en: ['Push', 'Pull', 'Point', 'Press'], ta: ['தள்ளு', 'இழு', 'சுட்டிக்காட்டு', 'அழுத்து'], hi: ['धक्का', 'खींचो', 'इशारा', 'दबाएं'], te: ['నెట్టు', 'లాగు', 'పాయింట్', 'నొక్కు'] },
            correctIndex: 1,
            hint: { en: 'Think about the first action you take with an extinguisher.', ta: 'அணைப்பானுடன் நீங்கள் எடுக்கும் முதல் நடவடிக்கையைப் பற்றி சிந்தியுங்கள்.', hi: 'अग्निशामक के साथ आप जो पहला कदम उठाते हैं उसके बारे में सोचें।', te: 'అగ్నిమాపకంతో మీరు తీసుకునే మొదటి చర్య గురించి ఆలోచించండి.' },
          },
        },
      ],
    },
    {
      id: 'mod-003',
      title: { en: 'Machine Safety Operations', ta: 'இயந்திர பாதுகாப்பு செயல்பாடுகள்', hi: 'मशीन सुरक्षा संचालन', te: 'మెషిన్ భద్రత కార్యకలాపాలు' },
      description: { en: 'Safe operation of machinery and equipment', ta: 'இயந்திரங்கள் மற்றும் உபகரணங்களின் பாதுகாப்பான செயல்பாடு', hi: 'मशीनरी और उपकरण का सुरक्षित संचालन', te: 'యంత్రాలు మరియు పరికరాల సురక్షిత నిర్వహణ' },
      icon: 'Cog',
      steps: [
        {
          id: 'step-003-1',
          type: 'intro',
          title: { en: 'Machine Safety Basics', ta: 'இயந்திர பாதுகாப்பு அடிப்படைகள்', hi: 'मशीन सुरक्षा मूल बातें', te: 'మెషిన్ భద్రత ప్రాథమికాలు' },
          content: { en: 'Working with machinery requires constant vigilance and adherence to safety protocols. This module covers lockout/tagout procedures, machine guards, and safe operating practices.', ta: 'இயந்திரங்களுடன் பணியாற்ற தொடர்ந்து விழிப்புணர்வு மற்றும் பாதுகாப்பு நெறிமுறைகளை பின்பற்றுதல் தேவை.', hi: 'मशीनरी के साथ काम करने के लिए निरंतर सतर्कता और सुरक्षा प्रोटोकॉल का पालन आवश्यक है।', te: 'యంత్రాలతో పని చేయడానికి నిరంతర అప్రమత్తత మరియు భద్రతా ప్రోటోకాల్‌లను పాటించడం అవసరం.' },
        },
        {
          id: 'step-003-2',
          type: 'content',
          title: { en: 'Lockout/Tagout Procedures', ta: 'லாக்அவுட்/டேகவுட் நடைமுறைகள்', hi: 'लॉकआउट/टैगआउट प्रक्रियाएं', te: 'లాకౌట్/ట్యాగౌట్ విధానాలు' },
          content: { en: '<h3>LOTO Safety</h3><p>Lockout/Tagout (LOTO) procedures protect workers from hazardous energy during maintenance:</p><ol><li>Prepare for shutdown</li><li>Notify affected employees</li><li>Equipment shutdown</li><li>Isolate energy sources</li><li>Apply lockout/tagout devices</li><li>Release stored energy</li><li>Verify isolation</li></ol>', ta: '<h3>LOTO பாதுகாப்பு</h3>', hi: '<h3>LOTO सुरक्षा</h3>', te: '<h3>LOTO భద్రత</h3>' },
        },
        {
          id: 'step-003-3',
          type: 'quiz',
          title: { en: 'LOTO Quiz', ta: 'LOTO வினாடி வினா', hi: 'LOTO प्रश्नोत्तरी', te: 'LOTO క్విజ్' },
          quiz: {
            question: { en: 'When should LOTO procedures be applied?', ta: 'LOTO நடைமுறைகள் எப்போது பயன்படுத்தப்பட வேண்டும்?', hi: 'LOTO प्रक्रियाएं कब लागू की जानी चाहिए?', te: 'LOTO విధానాలు ఎప్పుడు వర్తింపజేయాలి?' },
            options: { en: ['During normal operation', 'During maintenance and repair', 'Only during emergencies', 'Never'], ta: ['சாதாரண இயக்கத்தின் போது', 'பராமரிப்பு மற்றும் பழுதுபார்ப்பின் போது', 'அவசர நிலைகளில் மட்டும்', 'ஒருபோதும் இல்லை'], hi: ['सामान्य संचालन के दौरान', 'रखरखाव और मरम्मत के दौरान', 'केवल आपात स्थिति में', 'कभी नहीं'], te: ['సాధారణ ఆపరేషన్ సమయంలో', 'నిర్వహణ మరియు మరమ్మతు సమయంలో', 'అత్యవసర సమయంలో మాత్రమే', 'ఎప్పుడూ కాదు'] },
            correctIndex: 1,
          },
        },
      ],
    },
    {
      id: 'mod-004',
      title: { en: 'Chemical Handling Safety', ta: 'இரசாயன கையாளுதல் பாதுகாப்பு', hi: 'रासायनिक हैंडलिंग सुरक्षा', te: 'రసాయన నిర్వహణ భద్రత' },
      description: { en: 'Safe handling, storage, and disposal of chemicals', ta: 'இரசாயனங்களின் பாதுகாப்பான கையாளுதல், சேமிப்பு மற்றும் அகற்றல்', hi: 'रसायनों का सुरक्षित हैंडलिंग, भंडारण और निपटान', te: 'రసాయనాల సురక్షిత నిర్వహణ, నిల్వ మరియు పారవేయడం' },
      icon: 'FlaskConical',
      steps: [
        {
          id: 'step-004-1',
          type: 'intro',
          title: { en: 'Chemical Safety Overview', ta: 'இரசாயன பாதுகாப்பு மேலோட்டம்', hi: 'रासायनिक सुरक्षा अवलोकन', te: 'రసాయన భద్రత అవలోకనం' },
          content: { en: 'Understanding chemical hazards is essential for workplace safety. Learn about MSDS sheets, proper handling techniques, and emergency procedures.', ta: 'இரசாயன அபாயங்களைப் புரிந்துகொள்வது பணியிட பாதுகாப்புக்கு அவசியம்.', hi: 'कार्यस्थल सुरक्षा के लिए रासायनिक खतरों को समझना आवश्यक है।', te: 'కార్యాలయ భద్రత కోసం రసాయన ప్రమాదాలను అర్థం చేసుకోవడం అవసరం.' },
        },
        {
          id: 'step-004-2',
          type: 'quiz',
          title: { en: 'Chemical Safety Quiz', ta: 'இரசாயன பாதுகாப்பு வினாடி வினா', hi: 'रासायनिक सुरक्षा प्रश्नोत्तरी', te: 'రసాయన భద్రత క్విజ్' },
          quiz: {
            question: { en: 'What document provides detailed information about chemical hazards?', ta: 'இரசாயன அபாயங்கள் பற்றிய விரிவான தகவல்களை எந்த ஆவணம் வழங்குகிறது?', hi: 'कौन सा दस्तावेज़ रासायनिक खतरों के बारे में विस्तृत जानकारी प्रदान करता है?', te: 'రసాయన ప్రమాదాల గురించి వివరమైన సమాచారం ఏ పత్రం అందిస్తుంది?' },
            options: { en: ['MSDS/SDS', 'Employee handbook', 'Company newsletter', 'Safety poster'], ta: ['MSDS/SDS', 'ஊழியர் கையேடு', 'நிறுவன செய்திமடல்', 'பாதுகாப்பு போஸ்டர்'], hi: ['MSDS/SDS', 'कर्मचारी पुस्तिका', 'कंपनी समाचार पत्र', 'सुरक्षा पोस्टर'], te: ['MSDS/SDS', 'ఉద్యోగి హ్యాండ్‌బుక్', 'కంపెనీ న్యూస్‌లెటర్', 'సేఫ్టీ పోస్టర్'] },
            correctIndex: 0,
          },
        },
      ],
    },
    {
      id: 'mod-005',
      title: { en: 'Electrical Safety', ta: 'மின் பாதுகாப்பு', hi: 'विद्युत सुरक्षा', te: 'విద్యుత్ భద్రత' },
      description: { en: 'Understanding electrical hazards and safe practices', ta: 'மின் அபாயங்கள் மற்றும் பாதுகாப்பான நடைமுறைகளைப் புரிந்துகொள்ளுதல்', hi: 'विद्युत खतरों और सुरक्षित प्रथाओं को समझना', te: 'విద్యుత్ ప్రమాదాలు మరియు సురక్షిత పద్ధతులను అర్థం చేసుకోవడం' },
      icon: 'Zap',
      steps: [
        {
          id: 'step-005-1',
          type: 'intro',
          title: { en: 'Electrical Hazards', ta: 'மின் அபாயங்கள்', hi: 'विद्युत खतरे', te: 'విద్యుత్ ప్రమాదాలు' },
          content: { en: 'Electricity powers our workplace but can be deadly if not handled properly. Learn about electrical safety measures and emergency procedures.', ta: 'மின்சாரம் நமது பணியிடத்தை இயக்குகிறது ஆனால் சரியாக கையாளாவிட்டால் ஆபத்தானது.', hi: 'बिजली हमारे कार्यस्थल को शक्ति देती है लेकिन अगर ठीक से नहीं संभाला जाए तो घातक हो सकती है।', te: 'విద్యుత్ మన కార్యాలయానికి శక్తినిస్తుంది కానీ సరిగ్గా నిర్వహించకపోతే ప్రాణాంతకం కావచ్చు.' },
        },
        {
          id: 'step-005-2',
          type: 'quiz',
          title: { en: 'Electrical Safety Quiz', ta: 'மின் பாதுகாப்பு வினாடி வினா', hi: 'विद्युत सुरक्षा प्रश्नोत्तरी', te: 'విద్యుత్ భద్రత క్విజ్' },
          quiz: {
            question: { en: 'What should you do if you see a damaged electrical cord?', ta: 'சேதமடைந்த மின் கம்பியை நீங்கள் பார்த்தால் என்ன செய்ய வேண்டும்?', hi: 'यदि आप क्षतिग्रस्त विद्युत तार देखते हैं तो आपको क्या करना चाहिए?', te: 'పాడైన విద్యుత్ తీగను చూస్తే మీరు ఏమి చేయాలి?' },
            options: { en: ['Use it carefully', 'Report it immediately', 'Cover it with tape', 'Ignore it'], ta: ['கவனமாக பயன்படுத்தவும்', 'உடனடியாக தெரிவிக்கவும்', 'டேப்பால் மூடவும்', 'புறக்கணிக்கவும்'], hi: ['सावधानी से इसका उपयोग करें', 'तुरंत रिपोर्ट करें', 'टेप से ढकें', 'इसे अनदेखा करें'], te: ['జాగ్రత్తగా ఉపయోగించండి', 'వెంటనే నివేదించండి', 'టేప్‌తో కప్పండి', 'విస్మరించండి'] },
            correctIndex: 1,
          },
        },
      ],
    },
  ];

  for (const module of modules) {
    saveModule(module);
  }

  // Seed Questions for Testing
  const questions: Question[] = [
    {
      id: 'q-001',
      moduleId: 'mod-001',
      text: { en: 'A worker notices a colleague not wearing safety glasses in a designated area. What is the appropriate action?', ta: 'ஒரு தொழிலாளி குறிப்பிட்ட பகுதியில் ஒரு சக ஊழியர் பாதுகாப்பு கண்ணாடி அணியவில்லை என்பதைக் கவனிக்கிறார். சரியான நடவடிக்கை என்ன?', hi: 'एक कर्मचारी ने देखा कि एक सहकर्मी निर्दिष्ट क्षेत्र में सुरक्षा चश्मा नहीं पहन रहा है। उचित कार्रवाई क्या है?', te: 'ఒక కార్మికుడు నిర్దేశిత ప్రాంతంలో ఒక సహోద్యోగి భద్రతా అద్దాలు ధరించడం లేదని గమనించాడు. సరైన చర్య ఏమిటి?' },
      type: 'single',
      options: { en: ['Ignore it - it\'s not your responsibility', 'Politely remind them and report if needed', 'Report them to HR immediately', 'Continue working without saying anything'], ta: ['புறக்கணிக்கவும் - இது உங்கள் பொறுப்பு அல்ல', 'அவர்களுக்கு மரியாதையாக நினைவூட்டி, தேவைப்பட்டால் தெரிவிக்கவும்', 'உடனடியாக HR-க்கு புகாரளிக்கவும்', 'எதுவும் சொல்லாமல் வேலையைத் தொடரவும்'], hi: ['इसे अनदेखा करें - यह आपकी जिम्मेदारी नहीं है', 'विनम्रता से याद दिलाएं और जरूरत पड़ने पर रिपोर्ट करें', 'तुरंत HR को रिपोर्ट करें', 'कुछ भी कहे बिना काम करते रहें'], te: ['విస్మరించండి - ఇది మీ బాధ్యత కాదు', 'మర్యాదగా గుర్తు చేయండి మరియు అవసరమైతే నివేదించండి', 'వెంటనే HR కి నివేదించండి', 'ఏమీ చెప్పకుండా పని కొనసాగించండి'] },
      answer: 1,
      difficulty: 'complex',
    },
    {
      id: 'q-002',
      moduleId: 'mod-001',
      text: { en: 'Which items are mandatory PPE in the assembly area? (Select all that apply)', ta: 'அசெம்பிளி பகுதியில் எந்த பொருட்கள் கட்டாய PPE? (பொருந்துவனவற்றை தேர்ந்தெடுக்கவும்)', hi: 'असेंबली क्षेत्र में कौन से आइटम अनिवार्य PPE हैं? (लागू होने वाले सभी का चयन करें)', te: 'అసెంబ్లీ ప్రాంతంలో ఏ వస్తువులు తప్పనిసరి PPE? (వర్తించే అన్నింటిని ఎంచుకోండి)' },
      type: 'multi',
      options: { en: ['Safety shoes', 'Safety glasses', 'Hearing protection', 'Wrist watch'], ta: ['பாதுகாப்பு காலணிகள்', 'பாதுகாப்பு கண்ணாடிகள்', 'செவி பாதுகாப்பு', 'கைக்கடிகாரம்'], hi: ['सुरक्षा जूते', 'सुरक्षा चश्मा', 'श्रवण सुरक्षा', 'कलाई घड़ी'], te: ['భద్రతా పాదరక్షలు', 'భద్రతా అద్దాలు', 'వినికిడి రక్షణ', 'చేతి గడియారం'] },
      answer: [0, 1, 2],
      difficulty: 'complex',
    },
    {
      id: 'q-003',
      moduleId: 'mod-002',
      text: { en: 'During a fire drill, you notice the nearest exit is blocked. What should you do?', ta: 'தீ பயிற்சியின் போது, அருகிலுள்ள வெளியேறும் வழி தடுக்கப்பட்டிருப்பதை நீங்கள் கவனிக்கிறீர்கள். நீங்கள் என்ன செய்ய வேண்டும்?', hi: 'अग्नि अभ्यास के दौरान, आप देखते हैं कि निकटतम निकास अवरुद्ध है। आपको क्या करना चाहिए?', te: 'ఫైర్ డ్రిల్ సమయంలో, సమీపంలోని నిష్క్రమణ నిరోధించబడిందని మీరు గమనించారు. మీరు ఏమి చేయాలి?' },
      type: 'single',
      options: { en: ['Wait for someone to clear the exit', 'Use an alternate exit and report the blocked path', 'Try to remove the blockage yourself', 'Return to your workstation'], ta: ['வெளியேறும் வழியை யாரேனும் அழிக்க காத்திருங்கள்', 'மாற்று வெளியேறும் வழியைப் பயன்படுத்தி, தடுக்கப்பட்ட பாதையைப் புகாரளிக்கவும்', 'தடையை நீங்களே அகற்ற முயற்சிக்கவும்', 'உங்கள் பணியிடத்திற்கு திரும்பவும்'], hi: ['किसी के निकास साफ करने का इंतजार करें', 'वैकल्पिक निकास का उपयोग करें और अवरुद्ध मार्ग की रिपोर्ट करें', 'स्वयं बाधा हटाने का प्रयास करें', 'अपने कार्यस्थान पर लौटें'], te: ['ఎవరైనా ఎగ్జిట్ క్లియర్ చేయడానికి వేచి ఉండండి', 'ప్రత్యామ్నాయ నిష్క్రమణను ఉపయోగించండి మరియు నిరోధించబడిన మార్గాన్ని నివేదించండి', 'మీరే అడ్డంకిని తొలగించడానికి ప్రయత్నించండి', 'మీ వర్క్‌స్టేషన్‌కు తిరిగి వెళ్ళండి'] },
      answer: 1,
      difficulty: 'complex',
    },
    {
      id: 'q-004',
      moduleId: 'mod-003',
      text: { en: 'Before performing maintenance on a press machine, what is the FIRST step?', ta: 'பிரஸ் இயந்திரத்தில் பராமரிப்பு செய்வதற்கு முன், முதல் படி என்ன?', hi: 'प्रेस मशीन पर रखरखाव करने से पहले, पहला कदम क्या है?', te: 'ప్రెస్ మెషిన్‌లో నిర్వహణ చేయడానికి ముందు, మొదటి దశ ఏమిటి?' },
      type: 'single',
      options: { en: ['Start the repair immediately', 'Apply lockout/tagout procedures', 'Notify your supervisor only', 'Put on extra PPE'], ta: ['உடனடியாக பழுது பார்க்கத் தொடங்குங்கள்', 'லாக்அவுட்/டேகவுட் நடைமுறைகளைப் பயன்படுத்துங்கள்', 'உங்கள் மேற்பார்வையாளருக்கு மட்டும் தெரிவிக்கவும்', 'கூடுதல் PPE அணியுங்கள்'], hi: ['तुरंत मरम्मत शुरू करें', 'लॉकआउट/टैगआउट प्रक्रियाएं लागू करें', 'केवल अपने पर्यवेक्षक को सूचित करें', 'अतिरिक्त PPE पहनें'], te: ['వెంటనే మరమ్మత్తు ప్రారంభించండి', 'లాకౌట్/ట్యాగౌట్ విధానాలను వర్తింపజేయండి', 'మీ సూపర్‌వైజర్‌కు మాత్రమే తెలియజేయండి', 'అదనపు PPE వేసుకోండి'] },
      answer: 1,
      difficulty: 'complex',
    },
    {
      id: 'q-005',
      moduleId: 'mod-004',
      text: { en: 'Fill in the blank: The document that contains chemical hazard information is called ___', ta: 'வெற்றிடத்தை நிரப்புங்கள்: இரசாயன அபாய தகவல்களைக் கொண்ட ஆவணம் ___ என்று அழைக்கப்படுகிறது', hi: 'रिक्त स्थान भरें: रासायनिक खतरे की जानकारी वाले दस्तावेज़ को ___ कहा जाता है', te: 'ఖాళీని పూరించండి: రసాయన ప్రమాద సమాచారం కలిగిన పత్రాన్ని ___ అంటారు' },
      type: 'fill',
      answer: 'MSDS',
      hint: { en: 'Material Safety Data Sheet', ta: 'பொருள் பாதுகாப்பு தரவு தாள்', hi: 'सामग्री सुरक्षा डेटा शीट', te: 'మెటీరియల్ సేఫ్టీ డేటా షీట్' },
      difficulty: 'simple',
    },
  ];

  for (const question of questions) {
    saveQuestion(question);
  }

  // Seed Tests
  const tests: Test[] = [
    {
      id: 't_m1_basic',
      title: { en: 'Workplace Safety Basics Test', ta: 'பணியிட பாதுகாப்பு அடிப்படை சோதனை', hi: 'कार्यस्थल सुरक्षा मूल परीक्षा', te: 'కార్యాలయ భద్రత ప్రాథమిక పరీక్ష' },
      moduleId: 'mod-001',
      questionIds: ['q-001', 'q-002'],
      timeLimitMinutes: 10,
      passScore: 70,
    },
    {
      id: 't_m3_advanced',
      title: { en: 'Advanced Safety Operations Test', ta: 'மேம்பட்ட பாதுகாப்பு செயல்பாடுகள் சோதனை', hi: 'उन्नत सुरक्षा संचालन परीक्षा', te: 'అధునాతన భద్రత కార్యకలాపాల పరీక్ష' },
      moduleId: 'mod-003',
      questionIds: ['q-003', 'q-004', 'q-005'],
      timeLimitMinutes: 15,
      passScore: 75,
    },
  ];

  for (const test of tests) {
    saveTest(test);
  }

  // Seed sample Test Attempts for analytics demo
  const sampleAttempts: TestAttempt[] = [
    {
      id: 'attempt-001',
      userId: 'trainee-001',
      testId: 't_m1_basic',
      answers: [
        { questionId: 'q-001', answer: '1', timeSpent: 45 },
        { questionId: 'q-002', answer: ['0', '1', '2'], timeSpent: 60 },
      ],
      score: 100,
      passed: true,
      startedAt: new Date(Date.now() - 86400000).toISOString(),
      finishedAt: new Date(Date.now() - 86400000 + 300000).toISOString(),
      durationSeconds: 300,
      status: 'completed',
    },
    {
      id: 'attempt-002',
      userId: 'trainee-002',
      testId: 't_m1_basic',
      answers: [
        { questionId: 'q-001', answer: '0', timeSpent: 30 },
        { questionId: 'q-002', answer: ['0', '1'], timeSpent: 45 },
      ],
      score: 50,
      passed: false,
      startedAt: new Date(Date.now() - 172800000).toISOString(),
      finishedAt: new Date(Date.now() - 172800000 + 180000).toISOString(),
      durationSeconds: 180,
      status: 'completed',
    },
  ];

  for (const attempt of sampleAttempts) {
    saveAttempt(attempt);
  }

  markInitialized();
}
