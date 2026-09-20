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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      album_images: {
        Row: {
          album_id: string
          caption_ar: string
          caption_en: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          album_id: string
          caption_ar?: string
          caption_en?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          album_id?: string
          caption_ar?: string
          caption_en?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "album_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_url: string
          created_at: string
          description_ar: string
          description_en: string
          id: string
          slug: string
          sort_order: number
          title_ar: string
          title_en: string
        }
        Insert: {
          cover_url?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          id?: string
          slug: string
          sort_order?: number
          title_ar: string
          title_en: string
        }
        Update: {
          cover_url?: string
          created_at?: string
          description_ar?: string
          description_en?: string
          id?: string
          slug?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_ar: string
          author_en: string
          category_id: string | null
          content_ar: string
          content_en: string
          created_at: string
          excerpt_ar: string
          excerpt_en: string
          id: string
          image_url: string
          is_published: boolean
          published_at: string
          slug: string
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          author_ar?: string
          author_en?: string
          category_id?: string | null
          content_ar?: string
          content_en?: string
          created_at?: string
          excerpt_ar?: string
          excerpt_en?: string
          id?: string
          image_url?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          author_ar?: string
          author_en?: string
          category_id?: string | null
          content_ar?: string
          content_en?: string
          created_at?: string
          excerpt_ar?: string
          excerpt_en?: string
          id?: string
          image_url?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string
          subject?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_ar: string
          answer_en: string
          created_at: string
          id: string
          question_ar: string
          question_en: string
          sort_order: number
        }
        Insert: {
          answer_ar?: string
          answer_en?: string
          created_at?: string
          id?: string
          question_ar: string
          question_en: string
          sort_order?: number
        }
        Update: {
          answer_ar?: string
          answer_en?: string
          created_at?: string
          id?: string
          question_ar?: string
          question_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description_ar: string
          description_en: string
          icon: string
          id: string
          sort_order: number
          title_ar: string
          title_en: string
        }
        Insert: {
          created_at?: string
          description_ar?: string
          description_en?: string
          icon?: string
          id?: string
          sort_order?: number
          title_ar: string
          title_en: string
        }
        Update: {
          created_at?: string
          description_ar?: string
          description_en?: string
          icon?: string
          id?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_ar: string
          category_en: string
          content_ar: string
          content_en: string
          created_at: string
          features_ar: string[]
          features_en: string[]
          icon: string
          id: string
          image_url: string
          is_published: boolean
          slug: string
          sort_order: number
          summary_ar: string
          summary_en: string
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          category_ar?: string
          category_en?: string
          content_ar?: string
          content_en?: string
          created_at?: string
          features_ar?: string[]
          features_en?: string[]
          icon?: string
          id?: string
          image_url?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          category_ar?: string
          category_en?: string
          content_ar?: string
          content_en?: string
          created_at?: string
          features_ar?: string[]
          features_en?: string[]
          icon?: string
          id?: string
          image_url?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          summary_ar?: string
          summary_en?: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          body_ar: string
          body_en: string
          id: string
          slug: string
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          body_ar?: string
          body_en?: string
          id?: string
          slug: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Update: {
          body_ar?: string
          body_en?: string
          id?: string
          slug?: string
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          locale: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locale?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio_ar: string
          bio_en: string
          created_at: string
          id: string
          name_ar: string
          name_en: string
          photo_url: string
          role_ar: string
          role_en: string
          sort_order: number
        }
        Insert: {
          bio_ar?: string
          bio_en?: string
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          photo_url?: string
          role_ar?: string
          role_en?: string
          sort_order?: number
        }
        Update: {
          bio_ar?: string
          bio_en?: string
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          photo_url?: string
          role_ar?: string
          role_en?: string
          sort_order?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
