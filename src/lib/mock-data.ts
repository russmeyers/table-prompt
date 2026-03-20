import type { Restaurant, OwnerProfile, Contact, CampaignSuggestion, Campaign, OfferTemplate, CalendarEvent, PricingPlan } from "./types";

export const mockRestaurant: Restaurant = {
  id: "rest-1",
  name: "Bella's Italian Kitchen",
  type: "Italian",
  timezone: "America/New_York",
  phone: "(555) 234-5678",
  slowDays: ["Tuesday", "Wednesday"],
  mealService: "both",
  promoStyles: ["specials", "discounts"],
  joinIncentive: "Free appetizer with your next visit",
  publicSignupToken: "bellas-italian",
  autoSendEnabled: false,
  maxAutoPerWeek: 2,
  autoSendDays: ["Tuesday", "Friday"],
  doneForYouMode: false,
};

export const mockOwner: OwnerProfile = {
  id: "owner-1",
  restaurantId: "rest-1",
  contactName: "Maria Rossi",
  mobileNumber: "(555) 123-4567",
  email: "maria@bellaskitchen.com",
  smsNotificationsEnabled: true,
  emailNotificationsEnabled: true,
  approvalRequired: true,
};

export const mockContacts: Contact[] = [
  { id: "c1", restaurantId: "rest-1", firstName: "Sarah", lastName: "Chen", mobileNumber: "(555) 111-2233", optedIn: true, optedOut: false, tags: ["VIP", "regular"], source: "QR code", optedInAt: "2024-11-15T10:00:00Z", consentSource: "signup_page", createdAt: "2024-11-15T10:00:00Z" },
  { id: "c2", restaurantId: "rest-1", firstName: "James", lastName: "Wright", mobileNumber: "(555) 222-3344", optedIn: true, optedOut: false, tags: ["new"], source: "CSV import", optedInAt: "2024-12-01T10:00:00Z", consentSource: "csv_import", createdAt: "2024-12-01T10:00:00Z" },
  { id: "c3", restaurantId: "rest-1", firstName: "Priya", lastName: "Patel", mobileNumber: "(555) 333-4455", optedIn: true, optedOut: false, tags: ["regular"], source: "keyword", optedInAt: "2025-01-05T10:00:00Z", consentSource: "keyword_signup", createdAt: "2025-01-05T10:00:00Z" },
  { id: "c4", restaurantId: "rest-1", firstName: "Mike", lastName: "Thompson", mobileNumber: "(555) 444-5566", email: "mike@email.com", optedIn: false, optedOut: true, tags: [], source: "manual", optedInAt: "2024-10-20T10:00:00Z", optedOutAt: "2025-02-10T10:00:00Z", consentSource: "manual_add", createdAt: "2024-10-20T10:00:00Z" },
  { id: "c5", restaurantId: "rest-1", firstName: "Lisa", lastName: "Garcia", mobileNumber: "(555) 555-6677", optedIn: true, optedOut: false, tags: ["VIP"], source: "signup page", optedInAt: "2025-02-14T10:00:00Z", consentSource: "signup_page", createdAt: "2025-02-14T10:00:00Z" },
];

