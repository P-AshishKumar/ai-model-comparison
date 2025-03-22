export const questions = [
    {
        id: 'Scenario 1',
        title: 'Violation for Security Updates',
        question: 'I have a Nokia 2017 that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy?',
        promptTechnique:
            [
                {
                    id: 'zero-shot',
                    title: 'Zero-shot Prompting',
                    prompt: (question: string) => `Question: ${question} Please give me a yes or no answer.`,
                },
                {
                    id: 'few-shot',
                    title: 'Few-shot Prompting',
                    prompt: (question: string) => `Example1: I have a Blackberry 2012 that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is yes because blackberry 2012 no longer receives updates from the vendor and hence is a security risk.\n\nExample 2: I have a Samsung 2024 with original OS that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is no because its OS is original, and it received updates.\n\nNow answer the below question:\nQuestion: ${question} Please give me a yes or no answer.`,
                }
            ]
    },
    {
        id: 'Scenario 2',
        title: 'Email Storage Compliance in MDM Policy',
        question: `Employee used personal device while waiting 4 weeks for company laptop (beyond 3-week policy). Device is properly secured with company controls, and CISO granted formal exception for 5-6 weeks until data transfer and wiping. This arrangement is acceptable from security and compliance perspective.`,
        promptTechnique:
            [
                {
                    id: 'zero-shot',
                    title: 'Zero-shot Prompting',
                    prompt: (question: string) => `One of my employees did not receive a company laptop until 4 weeks after joining, despite the company policy stating laptops would be provided within 3 weeks. During this time, she used her personal device strictly under IT’s guidance and with WPI-approved security configurations applied. The device has: A strong passcode to unlock, Encryption enabled, The latest vendor OS updates installed, University security policies configured (e.g., remote wipe, password requirements), No jailbreaking or modifications. Now that she has received her company laptop, she is unable to transfer data due to network privacy settings. However, an exception has been formally requested and granted by the Chief Information Security Officer to continue using the personal device to store and access company data for the next 5–6 weeks, after which all data will be securely transferred and wiped from the personal device. Considering all factors, is this arrangement acceptable from a security and compliance perspective? Please answer yes or no ?`,
                },
                {
                    id: 'chain-of-thought',
                    title: 'Chain-of-thought Prompting',
                    prompt: (question: string) => `I need to determine if it's acceptable for an employee to continue using her personal device for company data. Let me analyze this step by step: What is the initial policy situation regarding company laptops? How long did the employee wait for a company laptop compared to policy? What security measures are currently in place on the personal device? Is the latest vendor OS updated installed? (Yes/No) Why can't the data be transferred now that she has received the company laptop? Has proper authorization been obtained for continued personal device use? What is the timeframe for this exception? What is the plan for the company data after this period ends? Considering all factors, is this arrangement acceptable from a security and compliance perspective? Please answer yes or no ?  \n\nThink through:
 
Step-by-Step Analysis:
1. What is the initial policy situation regarding company laptops?
The policy states that university-owned smart devices (laptops not explicitly mentioned, but inferred under university-issued devices) are provided to certain employees when deemed necessary by their supervisors. IT configures and manages these devices. \n 
2. How long did the employee wait for a company laptop compared to policy? 
🟨 Not specified in the policy document. Needs case-specific information.\n 
3. What security measures are currently in place on the personal device?
The policy requires that any personally owned device accessing university resources must:\n 
Use a vendor-provided OS
Stay updated
Have a PIN/password
Support remote wipe on 10 failed attempts or if lost
Limit email storage to 4 weeks
Not be jailbroken\n 
4. Is the latest vendor OS update installed? (Yes/No)\n 
❓ Unknown — must be checked for the specific device in question.\n 
5. Why can't the data be transferred now that she has received the company laptop?\n 
🟨 Not addressed in the policy. You need to identify any operational or technical limitations involved.\n 
6. Has proper authorization been obtained for continued personal device use?
Policy states:\n 
“Exceptions... may be required... contact WPI’s Chief Information Security Officer.”\n 
So, if explicit exception approval from the CISO is not obtained, it’s a policy violation.\n 
7. What is the timeframe for this exception?\n 
⛔ If the exception has not been approved, there is no valid timeframe.\n 
8. What is the plan for the company data after this period ends?\n 
Policy requires remote wipe if the device is lost/stolen. There's no guidance for "planned transfer" — best practice would be to remove data from the personal device.\n 
`,
                }
            ]
    }

    // {
    //     id: 'Scenario 2',
    //     title: 'Device Compromise',
    //     question: `Question: An employee's mobile device starts exhibiting unusual behavior. The device shows increased battery usage, initiates several connections to various IP addresses, and some unfamiliar apps appear to be installed. Does this device show clear evidence of being compromised?`,
    //     promptTechnique:
    //         [
    //             {
    //                 id: 'few-shot',
    //                 title: 'Few-shot Prompting',
    //                 prompt: (question: string) => `Example1: An employee's mobile device starts exhibiting unusual behavior. The battery drains quickly even when not in use. The device connects repeatedly to IP addresses in countries where the company doesn't operate. Apps the employee never installed appear in the app drawer, including one that requests unusual permissions. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\n\Example2: An employee's mobile device starts exhibiting unusual behavior. The battery depletes unusually fast. Network logs show the device connecting to unrecognized servers with suspicious domain names. The security scan reveals hidden processes running in the background and unauthorized modifications to system files. Several unfamiliar applications with administrator privileges appear to be installed without the employee's knowledge. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\n\nNow answer the below question:${question}Please give me a yes or no answer.`,
    //             },
    //             {
    //                 id: 'chain-of-thought',
    //                 title: 'Chain-of-thought Prompting',
    //                 prompt: (question: string) => `Question: Analyze the following mobile device behavior to determine if it shows clear evidence of compromise: ${question}\n\nThink through:\n1. Each symptom's possible causes (legitimate vs. malicious)\n2. How these symptoms correlate together\n3. What additional information would strengthen your conclusion\n\nBased on your analysis, provide your assessment: Does this device show clear evidence of being compromised. Just provide the response as yes or no.`,
    //             }
    //         ]
    // }
]