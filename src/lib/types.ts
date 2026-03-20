export interface Restaurant {
  id: string;
  name: string;
  type: string;
  timezone: string;
  phone: string;
  slowDays: string[];
  mealService: "lunch" | "dinner" | "both";
  promoStyles: string[];
  joinIncentive: string;
  publicSignupToken: string;
  autoSendEnabled: boolean;
  maxAutoPerWeek: number;
  autoSendDays: string[];
  doneForYouMode: boolean;
}

export interface OwnerProfile {
  id: string;
  restaurantId: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  smsNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  approvalRequired: boolean;
}

export interface Contact {
  id: string;
  restaurantId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email?: string;
  optedIn: boolean;
  optedOut: boolean;
  tags: string[];
  source: string;
  optedInAt: string;
  optedOutAt?: string;
  consentSource: string;
  createdAt: string;
}

// ── Workflow states ──────────────────────────────────────────
export type WorkflowStep =
  | "suggestion_created"
  | "owner_notified"
  | "owner_opened_link"
  | "owner_edited"
  | "owner_approved"
  | "sent"
  | "skipped";

export interface WorkflowEvent {
  step: WorkflowStep;
  timestamp: string;
  note?: string;
}

export type SuggestionStatus = "pending" | "notified" | "in_review" | "approved" | "sent" | "skipped" | "dismissed";
export type TriggerType = "inactivity" | "weather" | "weekday" | "meal_period" | "calendar_event" | "manual" | "emergency";

export interface CampaignSuggestion {
  id: string;
  restaurantId: string;
  title: string;
  triggerType: TriggerType;
  suggestionReason: string;
  recommendedMessage: string;
  recommendedSendTime: string;
  targetCount: number;
  status: SuggestionStatus;
  workflow: WorkflowEvent[];
  createdAt: string;
}

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "cancelled";

export interface Campaign {
  id: string;
  restaurantId: string;
  suggestionId?: string;
  title: string;
  messageBody: string;
  status: CampaignStatus;
  targetCount: number;
  estimatedCost: number;
  redemptionCode?: string;
  estimatedRedemptions?: number;
  estimatedRevenue?: number;
  sentAt?: string;
  createdAt: string;
}

export interface OfferTemplate {
  id: string;
  title: string;
  description: string;
  exampleMessage: string;
  category: string;
}

export interface CalendarEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  suggestedCampaignId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  textsIncluded: number;
  overageRate: number;
  features: string[];
  popular?: boolean;
  tagline?: string;
}
