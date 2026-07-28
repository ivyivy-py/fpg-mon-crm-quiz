import { Question, Badge, GymSection, SheetConfig } from '../types';

export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1aFT9fnia3stfbdl7KX185FD4Ke-1S1m2DvWGKMTpGlA/edit?gid=994678157#gid=994678157';

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  activeGym: 1, // Default active gym (from Config!B1)
  codeword: 'HANDSON2026', // Secret codeword provided by instructor to complete hands-on/quiz
};

export const GYM_SECTIONS: GymSection[] = [
  {
    id: 1,
    bubbleLabel: 'Gym 1',
    name: 'Gym 1: Data Inputs (Triggers & Entry Logic)',
    shortTitle: 'Data Inputs',
    description: 'Master real-time event triggers, audience filtering, and re-entry rules.',
    icon: 'input'
  },
  {
    id: 2,
    bubbleLabel: 'Gym 2',
    name: 'Gym 2: Communication Types (eDM vs. PNS)',
    shortTitle: 'Communication Types',
    description: 'Optimize eDM vs. PNS channel selection, push fallbacks, and fatigue capping.',
    icon: 'mark_email_read'
  },
  {
    id: 3,
    bubbleLabel: 'Gym 3',
    name: 'Gym 3: Flow Control (Splits & Waits)',
    shortTitle: 'Flow Control',
    description: 'Architect decision splits, engagement splits, wait nodes, and multi-branch routing.',
    icon: 'alt_route'
  },
  {
    id: 4,
    bubbleLabel: 'Gym 4',
    name: 'Gym 4: Exit Controls (Goals & Unsubscribes)',
    shortTitle: 'Exit Controls',
    description: 'Implement journey exit criteria, goal ejection thresholds, and consent compliance.',
    icon: 'verified_user'
  },
  {
    id: 5,
    bubbleLabel: 'Gym 5',
    name: 'Gym 5: Group Hands-on Session',
    shortTitle: 'Group Hands-on',
    description: 'Interactive group workshop challenge. Enter instructor codeword to complete and unlock Master status.',
    icon: 'groups',
    isHandsOn: true
  }
];


