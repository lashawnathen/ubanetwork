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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          pinned: boolean | null
          title: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          title: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          pinned?: boolean | null
          title?: string
        }
        Relationships: []
      }
      daily_claims: {
        Row: {
          claimed_at: string
          id: string
          player_id: string
          reward_amount: number
          streak_day: number
        }
        Insert: {
          claimed_at?: string
          id?: string
          player_id: string
          reward_amount: number
          streak_day?: number
        }
        Update: {
          claimed_at?: string
          id?: string
          player_id?: string
          reward_amount?: number
          streak_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      league_settings: {
        Row: {
          category: string | null
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      player_accessories: {
        Row: {
          id: string
          name: string
          player_id: string
          slot: string
        }
        Insert: {
          id?: string
          name: string
          player_id: string
          slot: string
        }
        Update: {
          id?: string
          name?: string
          player_id?: string
          slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_accessories_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_attributes: {
        Row: {
          category: string
          id: string
          name: string
          player_id: string
          value: number
        }
        Insert: {
          category?: string
          id?: string
          name: string
          player_id: string
          value?: number
        }
        Update: {
          category?: string
          id?: string
          name?: string
          player_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_attributes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_badges: {
        Row: {
          category: string | null
          id: string
          level: string
          name: string
          player_id: string
        }
        Insert: {
          category?: string | null
          id?: string
          level?: string
          name: string
          player_id: string
        }
        Update: {
          category?: string | null
          id?: string
          level?: string
          name?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_gameplans: {
        Row: {
          created_at: string
          custom_settings: Json | null
          defensive_aggression: string | null
          drive_tendency: string | null
          freelance_style: string | null
          id: string
          player_id: string
          playmaking_focus: string | null
          rebounding_priority: string | null
          shot_tendency: string | null
          tempo: string | null
          updated_at: string
          usage: string | null
        }
        Insert: {
          created_at?: string
          custom_settings?: Json | null
          defensive_aggression?: string | null
          drive_tendency?: string | null
          freelance_style?: string | null
          id?: string
          player_id: string
          playmaking_focus?: string | null
          rebounding_priority?: string | null
          shot_tendency?: string | null
          tempo?: string | null
          updated_at?: string
          usage?: string | null
        }
        Update: {
          created_at?: string
          custom_settings?: Json | null
          defensive_aggression?: string | null
          drive_tendency?: string | null
          freelance_style?: string | null
          id?: string
          player_id?: string
          playmaking_focus?: string | null
          rebounding_priority?: string | null
          shot_tendency?: string | null
          tempo?: string | null
          updated_at?: string
          usage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_gameplans_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_gear: {
        Row: {
          brand: string | null
          id: string
          name: string
          player_id: string
          slot: string
        }
        Insert: {
          brand?: string | null
          id?: string
          name: string
          player_id: string
          slot: string
        }
        Update: {
          brand?: string | null
          id?: string
          name?: string
          player_id?: string
          slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_gear_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_hotzones: {
        Row: {
          id: string
          level: string
          player_id: string
          zone: string
        }
        Insert: {
          id?: string
          level?: string
          player_id: string
          zone: string
        }
        Update: {
          id?: string
          level?: string
          player_id?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_hotzones_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_signatures: {
        Row: {
          category: string
          id: string
          name: string
          player_id: string
        }
        Insert: {
          category: string
          id?: string
          name: string
          player_id: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_signatures_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_tendencies: {
        Row: {
          id: string
          name: string
          player_id: string
          value: number
        }
        Insert: {
          id?: string
          name: string
          player_id: string
          value?: number
        }
        Update: {
          id?: string
          name?: string
          player_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_tendencies_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          archetype: string | null
          created_at: string
          daily_streak: number
          id: string
          last_daily_claim: string | null
          name: string
          overall: number
          position: string
          profile_image_url: string | null
          season: number
          status: string
          team_id: string | null
          uc_balance: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          archetype?: string | null
          created_at?: string
          daily_streak?: number
          id?: string
          last_daily_claim?: string | null
          name: string
          overall?: number
          position?: string
          profile_image_url?: string | null
          season?: number
          status?: string
          team_id?: string | null
          uc_balance?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          archetype?: string | null
          created_at?: string
          daily_streak?: number
          id?: string
          last_daily_claim?: string | null
          name?: string
          overall?: number
          position?: string
          profile_image_url?: string | null
          season?: number
          status?: string
          team_id?: string | null
          uc_balance?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_id: string | null
          discord_username: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          abbreviation: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          abbreviation?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          abbreviation?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          performed_by: string | null
          player_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          performed_by?: string | null
          player_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          performed_by?: string | null
          player_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "player"
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
      app_role: ["admin", "player"],
    },
  },
} as const
