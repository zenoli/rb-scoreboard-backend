export type User = "Olivier" | "Fabian" | "Jakob" | "Joel" | "Christian" | "Jan"


export interface Type {
  _id: number
  name: string
  code: string
  developer_name: string
  model_type: string
  stat_group: string | null
}

export interface Team {
  id: number
  sport_id: number
  country_id: number | null
  venue_id: number | null
  gender: Gender
  name: string
  short_code: null | string
  image_path: string
  founded: number | null
  type: TeamType
  placeholder: boolean
  last_played_at: Date | null
  players: TeamPlayer[]
}

export interface TeamPlayer {
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
  player: Player
}

export interface Player {
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
  gender: Gender
}

export interface RateLimit {
  resets_in_seconds: number
  remaining: number
  requested_entity: string
}

export interface Subscription {
  meta: Meta
  plans: Plan[]
  add_ons: any[]
  widgets: any[]
}

export interface Meta {
  trial_ends_at: null
  ends_at: Date
  current_timestamp: number
}

export interface Plan {
  plan: string
  sport: string
  category: string
}

export interface Season {
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
  fixtures: Fixture[]
}

export interface Fixture {
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
  leg: Leg
  details: string
  length: number
  placeholder: boolean
  has_odds: boolean
  has_premium_odds: boolean
  starting_at_timestamp: number
  events: Event[]
  participants: Team[]
}

export interface Event {
  id: number
  fixture_id: number
  period_id: number
  participant_id: number
  type_id: number
  section: Section
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

export type Gender = "male" | "female" | "neutral"
export type TeamType = "domestic" | "national"
export type Section = "event"
export type Leg = "1/1"