export const INITIAL_QUESTIONS: Question[] = [
  // --- Section 1: Data Inputs (Triggers & Entry Logic) ---
  {
    id: 1,
    sectionId: 1,
    sectionName: 'Section 1: Data Inputs (Triggers & Entry Logic)',
    tag: 'Real-Time vs. Batch',
    scenario: 'Marketing wants to send an immediate "1-Hour Express Delivery" discount code as soon as a customer abandons their cart online. Another campaign sends a weekly produce roundup every Monday.',
    question: 'How should entry into these two journeys be triggered differently?',
    options: [
      { id: 'A', text: 'Both should run on a fixed Monday morning schedule.' },
      { id: 'B', text: 'The cart abandonment should trigger instantly based on a real-time event, while the produce roundup should run on a scheduled batch.' },
      { id: 'C', text: 'Both should wait for the customer to open an email first.' },
      { id: 'D', text: 'Cart abandonment should only trigger once a month.' }
    ],
    correctOption: 'B',
    explanation: 'High-urgency campaigns (like cart recovery or 1-Hour delivery) rely on real-time event triggers to catch customers in the moment. Bulk newsletters work best on scheduled batch updates.',
    xp: 75
  },
  {
    id: 2,
    sectionId: 1,
    sectionName: 'Section 1: Data Inputs (Triggers & Entry Logic)',
    tag: 'Audience Filtering',
    scenario: 'You want to run a premium wine cross-sell campaign, but you must ensure you do not target customers who are under 21 or those who have opted out of alcohol promotions.',
    question: 'Where is the best place to enforce this eligibility criteria?',
    options: [
      { id: 'A', text: 'At the very end of the journey after sending the emails.' },
      { id: 'B', text: 'At the Entry Source / Data Filter before they even enter the journey.' },
      { id: 'C', text: 'Inside a wait step after 3 days.' },
      { id: 'D', text: 'Manually check each customer\'s age in the office before clicking send.' }
    ],
    correctOption: 'B',
    explanation: 'Filtering out ineligible customers at the entry point prevents wasteful messaging, protects customer experience, and ensures legal compliance upfront.',
    xp: 75
  },
  {
    id: 3,
    sectionId: 1,
    sectionName: 'Section 1: Data Inputs (Triggers & Entry Logic)',
    tag: 'Re-Entry Rules',
    scenario: 'A customer buys Fresh Produce on Monday, enters a 7-day onboarding journey, and completes it. On Friday of the same week, they place another Fresh Produce order.',
    question: 'How should you configure the journey entry rules so this customer gets the best experience?',
    options: [
      { id: 'A', text: 'Set to "No Re-Entry"—they should never be allowed in the journey ever again.' },
      { id: 'B', text: 'Set to "Re-Entry Anytime"—let them enter 5 times simultaneously so they get 5 overlapping copies of the same email.' },
      { id: 'C', text: 'Set to "Re-Entry Only After Exiting"—ensure they finish or exit their current journey before they can start a new one for their second order.' },
      { id: 'D', text: 'Block their account from placing orders until the 7 days are up.' }
    ],
    correctOption: 'C',
    explanation: '"Re-entry only after exiting" prevents customer fatigue from overlapping duplicate messages while still allowing repeat buyers to receive fresh nurture flows for new purchases.',
    xp: 80
  },

  // --- Section 2: Communication Types (eDM vs. PNS Strategy) ---
  {
    id: 4,
    sectionId: 2,
    sectionName: 'Section 2: Communication Types (eDM vs. PNS)',
    tag: 'Channel Selection',
    scenario: 'You have a flash sale offering "50% off Pork cuts for the next 2 hours only!" versus a "Monthly Wine & Steak Pairing Guide" with 4 full recipes.',
    question: 'Which channel combination makes the most strategic sense?',
    options: [
      { id: 'A', text: 'Send the recipe guide via Push Notification (PNS) and the 2-hour flash sale via Email (eDM).' },
      { id: 'B', text: 'Send the 2-hour flash sale via Push Notification (PNS) for immediate visibility, and the recipe guide via Email (eDM) for detailed reading.' },
      { id: 'C', text: 'Send both via SMS only.' },
      { id: 'D', text: 'Don\'t send any messages and wait for them to visit the store.' }
    ],
    correctOption: 'B',
    explanation: 'PNS drives immediate, urgent action on mobile screens, while eDM is superior for rich media, long-form content, and reference materials like recipes.',
    xp: 75
  },
  {
    id: 5,
    sectionId: 2,
    sectionName: 'Section 2: Communication Types (eDM vs. PNS)',
    tag: 'Channel Fallback',
    scenario: 'You want to alert customers about a 1-Hour Express delivery update via PNS, but 30% of your customer base has mobile push notifications turned off.',
    question: 'What is the best multi-channel strategy to ensure everyone gets the message?',
    options: [
      { id: 'A', text: 'Cancel the campaign for everyone.' },
      { id: 'B', text: 'Send an email to everyone first, and ignore mobile app users.' },
      { id: 'C', text: 'Try PNS first; if the user doesn\'t have push enabled, fallback to sending an eDM.' },
      { id: 'D', text: 'Send 3 push notifications anyway hoping they turn it on.' }
    ],
    correctOption: 'C',
    explanation: 'Smart journey design uses channel fallbacks—leveraging high-engagement channels first (PNS) while keeping high-reach channels (eDM) as a safety net.',
    xp: 80
  },
  {
    id: 6,
    sectionId: 2,
    sectionName: 'Section 2: Communication Types (eDM vs. PNS)',
    tag: 'Fatigue Protection',
    scenario: 'Green Business Unit is running a "Fresh Produce" promo, and Yellow Business Unit is running a "Pork & Wine" promo. A high-value customer qualifies for both on the exact same morning.',
    question: 'How do you prevent spamming the customer with 4 emails and 2 push notifications in one hour?',
    options: [
      { id: 'A', text: 'Send all messages at once—more messages always mean higher sales.' },
      { id: 'B', text: 'Delete the customer from the database so neither team can message them.' },
      { id: 'C', text: 'Establish global capping rules/decision checks so the customer only receives 1 high-priority message per day across all categories.' },
      { id: 'D', text: 'Let both teams fight over who sends their email first.' }
    ],
    correctOption: 'C',
    explanation: 'Performance marketers must balance category goals with customer fatigue. Cross-journey priority rules and frequency limits protect brand perception and unsubscribe rates.',
    xp: 85
  },

  // --- Section 3: Flow Control (Splits & Waits) ---
  {
    id: 7,
    sectionId: 3,
    sectionName: 'Section 3: Flow Control (Splits & Waits)',
    tag: 'Advanced Logic',
    scenario: 'Path A routes customers based on whether they are a "VIP Member = Yes/No". Path B routes customers based on whether they "Clicked the Wine Discount Link in yesterday\'s email".',
    question: 'Which split types should be used for Path A and Path B?',
    options: [
      { id: 'A', text: 'Path A = Engagement Split; Path B = Decision Split' },
      { id: 'B', text: 'Path A = Decision Split (Profile Data); Path B = Engagement Split (Behavior).' },
      { id: 'C', text: 'Both should use Wait Until Date nodes.' },
      { id: 'D', text: 'Both should use Random Splits.' }
    ],
    correctOption: 'B',
    explanation: 'Decision Splits evaluate who the customer is (profile/demographic attributes like VIP status), while Engagement Splits evaluate what the customer did (opening/clicking a specific message).',
    xp: 80
  },
  {
    id: 8,
    sectionId: 3,
    sectionName: 'Section 3: Flow Control (Splits & Waits)',
    tag: 'Wait Nodes',
    scenario: 'Campaign 1 gives new app users 3 days to complete their profile after signing up. Campaign 2 holds all customers until Black Friday morning at 8:00 AM to release a sitewide promo.',
    question: 'Which wait nodes match these two business requirements?',
    options: [
      { id: 'A', text: 'Campaign 1 = Wait Until Date; Campaign 2 = Wait by Duration' },
      { id: 'B', text: 'Campaign 1 = Wait by Duration (3 days from entry); Campaign 2 = Wait Until Date (Fixed calendar date).' },
      { id: 'C', text: 'Both should wait for 10 hours.' },
      { id: 'D', text: 'Neither campaign needs a wait node.' }
    ],
    correctOption: 'B',
    explanation: '"Wait by Duration" is relative to when an individual arrives at that step. "Wait Until Date" is an absolute wall that holds everyone together until a specific calendar moment.',
    xp: 80
  },
  {
    id: 9,
    sectionId: 3,
    sectionName: 'Section 3: Flow Control (Splits & Waits)',
    tag: 'Behavior Routing',
    scenario: 'You send a 1-Hour Express promo for Fresh Produce. You want to reward users who buy within 24 hours, remind users who opened the email but didn\'t buy, and try a PNS for users who ignored the email completely.',
    question: 'What is the most logical sequence of flow control nodes after the email send?',
    options: [
      { id: 'A', text: 'Send email -> Exit immediately.' },
      { id: 'B', text: 'Send email -> Wait 24 hours -> Send PNS to everyone regardless of what they did.' },
      { id: 'C', text: 'Send email -> Wait 24 hours -> Check Purchase Status (Decision Split) -> If No, check Email Open (Engagement Split) -> Route to tailored follow-ups.' },
      { id: 'D', text: 'Send 3 emails in a row with no wait times.' }
    ],
    correctOption: 'C',
    explanation: 'Combining a Purchase Check (Did they convert?) with a secondary Engagement Check (Did they at least view the message?) lets you segment non-converters into "warm lead" vs. "unresponsive" nurture branches.',
    xp: 90
  },

  // --- Section 4: Exit Controls (Goals & Unsubscribes) ---
  {
    id: 10,
    sectionId: 4,
    sectionName: 'Section 4: Exit Controls (Goals & Unsubscribes)',
    tag: 'Exit Criteria',
    scenario: 'You build a 14-day "Wine & Pork" cross-sell journey. As soon as a customer buys a bottle of Wine, they have achieved the business objective and should not receive any more sales prompts.',
    question: 'What mechanism handles removing a customer the moment they achieve this objective?',
    options: [
      { id: 'A', text: 'Wait by Duration' },
      { id: 'B', text: 'Exit Criteria / Journey Goal' },
      { id: 'C', text: 'Entry Source' },
      { id: 'D', text: 'Send eDM' }
    ],
    correctOption: 'B',
    explanation: 'Exit Criteria (and Journey Goals) act as an automated emergency brake—pulling a customer out of the journey as soon as they complete the desired conversion action.',
    xp: 80
  },
  {
    id: 11,
    sectionId: 4,
    sectionName: 'Section 4: Exit Controls (Goals & Unsubscribes)',
    tag: 'Unsubscribe Consent',
    scenario: 'A customer is sitting in a 5-day wait step before the sending of another eDM in your Fresh Produce journey. On Day 2, they unsubscribe from marketing communications on your app.',
    question: 'What should happen when Day 5 finishes and the journey attempts to send the next eDM?',
    options: [
      { id: 'A', text: 'The journey ignores their unsubscribe and sends the email anyway.' },
      { id: 'B', text: 'The journey crashes and stops working for all other users.' },
      { id: 'C', text: 'The system automatically suppresses/exits the customer to respect their consent choices.' },
      { id: 'D', text: 'The customer receives a text message asking why they unsubscribed.' }
    ],
    correctOption: 'C',
    explanation: 'Global consent and suppression rules automatically safeguard against sending messages to unsubscribed contacts, protecting legal compliance and brand reputation.',
    xp: 80
  },
  {
    id: 12,
    sectionId: 4,
    sectionName: 'Section 4: Exit Controls (Goals & Unsubscribes)',
    tag: 'Target Thresholds',
    scenario: 'You run a "1-Hour Express Delivery Habits" campaign that sends 3 educational tips over 2 weeks to get customers to place at least two 1-Hour Express orders. Customer A places their 2nd order on Day 3. Customer B never places a 2nd order.',
    question: 'How should the exit control differentiate between Customer A and Customer B?',
    options: [
      { id: 'A', text: 'Keep both customers on the journey for all 14 days and send them the exact same tips.' },
      { id: 'B', text: 'Customer A hits the Exit Goal (Express_Orders >= 2) on Day 3 and is ejected with a "Target Reached" badge; Customer B stays for the full 14 days to receive all nurture tips.' },
      { id: 'C', text: 'Eject Customer B immediately on Day 1 because they didn\'t order fast enough.' },
      { id: 'D', text: 'Force both customers to restart from the beginning.' }
    ],
    correctOption: 'B',
    explanation: 'Advanced journey logic measures specific target thresholds (Orders >= 2). Successful converters exit early to avoid over-messaging, while non-converters receive the full educational sequence.',
    xp: 95
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Data Input Strategist',
    description: 'Mastered Gym 1: real-time event triggers, entry audience filtering, and re-entry rules.',
    icon: 'input',
    sectionId: 1,
    gymId: 1,
    type: 'section',
    unlocked: false
  },
  {
    id: 'b2',
    name: 'eDM & PNS Specialist',
    description: 'Mastered Gym 2: channel selection, push fallbacks, and fatigue capping.',
    icon: 'mark_email_read',
    sectionId: 2,
    gymId: 2,
    type: 'section',
    unlocked: false
  },
  {
    id: 'b3',
    name: 'Flow Control Architect',
    description: 'Mastered Gym 3: decision splits, engagement splits, wait nodes, and multi-branch routing.',
    icon: 'alt_route',
    sectionId: 3,
    gymId: 3,
    type: 'section',
    unlocked: false
  },
  {
    id: 'b4',
    name: 'Exit & Compliance Guard',
    description: 'Mastered Gym 4: journey exit goals, unsubscribe protection, and target ejection thresholds.',
    icon: 'verified_user',
    sectionId: 4,
    gymId: 4,
    type: 'section',
    unlocked: false
  },
  {
    id: 'b5',
    name: 'Hands-on Arena Champion',
    description: 'Completed Gym 5: Group Hands-on Session and verified trainer codeword.',
    icon: 'groups',
    gymId: 5,
    type: 'handson',
    unlocked: false
  },
  {
    id: 'b_master',
    name: 'FPG-mon Journey Master',
    description: 'Completed all 5 Gyms (including Group Hands-on) with distinction.',
    icon: 'workspace_premium',
    type: 'mastery',
    unlocked: false
  }
];

