export type UserRole = 'client' | 'vendor'
export type ServiceCategory =
  | 'transport'
  | 'appliance_repair'
  | 'plumbing'
  | 'electricity'
  | 'carpentry'
  | 'painting'
  | 'cleaning'
  | 'other'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          avatar_url: string | null
          city: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: UserRole
          full_name?: string | null
          avatar_url?: string | null
          city?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          city?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      vendor_services: {
        Row: {
          id: string
          vendor_id: string
          category: ServiceCategory
          bio: string | null
          rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          category: ServiceCategory
          bio?: string | null
          rate?: number | null
          created_at?: string
        }
        Update: {
          category?: ServiceCategory
          bio?: string | null
          rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'vendor_services_vendor_id_fkey'
            columns: ['vendor_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      availabilities: {
        Row: {
          id: string
          vendor_id: string
          available_date: string
          is_booked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          available_date: string
          is_booked?: boolean
          created_at?: string
        }
        Update: {
          is_booked?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'availabilities_vendor_id_fkey'
            columns: ['vendor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          vendor_id: string
          availability_id: string | null
          booking_date: string
          status: BookingStatus
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          vendor_id: string
          availability_id?: string | null
          booking_date: string
          status?: BookingStatus
          created_at?: string
        }
        Update: {
          status?: BookingStatus
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_vendor_id_fkey'
            columns: ['vendor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_availability_id_fkey'
            columns: ['availability_id']
            isOneToOne: false
            referencedRelation: 'availabilities'
            referencedColumns: ['id']
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          client_id: string
          vendor_id: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          vendor_id: string
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'favorites_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_vendor_id_fkey'
            columns: ['vendor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type VendorService = Database['public']['Tables']['vendor_services']['Row']
export type Availability = Database['public']['Tables']['availabilities']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']

// Vendor profile joined with their service info — used in search results
export type VendorWithService = Profile & {
  vendor_services: VendorService | null
}
