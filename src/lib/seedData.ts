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

  const modules: Module[] = [
  {
    id: "ehs-001",
    title: {
      en: "Fundamentals & Safety Culture",
      ta: "\u0b85\u0b9f\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc8 & \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b95\u0bb2\u0bbe\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd",
      hi: "\u092c\u0941\u0928\u093f\u092f\u093e\u0926\u0940 \u092c\u093e\u0924\u094b\u0902 \u0914\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f",
      te: "\u0c2a\u0c4d\u0c30\u0c3e\u0c25\u0c2e\u0c3f\u0c15 \u0c05\u0c02\u0c36\u0c3e\u0c32\u0c41 & \u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c38\u0c02\u0c38\u0c4d\u0c15\u0c43\u0c24\u0c3f",
    },
    description: {
      en: "DTVS Policy, Zero Accident Vision",
      ta: "DTVS \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8, \u0baa\u0bc2\u0b9c\u0bcd\u0b9c\u0bbf\u0baf \u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1 \u0baa\u0bbe\u0bb0\u0bcd\u0bb5\u0bc8",
      hi: "DTVS \u0928\u0940\u0924\u093f, \u0936\u0942\u0928\u094d\u092f \u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e \u0926\u0943\u0937\u094d\u091f\u093f",
      te: "DTVS \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02, \u0c1c\u0c40\u0c30\u0c4b \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c35\u0c3f\u0c1c\u0c28\u0c4d",
    },
    category: "General Safety",
    estimatedTime: "15 min",
    icon: "Shield",
    thumbnail: assets.workerOrientation,
    steps: [
      {
        id: "step-1-1",
        type: "content",
        title: {
          en: "DTVS EHS Policy",
          ta: "DTVS EHS \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8",
          hi: "DTVS EHS \u0928\u0940\u0924\u093f",
          te: "DTVS EHS \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02",
        },
        content: {
          en: `
              <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 class="text-blue-800 font-bold text-xl mb-4">Our Commitment</h3>
                <ul class="space-y-3">
                  <li class="flex items-start"><span class="mr-2">✅</span> <strong>Safe & Healthy Workplace:</strong> We are committed to providing a hazard-free environment for all employees.</li>
                  <li class="flex items-start"><span class="mr-2">🌱</span> <strong>Environmental Protection:</strong> Reducing environmental impact in all daily activities.</li>
                  <li class="flex items-start"><span class="mr-2">♻️</span> <strong>5R Principle:</strong> Refuse, Reduce, Reuse, Repurpose, Recycle.</li>
                  <li class="flex items-start"><span class="mr-2">🤝</span> <strong>Active Participation:</strong> Safety is everyone's responsibility.</li>
                  <li class="flex items-start"><span class="mr-2">📈</span> <strong>Continual Improvement:</strong> We strive to be better every day.</li>
                </ul>
                <div class="mt-4 p-4 bg-white rounded border border-blue-200 text-center font-bold text-blue-900">
                  "Safety First – Always & Our Aim: Zero Accident"
                </div>
              </div>
            `,
          ta: `
               <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                 <h3 class="text-blue-800 font-bold text-xl mb-4">எங்கள் உறுதிமொழி</h3>
                 <ul class="space-y-3">
                   <li>✅ <strong>பாதுகாப்பான பணியிடம்:</strong> அனைவருக்கும் ஆபத்து இல்லாத சூழல்.</li>
                   <li>♻️ <strong>5R கொள்கை:</strong> மறுக்கவும், குறைக்கவும், மீண்டும் பயன்படுத்தவும், மறுநோக்கம், மறுசுழற்சி.</li>
                   <li>🤝 <strong>ஈடுபாடு:</strong> பாதுகாப்பு என்பது அனைவரின் பொறுப்பு.</li>
                 </ul>
                 <div class="mt-4 p-4 bg-white rounded border border-blue-200 text-center font-bold text-blue-900">
                   "பாதுகாப்பே முக்கியம் - எப்போதும் & நம் இலக்கு: பூஜ்ஜிய விபத்து"
                 </div>
               </div>
            `,
          hi: `
              <h3>DTVS EHS नीति</h3>
              <p>हम एक सुरक्षित और स्वस्थ कार्यस्थल प्रदान करने के लिए प्रतिबद्ध हैं। हमारा लक्ष्य शून्य दुर्घटना है।</p>
            `,
          te: `
              <h3>DTVS EHS విధానం</h3>
              <p>మేము సురక్షితమైన మరియు ఆరోగ్యకరమైన కార్యాలయాన్ని అందించడానికి కట్టుబడి ఉన్నాము. మా లక్ష్యం జీరో ప్రమాదం.</p>
            `,
        },
      },
      {
        id: "step-1-2",
        type: "content",
        title: {
          en: "10 Rules for Workplace Safety",
          ta: "\u0baa\u0ba3\u0bbf\u0baf\u0bbf\u0b9f \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbf\u0bb1\u0bcd\u0b95\u0bbe\u0ba9 10 \u0bb5\u0bbf\u0ba4\u0bbf\u0b95\u0bb3\u0bcd",
          hi: "\u0915\u093e\u0930\u094d\u092f\u0938\u094d\u0925\u0932 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0915\u0947 10 \u0928\u093f\u092f\u092e",
          te: "\u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c3e\u0c32\u0c2f\u0c02\u0c32\u0c4b \u0c2d\u0c26\u0c4d\u0c30\u0c24 \u0c15\u0c4b\u0c38\u0c02 10 \u0c28\u0c3f\u0c2f\u0c2e\u0c3e\u0c32\u0c41",
        },
        content: {
          en: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">1. Follow Safety Rules & Instructions</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">2. Work Only After Proper Training</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">3. Report Unsafe Conditions Immediately</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">4. Report Accidents & Near Misses</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">5. Maintain Cleanliness (5S)</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">6. Use Correct PPE</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">7. Do Not Bypass Safety Guards</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">8. Don't Rush - Think Before Act</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">9. Follow Emergency Procedures</div>
                <div class="bg-white p-4 shadow rounded border-t-4 border-green-500">10. Cooperate in Toolbox Talks</div>
              </div>
              <div class="mt-6 flex justify-center">
                 <img src="${assets.housekeeping5s}" alt="5S Methodology" class="max-w-md w-full rounded shadow-lg" />
              </div>
            `,
          ta: `
               <ul class="list-decimal pl-5 space-y-2">
                 <li>பாதுகாப்பு விதிகளைப் பின்பற்றவும்.</li>
                 <li>முறையான பயிற்சிக்குப் பிறகு மட்டுமே வேலை செய்யுங்கள்.</li>
                 <li>பாதுகாப்பற்ற நிலைமைகளை உடனடியாக புகாரளிக்கவும்.</li>
                 <li>விபத்துகள் மற்றும் நூலிழை தவறுகளை புகாரளிக்கவும்.</li>
                 <li>தூய்மையை பராமரிக்கவும் (5S).</li>
               </ul>
            `,
          hi: `
              <ul class="list-decimal pl-5">
                <li>सुरक्षा नियमों का पालन करें।</li>
                <li>प्रशिक्षण के बाद ही काम करें।</li>
                <li>सुरक्षा नियमों का पालन करें।</li>
                <li>प्रशिक्षण के बाद ही काम करें।</li>
                <li>असुरक्षित परिस्थितियों की रिपोर्ट करें।</li>
              </ul>
              <div class="mt-4 flex justify-center">
                 <img src="${assets.rightsResponsibilities}" alt="Rights and Responsibilities" class="w-full max-w-lg rounded shadow border border-gray-200" />
              </div>
            `,
          te: `
              <ul class="list-decimal pl-5">
                <li>భద్రతా నియమాలను పాటించండి.</li>
                <li>శిక్షణ తర్వాత పని చేయండి.</li>
              </ul>
            `,
        },
      },
      {
        id: "step-1-3",
        type: "content",
        title: {
          en: "Housekeeping & 5S Methodology",
          ta: "\u0bb5\u0bc0\u0b9f\u0bcd\u0b9f\u0bc1 \u0baa\u0bb0\u0bbe\u0bae\u0bb0\u0bbf\u0baa\u0bcd\u0baa\u0bc1 & 5S \u0bae\u0bc1\u0bb1\u0bc8",
          hi: "\u0938\u093e\u092b-\u0938\u092b\u093e\u0908 \u0914\u0930 5S \u092a\u0926\u094d\u0927\u0924\u093f",
          te: "\u0c17\u0c43\u0c39 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23 & 5S \u0c2a\u0c26\u0c4d\u0c27\u0c24\u0c3f",
        },
        imageUrl: assets.housekeeping5s,
        content: {
          en: `
              <h3 class="text-lg font-bold text-blue-800 mb-4">Why is Housekeeping Important?</h3>
              <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-4">
                <p class="font-semibold">⚠️ Poor housekeeping causes 22% of all industrial accidents!</p>
                <p class="mt-2 text-sm">Cluttered workplaces lead to trips, falls, and unsafe conditions.</p>
              </div>

              <h4 class="font-bold text-lg mt-6 mb-3">The 5S Methodology</h4>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <div class="bg-red-100 p-4 rounded text-center border-t-4 border-red-600">
                  <div class="text-2xl font-bold text-red-700">1S</div>
                  <div class="font-semibold mt-2">SORT</div>
                  <div class="text-xs mt-1">Remove unnecessary items</div>
                </div>
                <div class="bg-orange-100 p-4 rounded text-center border-t-4 border-orange-600">
                  <div class="text-2xl font-bold text-orange-700">2S</div>
                  <div class="font-semibold mt-2">SET IN ORDER</div>
                  <div class="text-xs mt-1">A place for everything</div>
                </div>
                <div class="bg-yellow-100 p-4 rounded text-center border-t-4 border-yellow-600">
                  <div class="text-2xl font-bold text-yellow-700">3S</div>
                  <div class="font-semibold mt-2">SHINE</div>
                  <div class="text-xs mt-1">Clean workspace daily</div>
                </div>
                <div class="bg-green-100 p-4 rounded text-center border-t-4 border-green-600">
                  <div class="text-2xl font-bold text-green-700">4S</div>
                  <div class="font-semibold mt-2">STANDARDIZE</div>
                  <div class="text-xs mt-1">Make cleaning routine</div>
                </div>
                <div class="bg-blue-100 p-4 rounded text-center border-t-4 border-blue-600">
                  <div class="text-2xl font-bold text-blue-700">5S</div>
                  <div class="font-semibold mt-2">SUSTAIN</div>
                  <div class="text-xs mt-1">Maintain discipline</div>
                </div>
              </div>

              <h4 class="font-bold mt-6 mb-3">Daily Housekeeping Checklist</h4>
              <div class="bg-white p-4 border rounded shadow-sm">
                <ul class="space-y-2">
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Clear all walkways and exits</li>
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Return tools to designated places</li>
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Clean up spills immediately</li>
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Dispose of waste properly</li>
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Check fire extinguishers are accessible</li>
                  <li class="flex items-start"><span class="text-green-600 mr-2">✅</span> Report damaged equipment</li>
                </ul>
              </div>
            `,
          ta: `
              <h3>வீட்டு பராமரிப்பு ஏன் முக்கியம்?</h3>
              <p>மோசமான வீட்டு பராமரிப்பு அனைத்து தொழில்துறை விபத்துகளில் 22% ஏற்படுத்துகிறது!</p>
              <h4>5S வழிமுறை</h4>
              <ol>
                <li><strong>வரிசைப்படுத்து:</strong> தேவையற்றவற்றை அகற்று</li>
                <li><strong>ஒழுங்குபடுத்து:</strong> எல்லாவற்றிற்கும் ஒரு இடம்</li>
                <li><strong>சுத்தம்:</strong> தினசரி சுத்தம் செய்யுங்கள்</li>
                <li><strong>தரநிலைப்படுத்து:</strong> சுத்தம் வழக்கமாக்கு</li>
                <li><strong>நிலைத்திரு:</strong> ஒழுக்கத்தை பராமரிக்கவும்</li>
              </ol>
            `,
          hi: `
              <h3>साफ-सफाई क्यों महत्वपूर्ण है?</h3>
              <p>खराब साफ-सफाई सभी औद्योगिक दुर्घटनाओं में से 22% का कारण बनती है!</p>
              <h4>5S पद्धति</h4>
              <ol>
                <li><strong>छांटना:</strong> अनावश्यक वस्तुओं को हटाएं</li>
                <li><strong>क्रम में सेट करें:</strong> हर चीज के लिए एक जगह</li>
                <li><strong>चमक:</strong> दैनिक सफाई करें</li>
                <li><strong>मानकीकरण:</strong> सफाई को नियमित बनाएं</li>
                <li><strong>बनाए रखें:</strong> अनुशासन बनाए रखें</li>
              </ol>
            `,
          te: `
              <h3>గృహ నిర్వహణ ఎందుకు ముఖ్యమైనది?</h3>
              <p>పేలవమైన గృహ నిర్వహణ అన్ని పారిశ్రామిక ప్రమాదాలలో 22% కారణమవుతుంది!</p>
              <h4>5S పద్ధతి</h4>
              <ol>
                <li><strong>క్రమబద్ధీకరించండి:</strong> అనవసర వస్తువులను తొలగించండి</li>
                <li><strong>క్రమంలో ఉంచండి:</strong> ప్రతిదానికీ ఒక స్థలం</li>
                <li><strong>శుభ్రం:</strong> రోజువారీ శుభ్రం చేయండి</li>
                <li><strong>ప్రామాణికత:</strong> శుభ్రతను రొటీన్‌గా చేయండి</li>
                <li><strong>కొనసాగించండి:</strong> క్రమశిక్షణను నిర్వహించండి</li>
              </ol>
            `,
        },
      },
      {
        id: "step-1-4",
        type: "content",
        title: {
          en: "Our Safety Policy",
          ta: "\u0b8e\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8",
          hi: "\u0939\u092e\u093e\u0930\u0940 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0928\u0940\u0924\u093f",
          te: "\u0c2e\u0c3e \u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02",
        },
        imageUrl: assets.workerOrientation,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-800 mb-4">Safety First, Always</h3>
              <div class="bg-blue-50 p-6 rounded-lg text-center border border-blue-200 shadow-sm">
                <p class="text-xl font-serif italic text-blue-900 mb-4">"No production is worth a life."</p>
                <p class="mb-4">We are committed to providing a safe and healthy working environment for all employees, contractors, and visitors.</p>
                
                <h4 class="font-bold text-left mb-2 mt-6">Our Commitments:</h4>
                <ul class="text-left list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Zero Harm:</strong> We believe all accidents are preventable.</li>
                  <li><strong>Compliance:</strong> We follow all legal safety regulations strictly.</li>
                  <li><strong>Training:</strong> Every employee is trained to work safely.</li>
                  <li><strong>Reporting:</strong> Everyone has the authority to Stop Work if it is unsafe.</li>
                </ul>
              </div>
            `,
          ta: `
              <h3>எங்கள் பாதுகாப்பு கொள்கை</h3>
              <p>"எந்த உற்பத்தியும் ஒரு உயிருக்கு ஈடாகாது."</p>
              <ul>
                <li>விபத்துக்களை தடுக்க முடியும்.</li>
                <li>சட்ட விதிமுறைகளை பின்பற்றுகிறோம்.</li>
                <li>அனைவருக்கும் பாதுகாப்பு பயிற்சி.</li>
                <li>பாதுகாப்பற்ற வேலையை நிறுத்தும் அதிகாரம்.</li>
              </ul>
            `,
          hi: `
              <h3>हमारी सुरक्षा नीति</h3>
              <p>"कोई भी उत्पादन जीवन से बढ़कर नहीं है।"</p>
              <ul>
                <li>जीरो हार्म (Zero Harm) लक्ष्य।</li>
                <li>कानूनी नियमों का पालन।</li>
                <li>सभी के लिए प्रशिक्षण।</li>
                <li>असली काम को रोकने का अधिकार।</li>
              </ul>
            `,
          te: `
              <h3>మా భద్రతా విధానం</h3>
              <p>"ఏ ఉత్పత్తి ప్రాణం కంటే ఎక్కువ కాదు."</p>
              <ul>
                <li>అన్ని ప్రమాదాలను నివారించవచ్చు.</li>
                <li>చట్టపరమైన నిబంధనలను పాటించడం.</li>
                <li>అందరికీ శిక్షణ.</li>
                <li>సురక్షితం కాని పనిని ఆపే అధికారం.</li>
              </ul>
            `,
        },
      },
      {
        id: "step-1-quiz",
        type: "quiz",
        title: {
          en: "Module 1 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 1 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 1 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 1 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Test your understanding of Safety Culture.",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b95\u0bb2\u0bbe\u0b9a\u0bcd\u0b9a\u0bbe\u0bb0\u0bae\u0bcd \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0baa\u0bc1\u0bb0\u0bbf\u0ba4\u0bb2\u0bc8 \u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0938\u0902\u0938\u094d\u0915\u0943\u0924\u093f \u0915\u0940 \u0905\u092a\u0928\u0940 \u0938\u092e\u091d \u0915\u093e \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c38\u0c02\u0c38\u0c4d\u0c15\u0c43\u0c24\u0c3f\u0c2a\u0c48 \u0c2e\u0c40 \u0c05\u0c35\u0c17\u0c3e\u0c39\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c40\u0c15\u0c4d\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-002",
    title: {
      en: "Industrial Hazards",
      ta: "\u0ba4\u0bca\u0bb4\u0bbf\u0bb2\u0bcd\u0ba4\u0bc1\u0bb1\u0bc8 \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd",
      hi: "\u0914\u0926\u094d\u092f\u094b\u0917\u093f\u0915 \u0916\u0924\u0930\u0947",
      te: "\u0c2a\u0c3e\u0c30\u0c3f\u0c36\u0c4d\u0c30\u0c3e\u0c2e\u0c3f\u0c15 \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c41",
    },
    description: {
      en: "Identify -> Assess -> Control",
      ta: "\u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd -> \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1 -> \u0b95\u0b9f\u0bcd\u0b9f\u0bc1\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1",
      hi: "\u092a\u0939\u091a\u093e\u0928\u0947\u0902 -> \u0906\u0915\u0932\u0928 -> \u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923",
      te: "\u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f -> \u0c05\u0c02\u0c1a\u0c28\u0c3e -> \u0c28\u0c3f\u0c2f\u0c02\u0c24\u0c4d\u0c30\u0c23",
    },
    category: "Occupational Health",
    estimatedTime: "20 min",
    icon: "AlertTriangle",
    thumbnail: assets.hazard,
    steps: [
      {
        id: "step-2-1",
        type: "content",
        title: {
          en: "Home vs Industry Hazards",
          ta: "\u0bb5\u0bc0\u0b9f\u0bc1 \u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd \u0ba4\u0bca\u0bb4\u0bbf\u0bb2\u0bcd\u0ba4\u0bc1\u0bb1\u0bc8 \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd",
          hi: "\u0918\u0930 \u0914\u0930 \u0909\u0926\u094d\u092f\u094b\u0917 \u0915\u0947 \u0916\u0924\u0930\u0947",
          te: "\u0c07\u0c32\u0c4d\u0c32\u0c41 vs \u0c2a\u0c30\u0c3f\u0c36\u0c4d\u0c30\u0c2e \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c41",
        },
        content: {
          en: `
              <table class="w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">Parameter</th>
                    <th class="border p-2">Home (Low Risk)</th>
                    <th class="border p-2">Industry (High Risk)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border p-2"><strong>Fire</strong></td>
                    <td class="border p-2">1-2 LPG cylinders</td>
                    <td class="border p-2">Large quantities of burning materials</td>
                  </tr>
                  <tr>
                    <td class="border p-2"><strong>Electricity</strong></td>
                    <td class="border p-2">220V AC (Low)</td>
                    <td class="border p-2">11KV (High Voltage)</td>
                  </tr>
                  <tr>
                    <td class="border p-2"><strong>Machinery</strong></td>
                    <td class="border p-2">Less hazardous (mixers, fans)</td>
                    <td class="border p-2">Dangerous heavy machinery</td>
                  </tr>
                </tbody>
              </table>
            `,
          ta: `
               <table class="w-full border-collapse border border-gray-300">
                 <thead>
                   <tr class="bg-gray-100">
                     <th class="border p-2">அளவுரு</th>
                     <th class="border p-2">வீடு (குறைந்த ஆபத்து)</th>
                     <th class="border p-2">தொழிற்சாலை (அதிக ஆபத்து)</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td class="border p-2"><strong>தீ</strong></td>
                     <td class="border p-2">1-2 LPG சிலிண்டர்கள்</td>
                     <td class="border p-2">அதிக அளவு எரியக்கூடிய பொருட்கள்</td>
                   </tr>
                   <tr>
                     <td class="border p-2"><strong>மின்சாரம்</strong></td>
                     <td class="border p-2">220V AC</td>
                     <td class="border p-2">11KV (உயர் மின்னழுத்தம்)</td>
                   </tr>
                 </tbody>
               </table>
            `,
          hi: `
              <p>उद्योग में घर की तुलना में अधिक जोखिम होता है।</p>
            `,
          te: `
              <p>పరిశ్రమలో ఇంటి కంటే ఎక్కువ ప్రమాదం ఉంది.</p>
            `,
        },
      },
      {
        id: "step-2-2",
        type: "content",
        title: {
          en: "5 Steps to Safety",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbf\u0bb1\u0bcd\u0b95\u0bbe\u0ba9 5 \u0baa\u0b9f\u0bbf\u0b95\u0bb3\u0bcd",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0915\u0947 5 \u091a\u0930\u0923",
          te: "\u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c15\u0c41 5 \u0c26\u0c36\u0c32\u0c41",
        },
        content: {
          en: `
                <div class="flex flex-col space-y-2">
                <img src="/assets/generated/hazard_symbols_grid_1766741715124.png" alt="Common Hazard Symbols" class="w-full max-w-sm mx-auto mb-4 rounded shadow-md border border-gray-200" />
                <div class="bg-blue-100 p-3 rounded flex items-center"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">1</div>Identify the Hazard</div>
                <div class="bg-blue-100 p-3 rounded flex items-center"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">2</div>Assess the Risk</div>
                <div class="bg-blue-100 p-3 rounded flex items-center"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">3</div>Control the Risk</div>
                <div class="bg-blue-100 p-3 rounded flex items-center"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">4</div>Practice Safe Work</div>
                <div class="bg-blue-100 p-3 rounded flex items-center"><div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">5</div>Report Issues</div>
                <div class="mt-4 p-4 bg-red-50 rounded border-l-4 border-red-500">
                   <h4 class="font-bold text-red-900 mb-2">Heat Stress Awareness</h4>
                   <div class="flex flex-col md:flex-row gap-4 items-center">
                      <img src="${assets.heatExhaustion}" alt="Heat Exhaustion Symptoms" class="w-32 rounded shadow" />
                      <div>
                        <p class="text-sm"><strong>Symptoms:</strong> Dizziness, Heavy Sweating, Weakness.</p>
                        <p class="text-xs mt-1">Stay hydrated and take breaks in cool areas.</p>
                      </div>
                   </div>
                </div>
              </div>
            `,
          ta: `
               <ol class="list-decimal pl-5">
                 <li>ஆபத்தை அடையாளம் காணவும்</li>
                 <li>ஆபத்தை மதிப்பிடவும்</li>
                 <li>ஆபத்தை கட்டுப்படுத்தவும்</li>
                 <li>பாதுகாப்பாக வேலை செய்யவும்</li>
                 <li>சிக்கல்களைப் புகாரளிக்கவும்</li>
               </ol>
            `,
          hi: `
              <p>खतरे को पहचानें, आकलन करें और नियंत्रित करें।</p>
            `,
          te: `
              <p>ప్రమాదాన్ని గుర్తించండి, అంచనా వేయండి మరియు నియంత్రించండి.</p>
            `,
        },
      },
      {
        id: "step-2-3",
        type: "content",
        title: {
          en: "Slip, Trip & Fall Prevention",
          ta: "\u0bb5\u0bb4\u0bc1\u0b95\u0bcd\u0b95\u0bb2\u0bcd, \u0ba4\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0bb2\u0bcd & \u0bb5\u0bbf\u0bb4\u0bc1\u0ba4\u0bb2\u0bcd \u0ba4\u0b9f\u0bc1\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u092b\u093f\u0938\u0932\u0928\u093e, \u0920\u094b\u0915\u0930 \u0914\u0930 \u0917\u093f\u0930\u093e\u0935\u091f \u0915\u0940 \u0930\u094b\u0915\u0925\u093e\u092e",
          te: "\u0c1c\u0c3e\u0c30\u0c21\u0c02, \u0c24\u0c4a\u0c32\u0c17\u0c3f\u0c02\u0c1a\u0c21\u0c02 & \u0c2a\u0c24\u0c28\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c23",
        },
        imageUrl: assets.slipTrip,
        content: {
          en: `
              <h3 class="text-lg font-bold text-red-800 mb-4">⚠️ #1 Cause of Workplace Injuries</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">Slips, trips, and falls account for 30% of all workplace accidents!</p>
                <p class="mt-2 text-sm">These "simple" accidents can cause serious injuries including fractures, sprains, and head trauma.</p>
              </div>

              <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-bold text-blue-800 mb-2">🔵 SLIPS</h4>
                  <p class="text-sm mb-2"><strong>Cause:</strong> Loss of traction between foot and floor</p>
                  <ul class="text-sm space-y-1">
                    <li>• Wet/oily surfaces</li>
                    <li>• Smooth floors</li>
                    <li>• Loose mats</li>
                    <li>• Weather (rain, ice)</li>
                  </ul>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                  <h4 class="font-bold text-orange-800 mb-2">🔶 TRIPS</h4>
                  <p class="text-sm mb-2"><strong>Cause:</strong> Foot strikes an object</p>
                  <ul class="text-sm space-y-1">
                    <li>• Uneven surfaces</li>
                    <li>• Cables/hoses</li>
                    <li>• Poor lighting</li>
                    <li>• Clutter</li>
                  </ul>
                </div>
              </div>

              <h4 class="font-bold text-lg mb-3">Prevention Measures</h4>
              <div class="space-y-2 mb-4">
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>✓ Clean Spills Immediately</strong> - Don't walk past them!
                </div>
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>✓ Use Warning Signs</strong> - Place "Wet Floor" signs
                </div>
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>✓ Keep Walkways Clear</strong> - No obstructions
                </div>
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>✓ Wear Proper Footwear</strong> - Anti-slip shoes
                </div>
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>✓ Report Hazards</strong> - Damaged floors, poor lighting
                </div>
              </div>

              <div class="bg-yellow-100 p-4 rounded border border-yellow-500">
                <p class="font-semibold">💡 Remember: "If you see it, fix it or report it!"</p>
                <p class="text-sm mt-1">Don't assume someone else will handle it.</p>
              </div>
            `,
          ta: `
              <h3>வழுக்கல், தடுக்கல் & விழுதல் தடுப்பு</h3>
              <p class="font-semibold">வழுக்கல், தடுக்கல் மற்றும் விழுதல் அனைத்து பணியிட விபத்துகளில் 30% ஆகும்!</p>
              <h4>வழுக்கல்</h4>
              <ul>
                <li>ஈரமான/எண்ணெய் பரப்புகள்</li>
                <li>மென்மையான தளங்கள்</li>
              </ul>
              <h4>தடுப்பு</h4>
              <ul>
                <li>உடனடியாக சிந்தல்களை சுத்தம் செய்யுங்கள்</li>
                <li>வழுக்கல் எதிர்ப்பு காலணிகளை அணியுங்கள்</li>
                <li>பாதைகளை தெளிவாக வைக்கவும்</li>
              </ul>
            `,
          hi: `
              <h3>फिसलना, ठोकर और गिरावट की रोकथाम</h3>
              <p class="font-semibold">फिसलना, ठोकर और गिरना सभी कार्यस्थल दुर्घटनाओं का 30% है!</p>
              <h4>फिसलना</h4>
              <ul>
                <li>गीली/तैलीय सतहें</li>
                <li>चिकनी फर्श</li>
              </ul>
              <h4>रोकथाम</h4>
              <ul>
                <li>रिसाव को तुरंत साफ करें</li>
                <li>एंटी-स्लिप जूते पहनें</li>
                <li>रास्ते साफ रखें</li>
              </ul>
            `,
          te: `
              <h3>జారడం, తొలగించడం & పతనాన్ని నివారణ</h3>
              <p class="font-semibold">జారడం, తొలగించడం మరియు పడటం అన్ని కార్యాలయ ప్రమాదాలలో 30%!</p>
              <h4>జారడం</h4>
              <ul>
                <li>తడి/నూనె ఉపరితలాలు</li>
                <li>మృదువైన అంతస్తులు</li>
              </ul>
              <h4>నివారణ</h4>
              <ul>
                <li>చిందిన వాటిని వెంటనే శుభ్రం చేయండి</li>
                <li>యాంటీ-స్లిప్ బూట్లు ధరించండి</li>
                <li>నడక మార్గాలను క్లియర్‌గా ఉంచండి</li>
              </ul>
            `,
        },
      },
      {
        id: "step-2-4",
        type: "content",
        title: {
          en: "Risk Assessment Matrix",
          ta: "\u0b87\u0b9f\u0bb0\u0bcd \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bcd\u0b9f\u0bc1 \u0b85\u0ba3\u0bbf",
          hi: "\u091c\u094b\u0916\u093f\u092e \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928 \u092e\u0948\u091f\u094d\u0930\u093f\u0915\u094d\u0938",
          te: "\u0c30\u0c3f\u0c38\u0c4d\u0c15\u0c4d \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d \u0c2e\u0c4d\u0c2f\u0c3e\u0c1f\u0c4d\u0c30\u0c3f\u0c15\u0c4d\u0c38\u0c4d",
        },
        imageUrl: assets.hazard,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-800 mb-4">How to Measure Risk?</h3>
              <p class="mb-4">Risk is calculated as: <strong>Risk = Probability x Severity</strong></p>

              <div class="overflow-x-auto mb-6">
                <table class="w-full text-center border text-xs md:text-sm">
                  <thead>
                    <tr>
                      <th class="p-2 border bg-gray-100">Probability ⬇️ / Severity ➡️</th>
                      <th class="p-2 border bg-green-100">Low (1)</th>
                      <th class="p-2 border bg-yellow-100">Medium (2)</th>
                      <th class="p-2 border bg-red-100">High (3)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="p-2 border bg-gray-50 font-bold">Unlikely (1)</td>
                      <td class="p-2 border bg-green-200">1 (Low)</td>
                      <td class="p-2 border bg-green-200">2 (Low)</td>
                      <td class="p-2 border bg-yellow-200">3 (Med)</td>
                    </tr>
                    <tr>
                      <td class="p-2 border bg-gray-50 font-bold">Likely (2)</td>
                      <td class="p-2 border bg-green-200">2 (Low)</td>
                      <td class="p-2 border bg-yellow-200">4 (Med)</td>
                      <td class="p-2 border bg-red-200 font-bold">6 (High)</td>
                    </tr>
                    <tr>
                      <td class="p-2 border bg-gray-50 font-bold">Certain (3)</td>
                      <td class="p-2 border bg-yellow-200">3 (Med)</td>
                      <td class="p-2 border bg-red-200 font-bold">6 (High)</td>
                      <td class="p-2 border bg-red-500 text-white font-bold">9 (Critical)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="bg-blue-50 p-4 rounded text-sm border-l-4 border-blue-500">
                <strong>Control Measures (Hierarchy):</strong>
                <ol class="list-decimal pl-5 mt-2">
                  <li>Elimination (Remove hazard)</li>
                  <li>Substitution (Replace hazard)</li>
                  <li>Engineering Controls (Isolate hazard)</li>
                  <li>Administrative Controls (Change work)</li>
                  <li>PPE (Protect worker)</li>
                </ol>
              </div>
            `,
          ta: `
              <h3>இடர் மதிப்பீடு கணிப்பு</h3>
              <p>இடர் = நிகழ்தகவு x தீவிரம்</p>
              <table>
                <tr><td>குறைந்த (1-2)</td><td>பாதுகாப்பானது</td></tr>
                <tr><td>நடுத்தர (3-4)</td><td>கவனம் தேவை</td></tr>
                <tr><td>அதிக (6-9)</td><td>வேலையை நிறுத்தவும்</td></tr>
              </table>
            `,
          hi: `
              <h3>जोखिम मूल्यांकन</h3>
              <p>जोखिम = संभावना x गंभीरता</p>
              <table>
                <tr><td>कम (1-2)</td><td>सुरक्षित</td></tr>
                <tr><td>मध्यम (3-4)</td><td>सावधानी बरतें</td></tr>
                <tr><td>उच्च (6-9)</td><td>काम रोकें</td></tr>
              </table>
            `,
          te: `
              <h3>రిస్క్ అంచనా</h3>
              <p>రిస్క్ = సంభావ్యత x తీవ్రత</p>
              <table>
                <tr><td>తక్కువ (1-2)</td><td>సురక్షితం</td></tr>
                <tr><td>మధ్యస్తం (3-4)</td><td>జాగ్రత్త</td></tr>
                <tr><td>ఎక్కువ (6-9)</td><td>పని ఆపు</td></tr>
              </table>
            `,
        },
      },
      {
        id: "step-2-interactive",
        type: "interactive",
        title: {
          en: "Spot the Hazard - Exercise 1",
          ta: "\u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc8 \u0b95\u0ba3\u0bcd\u0b9f\u0bc1\u0baa\u0bbf\u0b9f\u0bbf - \u0baa\u0baf\u0bbf\u0bb1\u0bcd\u0b9a\u0bbf 1",
          hi: "\u0916\u0924\u0930\u0947 \u0915\u094b \u092a\u0939\u091a\u093e\u0928\u0947\u0902 - \u0905\u092d\u094d\u092f\u093e\u0938 1",
          te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f - \u0c35\u0c4d\u0c2f\u0c3e\u0c2f\u0c3e\u0c2e\u0c02 1",
        },
        interactive: {
          image: assets.oilPuddle,
          hazards: [
            {
              id: "h1",
              x: 20,
              y: 75,
              description: {
                en: "Oil Spill - Slip Hazard",
                ta: "\u0b8e\u0ba3\u0bcd\u0ba3\u0bc6\u0baf\u0bcd \u0b95\u0b9a\u0bbf\u0bb5\u0bc1 - \u0bb5\u0bb4\u0bc1\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1",
                hi: "\u0924\u0947\u0932 \u0930\u093f\u0938\u093e\u0935",
                te: "\u0c28\u0c42\u0c28\u0c46 \u0c1a\u0c3f\u0c02\u0c26\u0c1f\u0c02",
              },
            },
            {
              id: "h2",
              x: 45,
              y: 30,
              description: {
                en: "Blocked Fire Extinguisher",
                ta: "\u0ba4\u0bc0\u0baf\u0ba3\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0ba9\u0bcd \u0ba4\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0bc1\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1",
                hi: "\u0905\u0935\u0930\u0941\u0926\u094d\u0927 \u0905\u0917\u094d\u0928\u093f\u0936\u093e\u092e\u0915",
                te: "\u0c2b\u0c48\u0c30\u0c4d \u0c0e\u0c15\u0c4d\u0c38\u0c4d\u200c\u0c1f\u0c3f\u0c02\u0c17\u0c4d\u0c35\u0c3f\u0c37\u0c30\u0c4d \u0c2c\u0c4d\u0c32\u0c3e\u0c15\u0c4d \u0c1a\u0c47\u0c2f\u0c2c\u0c21\u0c3f\u0c02\u0c26\u0c3f",
              },
            },
            {
              id: "h3",
              x: 80,
              y: 60,
              description: {
                en: "Trailing Cables - Trip Hazard",
                ta: "\u0b95\u0bc7\u0baa\u0bbf\u0bb3\u0bcd\u0b95\u0bb3\u0bcd - \u0ba4\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1",
                hi: "\u092c\u093f\u0916\u0930\u0947 \u0939\u0941\u090f \u0924\u093e\u0930",
                te: "\u0c15\u0c47\u0c2c\u0c41\u0c32\u0c4d\u0c38\u0c4d",
              },
            },
          ],
        },
        content: {
          en: "Click on 3 hazards: Oil Spill, Blocked Extinguisher, Trailing Cable.",
          ta: "3 \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bc8\u0b95\u0bcd \u0b95\u0bbf\u0bb3\u0bbf\u0b95\u0bcd \u0b9a\u0bc6\u0baf\u0bcd\u0baf\u0bb5\u0bc1\u0bae\u0bcd: \u0b8e\u0ba3\u0bcd\u0ba3\u0bc6\u0baf\u0bcd \u0b95\u0b9a\u0bbf\u0bb5\u0bc1, \u0ba4\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0ba4\u0bc0\u0baf\u0ba3\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0ba9\u0bcd, \u0b95\u0bc7\u0baa\u0bbf\u0bb3\u0bcd.",
          hi: "3 \u0916\u0924\u0930\u094b\u0902 \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902: \u0924\u0947\u0932 \u0930\u093f\u0938\u093e\u0935, \u0905\u0935\u0930\u0941\u0926\u094d\u0927 \u0905\u0917\u094d\u0928\u093f\u0936\u093e\u092e\u0915, \u0915\u0947\u092c\u0932\u0964",
          te: "3 \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c2a\u0c48 \u0c15\u0c4d\u0c32\u0c3f\u0c15\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.",
        },
      },
      {
        id: "step-2-quiz",
        type: "interactive",
        interactive: {
          image: assets.quizBlockedExit,
          hazards: [
            {
              id: "q1",
              x: 50,
              y: 50,
              description: {
                en: "Blocked Emergency Exit",
                ta: "\u0ba4\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0b85\u0bb5\u0b9a\u0bb0 \u0b95\u0bbe\u0bb2 \u0bb5\u0bb4\u0bbf",
                hi: "\u0905\u0935\u0930\u0941\u0926\u094d\u0927 \u0928\u093f\u0915\u093e\u0938",
                te: "\u0c28\u0c3f\u0c30\u0c4b\u0c27\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c28\u0c3f\u0c37\u0c4d\u0c15\u0c4d\u0c30\u0c2e\u0c23",
              },
            },
          ],
        },
        title: {
          en: "Module 2 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 2 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 2 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 2 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Identify the hazard in this image.",
          ta: "\u0b87\u0ba8\u0bcd\u0ba4 \u0baa\u0b9f\u0ba4\u0bcd\u0ba4\u0bbf\u0bb2\u0bcd \u0b89\u0bb3\u0bcd\u0bb3 \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc8 \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd \u0b95\u0bbe\u0ba3\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0907\u0938 \u091b\u0935\u093f \u092e\u0947\u0902 \u0916\u0924\u0930\u0947 \u0915\u094b \u092a\u0939\u091a\u093e\u0928\u0947\u0902\u0964",
          te: "\u0c08 \u0c1a\u0c3f\u0c24\u0c4d\u0c30\u0c02\u0c32\u0c4b \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-003",
    title: {
      en: "Accidents & Theories",
      ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bb3\u0bcd & \u0b95\u0bcb\u0b9f\u0bcd\u0baa\u0bbe\u0b9f\u0bc1\u0b95\u0bb3\u0bcd",
      hi: "\u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e\u090f\u0902 \u0914\u0930 \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924",
      te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c41 & \u0c38\u0c3f\u0c26\u0c4d\u0c27\u0c3e\u0c02\u0c24\u0c3e\u0c32\u0c41",
    },
    description: {
      en: "Why accidents happen? Heinrich Triangle",
      ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bb3\u0bcd \u0b8f\u0ba9\u0bcd \u0ba8\u0b9f\u0b95\u0bcd\u0b95\u0bbf\u0ba9\u0bcd\u0bb1\u0ba9?",
      hi: "\u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e\u090f\u0902 \u0915\u094d\u092f\u094b\u0902 \u0939\u094b\u0924\u0940 \u0939\u0948\u0902?",
      te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c41 \u0c0e\u0c02\u0c26\u0c41\u0c15\u0c41 \u0c1c\u0c30\u0c41\u0c17\u0c41\u0c24\u0c3e\u0c2f\u0c3f?",
    },
    category: "General Safety",
    estimatedTime: "20 min",
    icon: "Activity",
    thumbnail: assets.slipTrip,
    steps: [
      {
        id: "step-3-1",
        type: "content",
        title: {
          en: "Types of Accidents",
          ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1 \u0bb5\u0b95\u0bc8\u0b95\u0bb3\u0bcd",
          hi: "\u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e\u0913\u0902 \u0915\u0947 \u092a\u094d\u0930\u0915\u093e\u0930",
          te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c30\u0c15\u0c3e\u0c32\u0c41",
        },
        content: {
          en: `
              <div class="space-y-6">
                <h3 class="text-xl font-bold text-center mb-6">Industrial Accident Classification</h3>
                
                <!-- Staircase Visual -->
                <div class="flex flex-col items-center md:flex-row md:items-end justify-center gap-2 mb-8">
                  <div class="bg-yellow-300 p-2 text-center text-xs font-bold rounded shadow w-full md:w-24 h-16 flex items-center justify-center">Near Miss</div>
                  <div class="bg-orange-300 p-2 text-center text-xs font-bold rounded shadow w-full md:w-24 h-24 flex items-center justify-center">Incident</div>
                  <div class="bg-orange-500 p-2 text-center text-xs font-bold rounded shadow w-full md:w-24 h-32 flex items-center justify-center text-white">Minor</div>
                  <div class="bg-red-500 p-2 text-center text-xs font-bold rounded shadow w-full md:w-24 h-40 flex items-center justify-center text-white">Major</div>
                  <div class="bg-red-700 p-2 text-center text-xs font-bold rounded shadow w-full md:w-24 h-48 flex items-center justify-center text-white">Fatal</div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto shadow-lg rounded-lg">
                  <table class="w-full text-sm text-left border-collapse">
                    <thead class="text-xs text-white uppercase bg-slate-700">
                      <tr>
                        <th class="px-6 py-3">Type</th>
                        <th class="px-6 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-white border-b hover:bg-gray-50">
                        <td class="px-6 py-4 font-bold text-yellow-600">1. Near Miss</td>
                        <td class="px-6 py-4">Possibility of injury but <strong>NO</strong> human injury occurred.<br><span class="text-xs text-gray-500 italic">Ex: A hammer falls just beside a worker.</span></td>
                      </tr>
                      <tr class="bg-gray-50 border-b hover:bg-gray-100">
                        <td class="px-6 py-4 font-bold text-orange-400">2. Incident</td>
                        <td class="px-6 py-4">Employee returns to work within a few hours. First aid may be given, but no medical treatment required.</td>
                      </tr>
                      <tr class="bg-white border-b hover:bg-gray-50">
                        <td class="px-6 py-4 font-bold text-orange-600">3. Minor</td>
                        <td class="px-6 py-4">Employee returns to work within 48 hours. Small cut or bruise requiring a bandage.</td>
                      </tr>
                      <tr class="bg-gray-50 border-b hover:bg-gray-100">
                        <td class="px-6 py-4 font-bold text-red-600">4. Major (Reportable)</td>
                        <td class="px-6 py-4">Employee cannot return within 48 hours (assumed 21 days). Fracture, deep cut requiring surgery.</td>
                      </tr>
                      <tr class="bg-red-50 border-b hover:bg-red-100">
                        <td class="px-6 py-4 font-bold text-red-800">5. Fatal</td>
                        <td class="px-6 py-4">Death or Permanent Disablement.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            `,
          ta: `
               <div class="space-y-6">
                 <h3 class="text-xl font-bold text-center mb-6">விபத்து வகைப்பாடு</h3>
                 
                 <div class="overflow-x-auto shadow-lg rounded-lg">
                   <table class="w-full text-sm text-left border-collapse">
                     <thead class="text-xs text-white uppercase bg-slate-700">
                       <tr>
                         <th class="px-6 py-3">வகை</th>
                         <th class="px-6 py-3">விளக்கம்</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr class="bg-white border-b">
                         <td class="px-6 py-4 font-bold text-yellow-600">1. நூலிழை (Near Miss)</td>
                         <td class="px-6 py-4">காயம் ஏற்பட வாய்ப்பு ஆனால் காயம் இல்லை.</td>
                       </tr>
                       <tr class="bg-gray-50 border-b">
                         <td class="px-6 py-4 font-bold text-orange-400">2. சம்பவம் (Incident)</td>
                         <td class="px-6 py-4">சில மணிநேரங்களில் வேலைக்கு திரும்பலாம்.</td>
                       </tr>
                       <tr class="bg-white border-b">
                         <td class="px-6 py-4 font-bold text-orange-600">3. சிறிய காயம் (Minor)</td>
                         <td class="px-6 py-4">48 மணி நேரத்திற்குள் வேலைக்கு திரும்புதல்.</td>
                       </tr>
                       <tr class="bg-gray-50 border-b">
                         <td class="px-6 py-4 font-bold text-red-600">4. பெரிய காயம் (Major)</td>
                         <td class="px-6 py-4">எலும்பு முறிவு அல்லது அறுவை சிகிச்சை தேவை.</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
            `,
          hi: `
              <h3>दुर्घटना के प्रकार</h3>
              <p>विस्तृत विवरण नीचे दी गई तालिका में है।</p>
            `,
          te: `
              <h3>ప్రమాద రకాలు</h3>
              <p>వివరాలు పట్టికలో ఉన్నాయి.</p>
            `,
        },
      },
      {
        id: "step-3-2",
        type: "content",
        title: {
          en: "Heinrich Triangle Theory",
          ta: "\u0bb9\u0bc6\u0baf\u0bcd\u0ba9\u0bcd\u0bb0\u0bbf\u0b9a\u0bcd \u0bae\u0bc1\u0b95\u0bcd\u0b95\u0bcb\u0ba3 \u0b95\u0bcb\u0b9f\u0bcd\u0baa\u0bbe\u0b9f\u0bc1",
          hi: "\u0939\u0947\u0928\u0930\u093f\u0915 \u0924\u094d\u0930\u093f\u0915\u094b\u0923 \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924",
          te: "\u0c39\u0c46\u0c28\u0c4d\u0c30\u0c3f\u0c1a\u0c4d \u0c24\u0c4d\u0c30\u0c3f\u0c2d\u0c41\u0c1c \u0c38\u0c3f\u0c26\u0c4d\u0c27\u0c3e\u0c02\u0c24\u0c02",
        },
        content: {
          en: `
              <div class="flex flex-col items-center">
                <h3 class="text-xl font-bold mb-4">Heinrich's Safety Pyramid</h3>
                
                <div class="relative flex flex-col items-center justify-center my-8">
                  <!-- Level 1 -->
                  <div class="z-40 w-24 h-16 bg-red-600 text-white flex flex-col items-center justify-center shadow-lg clip-triangle-top text-center p-1">
                    <span class="text-2xl font-bold">1</span>
                    <span class="text-xs">Major</span>
                  </div>
                  <!-- Level 2 -->
                  <div class="z-30 w-48 h-12 bg-orange-500 text-white flex items-center justify-center shadow-md -mt-1">
                    <span class="font-bold mr-2">29</span> <span class="text-sm">Minor Injuries</span>
                  </div>
                  <!-- Level 3 -->
                  <div class="z-20 w-72 h-12 bg-yellow-400 text-black flex items-center justify-center shadow-md -mt-1">
                    <span class="font-bold mr-2">300</span> <span class="text-sm">Incidents</span>
                  </div>
                  <!-- Level 4 -->
                  <div class="z-10 w-96 h-12 bg-green-500 text-white flex items-center justify-center shadow-md -mt-1 rounded-b-lg">
                    <span class="font-bold mr-2">3000</span> <span class="text-sm">Near Misses / Unsafe Acts</span>
                  </div>
                </div>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded max-w-2xl w-full">
                  <h4 class="text-blue-800 font-bold mb-2">The Lesson:</h4>
                  <p class="text-blue-900 mb-2">We cannot prevent the <strong>1 Major Accident</strong> directly.</p>
                  <p class="text-blue-900">We MUST reduce the <strong>3000 Unsafe Acts</strong> at the bottom. If the bottom of the pyramid shrinks, the top disappears!</p>
                </div>
              </div>
            `,
          ta: `
               <div class="flex flex-col items-center">
                 <h3 class="text-xl font-bold mb-4">ஹெய்ன்ரிச் பிரமிட்</h3>
                 <p class="font-bold text-center mb-4">1 பெரிய விபத்திற்கு 29 சிறிய காயங்களும், 300 சம்பவங்களும் முன்னதாக நடக்கின்றன.</p>
                 <div class="bg-blue-50 p-4 rounded border border-blue-200">
                   <strong>பாடம்:</strong> பெரிய விபத்துக்களைத் தடுக்க, நாம் பாதுகாப்பற்ற செயல்களை (Unsafe Acts) குறைக்க வேண்டும்.
                 </div>
               </div>
            `,
          hi: `
              <p>हाइनरिक का सिद्धांत: 1 बड़ी दुर्घटना के पीछे 3000 असुरक्षित कार्य होते हैं।</p>
            `,
          te: `
              <p>హెన్రిచ్ సిద్ధాంతం: 1 పెద్ద ప్రమాదానికి వెనుక 3000 సురక్షితం కాని పనులు ఉంటాయి.</p>
            `,
        },
      },
      {
        id: "step-3-3",
        type: "content",
        title: {
          en: "Why Accidents Happen?",
          ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bb3\u0bcd \u0b8f\u0ba9\u0bcd \u0ba8\u0b9f\u0b95\u0bcd\u0b95\u0bbf\u0ba9\u0bcd\u0bb1\u0ba9?",
          hi: "\u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e\u090f\u0902 \u0915\u094d\u092f\u094b\u0902 \u0939\u094b\u0924\u0940 \u0939\u0948\u0902?",
          te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c32\u0c41 \u0c0e\u0c02\u0c26\u0c41\u0c15\u0c41 \u0c1c\u0c30\u0c41\u0c17\u0c41\u0c24\u0c3e\u0c2f\u0c3f?",
        },
        content: {
          en: `
              <div class="flex flex-col items-center">
                <h3>Root Causes of Accidents</h3>
                <div class="flex flex-col items-center w-full max-w-2xl mt-4">
                  <div class="border-2 border-slate-800 bg-red-100 p-4 rounded-lg font-bold text-xl text-center w-48 shadow-lg">ACCIDENT</div>
                  <div class="h-8 w-1 bg-slate-800"></div>
                  <div class="flex w-full justify-center relative">
                    <div class="border-t-4 border-slate-800 w-1/2 h-4 absolute top-0"></div>
                    <div class="flex flex-col items-center w-1/2 px-2 pt-4">
                      <div class="h-4 w-1 bg-slate-800 absolute top-0 left-1/4"></div>
                      <div class="bg-amber-100 border-2 border-amber-600 p-4 rounded shadow-md w-full text-center">
                        <h4 class="font-bold text-amber-800">UNSAFE CONDITIONS (12%)</h4>
                        <p class="text-xs mt-1">Situations (Unguarded, Wet Floor)</p>
                      </div>
                    </div>
                    <div class="flex flex-col items-center w-1/2 px-2 pt-4">
                      <div class="h-4 w-1 bg-slate-800 absolute top-0 right-1/4"></div>
                      <div class="bg-red-50 border-2 border-red-600 p-4 rounded shadow-md w-full text-center">
                        <h4 class="font-bold text-red-800">UNSAFE ACTS (88%)</h4>
                        <p class="text-xs mt-1">Human Behavior (Bypassing, No PPE)</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-8 text-center bg-blue-50 p-4 rounded border border-blue-200">
                    <p class="text-blue-800 font-bold">Conclusion: 88% of accidents are caused by Human Acts!</p>
                  </div>
                </div>
              </div>
            `,
          ta: `
               <p>88% விபத்துக்கள் பாதுகாப்பற்ற செயல்களால் (மனித தவறு) ஏற்படுகின்றன.</p>
            `,
          hi: `
              <p>88% दुर्घटनाएं मानवीय गलती (असुरक्षित कार्य) के कारण होती हैं।</p>
            `,
          te: `
              <p>88% ప్రమాదాలు మనిషి తప్పుల వల్ల జరుగుతాయి.</p>
            `,
        },
      },
      {
        id: "step-3-4",
        type: "content",
        title: {
          en: "Hierarchy of Controls",
          ta: "\u0b95\u0b9f\u0bcd\u0b9f\u0bc1\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bcd\u0b9f\u0bc1 \u0baa\u0b9f\u0bbf\u0ba8\u0bbf\u0bb2\u0bc8",
          hi: "\u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923 \u092a\u0926\u093e\u0928\u0941\u0915\u094d\u0930\u092e",
          te: "\u0c28\u0c3f\u0c2f\u0c02\u0c24\u0c4d\u0c30\u0c23\u0c32 \u0c15\u0c4d\u0c30\u0c2e\u0c3e\u0c28\u0c41\u0c17\u0c24 \u0c30\u0c42\u0c2a\u0c02",
        },
        imageUrl: assets.hierarchy,
        content: {
          en: `
              <h3 class="text-lg font-bold text-purple-800 mb-4">The Most Effective Way to Control Hazards</h3>
              <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600 mb-6">
                <p class="font-semibold">Not all safety measures are equally effective!</p>
                <p class="text-sm mt-2">The Hierarchy of Controls ranks methods from MOST to LEAST effective.</p>
              </div>

              <div class="space-y-3">
                <div class="bg-green-600 text-white p-4 rounded-lg shadow-lg">
                  <div class="flex items-center mb-2">
                    <div class="bg-white text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">1</div>
                    <h4 class="font-bold text-lg">ELIMINATION</h4>
                  </div>
                  <p class="text-sm pl-11">Remove the hazard completely</p>
                  <p class="text-xs pl-11 mt-1 italic">Example: Automate a dangerous manual task</p>
                </div>

                <div class="bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                  <div class="flex items-center mb-2">
                    <div class="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">2</div>
                    <h4 class="font-bold text-lg">SUBSTITUTION</h4>
                  </div>
                  <p class="text-sm pl-11">Replace with something safer</p>
                  <p class="text-xs pl-11 mt-1 italic">Example: Use water-based paint instead of solvent-based</p>
                </div>

                <div class="bg-cyan-600 text-white p-4 rounded-lg shadow-lg">
                  <div class="flex items-center mb-2">
                    <div class="bg-white text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">3</div>
                    <h4 class="font-bold text-lg">ENGINEERING CONTROLS</h4>
                  </div>
                  <p class="text-sm pl-11">Isolate people from hazard</p>
                  <p class="text-xs pl-11 mt-1 italic">Example: Machine guards, ventilation systems, barriers</p>
                </div>

                <div class="bg-orange-500 text-white p-4 rounded-lg shadow-md">
                  <div class="flex items-center mb-2">
                    <div class="bg-white text-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">4</div>
                    <h4 class="font-bold text-lg">ADMINISTRATIVE CONTROLS</h4>
                  </div>
                  <p class="text-sm pl-11">Change how people work</p>
                  <p class="text-xs pl-11 mt-1 italic">Example: Training, procedures, job rotation, signage</p>
                </div>

                <div class="bg-red-500 text-white p-4 rounded-lg shadow-md">
                  <div class="flex items-center mb-2">
                    <div class="bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">5</div>
                    <h4 class="font-bold text-lg">PPE (Personal Protective Equipment)</h4>
                  </div>
                  <p class="text-sm pl-11">Least effective - last line of defense</p>
                  <p class="text-xs pl-11 mt-1 italic">Example: Gloves, helmets, safety glasses</p>
                </div>
              </div>

              <div class="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded mt-6">
                <p class="font-semibold text-yellow-900">⚠️ Why is PPE last?</p>
                <p class="text-sm mt-2">PPE doesn't eliminate the hazard - it only provides protection IF worn correctly. It requires constant vigilance and discipline.</p>
              </div>
            `,
          ta: `
              <h3>கட்டுப்பாட்டு படிநிலை</h3>
              <p>அனைத்து பாதுகாப்பு நடவடிக்கைகளும் சமமாக பயனுள்ளதாக இல்லை!</p>
              <ol>
                <li><strong>நீக்குதல்:</strong> ஆபத்தை முழுவதுமாக அகற்றவும்</li>
                <li><strong>மாற்றீடு:</strong> பாதுகாப்பானதாக மாற்றவும்</li>
                <li><strong>பொறியியல் கட்டுப்பாடுகள்:</strong> இயந்திர காவலர்கள்</li>
                <li><strong>நிர்வாக கட்டுப்பாடுகள்:</strong> பயிற்சி, நடைமுறைகள்</li>
                <li><strong>PPE:</strong> கடைசி பாதுகாப்பு வரிசை</li>
              </ol>
            `,
          hi: `
              <h3>नियंत्रण पदानुक्रम</h3>
              <p>सभी सुरक्षा उपाय समान रूप से प्रभावी नहीं हैं!</p>
              <ol>
                <li><strong>उन्मूलन:</strong> खतरे को पूरी तरह हटा दें</li>
                <li><strong>प्रतिस्थापन:</strong> सुरक्षित विकल्प का उपयोग करें</li>
                <li><strong>इंजीनियरिंग नियंत्रण:</strong> मशीन गार्ड</li>
                <li><strong>प्रशासनिक नियंत्रण:</strong> प्रशिक्षण, प्रक्रियाएं</li>
                <li><strong>PPE:</strong> अंतिम रक्षा पंक्ति</li>
              </ol>
            `,
          te: `
              <h3>నియంత్రణల క్రమానుగత రూపం</h3>
              <p>అన్ని భద్రతా చర్యలు సమానంగా ప్రభావవంతంగా ఉండవు!</p>
              <ol>
                <li><strong>తొలగింపు:</strong> ప్రమాదాన్ని పూర్తిగా తొలగించండి</li>
                <li><strong>ప్రత్యామ్నాయం:</strong> సురక్షితమైన దానితో మార్చండి</li>
                <li><strong>ఇంజినీరింగ్ నియంత్రణలు:</strong> యంత్ర గార్డులు</li>
                <li><strong>నిర్వాహక నియంత్రణలు:</strong> శిక్షణ, విధానాలు</li>
                <li><strong>PPE:</strong> చివరి రక్షణ వరుస</li>
              </ol>
            `,
        },
      },
      {
        id: "step-3-quiz",
        type: "quiz",
        title: {
          en: "Module 3 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 3 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 3 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 3 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0902\u0c1f\u0c4d",
        },
        content: {
          en: "Test your knowledge on Accident Theories.",
          ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1 \u0b95\u0bcb\u0b9f\u0bcd\u0baa\u0bbe\u0b9f\u0bc1\u0b95\u0bb3\u0bcd \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b85\u0bb1\u0bbf\u0bb5\u0bc8 \u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0926\u0941\u0930\u094d\u0918\u091f\u0928\u093e \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924\u094b\u0902 \u092a\u0930 \u0905\u092a\u0928\u0947 \u091c\u094d\u091e\u093e\u0928 \u0915\u093e \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c38\u0c3f\u0c26\u0c4d\u0c27\u0c3e\u0c02\u0c24\u0c3e\u0c32\u0c2a\u0c48 \u0c2e\u0c40 \u0c05\u0c35\u0c17\u0c3e\u0c39\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c40\u0c15\u0c4d\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-004",
    title: {
      en: "Machine Safety & LOTO",
      ta: "\u0b87\u0baf\u0ba8\u0bcd\u0ba4\u0bbf\u0bb0 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 & LOTO",
      hi: "\u092e\u0936\u0940\u0928 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0914\u0930 LOTO",
      te: "\u0c2f\u0c02\u0c24\u0c4d\u0c30 \u0c2d\u0c26\u0c4d\u0c30\u0c24 & LOTO",
    },
    description: {
      en: "Safety Systems, Guarding, Interlocks",
      ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd, \u0b95\u0bbe\u0bb5\u0bb2\u0bbe\u0bb3\u0bbf\u0b95\u0bb3\u0bcd",
      hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092a\u094d\u0930\u0923\u093e\u0932\u093f\u092f\u093e\u0902",
      te: "\u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c35\u0c4d\u0c2f\u0c35\u0c38\u0c4d\u0c25\u0c32\u0c41",
    },
    category: "Technical Safety",
    estimatedTime: "25 min",
    icon: "Lock",
    thumbnail: assets.machineGuard,
    steps: [
      {
        id: "step-4-1",
        type: "content",
        title: {
          en: "Machine Safety Systems",
          ta: "\u0b87\u0baf\u0ba8\u0bcd\u0ba4\u0bbf\u0bb0 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd",
          hi: "\u092e\u0936\u0940\u0928 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092a\u094d\u0930\u0923\u093e\u0932\u093f\u092f\u093e\u0902",
          te: "\u0c2e\u0c46\u0c37\u0c3f\u0c28\u0c4d \u0c17\u0c3e\u0c30\u0c4d\u0c21\u0c3f\u0c02\u0c17\u0c4d & \u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c35\u0c4d\u0c2f\u0c35\u0c38\u0c4d\u0c25\u0c32\u0c41",
        },
        content: {
          en: `
              <div class="flex justify-center mb-6">
                 <img src="${assets.machineGuard}" alt="Machine Guarding" class="max-w-md w-full rounded shadow-lg" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-indigo-50 p-4 rounded-lg border-t-4 border-indigo-600">
                  <h4 class="font-bold text-indigo-900 mb-2">Double Hand Push Button</h4>
                  <p class="text-sm">Both hands must be used to operate the machine. Prevents hands from being in the danger zone.</p>
                </div>
                <div class="bg-indigo-50 p-4 rounded-lg border-t-4 border-indigo-600">
                  <h4 class="font-bold text-indigo-900 mb-2">Safety Light Curtains</h4>
                  <p class="text-sm">Invisible sensors that stop the machine if any body part enters the hazard area.</p>
                </div>
                <div class="bg-indigo-50 p-4 rounded-lg border-t-4 border-indigo-600">
                  <h4 class="font-bold text-indigo-900 mb-2">Interlocks</h4>
                  <p class="text-sm">Machine will not start if the door/guard is open. If opened during operation, machine stops immediately.</p>
                </div>
              </div>
              <div class="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 font-bold text-center">
                🚫 NEVER Bypass Safety Guards or Sensors!
              </div>
            `,
          ta: `
               <ul class="list-disc pl-5">
                 <li><strong>இரட்டை கை பொத்தான்:</strong> இயந்திரத்தை இயக்க இரண்டு கைகளையும் பயன்படுத்த வேண்டும்.</li>
                 <li><strong>பாதுகாப்பு திரைச்சீலைகள்:</strong> ஆபத்தான பகுதிக்குள் நுழைந்தால் இயந்திரத்தை நிறுத்தும்.</li>
                 <li><strong>இன்டர்லாக்:</strong> கதவு திறந்திருந்தால் இயந்திரம் இயங்காது.</li>
               </ul>
            `,
          hi: `
              <p>सुरक्षा प्रणालियों (गार्ड, सेंसर) को कभी भी बायपास न करें।</p>
            `,
          te: `
              <p>భద్రతా గార్డులను ఎప్పుడూ దాటవేయవద్దు.</p>
            `,
        },
      },
      {
        id: "step-4-2",
        type: "content",
        title: {
          en: "LOTO (Lock Out Tag Out)",
          ta: "LOTO (\u0bb2\u0bbe\u0b95\u0bcd \u0b85\u0bb5\u0bc1\u0b9f\u0bcd \u0b9f\u0bc7\u0b95\u0bcd \u0b85\u0bb5\u0bc1\u0b9f\u0bcd)",
          hi: "LOTO \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e",
          te: "LOTO \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02",
        },
        content: {
          en: `
              <div class="bg-gray-50 p-6 rounded-lg">
                <div class="float-right ml-4 mb-4 w-1/3">
                   <img src="${assets.lotoLock}" alt="LOTO Lock" class="w-full rounded shadow border" />
                </div>
                <h3 class="text-gray-800 font-bold text-lg mb-4">When to use LOTO?</h3>
                <p class="mb-4">During Maintenance, Cleaning, or Repair work.</p>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</div>
                    <div class="flex-1 bg-white p-3 shadow-sm rounded border-l-4 border-red-400"><strong>Stop Machine:</strong> Turn off the equipment normally.</div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</div>
                    <div class="flex-1 bg-white p-3 shadow-sm rounded border-l-4 border-red-400"><strong>Isolate Energy:</strong> Disconnect power source (Electric/Air/Hydraulic).</div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</div>
                    <div class="flex-1 bg-white p-3 shadow-sm rounded border-l-4 border-red-400"><strong>Lock & Tag:</strong> Apply your personal Lock and Danger Tag.</div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">4</div>
                    <div class="flex-1 bg-white p-3 shadow-sm rounded border-l-4 border-red-400"><strong>Verify:</strong> Try to start the machine to ensure it has NO POWER.</div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                   <div class="flex flex-col items-center">
                     <img src="${assets.lotoEnergyControl}" alt="Energy Control" class="rounded shadow border h-auto object-contain w-full" />
                     <p class="text-xs mt-1 text-center font-bold text-gray-600">Total Energy Isolation</p>
                   </div>
                   <div class="flex flex-col items-center">
                     <img src="${assets.lotoGroupWork}" alt="Group LOTO" class="rounded shadow border h-auto object-contain w-full" />
                     <p class="text-xs mt-1 text-center font-bold text-gray-600">Group LOTO: Analysis</p>
                   </div>
                </div>
              </div>
            `,
          ta: `
               <p>பராமரிப்பு பணியின் போது இயந்திரத்தை தனிமைப்படுத்த LOTO பயன்படுத்தப்படுகிறது.</p>
            `,
          hi: `
              <p>रखरखाव के दौरान LOTO का उपयोग करें। ऊर्जा स्रोत को बंद करें और लॉक करें।</p>
            `,
          te: `
              <p>మెయింటేనెన్స్ సమయంలో LOTO ఉపయోగించండి.</p>
            `,
        },
      },
      {
        id: "step-4-4",
        type: "content",
        title: {
          en: "Confined Space Safety",
          ta: "\u0bb5\u0bb0\u0bae\u0bcd\u0baa\u0bbf\u0bb1\u0bcd\u0b95\u0bc1\u0b9f\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0b87\u0b9f\u0bae\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u0938\u0940\u092e\u093f\u0924 \u0938\u094d\u0925\u093e\u0928 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
          te: "\u0c2a\u0c30\u0c3f\u0c2e\u0c3f\u0c24 \u0c38\u0c4d\u0c25\u0c32 \u0c2d\u0c26\u0c4d\u0c30\u0c24",
        },
        imageUrl: assets.confinedSpace,
        content: {
          en: `
              <h3 class="text-lg font-bold text-indigo-800 mb-4">What is a Confined Space?</h3>
              <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600 mb-6">
                <p class="font-semibold">A space that is:</p>
                <ul class="mt-2 space-y-1 text-sm">
                  <li>✓ Large enough for a worker to enter</li>
                  <li>✓ Has limited entry/exit</li>
                  <li>✓ NOT designed for continuous occupancy</li>
                </ul>
              </div>

              <h4 class="font-bold mb-3">Common Examples:</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-gray-100 p-3 rounded text-center">
                  <div class="text-2xl mb-1">🛢️</div>
                  <p class="text-xs font-semibold">Tanks</p>
                </div>
                <div class="bg-gray-100 p-3 rounded text-center">
                  <div class="text-2xl mb-1">⚙️</div>
                  <p class="text-xs font-semibold">Vessels</p>
                </div>
                <div class="bg-gray-100 p-3 rounded text-center">
                  <div class="text-2xl mb-1">🕳️</div>
                  <p class="text-xs font-semibold">Manholes</p>
                </div>
                <div class="bg-gray-100 p-3 rounded text-center">
                  <div class="text-2xl mb-1">📦</div>
                  <p class="text-xs font-semibold">Silos</p>
                </div>
              </div>

              <h4 class="font-bold text-red-700 mb-3">⚠️ Major Hazards:</h4>
              <div class="space-y-2 mb-6">
                <div class="bg-red-50 p-3 rounded border-l-4 border-red-600">
                  <strong>Oxygen Deficiency:</strong> <18% oxygen can cause death
                </div>
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-600">
                  <strong>Toxic Gases:</strong> H2S, CO, Methane accumulation
                </div>
                <div class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-600">
                  <strong>Flammable Atmosphere:</strong> Risk of explosion
                </div>
                <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                  <strong>Engulfment:</strong> Buried by flowable materials
                </div>
              </div>

              <h4 class="font-bold text-green-700 mb-3">✓ Safety Procedures:</h4>
              <ol class="space-y-2">
                <li class="flex items-start">
                  <span class="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span><strong>Get Permit:</strong> Confined Space Entry Permit required</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span><strong>Test Atmosphere:</strong> Check O2, toxic gases, flammability</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span><strong>Ventilate:</strong> Force fresh air circulation</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span><strong>Standby Person:</strong> Trained attendant outside at all times</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">5</span>
                  <span><strong>Rescue Plan:</strong> Emergency rescue equipment ready</span>
                </li>
              </ol>

              <div class="bg-red-100 border-2 border-red-600 p-4 rounded mt-6">
                <p class="font-bold text-red-900">⛔ NEVER enter a confined space alone!</p>
                <p class="text-sm mt-1">60% of confined space deaths are would-be rescuers</p>
              </div>
            `,
          ta: `
              <h3>வரம்பிற்குட்பட்ட இடம் பாதுகாப்பு</h3>
              <p>வரம்பிற்குட்பட்ட இடம் என்றால்:</p>
              <ul>
                <li>குறைந்த நுழைவு/வெளியேறல்</li>
                <li>தொடர்ந்து வேலை செய்ய வடிவமைக்கப்படாதது</li>
              </ul>
              <h4>பெரிய அபாயங்கள்:</h4>
              <ul>
                <li>ஆக்ஸிஜன் குறைபாடு</li>
                <li>நச்சு வாயுக்கள்</li>
                <li>எரியக்கூடிய வளிமண்டலம்</li>
              </ul>
            `,
          hi: `
              <h3>सीमित स्थान सुरक्षा</h3>
              <p>सीमित स्थान क्या है:</p>
              <ul>
                <li>सीमित प्रवेश/निकास</li>
                <li>निरंतर कब्जे के लिए डिज़ाइन नहीं किया गया</li>
              </ul>
              <h4>प्रमुख खतरे:</h4>
              <ul>
                <li>ऑक्सीजन की कमी</li>
                <li>जहरीली गैसें</li>
                <li>ज्वलनशील वातावरण</li>
              </ul>
            `,
          te: `
              <h3>పరిమిత స్థల భద్రత</h3>
              <p>పరిమిత స్థలం అంటే:</p>
              <ul>
                <li>పరిమిత ప్రవేశం/నిష్క్రమణ</li>
                <li>నిరంతర ఆక్యుపెన్సీ కోసం డిజైన్ చేయబడలేదు</li>
              </ul>
              <h4>ప్రధాన ప్రమాదాలు:</h4>
              <ul>
                <li>ఆక్సిజన్ లోపం</li>
                <li>విష వాయువులు</li>
                <li>మండే వాతావరణం</li>
              </ul>
            `,
        },
      },
      {
        id: "step-4-quiz",
        type: "quiz",
        title: {
          en: "Module 4 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 4 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 4 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 4 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Test your knowledge on Machine Safety.",
          ta: "\u0b87\u0baf\u0ba8\u0bcd\u0ba4\u0bbf\u0bb0 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0baa\u0bb1\u0bcd\u0bb1\u0bbf\u0baf \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b85\u0bb1\u0bbf\u0bb5\u0bc8 \u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u092e\u0936\u0940\u0928 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092a\u0930 \u0905\u092a\u0928\u0947 \u091c\u094d\u091e\u093e\u0928 \u0915\u093e \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c2f\u0c02\u0c24\u0c4d\u0c30 \u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c2a\u0c48 \u0c2e\u0c40 \u0c05\u0c35\u0c17\u0c3e\u0c39\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c40\u0c15\u0c4d\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-005",
    title: {
      en: "Personal Protective Equipment (PPE)",
      ta: "\u0ba4\u0ba9\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b89\u0baa\u0b95\u0bb0\u0ba3\u0b99\u0bcd\u0b95\u0bb3\u0bcd (PPE)",
      hi: "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0917\u0924 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0909\u092a\u0915\u0930\u0923 (PPE)",
      te: "\u0c35\u0c4d\u0c2f\u0c15\u0c4d\u0c24\u0c3f\u0c17\u0c24 \u0c30\u0c15\u0c4d\u0c37\u0c23 \u0c2a\u0c30\u0c3f\u0c15\u0c30\u0c3e\u0c32\u0c41 (PPE)",
    },
    description: {
      en: "Head to Toe Protection standards",
      ta: "\u0ba4\u0bb2\u0bc8 \u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0b95\u0bbe\u0bb2\u0bcd \u0bb5\u0bb0\u0bc8 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
      hi: "\u0938\u093f\u0930 \u0938\u0947 \u092a\u0948\u0930 \u0924\u0915 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
      te: "\u0c24\u0c32\u0c2a\u0c48 \u0c28\u0c41\u0c02\u0c21\u0c3f \u0c15\u0c3e\u0c32\u0c3f \u0c35\u0c30\u0c15\u0c41 \u0c30\u0c15\u0c4d\u0c37\u0c23",
    },
    category: "Personal Safety",
    estimatedTime: "15 min",
    icon: "HardHat",
    thumbnail: assets.ppeEquipment,
    steps: [
      {
        id: "step-5-1",
        type: "content",
        title: {
          en: "Head to Toe Protection",
          ta: "\u0ba4\u0bb2\u0bc8 \u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0b95\u0bbe\u0bb2\u0bcd \u0bb5\u0bb0\u0bc8 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u0938\u093f\u0930 \u0938\u0947 \u092a\u0948\u0930 \u0924\u0915 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
          te: "\u0c24\u0c32\u0c2a\u0c48 \u0c28\u0c41\u0c02\u0c21\u0c3f \u0c15\u0c3e\u0c32\u0c3f \u0c35\u0c30\u0c15\u0c41 \u0c30\u0c15\u0c4d\u0c37\u0c23",
        },
        content: {
          en: `
                <img src="${assets.ppeGear}" alt="PPE Gear" class="col-span-2 md:col-span-3 w-48 mx-auto mb-4" />
                <div class="bg-yellow-50 p-4 rounded text-center border-b-4 border-yellow-400">
                  <div class="text-4xl mb-2"><img src="${assets.ppeEquipment}" class="h-16 mx-auto object-contain" /></div>
                  <h4 class="font-bold">PPE Standards</h4>
                  <p class="text-xs">Helmet, Goggles, Vest, Gloves, Shoes.</p>
                </div>
                <div class="bg-blue-50 p-4 rounded text-center border-b-4 border-blue-400">
                  <div class="text-4xl mb-2">👓</div>
                  <h4 class="font-bold">Eyes</h4>
                  <p class="text-xs">Goggles protect from dust, chemical splash, sparks.</p>
                </div>
                <div class="bg-green-50 p-4 rounded text-center border-b-4 border-green-400">
                  <div class="text-4xl mb-2">👂</div>
                  <h4 class="font-bold">Ears</h4>
                  <p class="text-xs">Ear Plugs/Muffs for noise > 85 dB.</p>
                </div>
                <div class="bg-orange-50 p-4 rounded text-center border-b-4 border-orange-400">
                  <div class="text-4xl mb-2">🧤</div>
                  <h4 class="font-bold">Hands</h4>
                  <p class="text-xs">Gloves (Cotton, Leather, Nitrile) preventing cuts/burns.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded text-center border-b-4 border-gray-600">
                  <div class="text-4xl mb-2">🥾</div>
                  <h4 class="font-bold">Feet</h4>
                  <p class="text-xs">Safety Shoes with steel toe for impact protection.</p>
                </div>
                <div class="bg-teal-50 p-4 rounded text-center border-b-4 border-teal-400">
                  <div class="text-4xl mb-2">😷</div>
                  <h4 class="font-bold">Lungs</h4>
                  <p class="text-xs">Masks for dust. Respirators for fumes.</p>
                </div>
              </div>
            `,
          ta: `
               <ul class="list-disc pl-5">
                 <li><strong>தலை:</strong> தலைக்கவசம் (Helmet) - விழும் பொருட்களிலிருந்து காக்கிறது.</li>
                 <li><strong>கண்கள்:</strong> கண்ணாடி (Goggles) - தூசி மற்றும் தீப்பொறிகளிலிருந்து காக்கிறது.</li>
                 <li><strong>கால்:</strong> பாதுகாப்பு காலணிகள் (Safety Shoes).</li>
               </ul>
            `,
          hi: `
              <p>हेलमेट, गॉगल्स, दस्ताने, और सुरक्षा जूते हमेशा पहनें।</p>
            `,
          te: `
              <p>హెల్మెట్, కళ్లద్దాలు, చేతి తొడుగులు మరియు భద్రతా బూట్లు ధరించండి.</p>
            `,
        },
      },
      {
        id: "step-5-2",
        type: "content",
        title: {
          en: "Choosing the Right PPE",
          ta: "\u0b9a\u0bb0\u0bbf\u0baf\u0bbe\u0ba9 PPE \u0ba4\u0bc7\u0bb0\u0bcd\u0bb5\u0bc1",
          hi: "\u0938\u0939\u0940 PPE \u0915\u093e \u091a\u0941\u0928\u093e\u0935",
          te: "\u0c38\u0c30\u0c48\u0c28 PPE \u0c0e\u0c02\u0c2a\u0c3f\u0c15",
        },
        imageUrl: assets.ppeEquipment,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-800 mb-4">Match Control to Hazard</h3>
              <p class="mb-4">PPE must be selected based on the specific hazard. One size does not fit all.</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div class="bg-white p-3 rounded border border-gray-200">
                  <strong class="block text-red-600 mb-1">Chemical Handling</strong>
                  <ul class="list-disc pl-4 text-gray-600 space-y-1">
                    <li>Chemical Goggles (Not safety glasses)</li>
                    <li>Nitrile/Neoprene Gloves</li>
                    <li>Apron</li>
                  </ul>
                </div>
                <div class="bg-white p-3 rounded border border-gray-200">
                  <strong class="block text-blue-600 mb-1">Welding/Grinding</strong>
                  <ul class="list-disc pl-4 text-gray-600 space-y-1">
                    <li>Face Shield</li>
                    <li>Leather Gloves</li>
                    <li>FR Clothing</li>
                  </ul>
                </div>
                <div class="bg-white p-3 rounded border border-gray-200">
                  <strong class="block text-yellow-600 mb-1">Heavy Material Handling</strong>
                  <ul class="list-disc pl-4 text-gray-600 space-y-1">
                    <li>Steel Toe Shoes</li>
                    <li>Helmet (if overhead loads)</li>
                    <li>Cotton/Leather Gloves</li>
                  </ul>
                </div>
              </div>

              <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                <strong>Key Rule:</strong> PPE is the LAST resort. Try to eliminate the hazard first!
              </div>
            `,
          ta: `
              <h3>சரியான PPE தேர்வு</h3>
              <p>இரசாயன கையாளுதல்: இரசாயன கண்ணாடிகள், நைட்ரைல் கையுறைகள்.</p>
              <p>வெல்டிங்: முக கவசம், தோல் கையுறைகள்.</p>
              <p>பளு தூக்குதல்: பாதுகாப்பு காலணிகள்.</p>
            `,
          hi: `
              <h3>सही PPE का चुनाव</h3>
              <p>रसायन: केमिकल गॉगल्स, नाइट्राइल दस्ताने।</p>
              <p>वेल्डिंग: फेस शील्ड, चमड़े के दस्ताने।</p>
              <p>भारी सामान: सुरक्षा जूते।</p>
            `,
          te: `
              <h3>సరైన PPE ఎంపిక</h3>
              <p>రసాయనాలు: కెమికల్ గాగుల్స్, నైట్రైల్ గ్లోవ్స్.</p>
              <p>వెల్డింగ్: ఫేస్ షీల్డ్, లెదర్ గ్లోవ్స్.</p>
              <p>బరువైన పనులు: సేఫ్టీ షూస్.</p>
            `,
        },
      },
      {
        id: "step-5-3",
        type: "content",
        title: {
          en: "PPE Inspection & Maintenance",
          ta: "PPE \u0b86\u0baf\u0bcd\u0bb5\u0bc1 & \u0baa\u0bb0\u0bbe\u0bae\u0bb0\u0bbf\u0baa\u0bcd\u0baa\u0bc1",
          hi: "PPE \u0928\u093f\u0930\u0940\u0915\u094d\u0937\u0923 \u0914\u0930 \u0930\u0916\u0930\u0916\u093e\u0935",
          te: "PPE \u0c24\u0c28\u0c3f\u0c16\u0c40 & \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23",
        },
        imageUrl: assets.ppeGear,
        content: {
          en: `
              <h3 class="text-lg font-bold text-purple-800 mb-4">PPE is Your Last Line of Defense</h3>
              <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600 mb-6">
                <p class="font-semibold">PPE only works if it's in good condition!</p>
                <p class="text-sm mt-2">Damaged PPE is as dangerous as no PPE.</p>
              </div>

              <h4 class="font-bold mb-3">Before Each Use - Inspect Your PPE:</h4>
              <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-blue-700 flex items-center mb-2">
                    <span class="text-2xl mr-2">⛑️</span> Safety Helmet
                  </h5>
                  <ul class="text-sm space-y-1">
                    <li>✓ No cracks or dents</li>
                    <li>✓ Straps intact and adjustable</li>
                    <li>✓ Not expired (check date inside)</li>
                    <li>❌ Replace after any impact</li>
                  </ul>
                </div>

                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-green-700 flex items-center mb-2">
                    <span class="text-2xl mr-2">👓</span> Safety Goggles
                  </h5>
                  <ul class="text-sm space-y-1">
                    <li>✓ Lens clear, no scratches</li>
                    <li>✓ Tight seal around eyes</li>
                    <li>✓ Elastic strap functional</li>
                    <li>❌ Replace if vision impaired</li>
                  </ul>
                </div>

                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-orange-700 flex items-center mb-2">
                    <span class="text-2xl mr-2">🧤</span> Safety Gloves
                  </h5>
                  <ul class="text-sm space-y-1">
                    <li>✓ No holes or tears</li>
                    <li>✓ Proper fit (not too loose)</li>
                    <li>✓ Correct type for task</li>
                    <li>❌ Discard if contaminated</li>
                  </ul>
                </div>

                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-red-700 flex items-center mb-2">
                    <span class="text-2xl mr-2">👞</span> Safety Shoes
                  </h5>
                  <ul class="text-sm space-y-1">
                    <li>✓ Steel toe cap intact</li>
                    <li>✓ Sole has good grip</li>
                    <li>✓ No visible damage</li>
                    <li>❌ Replace if worn out</li>
                  </ul>
                </div>
              </div>

              <h4 class="font-bold mb-3">Common PPE Mistakes:</h4>
              <div class="space-y-2">
                <div class="bg-red-50 p-3 rounded border-l-4 border-red-600">
                  <strong>❌ Don't:</strong> Use damaged or expired PPE
                </div>
                <div class="bg-red-50 p-3 rounded border-l-4 border-red-600">
                  <strong>❌ Don't:</strong> Share PPE (helmets, shoes)
                </div>
                <div class="bg-red-50 p-3 rounded border-l-4 border-red-600">
                  <strong>❌ Don't:</strong> Remove PPE in hazardous areas
                </div>
                <div class="bg-red-50 p-3 rounded border-l-4 border-red-600">
                  <strong>❌ Don't:</strong> Store PPE in dirty/damp places
                </div>
              </div>

              <div class="bg-green-100 border-2 border-green-600 p-4 rounded mt-6">
                <p class="font-bold text-green-900">✓ Remember:</p>
                <p class="text-sm mt-2">If your PPE is damaged, report it immediately and get a replacement. Never compromise on safety!</p>
              </div>
            `,
          ta: `
              <h3>PPE ஆய்வு & பராமரிப்பு</h3>
              <p>PPE நல்ல நிலையில் இருந்தால் மட்டுமே வேலை செய்யும்!</p>
              <h4>ஆய்வு செய்யுங்கள்:</h4>
              <ul>
                <li>ஹெல்மெட்: விரிசல்கள் அல்லது பள்ளங்கள் இல்லை</li>
                <li>கண்கள்தொடுக்கக: தெளிவான லென்ஸ்</li>
                <li>கையுறைகள்: துளைகள் இல்லை</li>
                <li>செய்தி: ஸ்டீல் டோ கேப் உள்ளது</li>
              </ul>
            `,
          hi: `
              <h3>PPE निरीक्षण और रखरखाव</h3>
              <p>PPE तभी काम करता है जब यह अच्छी स्थिति में हो!</p>
              <h4>निरीक्षण करें:</h4>
              <ul>
                <li>हेलमेट: कोई दरार या डेंट नहीं</li>
                <li>चश्मे: साफ लेंस</li>
                <li>दस्ताने: कोई छेद नहीं</li>
                <li>जूते: स्टील टो कैप बरकरार</li>
              </ul>
            `,
          te: `
              <h3>PPE తనిఖీ & నిర్వహణ</h3>
              <p>PPE మంచి స్థితిలో ఉన్నప్పుడు మాత్రమే పని చేస్తుంది!</p>
              <h4>తనిఖీ చేయండి:</h4>
              <ul>
                <li>హెల్మెట్: పగుళ్లు లేదా డెంట్లు లేవు</li>
                <li>కళ్ళద్దాలు: స్పష్టమైన లెన్స్</li>
                <li>చేతి తొడుగులు: రంధ్రాలు లేవు</li>
                <li>బూట్లు: స్టీల్ టో క్యాప్ సరిగ్గా ఉంది</li>
              </ul>
            `,
        },
      },
      {
        id: "step-5-4",
        type: "content",
        title: {
          en: "Donning & Doffing PPE",
          ta: "PPE \u0b85\u0ba3\u0bbf\u0ba4\u0bb2\u0bcd & \u0b95\u0bb4\u0bb1\u0bcd\u0bb1\u0bc1\u0ba4\u0bb2\u0bcd",
          hi: "PPE \u092a\u0939\u0928\u0928\u093e \u0914\u0930 \u0909\u0924\u093e\u0930\u0928\u093e",
          te: "PPE \u0c27\u0c30\u0c3f\u0c02\u0c1a\u0c21\u0c02 & \u0c24\u0c40\u0c38\u0c3f\u0c35\u0c47\u0c2f\u0c21\u0c02",
        },
        imageUrl: assets.ppeEquipment,
        content: {
          en: `
          <h3 class="text-lg font-bold text-gray-800 mb-4">How to Wear PPE Correctly</h3>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Donning -->
            <div class="bg-green-50 p-4 rounded border border-green-200">
              <h4 class="font-bold text-green-700 mb-3 border-b border-green-300 pb-2">✅ Donning (Putting On)</h4>
              <ol class="list-decimal pl-5 space-y-2 text-sm">
                <li><strong>Inspect:</strong> Check for damage before wearing.</li>
                <li><strong>Helmet:</strong> Adjust strap for snug fit.</li>
                <li><strong>Glasses:</strong> Ensure no gap at temples.</li>
                <li><strong>Shoes:</strong> Lace up fully and tightly.</li>
                <li><strong>Gloves:</strong> Check for air leaks/holes.</li>
              </ol>
            </div>

            <!-- Doffing -->
            <div class="bg-red-50 p-4 rounded border border-red-200">
              <h4 class="font-bold text-red-700 mb-3 border-b border-red-300 pb-2">🔽 Doffing (Taking Off)</h4>
              <ol class="list-decimal pl-5 space-y-2 text-sm">
                <li><strong>Gloves First:</strong> Peel off without touching skin.</li>
                <li><strong>Sanitize:</strong> Wash hands if available.</li>
                <li><strong>Glasses/Helmet:</strong> Remove from back to front.</li>
                <li><strong>Shoes:</strong> Clean before entering clean zones.</li>
                <li><strong>Store:</strong> Place in designated locker/bin.</li>
              </ol>
            </div>
          </div>
          
          <div class="bg-blue-100 p-4 rounded text-center">
            <p class="font-bold text-blue-900">Why sequence matters?</p>
            <p class="text-sm">Removing PPE incorrectly can contaminate you with the very hazards you protected yourself against!</p>
          </div>
        `,
          ta: `
          <h3>PPE அணிதல் & கழற்றுதல்</h3>
          <p><strong>அணிதல்:</strong> சேதத்தை சரிபார்க்கவும், சரியாக பொருத்தவும்.</p>
          <p><strong>கழற்றுதல்:</strong> கையுறைகளை முதலில் கழற்றவும், கைகளை கழுவவும், பாதுகாப்பாக சேமிக்கவும்.</p>
        `,
          hi: `
          <h3>PPE पहनना और उतारना</h3>
          <p>पहनना: क्षति की जाँच करें, फिट सुनिश्चित करें।</p>
          <p>उचारना: पहले दस्ताने उतारें, हाथ धोएं, सही जगह रखें।</p>
        `,
          te: `
          <h3>PPE ధరించడం & తీసివేయడం</h3>
          <p>ధరించడం: డ్యామేజ్ ఉందా అని చూడండి, సరిగ్గా వేసుకోండి.</p>
          <p>తీసివేయడం: ముందుగా గ్లోవ్స్ తీయండి, చేతులు శుభ్రం చేసుకోండి.</p>
        `,
        },
      },
      {
        id: "step-5-quiz",
        type: "quiz",
        title: {
          en: "Module 5 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 5 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 5 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 5 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Check your PPE knowledge.",
          ta: "\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd PPE \u0b85\u0bb1\u0bbf\u0bb5\u0bc8 \u0b9a\u0bb0\u0bbf\u0baa\u0bbe\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0905\u092a\u0928\u0947 PPE \u091c\u094d\u091e\u093e\u0928 \u0915\u0940 \u091c\u093e\u0901\u091a \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c2e\u0c40 PPE \u0c2a\u0c30\u0c3f\u0c1c\u0c4d\u0c1e\u0c3e\u0c28\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c24\u0c28\u0c3f\u0c16\u0c40 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-006",
    title: {
      en: "Fire Safety",
      ta: "\u0ba4\u0bc0 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
      hi: "\u0905\u0917\u094d\u0928\u093f \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
      te: "\u0c05\u0c17\u0c4d\u0c28\u0c3f \u0c2d\u0c26\u0c4d\u0c30\u0c24",
    },
    description: {
      en: "Fire Triangle, Extinguishers, Evacuation",
      ta: "\u0ba4\u0bc0 \u0bae\u0bc1\u0b95\u0bcd\u0b95\u0bcb\u0ba3\u0bae\u0bcd, \u0b85\u0ba3\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0ba9\u0bcd\u0b95\u0bb3\u0bcd",
      hi: "\u092b\u093e\u092f\u0930 \u091f\u094d\u0930\u093e\u0907\u090f\u0902\u0917\u0932, \u090f\u0915\u094d\u0938\u091f\u093f\u0902\u0917\u094d\u0935\u093f\u0936\u0930",
      te: "\u0c2b\u0c48\u0c30\u0c4d \u0c1f\u0c4d\u0c30\u0c2f\u0c3e\u0c02\u0c17\u0c3f\u0c32\u0c4d, \u0c0e\u0c15\u0c4d\u0c38\u0c4d\u200c\u0c1f\u0c3f\u0c02\u0c17\u0c4d\u0c35\u0c3f\u0c37\u0c30\u0c4d\u0c38\u0c4d",
    },
    icon: "Flame",
    imageUrl: "",
    steps: [
      {
        id: "step-6-1",
        type: "content",
        title: {
          en: "The Fire Triangle",
          ta: "\u0ba4\u0bc0 \u0bae\u0bc1\u0b95\u0bcd\u0b95\u0bcb\u0ba3\u0bae\u0bcd",
          hi: "\u092b\u093e\u092f\u0930 \u091f\u094d\u0930\u093e\u0907\u090f\u0902\u0917\u0932",
          te: "\u0c2b\u0c48\u0c30\u0c4d \u0c1f\u0c4d\u0c30\u0c2f\u0c3e\u0c02\u0c17\u0c3f\u0c32\u0c4d",
        },
        content: {
          en: `
                <div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <h4 class="font-bold text-orange-900">How to Stop Fire?</h4>
                  <p>Remove <strong>ONE</strong> element to extinguish the fire.</p>
                  <ul class="list-disc pl-5 mt-2 text-sm">
                    <li><strong>Cooling:</strong> Removes Heat (Water)</li>
                    <li><strong>Starvation:</strong> Removes Fuel (Closing Valvue)</li>
                    <li><strong>Smothering:</strong> Removes Oxygen (Foam/CO2)</li>
                  </ul>
                </div>
            `,
          ta: `<div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <h4 class="font-bold text-orange-900">தீயை நிறுத்துவது எப்படி?</h4>
                  <p>வாய்க் குழல்<strong>ஒன்று</strong>element to extinguish the fire.</p>
                  <ul class="list-disc pl-5 mt-2 text-sm">
                    <li><strong>கூலிங்:</strong>வெப்பத்தை நீக்குகிறது (தண்ணீர்)</li>
                    <li><strong>Starvation:</strong>Removes Fuel (Closing Valvue)</li>
                    <li><strong>Smothering:</strong>ஆக்ஸிஜனை நீக்குகிறது (நுரை/CO2)</li>
                  </ul>
                </div>
            `,
          hi: `<div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <h4 class="font-bold text-orange-900">रिकॉर्डिंग कैसे रोकें?</h4>
                  <p>निकालें<strong>कभी ....</strong>element to extinguish the fire.</p>
                  <ul class="list-disc pl-5 mt-2 text-sm">
                    <li><strong>अभिशीतितीकरण</strong>Removes Heat (Water)</li>
                    <li><strong>Starvation:</strong>ईंधन निकालता है (क्लोजिंग वैल्यू)</li>
                    <li><strong>Smothering:</strong>ऑक्सीजन निकालता है (फोम/CO2)</li>
                  </ul>
                </div>
            `,
          te: `<div class="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <h4 class="font-bold text-orange-900">How to Stop Fire?</h4>
                  <p> తొలగించు<strong>ONE</strong>అగ్నిని ఆర్పివేయు మూలకము.</p>
                  <ul class="list-disc pl-5 mt-2 text-sm">
                    <li><strong>శీతలీకరణ:</strong>వేడిని తొలగిస్తుంది (నీరు)</li>
                    <li><strong>అన్నపాన రాహిత్యం</strong>ఇంధనాన్ని తొలగిస్తుంది (ముగింపు వాల్వ్యూ)</li>
                    <li><strong>ఉక్కిరిబిక్కిరి చేయడం:</strong>ఆక్సిజన్ను తొలగిస్తుంది (ఫోమ్/CO2)</li>
                  </ul>
                </div>
            `,
        },
        imageUrl: assets.fireTriangle,
        imageHeight: "300px",
      },
      {
        id: "step-6-2",
        type: "content",
        title: {
          en: "Fire Extinguisher Types",
          ta: "\u0ba4\u0bc0\u0baf\u0ba3\u0bc8\u0baa\u0bcd\u0baa\u0bbe\u0ba9\u0bbf\u0ba9\u0bcd \u0bb5\u0b95\u0bc8\u0b95\u0bb3\u0bcd",
          hi: "\u0905\u0917\u094d\u0928\u093f\u0936\u093e\u092e\u0915 \u0915\u0947 \u092a\u094d\u0930\u0915\u093e\u0930",
          te: "\u0c05\u0c17\u0c4d\u0c28\u0c3f\u0c2e\u0c3e\u0c2a\u0c15 \u0c30\u0c15\u0c3e\u0c32\u0c41",
        },
        content: {
          en: `
              <div class="mb-6 flex justify-center">
                <img src="${assets.fireExtinguisher}" alt="Fire Extinguisher Chart" class="max-w-full rounded shadow-md" />
              </div>
              <table class="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border p-2">Class</th>
                    <th class="border p-2">Fire Type</th>
                    <th class="border p-2">Extinguisher</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border p-2 font-bold text-red-600">Class A</td>
                    <td class="border p-2">Solids (Wood, Paper)</td>
                    <td class="border p-2">Water, ABC Powder</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-yellow-600">Class B</td>
                    <td class="border p-2">Liquids (Oil, Petrol)</td>
                    <td class="border p-2">Foam, CO2, DCP</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-blue-600">Class C</td>
                    <td class="border p-2">Gases (LPG, Hydrogen)</td>
                    <td class="border p-2">DCP (Dry Powder)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-gray-600">Electric</td>
                    <td class="border p-2">Electrical Equipment</td>
                    <td class="border p-2">CO2 (Carbon Dioxide)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-orange-600">Class D</td>
                    <td class="border p-2">Metals (Magnesium)</td>
                    <td class="border p-2">Special Powder</td>
                  </tr>
                </tbody>
              </table>
              <div class="mt-6 bg-green-50 p-4 rounded border-l-4 border-green-500">
                 <h4 class="font-bold text-green-900 mb-2">Evacuation Plan</h4>
                 <div class="flex flex-col md:flex-row gap-4">
                    <img src="${assets.fireEvacuation}" alt="Evacuation Route" class="w-1/2 rounded shadow" />
                    <img src="${assets.assemblyPoint}" alt="Assembly Point" class="w-1/2 rounded shadow" />
                 </div>
                 <p class="mt-2 text-sm">Follow the green exit signs. Gather at the designated Assembly Point.</p>
              </div>
            `,
          ta: `<div class="mb-6 flex justify-center">
                <img src="${assets.fireExtinguisher}" alt="Fire Extinguisher Chart" class="max-w-full rounded shadow-md">
              </div>
              <table class="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border p-2">à®®à¯à®² à®¤à®¿à®à¯à®à®®à¯</th>
                    <th class="border p-2">Fire Type</th>
                    <th class="border p-2">தீயணைப்பான்</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border p-2 font-bold text-red-600">Class A</td>
                    <td class="border p-2">சாலிட்ஸ் (மரம், காகிதம்)</td>
                    <td class="border p-2">Water, ABC Powder</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-yellow-600">வகை B</td>
                    <td class="border p-2">திரவங்கள் (எண்ணெய், பெட்ரோல்)</td>
                    <td class="border p-2">நுரை, CO2, DCP</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-blue-600">வகை C</td>
                    <td class="border p-2">வாயுக்கள் (எல்பிஜி, ஹைட்ரஜன்)</td>
                    <td class="border p-2">DCP (உலர் தூள்)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-gray-600">மின்சாரம்</td>
                    <td class="border p-2">மின் உபகரணங்கள்</td>
                    <td class="border p-2">CO2 (கார்பன் டை ஆக்சைடு)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-orange-600">வகுப்பு D</td>
                    <td class="border p-2">உலோகங்கள் (மெக்னீசியம்)</td>
                    <td class="border p-2">சிறப்பு தூள்</td>
                  </tr>
                </tbody>
              </table>
              <div class="mt-6 bg-green-50 p-4 rounded border-l-4 border-green-500">
                 <h4 class="font-bold text-green-900 mb-2">வெளியேற்றத் திட்டம்</h4>
                 <div class="flex flex-col md:flex-row gap-4">
                    <img src="${assets.fireEvacuation}" alt="Evacuation Route" class="w-1/2 rounded shadow">
                    <img src="${assets.assemblyPoint}" alt="Assembly Point" class="w-1/2 rounded shadow">
                 </div>
                 <p class="mt-2 text-sm">பச்சை வெளியேறும் அறிகுறிகளைப் பின்பற்றவும். நியமிக்கப்பட்ட அசெம்பிளி பாயிண்டில் கூடிவருங்கள்.</p>
              </div>
            `,
          hi: `<div class="mb-6 flex justify-center">
                <img src="${assets.fireExtinguisher}" alt="Fire Extinguisher Chart" class="max-w-full rounded shadow-md">
              </div>
              <table class="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border p-2">डॉन बॉस्को हाई स्कूल</th>
                    <th class="border p-2">आग का प्रकार</th>
                    <th class="border p-2">Extinguisher</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border p-2 font-bold text-red-600">वर्ग A</td>
                    <td class="border p-2">ठोस पदार्थ (लकड़ी, कागज)</td>
                    <td class="border p-2">Water, ABC Powder</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-yellow-600">Class B</td>
                    <td class="border p-2">तरल पदार्थ (तेल, पेट्रोल)</td>
                    <td class="border p-2">Foam, CO2, DCP</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-blue-600">श्रेणी C</td>
                    <td class="border p-2">गैसें (एलपीजी, हाइड्रोजन)</td>
                    <td class="border p-2">डीसीपी (सूखा पाउडर)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-gray-600">इलेक्ट्रिक</td>
                    <td class="border p-2">विद्युत उपकरण</td>
                    <td class="border p-2">CO2 (कार्बन डाइऑक्साइड)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-orange-600">श्रेणी D</td>
                    <td class="border p-2">धातु (मैग्नीशियम)</td>
                    <td class="border p-2">विशेष पाउडर</td>
                  </tr>
                </tbody>
              </table>
              <div class="mt-6 bg-green-50 p-4 rounded border-l-4 border-green-500">
                 <h4 class="font-bold text-green-900 mb-2">निकासी</h4>
                 <div class="flex flex-col md:flex-row gap-4">
                    <img src="${assets.fireEvacuation}" alt="Evacuation Route" class="w-1/2 rounded shadow">
                    <img src="${assets.assemblyPoint}" alt="Assembly Point" class="w-1/2 rounded shadow">
                 </div>
                 <p class="mt-2 text-sm">हरे रंग के निकास संकेतों का पालन करें। निर्धारित असेंबली पॉइंट पर इकट्ठा हों।</p>
              </div>
            `,
          te: `<div class="mb-6 flex justify-center">
                <img src="${assets.fireExtinguisher}" alt="Fire Extinguisher Chart" class="max-w-full rounded shadow-md">
              </div>
              <table class="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border p-2">క్లాసు</th>
                    <th class="border p-2">అగ్ని రకం</th>
                    <th class="border p-2">Extinguisher</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border p-2 font-bold text-red-600">Class A</td>
                    <td class="border p-2">ఘనపదార్థాలు (కలప, కాగితం)</td>
                    <td class="border p-2">నీరు, ABC పౌడర్</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-yellow-600">క్లాస్ "బి":</td>
                    <td class="border p-2">Liquids (Oil, Petrol)</td>
                    <td class="border p-2">ఫోమ్, CO2, DCP</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-blue-600">&lt;g id="1"&gt;క్లాస్ "సి"&lt;/g&gt; :</td>
                    <td class="border p-2">వాయువులు (LPG, హైడ్రోజన్)</td>
                    <td class="border p-2">DCP (డ్రై పౌడర్)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-gray-600">విద్యుత్తు</td>
                    <td class="border p-2">ఎలక్ట్రికల్ ఎక్విప్ ‌ మెంట్</td>
                    <td class="border p-2">CO2 (కార్బన్ డయాక్సైడ్)</td>
                  </tr>
                  <tr>
                    <td class="border p-2 font-bold text-orange-600">క్లాస్ D</td>
                    <td class="border p-2">లోహాలు (మెగ్నీషియం)</td>
                    <td class="border p-2">ప్రత్యేక పౌడర్</td>
                  </tr>
                </tbody>
              </table>
              <div class="mt-6 bg-green-50 p-4 rounded border-l-4 border-green-500">
                 <h4 class="font-bold text-green-900 mb-2">తరలింపు ప్రణాళిక</h4>
                 <div class="flex flex-col md:flex-row gap-4">
                    <img src="${assets.fireEvacuation}" alt="Evacuation Route" class="w-1/2 rounded shadow">
                    <img src="${assets.assemblyPoint}" alt="Assembly Point" class="w-1/2 rounded shadow">
                 </div>
                 <p class="mt-2 text-sm">ఆకుపచ్చ నిష్క్రమణ సంకేతాలను అనుసరించండి. నియమించబడిన అసెంబ్లీ పాయింట్ వద్ద సమావేశమవ్వండి.</p>
              </div>
            `,
        },
      },
      {
        id: "step-6-4",
        type: "content",
        title: {
          en: "Emergency Response Procedures",
          ta: "\u0b85\u0bb5\u0b9a\u0bb0 \u0ba8\u0b9f\u0bb5\u0b9f\u0bbf\u0b95\u0bcd\u0b95\u0bc8 \u0ba8\u0b9f\u0bc8\u0bae\u0bc1\u0bb1\u0bc8\u0b95\u0bb3\u0bcd",
          hi: "\u0906\u092a\u093e\u0924\u0915\u093e\u0932\u0940\u0928 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e\u090f\u0902",
          te: "\u0c05\u0c24\u0c4d\u0c2f\u0c35\u0c38\u0c30 \u0c2a\u0c4d\u0c30\u0c24\u0c3f\u0c38\u0c4d\u0c2a\u0c02\u0c26\u0c28 \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c3e\u0c32\u0c41",
        },
        content: {
          en: `
              <h3 class="text-lg font-bold text-red-800 mb-4">🚨 What to Do in an Emergency</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">Every second counts in an emergency!</p>
                <p class="text-sm mt-2">Know the procedures BEFORE an emergency happens.</p>
              </div>

              <h4 class="font-bold mb-3">Emergency Numbers - India</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-red-100 p-3 rounded text-center border-2 border-red-600">
                  <div class="text-2xl font-bold text-red-700">108</div>
                  <p class="text-xs font-semibold">Ambulance</p>
                </div>
                <div class="bg-orange-100 p-3 rounded text-center border-2 border-orange-600">
                  <div class="text-2xl font-bold text-orange-700">101</div>
                  <p class="text-xs font-semibold">Fire</p>
                </div>
                <div class="bg-blue-100 p-3 rounded text-center border-2 border-blue-600">
                  <div class="text-2xl font-bold text-blue-700">100</div>
                  <p class="text-xs font-semibold">Police</p>
                </div>
                <div class="bg-green-100 p-3 rounded text-center border-2 border-green-600">
                  <div class="text-2xl font-bold text-green-700">112</div>
                  <p class="text-xs font-semibold">All Services</p>
                </div>
              </div>

              <h4 class="font-bold text-lg mb-3">Emergency Action Plan - RACE</h4>
              <div class="space-y-3 mb-6">
                <div class="flex items-start bg-red-100 p-4 rounded border-l-4 border-red-600">
                  <div class="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">R</div>
                  <div>
                    <strong class="text-red-900">RESCUE</strong>
                    <p class="text-sm mt-1">Remove anyone in immediate danger (if safe to do so)</p>
                  </div>
                </div>
                <div class="flex items-start bg-orange-100 p-4 rounded border-l-4 border-orange-600">
                  <div class="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">A</div>
                  <div>
                    <strong class="text-orange-900">ALARM</strong>
                    <p class="text-sm mt-1">Activate the alarm and call emergency services</p>
                  </div>
                </div>
                <div class="flex items-start bg-yellow-100 p-4 rounded border-l-4 border-yellow-600">
                  <div class="bg-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">C</div>
                  <div>
                    <strong class="text-yellow-900">CONFINE</strong>
                    <p class="text-sm mt-1">Close doors to contain fire/smoke (for fire emergencies)</p>
                  </div>
                </div>
                <div class="flex items-start bg-green-100 p-4 rounded border-l-4 border-green-600">
                  <div class="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">E</div>
                  <div>
                    <strong class="text-green-900">EVACUATE/EXTINGUISH</strong>
                    <p class="text-sm mt-1">Evacuate the area OR extinguish if fire is small and you're trained</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-3">Evacuation Guidelines:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> Stay calm and don't panic</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> Follow exit signs to nearest safe exit</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> DO NOT use elevators</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> Help elderly/disabled if safe</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> Meet at designated Assembly Point</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span> DO NOT re-enter until cleared by authorities</li>
              </ul>

              <div class="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                <p class="font-bold text-blue-900">📍 Assembly Point Location:</p>
                <p class="text-sm mt-2">Know your workplace assembly point! Look for the green "Assembly Point" sign.</p>
              </div>
            `,
          ta: `<h3 class="text-lg font-bold text-red-800 mb-4">அவசரகாலத்தில் 🚨 என்ன செய்ய வேண்டும்</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">ஒவ்வொரு தமிழ் எண்ணிக்கைகள் வாக்களிக்கும்போது</p>
                <p class="text-sm mt-2">அவசரநிலை ஏற்படுவதற்கு முன்பு நடைமுறைகளை அறிந்து கொள்ளுங்கள்.</p>
              </div>

              <h4 class="font-bold mb-3">அவசர எண்கள் - இந்தியா</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-red-100 p-3 rounded text-center border-2 border-red-600">
                  <div class="text-2xl font-bold text-red-700">108</div>
                  <p class="text-xs font-semibold">நோயாளர் ஊர்தி</p>
                </div>
                <div class="bg-orange-100 p-3 rounded text-center border-2 border-orange-600">
                  <div class="text-2xl font-bold text-orange-700">101</div>
                  <p class="text-xs font-semibold">நெருப்பு</p>
                </div>
                <div class="bg-blue-100 p-3 rounded text-center border-2 border-blue-600">
                  <div class="text-2xl font-bold text-blue-700">100</div>
                  <p class="text-xs font-semibold">Police</p>
                </div>
                <div class="bg-green-100 p-3 rounded text-center border-2 border-green-600">
                  <div class="text-2xl font-bold text-green-700">112</div>
                  <p class="text-xs font-semibold">All Services</p>
                </div>
              </div>

              <h4 class="font-bold text-lg mb-3">அவசரகால செயல் திட்டம் - இனம்</h4>
              <div class="space-y-3 mb-6">
                <div class="flex items-start bg-red-100 p-4 rounded border-l-4 border-red-600">
                  <div class="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">Comment</div>
                  <div>
                    <strong class="text-red-900">RESCUE</strong>
                    <p class="text-sm mt-1">உடனடி ஆபத்தில் உள்ள எவரையும் அகற்றவும் (அவ்வாறு செய்வது பாதுகாப்பானது என்றால்)</p>
                  </div>
                </div>
                <div class="flex items-start bg-orange-100 p-4 rounded border-l-4 border-orange-600">
                  <div class="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">A</div>
                  <div>
                    <strong class="text-orange-900">ALARM</strong>
                    <p class="text-sm mt-1">அலாரத்தை செயல்படுத்துங்கள் மற்றும் அவசர சேவைகளை அழைக்கவும்</p>
                  </div>
                </div>
                <div class="flex items-start bg-yellow-100 p-4 rounded border-l-4 border-yellow-600">
                  <div class="bg-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">C.</div>
                  <div>
                    <strong class="text-yellow-900">வரையறு</strong>
                    <p class="text-sm mt-1">Close doors to contain fire/smoke (for fire emergencies)</p>
                  </div>
                </div>
                <div class="flex items-start bg-green-100 p-4 rounded border-l-4 border-green-600">
                  <div class="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">E</div>
                  <div>
                    <strong class="text-green-900">வெளியேற்றவும்/அணைக்கவும்</strong>
                    <p class="text-sm mt-1">தீ சிறியதாக இருந்தால் அப்பகுதியை காலி செய்யவும் அல்லது அணைக்கவும்</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-3">வெளியேற்ற வழிகாட்டுதல்கள்:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>அமைதியாக இருங்கள், பீதியடைய வேண்டாம்</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>அருகிலுள்ள பாதுகாப்பான வெளியேறுவதற்கு வெளியேறும் அறிகுறிகளைப் பின்பற்றவும்</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>à®à®¿à®±à¯ à®à¯à®±à®¿à®ªà¯à®ªà¯ à®¨à¯à®à¯à®à¯à®</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>பாதுகாப்பாக இருந்தால் வயதானவர்கள்/ஊனமுற்றவர்களுக்கு உதவுங்கள்</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>நியமிக்கப்பட்ட அசெம்பிளி பாயிண்டில் சந்தித்தல்</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>அதிகாரிகளால் அகற்றப்படும் வரை மீண்டும் நுழைய வேண்டாம்</li>
              </ul>

              <div class="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                <p class="font-bold text-blue-900">📍 அசெம்பிளி பாயிண்ட் இடம்:</p>
                <p class="text-sm mt-2">உங்கள் பணியிட அசெம்பிளி புள்ளியை அறிந்து கொள்ளுங்கள்! பச்சை நிற &amp;quot;அசெம்பிளி புள்ளி&amp;quot; அடையாளத்தைத் தேடுங்கள்.</p>
              </div>
            `,
          hi: `<h3 class="text-lg font-bold text-red-800 mb-4">आपातकाल में क्या करें?</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">आपातकाल में हर सेकंड मायने रखता है!</p>
                <p class="text-sm mt-2">Know the procedures BEFORE an emergency happens.</p>
              </div>

              <h4 class="font-bold mb-3">आपातकालीन नंबर - भारत</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-red-100 p-3 rounded text-center border-2 border-red-600">
                  <div class="text-2xl font-bold text-red-700">108</div>
                  <p class="text-xs font-semibold">Ambulance</p>
                </div>
                <div class="bg-orange-100 p-3 rounded text-center border-2 border-orange-600">
                  <div class="text-2xl font-bold text-orange-700">101</div>
                  <p class="text-xs font-semibold">आग</p>
                </div>
                <div class="bg-blue-100 p-3 rounded text-center border-2 border-blue-600">
                  <div class="text-2xl font-bold text-blue-700">100</div>
                  <p class="text-xs font-semibold">पुलिस</p>
                </div>
                <div class="bg-green-100 p-3 rounded text-center border-2 border-green-600">
                  <div class="text-2xl font-bold text-green-700">112</div>
                  <p class="text-xs font-semibold">सेवाएँ</p>
                </div>
              </div>

              <h4 class="font-bold text-lg mb-3">Emergency Action Plan - RACE</h4>
              <div class="space-y-3 mb-6">
                <div class="flex items-start bg-red-100 p-4 rounded border-l-4 border-red-600">
                  <div class="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">R</div>
                  <div>
                    <strong class="text-red-900">बचाव</strong>
                    <p class="text-sm mt-1">तत्काल खतरे में किसी को भी हटा दें (यदि ऐसा करना सुरक्षित है)</p>
                  </div>
                </div>
                <div class="flex items-start bg-orange-100 p-4 rounded border-l-4 border-orange-600">
                  <div class="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">A</div>
                  <div>
                    <strong class="text-orange-900">अलार्म</strong>
                    <p class="text-sm mt-1">Activate the alarm and call emergency services</p>
                  </div>
                </div>
                <div class="flex items-start bg-yellow-100 p-4 rounded border-l-4 border-yellow-600">
                  <div class="bg-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">C</div>
                  <div>
                    <strong class="text-yellow-900">सीमित करें</strong>
                    <p class="text-sm mt-1">आग/धुएं को रोकने के लिए दरवाजे बंद करें (आग की आपात स्थिति के लिए)</p>
                  </div>
                </div>
                <div class="flex items-start bg-green-100 p-4 rounded border-l-4 border-green-600">
                  <div class="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">E</div>
                  <div>
                    <strong class="text-green-900">खाली करना/बुझाना</strong>
                    <p class="text-sm mt-1">अगर आग छोटी है और आपको प्रशिक्षित किया गया है, तो उस जगह को खाली करें या बुझाएँ</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-3">निकासी के दिशानिर्देश:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>शांत रहें और घबराएँ नहीं</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>नज़दीकी सुरक्षित निकास के लिए निकास संकेतों का पालन करें</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>लिफ्ट का उपयोग न करें</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>सुरक्षित होने पर बुजुर्गों/दिव्यांगों की मदद</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>निर्धारित असेंबली पॉइंट पर मिलें</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>अधिकारियों द्वारा मंजूरी दिए जाने तक फिर से प्रवेश न करें</li>
              </ul>

              <div class="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                <p class="font-bold text-blue-900">📍 असेंबली प्वाइंट लोकेशन:</p>
                <p class="text-sm mt-2">अपने कार्यस्थल असेंबली पॉइंट को जानें! हरे रंग का "असेंबली पॉइंट" चिह्न देखें।</p>
              </div>
            `,
          te: `<h3 class="text-lg font-bold text-red-800 mb-4">అత్యవసర పరిస్థితిలో 🚨 ఏమి చేయాలి</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">ప్రతి సెకను అత్యవసర పరిస్థితుల్లో లెక్కించబడుతుంది!</p>
                <p class="text-sm mt-2">అత్యవసర పరిస్థితి ఏర్పడే ముందు విధానాలను తెలుసుకోండి.</p>
              </div>

              <h4 class="font-bold mb-3">అత్యవసర సంఖ్యలు - భారతదేశం</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-red-100 p-3 rounded text-center border-2 border-red-600">
                  <div class="text-2xl font-bold text-red-700">108</div>
                  <p class="text-xs font-semibold">అంబులెన్సులు</p>
                </div>
                <div class="bg-orange-100 p-3 rounded text-center border-2 border-orange-600">
                  <div class="text-2xl font-bold text-orange-700">101</div>
                  <p class="text-xs font-semibold">అగ్ని</p>
                </div>
                <div class="bg-blue-100 p-3 rounded text-center border-2 border-blue-600">
                  <div class="text-2xl font-bold text-blue-700">100</div>
                  <p class="text-xs font-semibold">రక్షకులు</p>
                </div>
                <div class="bg-green-100 p-3 rounded text-center border-2 border-green-600">
                  <div class="text-2xl font-bold text-green-700">112</div>
                  <p class="text-xs font-semibold">అన్ని సేవలు</p>
                </div>
              </div>

              <h4 class="font-bold text-lg mb-3">అత్యవసర కార్యాచరణ ప్రణాళిక - జాతి</h4>
              <div class="space-y-3 mb-6">
                <div class="flex items-start bg-red-100 p-4 rounded border-l-4 border-red-600">
                  <div class="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">R</div>
                  <div>
                    <strong class="text-red-900">రెస్క్యూ</strong>
                    <p class="text-sm mt-1">తక్షణ ప్రమాదంలో ఉన్న ఎవరినైనా తొలగించండి (అలా చేయడం సురక్షితం అయితే)</p>
                  </div>
                </div>
                <div class="flex items-start bg-orange-100 p-4 rounded border-l-4 border-orange-600">
                  <div class="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">A</div>
                  <div>
                    <strong class="text-orange-900">అలారం</strong>
                    <p class="text-sm mt-1">అలారం యాక్టివేట్ చేసి, అత్యవసర సేవలకు కాల్ చేయండి</p>
                  </div>
                </div>
                <div class="flex items-start bg-yellow-100 p-4 rounded border-l-4 border-yellow-600">
                  <div class="bg-yellow-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">Chala gurthu vastunauu</div>
                  <div>
                    <strong class="text-yellow-900">CONFINE</strong>
                    <p class="text-sm mt-1">Close doors to contain fire/smoke (for fire emergencies)</p>
                  </div>
                </div>
                <div class="flex items-start bg-green-100 p-4 rounded border-l-4 border-green-600">
                  <div class="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">E</div>
                  <div>
                    <strong class="text-green-900">ఖాళీ/ఆరిపోవడం</strong>
                    <p class="text-sm mt-1">మంటలు చిన్నగా ఉంటే ఆ ప్రాంతాన్ని ఖాళీ చేయండి లేదా ఆర్పివేయండి మరియు మీకు శిక్షణ ఇవ్వబడుతుంది</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-3">తరలింపు మార్గదర్శకాలు:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>అబ్బాయిలను ఏ విషయంలోనూ నమ్మవద్దు</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>సమీప సురక్షిత నిష్క్రమణకు నిష్క్రమణ సంకేతాలను అనుసరించండి</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>ఎలివేటర్ ‌ లను ఉపయోగించవద్దు</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>సురక్షితంగా ఉంటే వృద్ధులకు/వికలాంగులకు సహాయం చేయండి</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>నియమించబడిన అసెంబ్లీ పాయింట్ వద్ద కలవండి</li>
                <li class="flex items-start"><span class="text-green-600 mr-2 font-bold">✓</span>అధికారులు క్లియర్ చేసే వరకు తిరిగి ప్రవేశించవద్దు</li>
              </ul>

              <div class="bg-blue-100 border-2 border-blue-600 p-4 rounded">
                <p class="font-bold text-blue-900">📍 అసెంబ్లీ పాయింట్ లొకేషన్:</p>
                <p class="text-sm mt-2">మీ కార్యాలయంలోని అసెంబ్లీ పాయింట్ గురించి తెలుసుకోండి! ఆకుపచ్చ &amp;quot;అసెంబ్లీ పాయింట్&amp;quot; గుర్తు కోసం చూడండి.</p>
              </div>
            `,
        },
        imageUrl: assets.emergency,
      },
      {
        id: "step-6-quiz",
        type: "quiz",
        title: {
          en: "Module 6 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 6 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 6 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 6 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Test your Fire Safety Awareness.",
          ta: "\u0ba4\u0bc0 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0bb5\u0bbf\u0bb4\u0bbf\u0baa\u0bcd\u0baa\u0bc1\u0ba3\u0bb0\u0bcd\u0bb5\u0bc8 \u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0905\u0917\u094d\u0928\u093f \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u091c\u093e\u0917\u0930\u0942\u0915\u0924\u093e \u0915\u093e \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c05\u0c17\u0c4d\u0c28\u0c3f \u0c2d\u0c26\u0c4d\u0c30\u0c24 \u0c05\u0c35\u0c17\u0c3e\u0c39\u0c28\u0c28\u0c41 \u0c2a\u0c30\u0c40\u0c15\u0c4d\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-007",
    title: {
      en: "Material Handling",
      ta: "\u0baa\u0bca\u0bb0\u0bc1\u0bb3\u0bcd \u0b95\u0bc8\u0baf\u0bbe\u0bb3\u0bc1\u0ba4\u0bb2\u0bcd",
      hi: "\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u0939\u0948\u0902\u0921\u0932\u093f\u0902\u0917",
      te: "\u0c2e\u0c46\u0c1f\u0c40\u0c30\u0c3f\u0c2f\u0c32\u0c4d \u0c39\u0c4d\u0c2f\u0c3e\u0c02\u0c21\u0c4d\u0c32\u0c3f\u0c02\u0c17\u0c4d",
    },
    description: {
      en: "Manual Lifting, Trolley Safety, Forklifts",
      ta: "\u0b95\u0bc8\u0baf\u0bbe\u0bb2\u0bcd \u0ba4\u0bc2\u0b95\u0bcd\u0b95\u0bc1\u0ba4\u0bb2\u0bcd, \u0b9f\u0bcd\u0bb0\u0bbe\u0bb2\u0bbf \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
      hi: "\u092e\u0948\u0928\u0941\u0905\u0932 \u0932\u093f\u092b\u094d\u091f\u093f\u0902\u0917, \u091f\u094d\u0930\u0949\u0932\u0940 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
      te: "\u0c2e\u0c3e\u0c28\u0c4d\u0c2f\u0c41\u0c35\u0c32\u0c4d \u0c32\u0c3f\u0c2b\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d, \u0c1f\u0c4d\u0c30\u0c3e\u0c32\u0c40 \u0c38\u0c47\u0c2b\u0c4d\u0c1f\u0c40",
    },
    category: "Occupational Health",
    estimatedTime: "15 min",
    icon: "User",
    thumbnail: assets.safeLifting,
    steps: [
      {
        id: "step-7-1",
        type: "content",
        title: {
          en: "Manual Lifting Safety",
          ta: "\u0b95\u0bc8\u0baf\u0bbe\u0bb2\u0bcd \u0ba4\u0bc2\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u092e\u0948\u0928\u0941\u0905\u0932 \u0932\u093f\u092b\u094d\u091f\u093f\u0902\u0917 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
          te: "\u0c2e\u0c3e\u0c28\u0c4d\u0c2f\u0c41\u0c35\u0c32\u0c4d \u0c32\u0c3f\u0c2b\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d \u0c2d\u0c26\u0c4d\u0c30\u0c24",
        },
        content: {
          en: `
              <div class="flex justify-center mb-6">
                 <img src="${assets.safeLifting}" alt="Safe Lifting Technique" class="max-w-md w-full rounded shadow-lg" />
              </div>
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1 bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <h4 class="font-bold text-green-800 mb-2">✅ DOs</h4>
                  <ul class="list-disc pl-5 space-y-2 text-sm">
                    <li>Size up the load. Test weight before lifting.</li>
                    <li>Keep back straight, bend knees.</li>
                    <li>Lift with legs, not back.</li>
                    <li>Keep load close to body.</li>
                    <li>Max limit: <strong>25 kg</strong> for men (Ideal) / 15 kg for women (Guideline).</li>
                  </ul>
                </div>
                <div class="flex-1 bg-red-50 p-4 rounded border-l-4 border-red-500">
                  <h4 class="font-bold text-red-800 mb-2">❌ DON'Ts</h4>
                  <ul class="list-disc pl-5 space-y-2 text-sm">
                    <li>Do not twist body while lifting.</li>
                    <li>Do not lift heavy loads above shoulder height.</li>
                    <li>Do not jerk the load.</li>
                    <li>Do not block your vision.</li>
                  </ul>
                </div>
              </div>
            `,
          ta: `
               <p>முழங்கால்களை வளைத்து, முதுகை நேராக வைத்து தூக்கவும். கால்களைப் பயன்படுத்தவும், முதுகை அல்ல.</p>
            `,
          hi: `
              <p>घुटनों को मोड़ें, पीठ सीधी रखें। पैरों से उठाएं, पीठ से नहीं।</p>
            `,
          te: `
              <p>మోకాళ్లను వంచి, వెనుక భాగాన్ని నిటారుగా ఉంచండి. కాళ్లతో ఎత్తండి, వెనుకతో కాదు.</p>
            `,
        },
      },
      {
        id: "step-7-2",
        type: "content",
        title: {
          en: "Trolley & Equipment Safety",
          ta: "\u0b9f\u0bcd\u0bb0\u0bbe\u0bb2\u0bbf & \u0b89\u0baa\u0b95\u0bb0\u0ba3 \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u091f\u094d\u0930\u0949\u0932\u0940 \u0914\u0930 \u0909\u092a\u0915\u0930\u0923 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
          te: "\u0c1f\u0c4d\u0c30\u0c3e\u0c32\u0c40 & \u0c2a\u0c30\u0c3f\u0c15\u0c30\u0c3e\u0c32 \u0c2d\u0c26\u0c4d\u0c30\u0c24",
        },
        content: {
          en: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded shadow-sm">
                  <h4 class="font-bold text-blue-900">🛒 Hand Trolley</h4>
                  <p class="text-sm mt-2"><strong>Push vs Pull:</strong> It is generally safer to PUSH a trolley than to pull it (better visibility and ergonomics).</p>
                  <p class="text-sm mt-1">🚧 <strong>Stuck Wheel:</strong> Inspect wheels daily. Do not force a stuck trolley.</p>
                </div>
                <div class="bg-indigo-50 p-4 rounded shadow-sm">
                  <h4 class="font-bold text-indigo-900">🚜 Forklift Safety</h4>
                  <p class="text-sm mt-2"><strong>Pedestrians:</strong> Maintain eye contact with the driver. Use designated walkways.</p>
                  <p class="text-sm mt-1"><strong>Speed:</strong> Follow speed limits inside local factory (usually 5-10 kmph).</p>
                </div>
              </div>
            `,
          ta: `
               <p>ட்ராலியை இழுப்பதை விட தள்ளுவது சிறந்தது.</p>
            `,
          hi: `
              <p>ट्रॉली को खींचने की बजाय धक्का देना बेहतर है।</p>
            `,
          te: `
              <p>ట్రాలీని లాగడం కంటే నెట్టడం మంచిది.</p>
            `,
        },
      },
      {
        id: "step-7-3",
        type: "content",
        title: {
          en: "Ergonomics & Proper Lifting",
          ta: "\u0baa\u0ba3\u0bbf\u0baf\u0bbf\u0b9f \u0bb5\u0b9a\u0ba4\u0bbf & \u0b9a\u0bb0\u0bbf\u0baf\u0bbe\u0ba9 \u0ba4\u0bc2\u0b95\u0bcd\u0b95\u0bc1\u0ba4\u0bb2\u0bcd",
          hi: "\u090f\u0930\u094d\u0917\u094b\u0928\u0949\u092e\u093f\u0915\u094d\u0938 \u0914\u0930 \u0938\u0939\u0940 \u0909\u0920\u093e\u0928\u093e",
          te: "\u0c0e\u0c30\u0c4d\u0c17\u0c4a\u0c28\u0c3e\u0c2e\u0c3f\u0c15\u0c4d\u0c38\u0c4d & \u0c38\u0c30\u0c48\u0c28 \u0c32\u0c3f\u0c2b\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d",
        },
        imageUrl: assets.safeLifting,
        content: {
          en: `
              <h3 class="text-lg font-bold text-teal-800 mb-4">Work Smarter, Not Harder</h3>
              <div class="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-600 mb-6">
                <p class="font-semibold">Poor ergonomics cause back pain, muscle strain, and long-term injuries!</p>
                <p class="text-sm mt-2">70% of workers report musculoskeletal problems.</p>
              </div>

              <h4 class="font-bold mb-3">Safe Lifting Technique - 6 Steps:</h4>
              <div class="space-y-3 mb-6">
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                  <div>
                    <strong>Plan the Lift</strong>
                    <p class="text-sm">Check weight, clear path, get help if needed</p>
                  </div>
                </div>
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                  <div>
                    <strong>Position Feet</strong>
                    <p class="text-sm">Shoulder-width apart, one foot slightly forward</p>
                  </div>
                </div>
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                  <div>
                    <strong>Bend Knees</strong>
                    <p class="text-sm">Squat down - NEVER bend at the waist!</p>
                  </div>
                </div>
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</div>
                  <div>
                    <strong>Get Good Grip</strong>
                    <p class="text-sm">Use full palm, not just fingers</p>
                  </div>
                </div>
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">5</div>
                  <div>
                    <strong>Lift with Legs</strong>
                    <p class="text-sm">Keep back straight, use leg muscles</p>
                  </div>
                </div>
                <div class="flex items-start bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">6</div>
                  <div>
                    <strong>Keep Load Close</strong>
                    <p class="text-sm">Hold object close to body while moving</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-3">Weight Limits:</h4>
              <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-blue-700">👨 Men</h5>
                  <p class="text-2xl font-bold text-blue-600 my-2">25 kg</p>
                  <p class="text-sm">Maximum safe manual lift</p>
                </div>
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-pink-700">👩 Women</h5>
                  <p class="text-2xl font-bold text-pink-600 my-2">16 kg</p>
                  <p class="text-sm">Maximum safe manual lift</p>
                </div>
              </div>

              <h4 class="font-bold mb-3">Workstation Ergonomics:</h4>
              <ul class="space-y-2">
                <li class="flex items-start"><span class="text-green-600 mr-2">✓</span> Chair height: Feet flat on floor</li>
                <li class="flex items-start"><span class="text-green-600 mr-2">✓</span> Screen: Eye level, arm's length away</li>
                <li class="flex items-start"><span class="text-green-600 mr-2">✓</span> Arms: 90-degree angle at elbows</li>
                <li class="flex items-start"><span class="text-green-600 mr-2">✓</span> Take breaks: Stand/stretch every hour</li>
              </ul>

              <div class="bg-red-100 border-2 border-red-600 p-4 rounded mt-6">
                <p class="font-bold text-red-900">⛔ NEVER:</p>
                <ul class="text-sm mt-2 space-y-1">
                  <li>• Twist while lifting</li>
                  <li>• Lift above shoulder height alone</li>
                  <li>• Bend forward from the waist</li>
                  <li>• Rush - take your time!</li>
                </ul>
              </div>
            `,
          ta: `
              <h3>பணியிட வசதி & சரியான தூக்குதல்</h3>
              <p>மோசமான பணியிட வசதி முதுகு வலி, தசை வலி ஏற்படுத்துகிறது!</p>
              <h4>பாதுகாப்பான தூக்குதல் நுட்பம்:</h4>
              <ol>
                <li>திட்டமிடவும்</li>
                <li>கால்களை நிலைநிறுத்தவும்</li>
                <li>முழங்கால்களை வளைக்கவும்</li>
                <li>நல்ல பிடி பெறவும்</li>
                <li>கால்களால் தூக்கவும்</li>
                <li>சுமையை நெருக்கமாக வைக்கவும்</li>
              </ol>
              <p><strong>எடை வரம்புகள்:</strong> ஆண்கள் 25 kg, பெண்கள் 16 kg</p>
            `,
          hi: `
              <h3>एर्गोनॉमिक्स और सही उठाना</h3>
              <p>खराब एर्गोनॉमिक्स पीठ दर्द, मांसपेशियों में खिंचाव का कारण बनता है!</p>
              <h4>सुरक्षित उठाने की तकनीक:</h4>
              <ol>
                <li>योजना बनाएं</li>
                <li>पैरों को स्थिति में रखें</li>
                <li>घुटनों को मोड़ें</li>
                <li>अच्छी पकड़ लें</li>
                <li>पैरों से उठाएं</li>
                <li>लोड करीब रखें</li>
              </ol>
              <p><strong>वजन सीमा:</strong> पुरुष 25 kg, महिला 16 kg</p>
            `,
          te: `
              <h3>ఎర్గొనామిక్స్ & సరైన లిఫ్టింగ్</h3>
              <p>పేలవమైన ఎర్గొనామిక్స్ వెన్నెముక నొప్పి, కండరాల ఒత్తిడికి కారణమవుతుంది!</p>
              <h4>సురక్షిత లిఫ్టింగ్ టెక్నిక్:</h4>
              <ol>
                <li>ప్లాన్ చేయండి</li>
                <li>పాదాలను ఉంచండి</li>
                <li>మోకాళ్లను వంచండి</li>
                <li>మంచి పట్టు పొందండి</li>
                <li>కాళ్ళతో ఎత్తండి</li>
                <li>లోడ్‌ను దగ్గరగా ఉంచండి</li>
              </ol>
              <p><strong>బరువు పరిమితులు:</strong> పురుషులు 25 kg, మహిళలు 16 kg</p>
            `,
        },
      },
      {
        id: "step-7-4",
        type: "content",
        title: {
          en: "Safe Storage & Stacking",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbe\u0ba9 \u0b9a\u0bc7\u0bae\u0bbf\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092d\u0902\u0921\u093e\u0930\u0923",
          te: "\u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24 \u0c28\u0c3f\u0c32\u0c4d\u0c35",
        },
        imageUrl: assets.materialHandlingIntro,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-800 mb-4">Gravity Never Sleeps!</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-indigo-50 p-4 rounded border-l-4 border-indigo-500">
                  <h4 class="font-bold text-indigo-900 mb-2">📦 Stacking Rules</h4>
                  <ul class="list-disc pl-5 text-sm space-y-2">
                    <li><strong>Base:</strong> Ensure heavy items are at the bottom.</li>
                    <li><strong>Height:</strong> Do not stack too high (Max 3x width usually).</li>
                    <li><strong>Interlock:</strong> Cross-stack layers for stability.</li>
                    <li><strong>Aisles:</strong> Do not stick out into walkways.</li>
                  </ul>
                </div>
                <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                  <h4 class="font-bold text-orange-900 mb-2">🚧 Chemical Storage</h4>
                  <ul class="list-disc pl-5 text-sm space-y-2">
                    <li><strong>Labels:</strong> Must face outward.</li>
                    <li><strong>Separation:</strong> Keep incompatibles apart (Acids vs Bases).</li>
                    <li><strong>Bunds:</strong> Use drip trays to catch leaks.</li>
                  </ul>
                </div>
              </div>

              <div class="bg-blue-100 p-4 rounded text-center">
                <h4 class="font-bold text-blue-900 mb-2">Pallet Safety</h4>
                <p class="text-sm">Inspect pallets for broken slats or protruding nails. A broken pallet can cause a stack to collapse!</p>
              </div>
            `,
          ta: `
              <h3>பாதுகாப்பான சேமிப்பு</h3>
              <p>கனமான பொருட்களை கீழே வைக்கவும்.</p>
              <p>அதிக உயரத்தில் அடுக்கி வைக்காதீர்கள்.</p>
              <p>மிகவும் அகலமாக அடுக்கி வைக்காதீர்கள் (Interlock).</p>
            `,
          hi: `
              <h3>सुरक्षित भंडारण</h3>
              <p>भारी सामान नीचे रखें।</p>
              <p>बहुत ऊंचा न ढेर लगाएं।</p>
              <p>रास्तों में बाधा न डालें।</p>
            `,
          te: `
              <h3>సురక్షిత నిల్వ</h3>
              <p>బరువైన వస్తువులను కింద ఉంచండి.</p>
              <p>మరీ ఎత్తుగా పేర్చవద్దు.</p>
              <p>నడక దారిలో అడ్డంకులు లేకుండా ఉంచండి.</p>
            `,
        },
      },
      {
        id: "step-7-quiz",
        type: "interactive",
        interactive: {
          image: assets.quizAwkwardLift,
          hazards: [
            {
              id: "q7",
              x: 50,
              y: 50,
              description: {
                en: "Unsafe Lifting Posture",
                ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bb1\u0bcd\u0bb1 \u0ba4\u0bc2\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0bae\u0bc1\u0bb1\u0bc8",
                hi: "\u0905\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u092b\u094d\u091f\u093f\u0902\u0917",
                te: "\u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24\u0c02 \u0c15\u0c3e\u0c28\u0c3f \u0c32\u0c3f\u0c2b\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d",
              },
            },
          ],
        },
        title: {
          en: "Module 7 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 7 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 7 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 7 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Identify the unsafe lifting practice.",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bb1\u0bcd\u0bb1 \u0ba4\u0bc2\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd \u0bae\u0bc1\u0bb1\u0bc8\u0baf\u0bc8 \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd \u0b95\u0bbe\u0ba3\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0905\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u093f\u092b\u094d\u091f\u093f\u0902\u0917 \u0915\u0940 \u092a\u0939\u091a\u093e\u0928 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24\u0c02 \u0c15\u0c3e\u0c28\u0c3f \u0c32\u0c3f\u0c2b\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d\u200c\u0c28\u0c41 \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-008",
    title: {
      en: "Electrical Safety",
      ta: "\u0bae\u0bbf\u0ba9\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
      hi: "\u0935\u093f\u0926\u094d\u092f\u0941\u0924 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
      te: "\u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c41\u0c24\u0c4d \u0c2d\u0c26\u0c4d\u0c30\u0c24",
    },
    description: {
      en: "Shock Prevention, Wires, Fuse Boxes",
      ta: "\u0b85\u0ba4\u0bbf\u0bb0\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf \u0ba4\u0b9f\u0bc1\u0baa\u0bcd\u0baa\u0bc1, \u0b95\u0bae\u0bcd\u0baa\u0bbf\u0b95\u0bb3\u0bcd",
      hi: "\u0936\u0949\u0915 \u0915\u0940 \u0930\u094b\u0915\u0925\u093e\u092e",
      te: "\u0c37\u0c3e\u0c15\u0c4d \u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c23",
    },
    category: "Technical Safety",
    estimatedTime: "20 min",
    icon: "Zap",
    thumbnail: assets.electricalDanger,
    steps: [
      {
        id: "step-8-1",
        type: "content",
        title: {
          en: "Preventing Electric Shock",
          ta: "\u0bae\u0bbf\u0ba9\u0bcd \u0b85\u0ba4\u0bbf\u0bb0\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf\u0baf\u0bc8\u0ba4\u0bcd \u0ba4\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd",
          hi: "\u092c\u093f\u091c\u0932\u0940 \u0915\u0947 \u091d\u091f\u0915\u0947 \u0915\u0940 \u0930\u094b\u0915\u0925\u093e\u092e",
          te: "\u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c41\u0c24\u0c4d \u0c37\u0c3e\u0c15\u0c4d \u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c23",
        },
        content: {
          en: `
              <div class="flex justify-center mb-6">
                 <img src="${assets.electricalDanger}" alt="Electrical Hazards" class="max-w-md w-full rounded shadow-lg" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-red-50 p-4 rounded border-l-4 border-red-500">
                  <h4 class="font-bold text-red-900 mb-2">⚡ Common Hazards</h4>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>Damaged / Frayed wires.</li>
                    <li>Overloaded sockets.</li>
                    <li>Water near electrical equipment.</li>
                    <li>Bypassing fuses or breakers.</li>
                  </ul>
                </div>
                <div class="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <h4 class="font-bold text-green-900 mb-2">✅ Safe Practices</h4>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>Inspect cords before use.</li>
                    <li>Use <strong>LOTO</strong> before repair.</li>
                    <li>Keep panels clear (1 meter access).</li>
                    <li>Only trained electricians open panels.</li>
                  </ul>
                </div>
              </div>
            `,
          ta: `
               <ul class="list-disc pl-5">
                 <li>சேதமடைந்த கம்பிகளை பயன்படுத்த வேண்டாம்.</li>
                 <li>ஈரமான கைகளால் தொட வேண்டாம்.</li>
                 <li>தகுதிவாய்ந்த எலக்ட்ரீஷியன்களை மட்டும் அனுமதிக்கவும்.</li>
               </ul>
            `,
          hi: `
              <p>कटे हुए तारों का प्रयोग न करें। गीले हाथों से न छुएं।</p>
            `,
          te: `
              <p>దెబ్బతిన్న వైర్లను ఉపయోగించవద్దు. తడి చేతులతో తాకవద్దు.</p>
            `,
        },
      },
      {
        id: "step-8-2",
        type: "content",
        title: {
          en: "Effects of Current on Body",
          ta: "\u0b89\u0b9f\u0bb2\u0bbf\u0bb2\u0bcd \u0bae\u0bbf\u0ba9\u0bcd\u0ba9\u0bcb\u0b9f\u0bcd\u0b9f\u0ba4\u0bcd\u0ba4\u0bbf\u0ba9\u0bcd \u0bb5\u0bbf\u0bb3\u0bc8\u0bb5\u0bc1\u0b95\u0bb3\u0bcd",
          hi: "\u0936\u0930\u0940\u0930 \u092a\u0930 \u0915\u0930\u0902\u091f \u0915\u093e \u092a\u094d\u0930\u092d\u093e\u0935",
          te: "\u0c36\u0c30\u0c40\u0c30\u0c02\u0c2a\u0c48 \u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c41\u0c24\u0c4d \u0c2a\u0c4d\u0c30\u0c2d\u0c3e\u0c35\u0c02",
        },
        imageUrl: assets.electricalDanger,
        content: {
          en: `
              <h3 class="text-lg font-bold text-red-800 mb-4">Why Electricity is Dangerous</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-semibold">It's not just the voltage, it's the CURRENT that kills!</p>
                <p class="text-sm mt-2">Even a small amount of current (30mA) can cause heart fibrillation.</p>
              </div>

              <h4 class="font-bold mb-3">Current Thresholds & Effects:</h4>
              <div class="space-y-4 mb-6">
                <div class="flex items-center bg-yellow-50 p-3 rounded border border-yellow-200">
                  <div class="bg-yellow-500 text-white font-bold w-16 text-center py-1 rounded mr-4">1 mA</div>
                  <div>
                    <strong>Tingle Sensation</strong>
                    <p class="text-xs text-gray-600">Faint tingle, uncomfortable but not painful.</p>
                  </div>
                </div>
                <div class="flex items-center bg-orange-50 p-3 rounded border border-orange-200">
                  <div class="bg-orange-500 text-white font-bold w-16 text-center py-1 rounded mr-4">10 mA</div>
                  <div>
                    <strong>Muscle Contraction</strong>
                    <p class="text-xs text-gray-600">"Can't Let Go" threshold. Painful shock.</p>
                  </div>
                </div>
                <div class="flex items-center bg-red-50 p-3 rounded border border-red-200">
                  <div class="bg-red-500 text-white font-bold w-16 text-center py-1 rounded mr-4">30 mA</div>
                  <div>
                    <strong>Respiratory Paralysis</strong>
                    <p class="text-xs text-gray-600">Breathing stops. Possible death.</p>
                  </div>
                </div>
                <div class="flex items-center bg-red-100 p-3 rounded border border-red-400">
                  <div class="bg-red-700 text-white font-bold w-16 text-center py-1 rounded mr-4">100 mA</div>
                  <div>
                    <strong>Ventricular Fibrillation</strong>
                    <p class="text-xs text-gray-600">Heart rhythm disrupted. Fatal without CPR.</p>
                  </div>
                </div>
              </div>

              <h4 class="font-bold mb-2">Primary Factors of Severity:</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Amount of Current:</strong> Higher amps = more damage.</li>
                <li><strong>Path through Body:</strong> Across chest/heart is most dangerous.</li>
                <li><strong>Duration:</strong> Longer exposure = severe burns/death.</li>
              </ul>
            `,
          ta: `
              <h3>உடலில் மின்னோட்டத்தின் விரைவான விளைவுகள்</h3>
              <ul>
                <li><strong>1 mA:</strong> லேசான கூச்ச உணர்வு</li>
                <li><strong>10 mA:</strong> தசை பிடிப்பு (கைவிட முடியாது)</li>
                <li><strong>30 mA:</strong> சுவாசம் தடைபடுதல்</li>
                <li><strong>100 mA:</strong> இதய துடிப்பு பாதிப்பு (உயிரிழப்பு)</li>
              </ul>
              <p>மின்னோட்டம் இதயத்தின் வழியாக பாய்வது மிகவும் ஆபத்தானது.</p>
            `,
          hi: `
              <h3>शरीर पर करंट का प्रभाव</h3>
              <ul>
                <li><strong>1 mA:</strong> हल्का झटका</li>
                <li><strong>10 mA:</strong> मांसपेशियों में संकुचन</li>
                <li><strong>30 mA:</strong> सांस रुकना</li>
                <li><strong>100 mA:</strong> दिल का दौरा (घातक)</li>
              </ul>
            `,
          te: `
              <h3>శరీరంపై విద్యుత్ ప్రభావం</h3>
              <ul>
                <li><strong>1 mA:</strong> స్వల్ప జలదరింపు</li>
                <li><strong>10 mA:</strong> కండరాల సంకోచం</li>
                <li><strong>30 mA:</strong> శ్వాస ఆగిపోవడం</li>
                <li><strong>100 mA:</strong> గుండె వైఫల్యం</li>
              </ul>
            `,
        },
      },
      {
        id: "step-8-3",
        type: "content",
        title: {
          en: "Voltage Levels & Safe Distances",
          ta: "\u0bae\u0bbf\u0ba9\u0bcd\u0ba9\u0bb4\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba8\u0bbf\u0bb2\u0bc8\u0b95\u0bb3\u0bcd & \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
          hi: "voltage \u0938\u094d\u0924\u0930 \u0914\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0926\u0942\u0930\u0940",
          te: "\u0c35\u0c4b\u0c32\u0c4d\u0c1f\u0c47\u0c1c\u0c4d \u0c38\u0c4d\u0c25\u0c3e\u0c2f\u0c3f\u0c32\u0c41 & \u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24 \u0c26\u0c42\u0c30\u0c3e\u0c32\u0c41",
        },
        imageUrl: assets.electricalVoltage,
        content: {
          en: `
              <h3 class="text-lg font-bold text-blue-800 mb-4">Understanding Voltage Levels</h3>
              <p class="mb-4 text-sm">Different voltages require different safety protocols and approach limits.</p>

              <div class="grid grid-cols-1 gap-4 mb-6">
                <div class="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 bg-opacity-50">
                  <h5 class="font-bold text-blue-900">Low Voltage (LV)</h5>
                  <p class="text-sm font-semibold">< 1000V AC</p>
                  <p class="text-xs mt-1">Found in: Office outlets, lighting, small machinery.</p>
                </div>
                <div class="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50 bg-opacity-50">
                  <h5 class="font-bold text-orange-900">High Voltage (HV)</h5>
                  <p class="text-sm font-semibold">> 1000V AC</p>
                  <p class="text-xs mt-1">Found in: Transformers, main distribution lines.</p>
                </div>
              </div>

              <h4 class="font-bold mb-3 text-red-700">⚠️ Safe Approach Distances</h4>
              <table class="w-full text-sm border-collapse border border-gray-300 mb-6">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-300 p-2 text-left">Voltage</th>
                    <th class="border border-gray-300 p-2 text-left">Min. Distance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 p-2">Up to 11kV</td>
                    <td class="border border-gray-300 p-2 font-bold text-red-600">3 meters</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-2">11kV - 33kV</td>
                    <td class="border border-gray-300 p-2 font-bold text-red-600">3.7 meters</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-2">Above 33kV</td>
                    <td class="border border-gray-300 p-2 font-bold text-red-600">5+ meters</td>
                  </tr>
                </tbody>
              </table>
              <div class="bg-yellow-100 p-3 rounded text-center text-sm font-bold border border-yellow-400">
                ⛔ Always assume overhead lines are LIVE and DANGEROUS.
              </div>
            `,
          ta: `
              <h3>மின்னழுத்த நிலைகள்</h3>
              <p><strong>குறைந்த மின்னழுத்தம் (LV):</strong> < 1000V (அலுவலகம், விளக்குகள்)</p>
              <p><strong>உயர் மின்னழுத்தம் (HV):</strong> > 1000V (மின்மாற்றிகள்)</p>
              <h4>பாதுகாப்பான இடைவெளி:</h4>
              <p>11kV வரை: 3 மீட்டர் இடைவெளி அவசியம்.</p>
            `,
          hi: `
              <h3>वोल्टेज स्तर</h3>
              <p><strong>कम वोल्टेज:</strong> < 1000V</p>
              <p><strong>उच्च वोल्टेज:</strong> > 1000V</p>
              <h4>सुरक्षित दूरी:</h4>
              <p>11kV तक: 3 मीटर की दूरी बनाए रखें।</p>
            `,
          te: `
              <h3>వోల్టేజ్ స్థాయిలు</h3>
              <p><strong>తక్కువ వోల్టేజ్:</strong> < 1000V</p>
              <p><strong>హై వోల్టేజ్:</strong> > 1000V</p>
              <h4>సురక్షిత దూరం:</h4>
              <p>11kV వరకు: 3 మీటర్ల దూరంలో ఉండాలి.</p>
            `,
        },
      },
      {
        id: "step-8-4",
        type: "content",
        title: {
          en: "Safety Devices: ELCB & RCCB",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1 \u0b9a\u0bbe\u0ba4\u0ba9\u0b99\u0bcd\u0b95\u0bb3\u0bcd",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093e \u0909\u092a\u0915\u0930\u0923",
          te: "\u0c2d\u0c26\u0c4d\u0c30\u0c24\u0c3e \u0c2a\u0c30\u0c3f\u0c15\u0c30\u0c3e\u0c32\u0c41",
        },
        imageUrl: assets.electricalDanger,
        content: {
          en: `
              <h3 class="text-lg font-bold text-green-800 mb-4">Life Saving Devices</h3>
              <p class="mb-4">Standard fuses protect equipment. <strong>RCCBs protect HUMANS.</strong></p>

              <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white p-4 rounded shadow-sm border-t-4 border-green-500">
                  <h5 class="font-bold text-lg mb-2">RCCB / ELCB</h5>
                  <p class="text-xs text-gray-500 mb-2">Residual Current Circuit Breaker</p>
                  <p class="text-sm">Detects tiny leakages (like current flowing through a person) and cuts power in <strong>0.03 seconds</strong>.</p>
                </div>
                <div class="bg-white p-4 rounded shadow-sm border-t-4 border-gray-500">
                  <h5 class="font-bold text-lg mb-2">MCB</h5>
                  <p class="text-xs text-gray-500 mb-2">Miniature Circuit Breaker</p>
                  <p class="text-sm">Trips only on overload or short circuit. <strong>Does NOT prevent shock.</strong></p>
                </div>
              </div>

              <h4 class="font-bold mb-3">Does your RCCB work?</h4>
              <div class="bg-blue-50 p-4 rounded border border-blue-200">
                <p class="font-bold text-blue-800 mb-2">🧪 The Test Button</p>
                <ol class="list-decimal pl-5 space-y-1 text-sm">
                  <li>Look for the button marked <strong>'T'</strong> or <strong>'Test'</strong> on the breaker.</li>
                  <li>Press it once a month.</li>
                  <li>If the switch flips OFF instantly, it works.</li>
                  <li>If nothing happens, <strong>replace it immediately!</strong></li>
                </ol>
              </div>
            `,
          ta: `
              <h3>பாதுகாப்பு சாதனங்கள் (RCCB)</h3>
              <p>சாதாரண பிரேக்கர்கள் (MCB) உபகரணங்களை மட்டுமே பாதுகாக்கும்.</p>
              <p><strong>RCCB</strong> மட்டுமே மின்சார அதிர்ச்சியிலிருந்து உங்களை காப்பாற்றும்.</p>
              <p><strong>சோதனை பொத்தான் (Test Button):</strong> மாதம் ஒருமுறை அழுத்தி சோதிக்கவும். அது உடனே அணைக்க வேண்டும்.</p>
            `,
          hi: `
              <h3>सुरक्षा उपकरण (RCCB)</h3>
              <p>MCB केवल उपकरणों की रक्षा करता है। <strong>RCCB</strong> इंसानों को करंट से बचाता है।</p>
              <p><strong>टेस्ट बटन:</strong> महीने में एक बार 'T' बटन दबाएं। बिजली तुरंत बंद होनी चाहिए।</p>
            `,
          te: `
              <h3>భద్రతా పరికరాలు (RCCB)</h3>
              <p>MCB పరికరాలను మాత్రమే రక్షిస్తుంది. <strong>RCCB</strong> విద్యుత్ షాక్ నుండి మిమ్మల్ని రక్షిస్తుంది.</p>
              <p><strong>టెస్ట్ బటన్:</strong> నెలకు ఒకసారి 'T' బటన్‌ను నొక్కండి. విద్యుత్ వెంటనే ఆగిపోవాలి.</p>
            `,
        },
      },
      {
        id: "step-8-quiz",
        type: "interactive",
        interactive: {
          image: assets.quizExposedWire,
          hazards: [
            {
              id: "q8",
              x: 50,
              y: 50,
              description: {
                en: "Exposed Live Wires",
                ta: "\u0ba4\u0bbf\u0bb1\u0ba8\u0bcd\u0ba4 \u0bae\u0bbf\u0ba9\u0bcd \u0b95\u0bae\u0bcd\u0baa\u0bbf\u0b95\u0bb3\u0bcd",
                hi: "\u0916\u0941\u0932\u0947 \u0924\u093e\u0930",
                te: "\u0c2c\u0c39\u0c3f\u0c30\u0c4d\u0c17\u0c24\u0c2e\u0c48\u0c28 \u0c35\u0c48\u0c30\u0c4d\u0c32\u0c41",
              },
            },
          ],
        },
        title: {
          en: "Module 8 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 8 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 8 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 8 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Identify the electrical hazard.",
          ta: "\u0bae\u0bbf\u0ba9\u0bcd \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc8 \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd \u0b95\u0bbe\u0ba3\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0935\u093f\u0926\u094d\u092f\u0941\u0924 \u0916\u0924\u0930\u0947 \u0915\u0940 \u092a\u0939\u091a\u093e\u0928 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c41\u0c24\u0c4d \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-009",
    title: {
      en: "Chemical Safety",
      ta: "\u0bb5\u0bc7\u0ba4\u0bbf\u0baf\u0bbf\u0baf\u0bb2\u0bcd \u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bc1",
      hi: "\u0930\u093e\u0938\u093e\u092f\u0928\u093f\u0915 \u0938\u0941\u0930\u0915\u094d\u0937\u093e",
      te: "\u0c30\u0c38\u0c3e\u0c2f\u0c28 \u0c2d\u0c26\u0c4d\u0c30\u0c24",
    },
    description: {
      en: "Handling, MSDS, NFPA Diamond",
      ta: "\u0b95\u0bc8\u0baf\u0bbe\u0bb3\u0bc1\u0ba4\u0bb2\u0bcd, MSDS, NFPA",
      hi: "\u0939\u0948\u0902\u0921\u0932\u093f\u0902\u0917, MSDS",
      te: "\u0c39\u0c4d\u0c2f\u0c3e\u0c02\u0c21\u0c4d\u0c32\u0c3f\u0c02\u0c17\u0c4d, MSDS",
    },
    category: "Technical Safety",
    estimatedTime: "20 min",
    icon: "Beaker",
    thumbnail: assets.chemicalHazards,
    steps: [
      {
        id: "step-9-1",
        type: "content",
        title: {
          en: "Safe Handling & MSDS",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbe\u0ba9 \u0b95\u0bc8\u0baf\u0bbe\u0bb3\u0bc1\u0ba4\u0bb2\u0bcd & MSDS",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0939\u0948\u0902\u0921\u0932\u093f\u0902\u0917 \u0914\u0930 MSDS",
          te: "\u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23 & MSDS",
        },
        content: {
          en: `
              <div class="flex justify-center mb-6">
                 <img src="${assets.chemicalHazards}" alt="Chemical Hazards" class="max-w-md w-full rounded shadow-lg" />
              </div>
              <div class="bg-indigo-50 p-4 rounded mb-4 border-l-4 border-indigo-500">
                <h4 class="font-bold text-indigo-900">What is MSDS? (Material Safety Data Sheet)</h4>
                <p class="text-sm mt-1">Information regarding properties of chemicals, hazards, and safety precautions. <strong>ALWAYS READ MSDS BEFORE HANDLING.</strong></p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 shadow rounded">
                  <h5 class="font-bold text-gray-700">✅ Do</h5>
                  <ul class="list-disc pl-5 text-sm space-y-1">
                    <li>Use appropriate PPE (Rubber Gloves, Apron).</li>
                    <li>Work in well-ventilated areas.</li>
                    <li>Store chemicals in designated areas.</li>
                    <li>Label all containers clearly.</li>
                  </ul>
                </div>
                <div class="bg-white p-4 shadow rounded">
                  <h5 class="font-bold text-gray-700">❌ Don't</h5>
                  <ul class="list-disc pl-5 text-sm space-y-1">
                    <li>Never smell or taste chemicals.</li>
                    <li>Do not mix chemicals without knowledge.</li>
                    <li>Do not use unlabelled containers.</li>
                  </ul>
                </div>
              </div>
            `,
          ta: `
               <p>MSDS - வேதிப்பொருட்களின் பண்புகள் மற்றும் பாதுகாப்பு முன்னெச்சரிக்கைகள் பற்றிய தகவல்.</p>
            `,
          hi: `
              <p>MSDS: रसायनों के गुणों और सुरक्षा सावधानियों के बारे में जानकारी।</p>
            `,
          te: `
              <p>MSDS: రసాయనాల గుణాలు మరియు భద్రతా జాగ్రత్తల గురించిన సమాచారం.</p>
            `,
        },
      },
      {
        id: "step-9-2",
        type: "content",
        title: {
          en: "NFPA 704 Diamond",
          ta: "NFPA 704 \u0bb5\u0bc8\u0bb0\u0bae\u0bcd",
          hi: "NFPA 704 \u0921\u093e\u092f\u092e\u0902\u0921",
          te: "NFPA 704 \u0c21\u0c48\u0c2e\u0c02\u0c21\u0c4d",
        },
        content: {
          en: `
              <div class="flex flex-col items-center">
                <div class="mb-4">
                   <img src="${assets.chemicalLabel}" alt="Chemical Labels" class="max-w-xs rounded shadow" />
                </div>
                <div class="grid grid-cols-2 gap-2 w-48 h-48 rotate-45 my-6">
                   <div class="bg-blue-500 flex items-center justify-center text-white font-bold text-xl -rotate-45 shadow border-2 border-white">Health (Blue)</div>
                   <div class="bg-red-500 flex items-center justify-center text-white font-bold text-xl -rotate-45 shadow border-2 border-white">Fire (Red)</div>
                   <div class="bg-yellow-400 flex items-center justify-center text-black font-bold text-xl -rotate-45 shadow border-2 border-white">Reactivity (Yel)</div>
                   <div class="bg-white flex items-center justify-center text-black font-bold text-xl -rotate-45 shadow border-2 border-white">Specific (White)</div>
                </div>
                <div class="w-full max-w-lg">
                  <table class="w-full text-xs md:text-sm border-collapse border border-gray-300">
                    <tr class="bg-blue-100"><td class="p-2 font-bold text-blue-900">Blue (Health)</td><td class="p-2">0 (Normal) to 4 (Deadly)</td></tr>
                    <tr class="bg-red-100"><td class="p-2 font-bold text-red-900">Red (Flammability)</td><td class="p-2">0 (Will not burn) to 4 (Below 73°F)</td></tr>
                    <tr class="bg-yellow-100"><td class="p-2 font-bold text-yellow-900">Yellow (Reactivity)</td><td class="p-2">0 (Stable) to 4 (May detonate)</td></tr>
                    <tr class="bg-gray-100"><td class="p-2 font-bold text-gray-900">White (Specific)</td><td class="p-2">ACID, ALK, COR (Corrosive), ☢️ (Radioactive)</td></tr>
                  </table>
                </div>
              </div>
            `,
          ta: `
               <p>நீலம் (சுகாதாரம்), சிவப்பு (தீ), மஞ்சள் (வினைத்திறன்), வெள்ளை (குறிப்பிட்ட ஆபத்து).</p>
            `,
          hi: `
              <p>नीला (स्वास्थ्य), लाल (आग), पीला (प्रतिक्रियाशीलता), सफेद (विशिष्ट)।</p>
            `,
          te: `
              <p>నీలం (ఆరోగ్యం), ఎరుపు (మంట), పసుపు (రియాక్టివిటీ), తెలుపు (నిర్దిష్ట).</p>
            `,
        },
      },
      {
        id: "step-9-3",
        type: "content",
        title: {
          en: "GHS Hazard Symbols",
          ta: "GHS \u0b86\u0baa\u0ba4\u0bcd\u0ba4\u0bc1 \u0b95\u0bc1\u0bb1\u0bbf\u0baf\u0bc0\u0b9f\u0bc1\u0b95\u0bb3\u0bcd",
          hi: " GHS \u0916\u0924\u0930\u093e \u092a\u094d\u0930\u0924\u0940\u0915",
          te: "GHS \u0c2a\u0c4d\u0c30\u0c2e\u0c3e\u0c26 \u0c1a\u0c3f\u0c39\u0c4d\u0c28\u0c3e\u0c32\u0c41",
        },
        imageUrl: assets.chemicalLabel,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-800 mb-4">Know Your Symbols (GHS)</h3>
              <p class="mb-4">Global Harmonized System (GHS) uses standard pictograms to identify hazards instantly.</p>

              <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6 text-sm">
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">🔥</div>
                  <strong class="text-red-600">Flammable</strong>
                  <p class="text-xs text-gray-500">Catches fire easily (Petrol, Solvents)</p>
                </div>
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">☠️</div>
                  <strong class="text-gray-900">Toxic</strong>
                  <p class="text-xs text-gray-500">Fatal if swallowed/inhaled (Cyanide)</p>
                </div>
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">🧪</div>
                  <strong class="text-gray-900">Corrosive</strong>
                  <p class="text-xs text-gray-500">Burns skin/eyes (Acids)</p>
                </div>
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">💥</div>
                  <strong class="text-orange-600">Explosive</strong>
                  <p class="text-xs text-gray-500">Explodes on impact/heat</p>
                </div>
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">🌾</div>
                  <strong class="text-green-600">Environmental</strong>
                  <p class="text-xs text-gray-500">Toxic to aquatic life</p>
                </div>
                <div class="bg-white p-3 rounded border flex flex-col items-center text-center">
                  <div class="text-4xl mb-2">⚕️</div>
                  <strong class="text-orange-500">Health Hazard</strong>
                  <p class="text-xs text-gray-500">Cancer/long-term damage</p>
                </div>
              </div>
              <p class="font-bold text-center bg-gray-100 p-2 rounded">Always look for these diamond-shaped red border signs on containers!</p>
            `,
          ta: `
              <h3>GHS ஆபத்து குறியீடுகள்</h3>
              <ul>
                <li>🔥 தீப்பற்றக்கூடியவை</li>
                <li>☠️ நச்சுத்தன்மை வாய்ந்தவை</li>
                <li>🧪 அரிக்கும் தன்மை கொண்டவை</li>
                <li>💥 வெடிக்கும் தன்மை கொண்டவை</li>
              </ul>
            `,
          hi: `
              <h3>GHS खतरा प्रतीक</h3>
              <ul>
                <li>🔥 ज्वलनशील</li>
                <li>☠️ विषाक्त</li>
                <li>🧪 संक्षारक</li>
                <li>💥 विस्फोटक</li>
              </ul>
            `,
          te: `
              <h3>GHS ప్రమాద చిహ్నాలు</h3>
              <ul>
                <li>🔥 మండే గుణం</li>
                <li>☠️ విషపూరితమైన</li>
                <li>🧪 తినివేసే గుణం</li>
                <li>💥 పేలుడు పదార్థం</li>
              </ul>
            `,
        },
      },
      {
        id: "step-9-4",
        type: "content",
        title: {
          en: "Spill Response Procedure",
          ta: "\u0b95\u0b9a\u0bbf\u0bb5\u0bc1 \u0b95\u0bc8\u0baf\u0bbe\u0bb3\u0bc1\u0bae\u0bcd \u0bae\u0bc1\u0bb1\u0bc8",
          hi: "\u0938\u094d\u092a\u093f\u0932 \u0930\u093f\u0938\u094d\u092a\u093e\u0902\u0938",
          te: "\u0c38\u0c4d\u0c2a\u0c3f\u0c32\u0c4d \u0c30\u0c46\u0c38\u0c4d\u0c2a\u0c3e\u0c28\u0c4d\u0c38\u0c4d",
        },
        imageUrl: assets.oilSpill,
        content: {
          en: `
              <h3 class="text-lg font-bold text-red-800 mb-4">Chemical Spill Response</h3>
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <p class="font-bold">ACT FAST, but ACT SAFELY.</p>
                <p class="text-sm">Minor spill? Clean it. Major spill? Evacuate.</p>
              </div>

              <h4 class="font-bold mb-3">Steps for Minor Spills:</h4>
              <ol class="list-decimal pl-5 space-y-3 mb-6">
                <li class="pl-2">
                  <strong>Notify:</strong> Inform supervisor and nearby workers.
                </li>
                <li class="pl-2">
                  <strong>PPE Up:</strong> Wear chemical gloves, goggles, and mask.
                </li>
                <li class="pl-2">
                  <strong>Contain:</strong> Use absorbent booms or socks to stop spread.
                </li>
                <li class="pl-2">
                  <strong>Clean:</strong> Use absorbent pads/sand to soak up liquid.
                </li>
                <li class="pl-2">
                  <strong>Disposal:</strong> Place used absorbents in RED hazardous waste bags.
                </li>
              </ol>

              <div class="bg-yellow-100 border-2 border-yellow-500 p-4 rounded text-center">
                <strong>⛔ NEVER wash chemicals down the drain!</strong>
              </div>
            `,
          ta: `
              <h3>ரசாயன கசிவு கையாளும் முறை</h3>
              <ol>
                <li>மேற்பார்வையாளருக்கு தெரிவிக்கவும்.</li>
                <li>PPE அணியவும்.</li>
                <li>பரவுவதை தடுக்கவும்.</li>
                <li>உறிஞ்சும் பொருட்களை பயன்படுத்தி சுத்தம் செய்யவும்.</li>
                <li>சிவப்பு பையில் அப்புறப்படுத்தவும்.</li>
              </ol>
            `,
          hi: `
              <h3>रासायनिक रिसाव प्रतिक्रिया</h3>
              <ol>
                <li>पर्यवेक्षक को सूचित करें।</li>
                <li>PPE पहनें।</li>
                <li>फैलाव रोकें।</li>
                <li>साफ करें।</li>
                <li>लाल बैग में डिस्पोज करें।</li>
              </ol>
            `,
          te: `
              <h3>రసాయన స్పిల్ రెస్పాన్స్</h3>
              <ol>
                <li>సూపర్‌వైజర్‌కు తెలియజేయండి.</li>
                <li>PPE ధరించండి.</li>
                <li>వ్యాప్తిని అరికట్టండి.</li>
                <li>శుభ్రం చేయండి.</li>
                <li>ఎరుపు సంచిలో పారవేయండి.</li>
              </ol>
            `,
        },
      },
      {
        id: "step-9-5",
        type: "content",
        title: {
          en: "Safe Storage Rules",
          ta: "\u0baa\u0bbe\u0ba4\u0bc1\u0b95\u0bbe\u0baa\u0bcd\u0baa\u0bbe\u0ba9 \u0b9a\u0bc7\u0bae\u0bbf\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092d\u0902\u0921\u093e\u0930\u0923",
          te: "\u0c38\u0c41\u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24 \u0c28\u0c3f\u0c32\u0c4d\u0c35",
        },
        imageUrl: assets.chemicalLabel,
        content: {
          en: `
              <h3 class="text-lg font-bold text-indigo-800 mb-4">Chemical Storage Golden Rules</h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="text-2xl mr-3">🧴</div>
                  <div>
                    <strong>Keep Lids Closed:</strong> Prevents evaporation and spills.
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="text-2xl mr-3">🏷️</div>
                  <div>
                    <strong>Labels Facing Out:</strong> Always know what you are grabbing.
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="text-2xl mr-3">↕️</div>
                  <div>
                    <strong>Eye Level or Below:</strong> Never store heavy chemicals above shoulder height.
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="text-2xl mr-3">🧱</div>
                  <div>
                    <strong>Secondary Containment:</strong> Use trays to catch leaks.
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="text-2xl mr-3">🚫</div>
                  <div>
                    <strong>Incompatible Chemicals:</strong> Store Acids away from Bases. Flammables away from Oxidizers.
                  </div>
                </div>
              </div>
            `,
          ta: `
              <h3>பாதுகாப்பான சேமிப்பு விதிகள்</h3>
              <ul>
                <li>மூடிகளை மூடி வைக்கவும்.</li>
                <li>லேபிள்கள் தெரியும் வகையில் வைக்கவும்.</li>
                <li>கண் மட்டத்திற்கு கீழே சேமிக்கவும்.</li>
                <li>வேதிப்பொருட்களை பிரித்து வைக்கவும்.</li>
              </ul>
            `,
          hi: `
              <h3>सुरक्षित भंडारण नियम</h3>
              <ul>
                <li>ढक्कन बंद रखें।</li>
                <li>लेबल बाहर की ओर रखें।</li>
                <li>आंखों के स्तर से नीचे स्टोर करें।</li>
                <li>असंगत रसायनों को दूर रखें।</li>
              </ul>
            `,
          te: `
              <h3>సురక్షిత నిల్వ సూత్రాలు</h3>
              <ul>
                <li>మూతలు మూసి ఉంచండి.</li>
                <li>లేబుల్స్ కనిపించేలా ఉంచండి.</li>
                <li>కంటి స్థాయి కంటే దిగువన నిల్వ చేయండి.</li>
                <li>రసాయనాలను వేరుగా ఉంచండి.</li>
              </ul>
            `,
        },
      },
      {
        id: "step-9-quiz",
        type: "interactive",
        interactive: {
          image: assets.quizUnlabeledBottle,
          hazards: [
            {
              id: "q9",
              x: 50,
              y: 50,
              description: {
                en: "Unlabeled Chemical Bottle",
                ta: "\u0bb2\u0bc7\u0baa\u0bbf\u0bb3\u0bcd \u0b87\u0bb2\u0bcd\u0bb2\u0bbe\u0ba4 \u0baa\u0bbe\u0b9f\u0bcd\u0b9f\u0bbf\u0bb2\u0bcd",
                hi: "\u092c\u093f\u0928\u093e \u0932\u0947\u092c\u0932 \u0935\u093e\u0932\u0940 \u092c\u094b\u0924\u0932",
                te: "\u0c32\u0c47\u0c2c\u0c41\u0c32\u0c4d \u0c32\u0c47\u0c28\u0c3f \u0c2c\u0c3e\u0c1f\u0c3f\u0c32\u0c4d",
              },
            },
          ],
        },
        title: {
          en: "Module 9 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 9 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 9 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 9 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Identify the chemical handling error.",
          ta: "\u0bb5\u0bc7\u0ba4\u0bbf\u0baf\u0bbf\u0baf\u0bb2\u0bcd \u0b95\u0bc8\u0baf\u0bbe\u0bb3\u0bc1\u0ba4\u0bb2\u0bcd \u0baa\u0bbf\u0bb4\u0bc8\u0baf\u0bc8 \u0b85\u0b9f\u0bc8\u0baf\u0bbe\u0bb3\u0bae\u0bcd \u0b95\u0bbe\u0ba3\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u0930\u093e\u0938\u093e\u092f\u0928\u093f\u0915 \u0939\u0948\u0902\u0921\u0932\u093f\u0902\u0917 \u0924\u094d\u0930\u0941\u091f\u093f \u0915\u0940 \u092a\u0939\u091a\u093e\u0928 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c30\u0c38\u0c3e\u0c2f\u0c28 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23 \u0c32\u0c4b\u0c2a\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-010",
    title: {
      en: "Environment & Sustainability",
      ta: "\u0b9a\u0bc1\u0bb1\u0bcd\u0bb1\u0bc1\u0b9a\u0bcd\u0b9a\u0bc2\u0bb4\u0bb2\u0bcd & \u0ba8\u0bbf\u0bb2\u0bc8\u0ba4\u0bcd\u0ba4\u0ba9\u0bcd\u0bae\u0bc8",
      hi: "\u092a\u0930\u094d\u092f\u093e\u0935\u0930\u0923 \u0914\u0930 \u0938\u094d\u0925\u093f\u0930\u0924\u093e",
      te: "\u0c2a\u0c30\u0c4d\u0c2f\u0c3e\u0c35\u0c30\u0c23\u0c02 & \u0c38\u0c41\u0c38\u0c4d\u0c25\u0c3f\u0c30\u0c24",
    },
    description: {
      en: "5R Principles, Waste Management",
      ta: "5R \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8\u0b95\u0bb3\u0bcd, \u0b95\u0bb4\u0bbf\u0bb5\u0bc1 \u0bae\u0bc7\u0bb2\u0bbe\u0ba3\u0bcd\u0bae\u0bc8",
      hi: "5R \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924, \u0905\u092a\u0936\u093f\u0937\u094d\u091f \u092a\u094d\u0930\u092c\u0902\u0927\u0928",
      te: "5R \u0c38\u0c42\u0c24\u0c4d\u0c30\u0c3e\u0c32\u0c41, \u0c35\u0c4d\u0c2f\u0c30\u0c4d\u0c25\u0c3e\u0c32 \u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c39\u0c23",
    },
    category: "Environment",
    estimatedTime: "15 min",
    thumbnail: assets.wasteBins,
    steps: [
      {
        id: "step-10-1",
        type: "content",
        title: {
          en: "The 5R Principle",
          ta: "5R \u0b95\u0bca\u0bb3\u0bcd\u0b95\u0bc8",
          hi: "5R \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924",
          te: "5R \u0c38\u0c42\u0c24\u0c4d\u0c30\u0c02",
        },
        content: {
          en: `
              <div class="space-y-4">
                <div class="flex justify-center mb-4">
                  <img src="${assets.envImpact}" alt="Environmental Impact" class="max-w-md w-full rounded shadow" />
                </div>
                <div class="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <h3 class="font-bold text-green-900 mb-2">Sustainable Living</h3>
                  <ul class="space-y-2">
                    <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 font-bold text-green-800">1</span> <strong>Refuse:</strong> Say no to single-use plastics.</li>
                    <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 font-bold text-green-800">2</span> <strong>Reduce:</strong> Use less energy and water.</li>
                    <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 font-bold text-green-800">3</span> <strong>Reuse:</strong> Use items multiple times.</li>
                    <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 font-bold text-green-800">4</span> <strong>Repurpose:</strong> Upcycle waste into new products.</li>
                    <li class="flex items-center"><span class="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 font-bold text-green-800">5</span> <strong>Recycle:</strong> Process waste into raw material.</li>
                  </ul>
                </div>
              </div>
            `,
          ta: `
               <p>மறுக்கவும் (Refuse), குறைக்கவும் (Reduce), மீண்டும் பயன்படுத்தவும் (Reuse), மறுநோக்கம் (Repurpose), மறுசுழற்சி (Recycle).</p>
            `,
          hi: `
              <p>5R: मना करें, कम करें, पुनः उपयोग करें, नया उद्देश्य दें, पुनर्चक्रण करें।</p>
            `,
          te: `
              <p>5R: తిరస్కరించండి, తగ్గించండి, మళ్లీ ఉపయోగించండి, మరొక ప్రయోజనం కోసం వాడండి, రీసైకిల్ చేయండి.</p>
            `,
        },
      },
      {
        id: "step-10-2",
        type: "content",
        title: {
          en: "Waste Segregation",
          ta: "\u0b95\u0bb4\u0bbf\u0bb5\u0bc1 \u0ba4\u0bb0\u0bae\u0bcd \u0baa\u0bbf\u0bb0\u0bbf\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd",
          hi: "\u0905\u092a\u0936\u093f\u0937\u094d\u091f \u092a\u0943\u0925\u0915\u094d\u0915\u0930\u0923",
          te: "\u0c35\u0c4d\u0c2f\u0c30\u0c4d\u0c25\u0c3e\u0c32 \u0c35\u0c3f\u0c2d\u0c1c\u0c28",
        },
        content: {
          en: `
              <div class="flex justify-center gap-4 mb-6">
                 <img src="${assets.recyclingBins}" alt="Recycling Bins" class="h-32 rounded shadow object-contain" />
                 <img src="${assets.waste}" alt="Waste Types" class="h-32 rounded shadow object-contain" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
                <div class="bg-green-600 p-6 rounded-lg shadow-lg">
                  <div class="text-4xl mb-2">🍏</div>
                  <h4 class="font-bold text-xl">Green Bin</h4>
                  <p class="text-sm mt-2">Biodegradable Waste (Food, Leaves)</p>
                </div>
                <div class="bg-blue-600 p-6 rounded-lg shadow-lg">
                  <div class="text-4xl mb-2">📰</div>
                  <h4 class="font-bold text-xl">Blue Bin</h4>
                  <p class="text-sm mt-2">Recyclable Waste (Paper, Plastic, Metal)</p>
                </div>
                <div class="bg-red-600 p-6 rounded-lg shadow-lg">
                  <div class="text-4xl mb-2">🧪</div>
                  <h4 class="font-bold text-xl">Red Bin</h4>
                  <p class="text-sm mt-2">Hazardous Waste (Chemicals, Oil rags)</p>
                </div>
              </div>
            `,
          ta: `
               <p>பச்சை (மக்கும் குப்பை), நீலம் (மறுசுழற்சி), சிவப்பு (ஆபத்தான கழிவு).</p>
            `,
          hi: `
              <p>हरा (जैविक), नीला (रीसाइकिलेबल), लाल (खतरनाक)।</p>
            `,
          te: `
              <p>ఆకుపచ్చ (బయోడిగ్రేడబుల్), నీలం (రీసైకిల్), ఎరుపు (ప్రమాదకరమైన).</p>
            `,
        },
      },
      {
        id: "step-10-3",
        type: "content",
        title: {
          en: "Energy Conservation",
          ta: "\u0b86\u0bb1\u0bcd\u0bb1\u0bb2\u0bcd \u0b9a\u0bc7\u0bae\u0bbf\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u090a\u0930\u094d\u091c\u093e \u0938\u0902\u0930\u0915\u094d\u0937\u0923",
          te: "\u0c36\u0c15\u0c4d\u0c24\u0c3f \u0c06\u0c26\u0c3e",
        },
        imageUrl: assets.envImpact,
        content: {
          en: `
              <h3 class="text-lg font-bold text-yellow-600 mb-4">Save Energy, Save Future</h3>
              <p class="mb-4">Reducing energy consumption lowers our carbon footprint.</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-yellow-50 p-4 rounded border border-yellow-200 text-center">
                  <div class="text-4xl mb-2">💡</div>
                  <strong class="block mb-1">Lighting</strong>
                  <p class="text-sm">Switch to LEDs. Turn OFF when leaving room.</p>
                </div>
                <div class="bg-blue-50 p-4 rounded border border-blue-200 text-center">
                  <div class="text-4xl mb-2">❄️</div>
                  <strong class="block mb-1">AC / Fans</strong>
                  <p class="text-sm">Set AC to 24°C. Don't cool empty spaces.</p>
                </div>
                <div class="bg-red-50 p-4 rounded border border-red-200 text-center">
                  <div class="text-4xl mb-2">⚙️</div>
                  <strong class="block mb-1">Machinery</strong>
                  <p class="text-sm">Shut down idle machines. Fix air leaks.</p>
                </div>
              </div>
              <div class="bg-green-100 p-4 rounded border-l-4 border-green-600">
                <strong>Did you know?</strong> One compressed air leak can cost ₹50,000 per year!
              </div>
            `,
          ta: `
              <h3>ஆற்றல் சேமிப்பு</h3>
              <ul>
                <li>LED விளக்குகளைப் பயன்படுத்தவும்.</li>
                <li>AC-ஐ 24°C இல் வைக்கவும்.</li>
                <li>இயந்திரங்களை சும்மா ஓடவிடாதீர்கள்.</li>
                <li>காற்று கசிவுகளை சரிசெய்யவும்.</li>
              </ul>
            `,
          hi: `
              <h3>ऊर्जा संरक्षण</h3>
              <ul>
                <li>LED का उपयोग करें।</li>
                <li>AC को 24°C पर सेट करें।</li>
                <li>मशीनों को बेवजह न चलाएं।</li>
              </ul>
            `,
          te: `
              <h3>శక్తి ఆదా</h3>
              <ul>
                <li>LED లైట్లను వాడండి.</li>
                <li>AC ని 24°C వద్ద ఉంచండి.</li>
                <li>యంత్రాలను అనవసరంగా నడపవద్దు.</li>
              </ul>
            `,
        },
      },
      {
        id: "step-10-4",
        type: "content",
        title: {
          en: "Water Conservation",
          ta: "\u0ba8\u0bc0\u0bb0\u0bcd \u0b9a\u0bc7\u0bae\u0bbf\u0baa\u0bcd\u0baa\u0bc1",
          hi: "\u091c\u0932 \u0938\u0902\u0930\u0915\u094d\u0937\u0923",
          te: "\u0c28\u0c40\u0c1f\u0c3f \u0c06\u0c26\u0c3e",
        },
        imageUrl: assets.envImpact,
        content: {
          en: `
              <h3 class="text-lg font-bold text-blue-600 mb-4">Every Drop Counts</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex items-center bg-blue-50 p-3 rounded">
                  <span class="text-2xl mr-4">🚰</span>
                  <div>
                    <strong>Fix Leaks:</strong> A dripping tap wastes 20,000 liters/year.
                  </div>
                </div>
                <div class="flex items-center bg-blue-50 p-3 rounded">
                  <span class="text-2xl mr-4">🔄</span>
                  <div>
                    <strong>Recycle:</strong> Reuse treated wastewater for gardening.
                  </div>
                </div>
                <div class="flex items-center bg-blue-50 p-3 rounded">
                  <span class="text-2xl mr-4">🚿</span>
                  <div>
                    <strong>Efficient Use:</strong> Use push-taps or sensors.
                  </div>
                </div>
              </div>
            `,
          ta: `
              <h3>நீர் சேமிப்பு</h3>
              <ul>
                <li>கசிவுகளை சரிசெய்யவும்.</li>
                <li>நீரை மறுசுழற்சி செய்யவும்.</li>
                <li>சிக்கனமாக பயன்படுத்தவும்.</li>
              </ul>
            `,
          hi: `
              <h3>जल संरक्षण</h3>
              <ul>
                <li>लीक ठीक करें।</li>
                <li>पानी रिसाइकिल करें।</li>
                <li>कम पानी इस्तेमाल करें।</li>
              </ul>
            `,
          te: `
              <h3>నీటి ఆదా</h3>
              <ul>
                <li>లీకేజీలను అరికట్టండి.</li>
                <li>నీటిని రీసైకిల్ చేయండి.</li>
                <li>తక్కువ నీటిని వాడండి.</li>
              </ul>
            `,
        },
      },
      {
        id: "step-10-5",
        type: "content",
        title: {
          en: "Pollution Control",
          ta: "\u0bae\u0bbe\u0b9a\u0bc1 \u0b95\u0b9f\u0bcd\u0b9f\u0bc1\u0baa\u0bcd\u0baa\u0bbe\u0b9f\u0bc1",
          hi: "\u092a\u094d\u0930\u0926\u0942\u0937\u0923 \u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923",
          te: "\u0c15\u0c3e\u0c32\u0c41\u0c37\u0c4d\u0c2f \u0c28\u0c3f\u0c2f\u0c02\u0c24\u0c4d\u0c30\u0c23",
        },
        imageUrl: assets.envImpact,
        content: {
          en: `
              <h3 class="text-lg font-bold text-gray-700 mb-4">Air & Noise Pollution</h3>
              
              <div class="grid md:grid-cols-2 gap-4">
                <div class="border p-4 rounded shadow-sm">
                  <h4 class="font-bold text-gray-600 mb-2">💨 Air Quality</h4>
                  <ul class="list-disc pl-5 text-sm space-y-1">
                    <li>Use dust collectors/filters.</li>
                    <li>Keep chemical containers closed.</li>
                    <li>Maintain vehicles properly.</li>
                  </ul>
                </div>
                <div class="border p-4 rounded shadow-sm">
                  <h4 class="font-bold text-purple-600 mb-2">🔊 Noise Control</h4>
                  <ul class="list-disc pl-5 text-sm space-y-1">
                    <li>Enclose noisy machines.</li>
                    <li>Lubricate moving parts.</li>
                    <li>Wear Ear Plugs (> 85 dB).</li>
                  </ul>
                </div>
              </div>
            `,
          ta: `
              <h3>மாசு கட்டுப்பாடு</h3>
              <p><strong>காற்று:</strong> தூசி வடிகட்டிகளை பயன்படுத்தவும்.</p>
              <p><strong>ஒலி:</strong> இயந்திரங்களை சத்தமில்லாமல் பராமரிக்கவும். காது கேட்கும் கருவி (Ear plug) அணியவும்.</p>
            `,
          hi: `
              <h3>प्रदूषण नियंत्रण</h3>
              <p>वायु: धूल फिल्टर का प्रयोग करें।</p>
              <p>ध्वनि: मशीनों को लुब्रिकेट करें। ईयर प्लग पहनें।</p>
            `,
          te: `
              <h3>కాలుష్య నియంత్రణ</h3>
              <p>గాలి: డస్ట్ ఫిల్టర్ల వాడకం.</p>
              <p>ధ్వని: యంత్రాల నిర్వహణ. ఇయర్ ప్లగ్ ధరించండి.</p>
            `,
        },
      },
      {
        id: "step-10-quiz",
        type: "quiz",
        title: {
          en: "Module 10 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 10 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 10 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 10 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Test your Environmental knowledge.",
          ta: "\u0b9a\u0bc1\u0bb1\u0bcd\u0bb1\u0bc1\u0b9a\u0bcd\u0b9a\u0bc2\u0bb4\u0bb2\u0bcd \u0b85\u0bb1\u0bbf\u0bb5\u0bc8 \u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
          hi: "\u092a\u0930\u094d\u092f\u093e\u0935\u0930\u0923 \u091c\u094d\u091e\u093e\u0928 \u0915\u093e \u092a\u0930\u0940\u0915\u094d\u0937\u0923 \u0915\u0930\u0947\u0902\u0964",
          te: "\u0c2a\u0c30\u0c4d\u0c2f\u0c3e\u0c35\u0c30\u0c23 \u0c2a\u0c30\u0c3f\u0c1c\u0c4d\u0c1e\u0c3e\u0c28\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c30\u0c40\u0c15\u0c4d\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.",
        },
      },
    ],
  },
  {
    id: "ehs-011",
    title: {
      en: "Incident Reporting & Analysis",
      ta: "\u0bb5\u0bbf\u0baa\u0ba4\u0bcd\u0ba4\u0bc1 \u0b85\u0bb1\u0bbf\u0b95\u0bcd\u0b95\u0bc8 & \u0baa\u0b95\u0bc1\u0baa\u0bcd\u0baa\u0bbe\u0baf\u0bcd\u0bb5\u0bc1",
      hi: "\u0918\u091f\u0928\u093e \u0930\u093f\u092a\u094b\u0930\u094d\u091f\u093f\u0902\u0917 \u0914\u0930 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923",
      te: "\u0c38\u0c02\u0c18\u0c1f\u0c28 \u0c28\u0c3f\u0c35\u0c47\u0c26\u0c3f\u0c15 & \u0c35\u0c3f\u0c36\u0c4d\u0c32\u0c47\u0c37\u0c23",
    },
    description: {
      en: "Case Studies, Reporting Procedure",
      ta: "\u0bb5\u0bb4\u0b95\u0bcd\u0b95\u0bc1 \u0b86\u0baf\u0bcd\u0bb5\u0bc1\u0b95\u0bb3\u0bcd, \u0b85\u0bb1\u0bbf\u0b95\u0bcd\u0b95\u0bc8 \u0bae\u0bc1\u0bb1\u0bc8",
      hi: "\u0915\u0947\u0938 \u0938\u094d\u091f\u0921\u0940\u091c, \u0930\u093f\u092a\u094b\u0930\u094d\u091f\u093f\u0902\u0917 \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e",
      te: "\u0c15\u0c47\u0c38\u0c4d \u0c38\u0c4d\u0c1f\u0c21\u0c40\u0c38\u0c4d, \u0c30\u0c3f\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02",
    },
    category: "Management",
    estimatedTime: "20 min",
    thumbnail: assets.emergency,
    steps: [
      {
        id: "step-11-1",
        type: "content",
        title: {
          en: "Case Study: The Loose Bolt",
          ta: "\u0bb5\u0bb4\u0b95\u0bcd\u0b95\u0bc1 \u0b86\u0baf\u0bcd\u0bb5\u0bc1: \u0ba4\u0bb3\u0bb0\u0bcd\u0bb5\u0bbe\u0ba9 \u0baa\u0bcb\u0bb2\u0bcd\u0b9f\u0bcd",
          hi: "\u0915\u0947\u0938 \u0938\u094d\u091f\u0921\u0940: \u0922\u0940\u0932\u093e \u092c\u094b\u0932\u094d\u091f",
          te: "\u0c15\u0c47\u0c38\u0c4d \u0c38\u0c4d\u0c1f\u0c21\u0c40: \u0c32\u0c42\u0c38\u0c4d \u0c2c\u0c4b\u0c32\u0c4d\u0c1f\u0c4d",
        },
        content: {
          en: `
              <div class="bg-gray-50 p-6 rounded-lg">
                <div class="float-right ml-4 mb-4 w-1/3">
                   <img src="${assets.firstAidScene}" alt="Accident Scene" class="w-full rounded shadow border" />
                </div>
                <h3 class="font-bold text-gray-800 text-lg mb-4">Story of Ignored Near Miss</h3>
                <div class="space-y-4">
                  <div class="flex">
                    <div class="w-12 text-2xl">📅</div>
                    <div>
                      <h5 class="font-bold">Day 1: Near Miss</h5>
                      <p class="text-sm">Operator notices a loose bolt on the guard. Ignores it. (Unsafe Condition)</p>
                    </div>
                  </div>
                   <div class="flex">
                    <div class="w-12 text-2xl">⏳</div>
                    <div>
                      <h5 class="font-bold">Day 3: The Incident</h5>
                      <p class="text-sm">Vibration causes the guard to fall off while machine is running.</p>
                    </div>
                  </div>
                   <div class="flex">
                    <div class="w-12 text-2xl">💥</div>
                    <div>
                      <h5 class="font-bold">The Injury</h5>
                      <p class="text-sm">Worker instinctivly tries to catch the guard, hand touches moving gear. Finger injury.</p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 p-4 bg-blue-100 rounded text-center font-bold text-blue-900 border border-blue-200">
                  Lesson: Report "Minor" issues immediately to prevent Major accidents!
                </div>
              </div>
            `,
          ta: `
               <p>பாடம்: சிறிய பிரச்சனைகளை உடனடியாக புகாரளிக்கவும்.</p>
            `,
          hi: `
              <p>पाठ: छोटी समस्याओं की तुरंत रिपोर्ट करें।</p>
            `,
          te: `
              <p>పాఠం: చిన్న సమస్యలను వెంటనే నివేదించండి.</p>
            `,
        },
      },
      {
        id: "step-11-2",
        type: "content",
        title: {
          en: "Reporting Procedure",
          ta: "\u0b85\u0bb1\u0bbf\u0b95\u0bcd\u0b95\u0bc8 \u0bae\u0bc1\u0bb1\u0bc8",
          hi: "\u0930\u093f\u092a\u094b\u0930\u094d\u091f\u093f\u0902\u0917 \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e",
          te: "\u0c30\u0c3f\u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c3f\u0c02\u0c17\u0c4d \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c02",
        },
        content: {
          en: `
              <div class="flex flex-col items-center">
                <div class="w-full max-w-2xl bg-white p-6 shadow-lg rounded-lg border-t-4 border-blue-600">
                  <h3 class="text-blue-900 font-bold text-xl mb-4">Steps to Report</h3>
                   <img src="${assets.firstAidKit}" alt="First Aid Kit" class="float-right w-24 mb-4 ml-4 object-contain" />
                  <div class="space-y-4">
                    <div class="flex items-center p-3 bg-gray-50 rounded">
                      <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4">1</div>
                      <div><strong>Inform Supervisor:</strong> Immediately tell your line leader.</div>
                    </div>
                    <div class="flex items-center p-3 bg-gray-50 rounded">
                      <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4">2</div>
                      <div><strong>First Aid:</strong> Visit the Occupational Health Center (OHC).</div>
                    </div>
                    <div class="flex items-center p-3 bg-gray-50 rounded">
                      <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4">3</div>
                      <div><strong>Fill Incident Form:</strong> Document what happened (Time, Place, Cause).</div>
                    </div>
                     <div class="flex items-center p-3 bg-gray-50 rounded">
                      <div class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4">4</div>
                      <div><strong>RCA:</strong> Join the investigation team to find Root Cause.</div>
                    </div>
                  </div>
                </div>
              </div>
            `,
          ta: `
               <ol class="list-decimal pl-5">
                 <li>மேற்பார்வையாளரிடம் தெரிவிக்கவும்.</li>
                 <li>முதலுதவி பெறவும்.</li>
                 <li>விபத்து படிவத்தை நிரப்பவும்.</li>
               </ol>
            `,
          hi: `
              <ol class="list-decimal pl-5">
                <li>पर्यवेक्षक को सूचित करें।</li>
                <li>प्राथमिक चिकित्सा प्राप्त करें।</li>
                <li>घटना फॉर्म भरें।</li>
              </ol>
            `,
          te: `
              <ol class="list-decimal pl-5">
                <li>పర్యవేక్షకుడికి తెలియజేయండి.</li>
                <li>ప్రథమ చికిత్స పొందండి.</li>
                <li>సంఘటన ఫారమ్‌ను పూరించండి.</li>
              </ol>
            `,
        },
      },
      {
        id: "step-11-4",
        type: "content",
        title: {
          en: "First Aid Basics",
          ta: "\u0bae\u0bc1\u0ba4\u0bb2\u0bc1\u0ba4\u0bb5\u0bbf \u0b85\u0b9f\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc8\u0b95\u0bb3\u0bcd",
          hi: "\u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915 \u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u092e\u0942\u0932 \u092c\u093e\u0924\u0947\u0902",
          te: "\u0c2a\u0c4d\u0c30\u0c25\u0c2e \u0c1a\u0c3f\u0c15\u0c3f\u0c24\u0c4d\u0c38 \u0c2a\u0c4d\u0c30\u0c3e\u0c25\u0c2e\u0c3f\u0c15\u0c3e\u0c32\u0c41",
        },
        imageUrl: assets.firstAidKit,
        content: {
          en: `
              <h3 class="text-lg font-bold text-rose-800 mb-4">🏥 First Aid - The Golden Hour</h3>
              <div class="bg-rose-50 p-4 rounded-lg border-l-4 border-rose-600 mb-6">
                <p class="font-semibold">The first 60 minutes after an injury are critical!</p>
                <p class="text-sm mt-2">Proper first aid can save lives and prevent disabilities.</p>
              </div>

              <h4 class="font-bold mb-3">Primary Survey - DR ABC</h4>
              <div class="space-y-2 mb-6">
                <div class="bg-red-100 p-3 rounded border-l-4 border-red-600">
                  <strong>D - Danger:</strong> Check for danger to yourself and the victim
                </div>
                <div class="bg-orange-100 p-3 rounded border-l-4 border-orange-600">
                  <strong>R - Response:</strong> Check if the person is conscious
                </div>
                <div class="bg-yellow-100 p-3 rounded border-l-4 border-yellow-600">
                  <strong>A - Airway:</strong> Ensure airway is clear
                </div>
                <div class="bg-green-100 p-3 rounded border-l-4 border-green-600">
                  <strong>B - Breathing:</strong> Check if they are breathing
                </div>
                <div class="bg-blue-100 p-3 rounded border-l-4 border-blue-600">
                  <strong>C - Circulation:</strong> Check for pulse and severe bleeding
                </div>
              </div>

              <h4 class="font-bold mb-3">Common Workplace Emergencies:</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-red-700">🩸 Bleeding</h5>
                  <ol class="text-sm mt-2 space-y-1">
                    <li>1. Apply direct pressure with clean cloth</li>
                    <li>2. Elevate injured area above heart</li>
                    <li>3. Don't remove cloth - add more if needed</li>
                    <li>4. Apply pressure bandage</li>
                  </ol>
                </div>
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-orange-700">🔥 Burns</h5>
                  <ol class="text-sm mt-2 space-y-1">
                    <li>1. Cool with running water (10-20 min)</li>
                    <li>2. Remove jewelry before swelling</li>
                    <li>3. Cover with sterile dressing</li>
                    <li>4. DON'T use ice, oil, or butter!</li>
                  </ol>
                </div>
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-blue-700">⚡ Shock</h5>
                  <ol class="text-sm mt-2 space-y-1">
                    <li>1. Lay person down</li>
                    <li>2. Elevate legs (if no spinal injury)</li>
                    <li>3. Keep warm with blanket</li>
                    <li>4. Monitor breathing</li>
                  </ol>
                </div>
                <div class="bg-white p-4 rounded border shadow-sm">
                  <h5 class="font-bold text-purple-700">💀 Fractures</h5>
                  <ol class="text-sm mt-2 space-y-1">
                    <li>1. DON'T move the injured part</li>
                    <li>2. Immobilize with splint</li>
                    <li>3. Apply ice pack</li>
                    <li>4. Get medical help immediately</li>
                  </ol>
                </div>
              </div>

              <div class="bg-green-100 border-2 border-green-600 p-4 rounded mt-6">
                <p class="font-bold text-green-900">✓ Location of First Aid Kit:</p>
                <p class="text-sm mt-2">Know where the nearest first aid kit and trained first aiders are located in your workplace!</p>
              </div>

              <div class="bg-red-100 border-2 border-red-600 p-4 rounded mt-4">
                <p class="font-bold text-red-900">⚠️ When to Call Emergency (108):</p>
                <ul class="text-sm mt-2 space-y-1">
                  <li>• Unconsciousness</li>
                  <li>• Severe bleeding</li>
                  <li>• Chest pain or breathing difficulty</li>
                  <li>• Head, neck, or spinal injury</li>
                  <li>• Severe burns</li>
                </ul>
              </div>
            `,
          ta: `
              <h3>முதலுதவி அடிப்படைகள்</h3>
              <p>காயத்திற்கு பிறகு முதல் 60 நிமிடங்கள் முக்கியமானவை!</p>
              <h4>DR ABC</h4>
              <ul>
                <li><strong>D - ஆபத்து:</strong> உங்களுக்கும் பாதிக்கப்பட்டவருக்கும் ஆபத்தை சரிபார்க்கவும்</li>
                <li><strong>R - பதில்:</strong> நபர் உணர்வுடன் உள்ளாரா என சரிபார்க்கவும்</li>
                <li><strong>A - காற்றுப்பாதை:</strong> காற்றுப்பாதை தெளிவாக உள்ளதா</li>
                <li><strong>B - சுவாசம்:</strong> சுவாசிக்கிறாரா என சரிபார்க்கவும்</li>
                <li><strong>C - இரத்த ஓட்டம்:</strong> துடிப்பு மற்றும் இரத்தப்போக்கு சரிபார்ப்பு</li>
              </ul>
            `,
          hi: `
              <h3>प्राथमिक चिकित्सा मूल बातें</h3>
              <p>चोट के बाद पहले 60 मिनट महत्वपूर्ण हैं!</p>
              <h4>DR ABC</h4>
              <ul>
                <li><strong>D - खतरा:</strong> खुद और पीड़ित के लिए खतरे की जांच करें</li>
                <li><strong>R - प्रतिक्रिया:</strong> जांचें कि व्यक्ति होश में है या नहीं</li>
                <li><strong>A - वायुमार्ग:</strong> सुनिश्चित करें कि वायुमार्ग साफ है</li>
                <li><strong>B - सांस:</strong> जांचें कि वे सांस ले रहे हैं या नहीं</li>
                <li><strong>C - परिसंचरण:</strong> नाड़ी और गंभीर रक्तस्राव की जांच करें</li>
              </ul>
            `,
          te: `
              <h3>ప్రథమ చికిత్స ప్రాథమికాలు</h3>
              <p>గాయం తర్వాత మొదటి 60 నిమిషాలు కీలకమైనవి!</p>
              <h4>DR ABC</h4>
              <ul>
                <li><strong>D - ప్రమాదం:</strong> మీకు మరియు బాధితుడికి ప్రమాదాన్ని తనిఖీ చేయండి</li>
                <li><strong>R - ప్రతిస్పందన:</strong> వ్యక్తి స్పృహలో ఉన్నాడో లేదో తనిఖీ చేయండి</li>
                <li><strong>A - వాయుమార్గం:</strong> వాయుమార్గం స్పష్టంగా ఉందో లేదో నిర్ధారించుకోండి</li>
                <li><strong>B - శ్వాస:</strong> వారు శ్వాస తీసుకుంటున్నారో లేదో తనిఖీ చేయండి</li>
                <li><strong>C - రక్త ప్రసరణ:</strong> పల్స్ మరియు తీవ్రమైన రక్తస్రావం తనిఖీ చేయండి</li>
              </ul>
            `,
        },
      },
      {
        id: "step-11-quiz",
        type: "quiz",
        title: {
          en: "Module 11 Assessment",
          ta: "\u0ba4\u0bca\u0b95\u0bc1\u0ba4\u0bbf 11 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1",
          hi: "\u092e\u0949\u0921\u094d\u092f\u0942\u0932 11 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928",
          te: "\u0c2e\u0c3e\u0c21\u0c4d\u0c2f\u0c42\u0c32\u0c4d 11 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d",
        },
        content: {
          en: "Final Case Study Assessment.",
          ta: "\u0b87\u0bb1\u0bc1\u0ba4\u0bbf \u0bb5\u0bb4\u0b95\u0bcd\u0b95\u0bc1 \u0b86\u0baf\u0bcd\u0bb5\u0bc1 \u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc0\u0b9f\u0bc1.",
          hi: "\u0905\u0902\u0924\u093f\u092e \u0915\u0947\u0938 \u0938\u094d\u091f\u0921\u0940 \u092e\u0942\u0932\u094d\u092f\u093e\u0902\u0915\u0928\u0964",
          te: "\u0c24\u0c41\u0c26\u0c3f \u0c15\u0c47\u0c38\u0c4d \u0c38\u0c4d\u0c1f\u0c21\u0c40 \u0c05\u0c38\u0c46\u0c38\u0c4d\u0c2e\u0c46\u0c02\u0c1f\u0c4d.",
        },
      },
    ],
  },
];

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
      text: { en: 'Which bin is for food waste?', ta: 'உணவு கழிவுகளுக்கான தொட்டி?', hi: 'खाद्य अपशिष्ट के लिए कौन सा डिब्बा?', te: 'ఆహార వ్యర్థాలకు ఏ డబ్బా?' },
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