export const INITIAL_LEADERBOARD = [
  { id: '1', handle: 'Master Trainer Red', clan: 'Red Clan' as const, avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGTjfIqf1EgT8MYm11KDZPeFeqKov20-411L-7hhOV_syFAY64if-yPb-F5vWFzc0tBhTWUVgFSDtv12k8oq6jveVieM2ncBN3XifP3qH8Q2Tzu8xKS9u_Ps8WGNdN6KohHw19Y-5bJ3RHEdSeyftN3yUzLR8gbrzNMFAebOdddOJuwfF-zd8H7rN21G_xFPKiElH9jgg9ZB1VMBiODnlhztPjXvYuFMTWHI1I7PpgYuq0Op0L63s', scoreXP: 950, passedCount: 12, badgeCount: 5 },
  { id: '2', handle: 'Trainer Blue_Oak', clan: 'Blue Clan' as const, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', scoreXP: 880, passedCount: 11, badgeCount: 4 },
  { id: '3', handle: 'Cynthia_SFMC', clan: 'Red Clan' as const, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', scoreXP: 850, passedCount: 10, badgeCount: 4 },
  { id: '4', handle: 'Lance_CRM', clan: 'Blue Clan' as const, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', scoreXP: 780, passedCount: 9, badgeCount: 3 },
  { id: '5', handle: 'Ash_Ketchum_SFMC', clan: 'Red Clan' as const, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', scoreXP: 720, passedCount: 8, badgeCount: 3 }
];
