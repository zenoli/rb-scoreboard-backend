export interface SmResponse {
  data: SmTeam[] | SmType[] | SmSeason
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
  players: SmTeamPlayer[]
}

export interface SmTeamPlayer {
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
  player: SmPlayer
}

export interface SmPlayer {
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

export interface SmRateLimit {
  resets_in_seconds: number
  remaining: number
  requested_entity: string
}

export interface SmSubscription {
  meta: SmMeta
  plans: SmPlan[]
  add_ons: any[]
  widgets: any[]
}

export interface SmMeta {
  trial_ends_at: null
  ends_at: Date
  current_timestamp: number
}

export interface SmPlan {
  plan: string
  sport: string
  category: string
}

export interface Welcome {
  data: Data
  subscription: Subscription[]
  rate_limit: RateLimit
  timezone: string
}

export interface SmSeason {
  id: number
  sport_id: number
  league_id: number
  tie_breaker_rule_id: number
  name: string
  finished: boolean
  pending: boolean
  is_current: boolean
  starting_at: Date
  ending_at: Date
  standings_recalculated_at: Date
  games_in_current_week: boolean
  fixtures: SmFixture[]
}

export interface SmFixture {
  id: number
  sport_id: number
  league_id: number
  season_id: number
  stage_id: number
  group_id: number | null
  aggregate_id: null
  round_id: number | null
  state_id: number
  venue_id: number
  name: string
  starting_at: Date
  result_info: null | string
  leg: SmLeg
  details: string
  length: number
  placeholder: boolean
  has_odds: boolean
  has_premium_odds: boolean
  starting_at_timestamp: number
  events: SmEvent[]
}

export interface SmEvent {
  id: number
  fixture_id: number
  period_id: number
  participant_id: number
  type_id: number
  section: SmSection
  player_id: number | null
  related_player_id: number | null
  player_name: string
  related_player_name: null | string
  result: null | string
  info: null | string
  addition: null | string
  minute: number
  extra_minute: number | null
  injured: boolean | null
  on_bench: boolean
  coach_id: number | null
  sub_type_id: number | null
}

export type SmGender = "male" | "female" | "neutral"
export type SmTeamType = "domestic" | "national"
export type SmSection = "event"
export type SmLeg = "1/1"
