export const questions = [
    {
        id: 'Scenario1',
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
                    prompt: (question: string) => `Example1: I have a Blackberry 2012 that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is yes because blackberry 2012 no longer receives updates from the vendor and hence is a security risk.\n\nExample 2: I have a Samsung 2024 with original OS that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is no because its OS is original, and it received updates. Now give me the answer for this question:\n\n${question} Please give me a yes or no answer.`,
                }
            ]
    },
    {
        id: 'Scenario2',
        title: 'Device Compromise',
        question: `An employee's mobile device starts exhibiting.The device shows increased battery usage.It initiates several connections to various IP addresses.Some unfamiliar apps appear to be installed.Does this device show clear evidence of being compromised?`,
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
                prompt: (question: string) => `Question: An employee's mobile device starts exhibiting unusual behavior. The battery drains quickly even when not in use. The device connects repeatedly to IP addresses in countries where the company doesn't operate. Apps the employee never installed appear in the app drawer, including one that requests unusual permissions. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\n\nQuestion: An employee's mobile device starts exhibiting unusual behavior. The battery depletes unusually fast. Network logs show the device connecting to unrecognized servers with suspicious domain names. The security scan reveals hidden processes running in the background and unauthorized modifications to system files. Several unfamiliar applications with administrator privileges appear to be installed without the employee's knowledge. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\n\nNow answer the below question:\n\n${question}\n\nPlease give me a yes or no answer.`,
            },
            {
                id: 'chain-of-thought',
                title: 'Chain-of-thought Prompting',
                prompt: (question: string) => `Question: Analyze the following mobile device behavior to determine if it shows clear evidence of compromise: ${question}\n\nThink through:\n1. Each symptom's possible causes (legitimate vs. malicious)\n2. How these symptoms correlate together\n3. What additional information would strengthen your conclusion\n\nBased on your analysis, provide your assessment: Does this device show clear evidence of being compromised. Just provide the response as yes or no.`,
            }
        ]
    }
]