export const mockSuggestions: CampaignSuggestion[] = [
  {
    id: "sug-1",
    restaurantId: "rest-1",
    title: "Rainy Night Comfort Special",
    triggerType: "weather",
    suggestionReason: "Rain forecast tonight — comfort food drives traffic on wet evenings",
    recommendedMessage: "Rainy night calls for comfort food 🍲 Stop in tonight and enjoy a free soup with any entrée. See you soon!",
    recommendedSendTime: "2025-03-20T14:00:00Z",
    targetCount: 842,
    status: "notified",
    workflow: [
      { step: "suggestion_created", timestamp: "2025-03-20T09:00:00Z" },
      { step: "owner_notified", timestamp: "2025-03-20T09:01:00Z", note: "SMS sent to (555) 123-4567" },
    ],
    createdAt: "2025-03-20T09:00:00Z",
  },
  {
    id: "sug-2",
    restaurantId: "rest-1",
    title: "Tuesday Dinner Push",
    triggerType: "weekday",
    suggestionReason: "Tuesday is usually slow — fill seats with a dinner deal",
    recommendedMessage: "Tuesday dinner plans? Join us tonight for 20% off all pasta dishes. Bring a friend 🍝",
    recommendedSendTime: "2025-03-21T11:00:00Z",
    targetCount: 842,
    status: "pending",
    workflow: [
      { step: "suggestion_created", timestamp: "2025-03-20T08:00:00Z" },
    ],
    createdAt: "2025-03-20T08:00:00Z",
  },
  {
    id: "sug-3",
    restaurantId: "rest-1",
    title: "Re-Engagement Text",
    triggerType: "inactivity",
    suggestionReason: "No campaign sent in 6 days — keep guests engaged",
    recommendedMessage: "It's been a while! We miss you at Bella's. Come in this week for a complimentary dessert with dinner 🎂",
    recommendedSendTime: "2025-03-20T16:00:00Z",
    targetCount: 842,
    status: "in_review",
    workflow: [
      { step: "suggestion_created", timestamp: "2025-03-19T09:00:00Z" },
      { step: "owner_notified", timestamp: "2025-03-19T09:02:00Z", note: "SMS sent to (555) 123-4567" },
      { step: "owner_opened_link", timestamp: "2025-03-19T10:15:00Z" },
    ],
    createdAt: "2025-03-19T09:00:00Z",
  },
];

export const mockCampaigns: Campaign[] = [
  { id: "camp-1", restaurantId: "rest-1", suggestionId: "sug-old-1", title: "Friday Lunch Special", messageBody: "Happy Friday! Swing by for our lunch combo — soup + sandwich for just $12. Available 11am–2pm 🥪", status: "sent", targetCount: 830, estimatedCost: 8.30, redemptionCode: "FRI12", estimatedRedemptions: 47, estimatedRevenue: 564, sentAt: "2025-03-14T11:00:00Z", createdAt: "2025-03-14T09:00:00Z" },
  { id: "camp-2", restaurantId: "rest-1", title: "Weekend Brunch Launch", messageBody: "NEW: Saturday & Sunday brunch at Bella's! Mimosas, frittatas, and fresh pastries. Book your table today 🥂", status: "sent", targetCount: 825, estimatedCost: 8.25, redemptionCode: "BRUNCH", estimatedRedemptions: 62, estimatedRevenue: 1240, sentAt: "2025-03-08T09:00:00Z", createdAt: "2025-03-07T14:00:00Z" },
  { id: "camp-3", restaurantId: "rest-1", title: "Valentine's Prix Fixe", messageBody: "Make Valentine's special ❤️ Reserve your table for our 3-course prix fixe dinner. $65/couple. Limited spots!", status: "sent", targetCount: 810, estimatedCost: 8.10, redemptionCode: "VDAY", estimatedRedemptions: 38, estimatedRevenue: 2470, sentAt: "2025-02-12T10:00:00Z", createdAt: "2025-02-10T09:00:00Z" },
];

