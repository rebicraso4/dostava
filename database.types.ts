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
      addons: {
        Row: {
          created_at: string
          id: number
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          price?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      meal_size: {
        Row: {
          created_at: string
          id: number
          size: string
        }
        Insert: {
          created_at?: string
          id?: number
          size: string
        }
        Update: {
          created_at?: string
          id?: number
          size?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          product_id: number
          product_size_id: number | null
          quantity: number
          size: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          product_size_id?: number | null
          quantity?: number
          size?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          product_size_id?: number | null
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_size_id_fkey"
            columns: ["product_size_id"]
            isOneToOne: false
            referencedRelation: "product_size"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items_addons: {
        Row: {
          order_item_id: number
          product_addon_id: number
        }
        Insert: {
          order_item_id: number
          product_addon_id: number
        }
        Update: {
          order_item_id?: number
          product_addon_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_addons_product_addon_id_fkey"
            columns: ["product_addon_id"]
            isOneToOne: false
            referencedRelation: "product_addons"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          created_at: string
          id: number
          name: string | null
          note: string | null
          res_id_ord: number | null
          status: string
          telephone: string | null
          total: number
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          name?: string | null
          note?: string | null
          res_id_ord?: number | null
          status?: string
          telephone?: string | null
          total?: number
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          name?: string | null
          note?: string | null
          res_id_ord?: number | null
          status?: string
          telephone?: string | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_res_id_ord_fkey"
            columns: ["res_id_ord"]
            isOneToOne: false
            referencedRelation: "restorans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_addons: {
        Row: {
          addon_id: number
          created_at: string
          id: number
          product_id: number
        }
        Insert: {
          addon_id: number
          created_at?: string
          id?: number
          product_id: number
        }
        Update: {
          addon_id?: number
          created_at?: string
          id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_size: {
        Row: {
          created_at: string
          id: number
          price: number
          product_id: number
          size_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          price: number
          product_id: number
          size_id: number
        }
        Update: {
          created_at?: string
          id?: number
          price?: number
          product_id?: number
          size_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_size_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_size_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "meal_size"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cat_id: number | null
          created_at: string
          description: string | null
          id: number
          image: string | null
          name: string
          price: number
          res_id: number | null
        }
        Insert: {
          cat_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name: string
          price: number
          res_id?: number | null
        }
        Update: {
          cat_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          price?: number
          res_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_res_id_fkey"
            columns: ["res_id"]
            isOneToOne: false
            referencedRelation: "restorans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          expo_push_token: string | null
          full_name: string | null
          group: string
          id: string
          res_admin_id: number | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id: string
          res_admin_id?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id?: string
          res_admin_id?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      restorans: {
        Row: {
          address: string | null
          created_at: string
          id: number
          image: string | null
          name: string
          work_hours: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name: string
          work_hours?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string
          work_hours?: string | null
        }
        Relationships: []
      }
      restorans_category: {
        Row: {
          category_id: number | null
          id: number
          restorans_id: number | null
        }
        Insert: {
          category_id?: number | null
          id?: number
          restorans_id?: number | null
        }
        Update: {
          category_id?: number | null
          id?: number
          restorans_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restorans_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restorans_category_restorans_id_fkey"
            columns: ["restorans_id"]
            isOneToOne: false
            referencedRelation: "restorans"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
