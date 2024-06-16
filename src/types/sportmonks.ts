export interface SmResponse {
  data: SmTeam[] | SmType[]
  subscription: SmSubscription[]
  rate_limit: SmRateLimit
  timezone: string
}

export interface SmType {
  id: number
  name: string
  code: string
  developer_name: string
  model_type: string
  stat_group: string | null
}

export interface SmTeam {
  id: number
  sport_id: number
  country_id: number | null
  venue_id: number | null
  gender: SmGender
  name: string
  short_code: null | string
  image_path: string
  founded: number | null
  type: SmTeamType
  placeholder: boolean
  last_played_at: Date | null
  players: SmPlayer[]
}

export enum SmGender {
  Male = "male",
  Neutral = "neutral",
}

export interface SmPlayer {
  id: number
  transfer_id: null
  player_id: number
  team_id: number
  position_id: number
  detailed_position_id: number
  start: null
  end: Date | null
  captain: boolean
  jersey_number: number
  player: SmPlayerInfo
}

export interface SmPlayerInfo {
  id: number
  sport_id: number
  country_id: number
  nationality_id: number
  city_id: number | null
  position_id: number
  detailed_position_id: number
  type_id: number | null
  common_name: string
  firstname: string
  lastname: string
  name: string
  display_name: string
  image_path: string
  height: number
  weight: number | null
  date_of_birth: Date
  gender: SmGender
}

export enum SmTeamType {
  Domestic = "domestic",
  National = "national",
}

export interface SmRateLimit {
  resets_in_seconds: number
  remaining: number
  requested_entity: string
}

export interface SmSubscription {
  meta: SmMeta
  plans: Plan[]
  add_ons: any[]
  widgets: any[]
}

export interface SmMeta {
  trial_ends_at: null
  ends_at: Date
  current_timestamp: number
}

export interface Plan {
  plan: string
  sport: string
  category: string
}
