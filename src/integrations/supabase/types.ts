export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      driver_earnings: {
        Row: {
          base_fare: number
          bonus: number | null
          commission: number
          created_at: string | null
          date: string | null
          driver_id: string
          id: string
          net_earning: number
          ride_id: string
        }
        Insert: {
          base_fare: number
          bonus?: number | null
          commission: number
          created_at?: string | null
          date?: string | null
          driver_id: string
          id?: string
          net_earning: number
          ride_id: string
        }
        Update: {
          base_fare?: number
          bonus?: number | null
          commission?: number
          created_at?: string | null
          date?: string | null
          driver_id?: string
          id?: string
          net_earning?: number
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_earnings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_earnings_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          city: string
          created_at: string | null
          current_location: unknown | null
          documents: Json | null
          earnings_today: number | null
          earnings_total: number | null
          id: string
          is_verified: boolean | null
          license_number: string
          rides_completed: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          updated_at: string | null
          vehicle_color: string | null
          vehicle_model: string | null
          vehicle_number: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          city: string
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          earnings_today?: number | null
          earnings_total?: number | null
          id: string
          is_verified?: boolean | null
          license_number: string
          rides_completed?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          updated_at?: string | null
          vehicle_color?: string | null
          vehicle_model?: string | null
          vehicle_number: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          city?: string
          created_at?: string | null
          current_location?: unknown | null
          documents?: Json | null
          earnings_today?: number | null
          earnings_total?: number | null
          id?: string
          is_verified?: boolean | null
          license_number?: string
          rides_completed?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          updated_at?: string | null
          vehicle_color?: string | null
          vehicle_model?: string | null
          vehicle_number?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          driver_id: string | null
          gateway_response: Json | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          ride_id: string
          rider_id: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          driver_id?: string | null
          gateway_response?: Json | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          ride_id: string
          rider_id: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          driver_id?: string | null
          gateway_response?: Json | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          ride_id?: string
          rider_id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          emergency_contact: string | null
          full_name: string
          home_address: string | null
          id: string
          phone: string
          profile_image: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          total_rides: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          emergency_contact?: string | null
          full_name: string
          home_address?: string | null
          id: string
          phone: string
          profile_image?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_rides?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          emergency_contact?: string | null
          full_name?: string
          home_address?: string | null
          id?: string
          phone?: string
          profile_image?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_rides?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_ride_amount: number | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_ride_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_ride_amount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          accepted_at: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          destination_coordinates: unknown
          destination_location: string
          distance_km: number | null
          driver_feedback: string | null
          driver_id: string | null
          driver_rating: number | null
          duration_minutes: number | null
          fare_estimate: number | null
          female_driver_preference: boolean | null
          final_fare: number | null
          id: string
          otp: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          picked_up_at: string | null
          pickup_coordinates: unknown
          pickup_location: string
          requested_at: string | null
          rider_feedback: string | null
          rider_id: string
          rider_rating: number | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["ride_status"] | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          accepted_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          destination_coordinates: unknown
          destination_location: string
          distance_km?: number | null
          driver_feedback?: string | null
          driver_id?: string | null
          driver_rating?: number | null
          duration_minutes?: number | null
          fare_estimate?: number | null
          female_driver_preference?: boolean | null
          final_fare?: number | null
          id?: string
          otp?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          picked_up_at?: string | null
          pickup_coordinates: unknown
          pickup_location: string
          requested_at?: string | null
          rider_feedback?: string | null
          rider_id: string
          rider_rating?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          accepted_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          destination_coordinates?: unknown
          destination_location?: string
          distance_km?: number | null
          driver_feedback?: string | null
          driver_id?: string | null
          driver_rating?: number | null
          duration_minutes?: number | null
          fare_estimate?: number | null
          female_driver_preference?: boolean | null
          final_fare?: number | null
          id?: string
          otp?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          picked_up_at?: string | null
          pickup_coordinates?: unknown
          pickup_location?: string
          requested_at?: string | null
          rider_feedback?: string | null
          rider_id?: string
          rider_rating?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          duration_days: number
          features: Json | null
          free_rides: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          duration_days: number
          features?: Json | null
          free_rides?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          duration_days?: number
          features?: Json | null
          free_rides?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          ride_id: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          ride_id?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          ride_id?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_promo_usage: {
        Row: {
          id: string
          promo_id: string
          ride_id: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          promo_id: string
          ride_id?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          promo_id?: string
          ride_id?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_usage_promo_id_fkey"
            columns: ["promo_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_usage_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renewal: boolean | null
          expires_at: string
          id: string
          is_active: boolean | null
          plan_id: string
          rides_used: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          auto_renewal?: boolean | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          plan_id: string
          rides_used?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          auto_renewal?: boolean | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          plan_id?: string
          rides_used?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      driver_status: "offline" | "available" | "busy" | "inactive"
      payment_method: "cash" | "card" | "upi" | "wallet"
      ride_status:
        | "requested"
        | "accepted"
        | "driver_assigned"
        | "picked_up"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role: "rider" | "driver" | "admin"
      vehicle_type: "bike" | "auto" | "taxi" | "premium" | "suv" | "rental"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      driver_status: ["offline", "available", "busy", "inactive"],
      payment_method: ["cash", "card", "upi", "wallet"],
      ride_status: [
        "requested",
        "accepted",
        "driver_assigned",
        "picked_up",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_role: ["rider", "driver", "admin"],
      vehicle_type: ["bike", "auto", "taxi", "premium", "suv", "rental"],
    },
  },
} as const
