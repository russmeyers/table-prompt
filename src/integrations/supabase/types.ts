export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          name: string
          suggested_campaign_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          name: string
          suggested_campaign_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          name?: string
          suggested_campaign_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_suggested_campaign_id_fkey"
            columns: ["suggested_campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sends: {
        Row: {
          campaign_id: string
          created_at: string
          failed_count: number | null
          id: string
          provider: string | null
          provider_cost: number | null
          sent_count: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          failed_count?: number | null
          id?: string
          provider?: string | null
          provider_cost?: number | null
          sent_count?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          failed_count?: number | null
          id?: string
          provider?: string | null
          provider_cost?: number | null
          sent_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_suggestions: {
        Row: {
          created_at: string
          id: string
          recommended_message: string | null
          recommended_send_time: string | null
          restaurant_id: string
          status: string
          suggestion_reason: string | null
          target_count: number | null
          title: string
          trigger_type: string
          workflow: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          recommended_message?: string | null
          recommended_send_time?: string | null
          restaurant_id: string
          status?: string
          suggestion_reason?: string | null
          target_count?: number | null
          title: string
          trigger_type?: string
          workflow?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          recommended_message?: string | null
          recommended_send_time?: string | null
          restaurant_id?: string
          status?: string
          suggestion_reason?: string | null
          target_count?: number | null
          title?: string
          trigger_type?: string
          workflow?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_suggestions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          estimated_cost: number | null
          estimated_redemptions: number | null
          estimated_revenue: number | null
          id: string
          message_body: string
          redemption_code: string | null
          restaurant_id: string
          sent_at: string | null
          status: string
          suggestion_id: string | null
          target_count: number | null
          title: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number | null
          estimated_redemptions?: number | null
          estimated_revenue?: number | null
          id?: string
          message_body: string
          redemption_code?: string | null
          restaurant_id: string
          sent_at?: string | null
          status?: string
          suggestion_id?: string | null
          target_count?: number | null
          title: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number | null
          estimated_redemptions?: number | null
          estimated_revenue?: number | null
          id?: string
          message_body?: string
          redemption_code?: string | null
          restaurant_id?: string
          sent_at?: string | null
          status?: string
          suggestion_id?: string | null
          target_count?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "campaign_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          consent_source: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          mobile_number: string
          opted_in: boolean
          opted_in_at: string | null
          opted_out: boolean
          opted_out_at: string | null
          restaurant_id: string
          source: string | null
          tags: string[] | null
        }
        Insert: {
          consent_source?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          mobile_number: string
          opted_in?: boolean
          opted_in_at?: string | null
          opted_out?: boolean
          opted_out_at?: string | null
          restaurant_id: string
          source?: string | null
          tags?: string[] | null
        }
        Update: {
          consent_source?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          mobile_number?: string
          opted_in?: boolean
          opted_in_at?: string | null
          opted_out?: boolean
          opted_out_at?: string | null
          restaurant_id?: string
          source?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          created_at: string
          destination: string
          id: string
          message_body: string | null
          notification_type: string
          restaurant_id: string
          status: string
          suggestion_id: string | null
        }
        Insert: {
          created_at?: string
          destination: string
          id?: string
          message_body?: string | null
          notification_type?: string
          restaurant_id: string
          status?: string
          suggestion_id?: string | null
        }
        Update: {
          created_at?: string
          destination?: string
          id?: string
          message_body?: string | null
          notification_type?: string
          restaurant_id?: string
          status?: string
          suggestion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "campaign_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          example_message: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          example_message?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          example_message?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          auto_send_days: string[] | null
          auto_send_enabled: boolean | null
          created_at: string
          done_for_you_mode: boolean | null
          id: string
          join_incentive: string | null
          max_auto_per_week: number | null
          meal_service: string | null
          name: string
          owner_user_id: string
          phone: string | null
          promo_styles: string[] | null
          public_signup_token: string | null
          slow_days: string[] | null
          timezone: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          auto_send_days?: string[] | null
          auto_send_enabled?: boolean | null
          created_at?: string
          done_for_you_mode?: boolean | null
          id?: string
          join_incentive?: string | null
          max_auto_per_week?: number | null
          meal_service?: string | null
          name: string
          owner_user_id: string
          phone?: string | null
          promo_styles?: string[] | null
          public_signup_token?: string | null
          slow_days?: string[] | null
          timezone?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          auto_send_days?: string[] | null
          auto_send_enabled?: boolean | null
          created_at?: string
          done_for_you_mode?: boolean | null
          id?: string
          join_incentive?: string | null
          max_auto_per_week?: number | null
          meal_service?: string | null
          name?: string
          owner_user_id?: string
          phone?: string | null
          promo_styles?: string[] | null
          public_signup_token?: string | null
          slow_days?: string[] | null
          timezone?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
