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
      beer_transactions: {
        Row: {
          customer_id: number
          id: number
          minister_id: number
          ordered: number
          ordered_at: string
          paid: number
        }
        Insert: {
          customer_id: number
          id?: number
          minister_id: number
          ordered: number
          ordered_at?: string
          paid: number
        }
        Update: {
          customer_id?: number
          id?: number
          minister_id?: number
          ordered?: number
          ordered_at?: string
          paid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_beer_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "listallusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "listusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_transactions_minister_id_fkey"
            columns: ["minister_id"]
            isOneToOne: false
            referencedRelation: "listallusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_transactions_minister_id_fkey"
            columns: ["minister_id"]
            isOneToOne: false
            referencedRelation: "listusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_transactions_minister_id_fkey"
            columns: ["minister_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          }
        ]
      }
      termins: {
        Row: {
          created_at: string
          end_at: string
          id: number
          start_at: string
          user_id: number
          washer: number
        }
        Insert: {
          created_at?: string
          end_at: string
          id?: number
          start_at: string
          user_id: number
          washer: number
        }
        Update: {
          created_at?: string
          end_at?: string
          id?: number
          start_at?: string
          user_id?: number
          washer?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_termin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "listallusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_termin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "listusers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_termin_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          }
        ]
      }
      user_info: {
        Row: {
          confirmed: boolean | null
          disabled: boolean | null
          id: number
          name: string
          phone: string | null
          room: number | null
          surname: string
          uuid: string | null
        }
        Insert: {
          confirmed?: boolean | null
          disabled?: boolean | null
          id?: number
          name: string
          phone?: string | null
          room?: number | null
          surname: string
          uuid?: string | null
        }
        Update: {
          confirmed?: boolean | null
          disabled?: boolean | null
          id?: number
          name?: string
          phone?: string | null
          room?: number | null
          surname?: string
          uuid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      listallusers: {
        Row: {
          confirmed: boolean | null
          disabled: boolean | null
          email: string | null
          id: number | null
          name: string | null
          phone: string | null
          room: number | null
          surname: string | null
        }
        Relationships: []
      }
      listusers: {
        Row: {
          confirmed: boolean | null
          disabled: boolean | null
          email: string | null
          id: number | null
          name: string | null
          phone: string | null
          room: number | null
          surname: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      edituser: {
        Args: {
          param_id: number
          param_name?: string
          param_surname?: string
          param_email?: string
          param_room?: number
          param_phone?: string
          param_disabled?: boolean
          param_confirmed?: boolean
        }
        Returns: undefined
      }
      getterminsbyuid:
        | {
            Args: {
              u_id: number
            }
            Returns: {
              id: number
              user_id: number
              washer: number
              created_at: string
              start_at: string
              end_at: string
            }[]
          }
        | {
            Args: {
              u_id: number
              active: boolean
            }
            Returns: {
              id: number
              user_id: number
              washer: number
              created_at: string
              start_at: string
              end_at: string
            }[]
          }
      getterminsinrange: {
        Args: {
          start: string
          stop: string
        }
        Returns: {
          id: number
          user_id: number
          washer: number
          created_at: string
          start_at: string
          end_at: string
        }[]
      }
      getterminsmonthyear: {
        Args: {
          month: number
          year: number
        }
        Returns: {
          id: number
          user_id: number
          washer: number
          created_at: string
          start_at: string
          end_at: string
        }[]
      }
      getuserbyid: {
        Args: {
          uid: number
        }
        Returns: {
          id: number
          uuid: string
          name: string
          surname: string
          email: string
          room: number
          phone: string
          confirmed: boolean
          disabled: boolean
          created_at: string
          last_sign_in_at: string
        }[]
      }
      search_name_surname: {
        Args: {
          "": unknown
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