export const mockOfferTemplates: OfferTemplate[] = [
  { id: "tpl-1", title: "Free Appetizer with Entrée", description: "Drive dinner traffic with a free starter", exampleMessage: "Tonight only! Enjoy a FREE appetizer with any entrée at {restaurant}. Show this text to redeem. Use code {code} 🍽️", category: "food" },
  { id: "tpl-2", title: "$5 Off $25", description: "Simple discount to bring people in", exampleMessage: "Here's $5 off your next meal of $25+ at {restaurant}. Show this text or use code {code}. Valid this week only!", category: "discount" },
  { id: "tpl-3", title: "Free Dessert Tonight", description: "Sweet incentive for same-day visits", exampleMessage: "Sweet deal! Get a FREE dessert with dinner tonight at {restaurant}. Just show this text. Code: {code} 🎂", category: "food" },
  { id: "tpl-4", title: "Kids Eat Free", description: "Family-friendly traffic driver", exampleMessage: "Kids eat FREE tonight at {restaurant}! One free kids meal per adult entrée. Bring the whole family 👨‍👩‍👧‍👦", category: "family" },
  { id: "tpl-5", title: "BOGO Deal", description: "Buy one get one to fill seats", exampleMessage: "BOGO at {restaurant}! Buy one entrée, get one free tonight. Bring a friend and enjoy. Code: {code} 🎉", category: "discount" },
  { id: "tpl-6", title: "Lunch Combo Special", description: "Drive weekday lunch traffic", exampleMessage: "Lunch special today! Soup + sandwich + drink for just $14 at {restaurant}. Available 11am–2pm. Code: {code} 🥪", category: "lunch" },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: "evt-1", name: "March Madness", date: "2025-03-20", description: "Basketball tournament — bar specials opportunity" },
  { id: "evt-2", name: "Easter Weekend", date: "2025-04-20", description: "Brunch and family dinner specials" },
  { id: "evt-3", name: "Cinco de Mayo", date: "2025-05-05", description: "Themed specials and drinks" },
  { id: "evt-4", name: "Mother's Day", date: "2025-05-11", description: "Brunch and prix fixe dinners" },
  { id: "evt-5", name: "Memorial Day Weekend", date: "2025-05-26", description: "Holiday weekend specials" },
  { id: "evt-6", name: "Father's Day", date: "2025-06-15", description: "Special dinner promotions" },
];

export const mockPricingPlans: PricingPlan[] = [
  { id: "starter", name: "Starter", price: 29, textsIncluded: 500, overageRate: 0.03, features: ["Up to 500 texts/month", "Smart campaign suggestions", "Easy 1-click sending", "QR code signup page", "Pre-built offer templates", "Simple performance dashboard"], tagline: "A simple way to stay consistent and start building your customer list." },
  { id: "launch", name: "Launch", price: 79, textsIncluded: 2500, overageRate: 0.03, features: ["Up to 2,500 texts/month", "Everything in Starter, plus:", "AI-written text messages", "Smart reminders sent to you", "\"We're slow — send now\" button", "Basic redemption tracking"], popular: true, tagline: "This is where most restaurants start seeing real results." },
  { id: "growth", name: "Growth", price: 149, textsIncluded: 6000, overageRate: 0.03, features: ["Up to 6,000 texts/month", "Everything in Launch, plus:", "Optional auto-send campaigns", "Built-in campaign calendar", "Smarter timing suggestions", "Priority sending"], tagline: "Stay top of mind with your customers — without thinking about it." },
  { id: "pro", name: "Pro", price: 249, textsIncluded: 12000, overageRate: 0.03, features: ["Up to 12,000 texts/month", "Everything in Growth, plus:", "Multi-location support", "Expanded offer library", "Simple performance insights", "\"Done-for-you\" campaign option"], tagline: "Scale your marketing without adding more work." },
];

export const dashboardStats = {
  subscriberCount: 842,
  campaignsSentThisMonth: 3,
  pendingSuggestions: 3,
  lastCampaignDate: "Mar 14, 2025",
  estimatedTextsUsed: 2485,
  textsIncluded: 5000,
};

// ── Workflow helpers ──────────────────────────────────────
export const workflowStepLabels: Record<string, string> = {
  suggestion_created: "Suggestion Created",
  owner_notified: "Owner Notified by SMS",
  owner_opened_link: "Owner Opened Review Link",
  owner_edited: "Owner Edited Message",
  owner_approved: "Owner Approved",
  sent: "Campaign Sent",
  skipped: "Owner Skipped",
};

export const workflowStepColors: Record<string, string> = {
  suggestion_created: "bg-muted text-muted-foreground",
  owner_notified: "bg-blue-50 text-blue-700",
  owner_opened_link: "bg-amber-50 text-amber-700",
  owner_edited: "bg-purple-50 text-purple-700",
  owner_approved: "bg-emerald-50 text-emerald-700",
  sent: "bg-emerald-100 text-emerald-800",
  skipped: "bg-muted text-muted-foreground",
};
