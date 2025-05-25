interface RootObject {
  openapi: string;
  info: Info;
  paths: Paths;
  components: Components;
}

interface Components {
  schemas: Schemas;
  securitySchemes: SecuritySchemes;
}

interface SecuritySchemes {
  OAuth2PasswordBearer: OAuth2PasswordBearer;
}

interface OAuth2PasswordBearer {
  type: string;
  flows: Flows;
}

interface Flows {
  password: Password;
}

interface Password {
  scopes: Schema2;
  tokenUrl: string;
}

interface Schemas {
  AgentCreateRequest: AgentCreateRequest;
  AgentResponse: AgentResponse;
  AgentUpdateRequest: AgentUpdateRequest;
  Body_login_token_post: Bodylogintokenpost;
  Body_update_current_user_api_v1_users_me_patch: Bodyupdatecurrentuserapiv1usersmepatch;
  Body_update_user_api_v1_users__user_id__patch: Bodyupdatecurrentuserapiv1usersmepatch;
  ChatCreateRequest: ChatCreateRequest;
  ChatCreateResponse: ChatCreateResponse;
  ChatResponse: ChatResponse;
  ChatUpdateRequest: ChatUpdateRequest;
  HTTPValidationError: HTTPValidationError;
  JournalContentModel: JournalContentModel;
  JournalCreate: JournalCreate;
  JournalResponse: JournalResponse;
  JournalSearchRequest: JournalSearchRequest;
  JournalSearchResponse: JournalSearchResponse;
  JournalUpdate: JournalUpdate;
  UserCreate: UserCreate;
  UserMemoryUpdate: UserMemoryUpdate;
  UserResponse: UserResponse;
  UserUpdate: UserUpdate;
  ValidationError: ValidationError;
}

interface ValidationError {
  properties: Properties21;
  type: string;
  required: string[];
  title: string;
}

interface Properties21 {
  loc: Loc;
  msg: Schema11;
  type: Schema11;
}

interface Loc {
  items: Items3;
  type: string;
  title: string;
}

interface Items3 {
  anyOf: AnyOf[];
}

interface UserUpdate {
  properties: Properties20;
  type: string;
  title: string;
  description: string;
  example: Example11;
}

interface Example11 {
  account_type: string;
  avatar_url: string;
  email: string;
  first_name: string;
  last_name: string;
  notification_enabled: boolean;
}

interface Properties20 {
  first_name: Lastname;
  last_name: Lastname;
  email: Createdat;
  phone_number: Phonenumber;
  avatar_url: Description;
  notification_enabled: Description;
  account_type: Description;
}

interface UserResponse {
  properties: Properties19;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example10;
}

interface Example10 {
  account_type: string;
  avatar_url: string;
  chats_owned: string[];
  created_at: string;
  display_name: string;
  email: string;
  first_name: string;
  id: string;
  journals_owned: string[];
  last_name: string;
  notification_enabled: boolean;
  phone_number: string;
  updated_at: string;
  users_followed: string[];
}

interface Properties19 {
  id: Schema5;
  first_name: Schema5;
  last_name: Description;
  display_name: Schema5;
  email: Description;
  phone_number: Description;
  avatar_url: Description;
  notification_enabled: Ispublic2;
  account_type: Schema5;
  created_at: Createdat;
  updated_at: Createdat;
  users_followed: Journalsowned;
  journals_owned: Journalsowned;
  chats_owned: Journalsowned;
  memory: Config;
}

interface UserMemoryUpdate {
  properties: Properties18;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example9;
}

interface Example9 {
  field: string;
  value: string[];
}

interface Properties18 {
  field: Schema5;
  value: Value;
}

interface Value {
  title: string;
  description: string;
}

interface UserCreate {
  properties: Properties17;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example8;
}

interface Example8 {
  account_type: string;
  avatar_url: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  notification_enabled: boolean;
  phone_number: string;
}

interface Properties17 {
  id: Schema5;
  first_name: Title;
  last_name: Lastname;
  email: Createdat;
  phone_number: Phonenumber;
  avatar_url: Description;
  notification_enabled: Ispublic2;
  account_type: Accounttype;
}

interface Accounttype {
  type: string;
  title: string;
  description: string;
  default: string;
}

interface Phonenumber {
  anyOf: AnyOf3[];
  title: string;
  description: string;
}

interface Lastname {
  anyOf: AnyOf8[];
  title: string;
  description: string;
}

interface AnyOf8 {
  type: string;
  maxLength?: number;
  minLength?: number;
}

interface JournalUpdate {
  properties: Properties16;
  additionalProperties: boolean;
  type: string;
  title: string;
  description: string;
}

interface Properties16 {
  title: Emotion;
  text: Clientid;
  time: Clientid;
  thumbnail_url: Clientid;
  people: Filtertags;
  headline: Clientid;
  images: Filtertags;
  tags: Filtertags;
  is_private: Clientid;
  shared_with: Filtertags;
}

interface JournalSearchResponse {
  properties: Properties15;
  type: string;
  required: string[];
  title: string;
  description: string;
}

interface Properties15 {
  journals: Schema4;
  total: Schema11;
  query: Schema11;
}

interface JournalSearchRequest {
  properties: Properties14;
  type: string;
  required: string[];
  title: string;
  description: string;
}

interface Properties14 {
  query: Schema11;
  user_id: Schema11;
  limit: Limit;
  include_shared: Includeshared;
  filter_tags: Filtertags;
  filter_people: Filtertags;
}

interface Filtertags {
  anyOf: AnyOf7[];
  title: string;
}

interface AnyOf7 {
  items?: AnyOf;
  type: string;
}

interface Includeshared {
  anyOf: AnyOf[];
  title: string;
  default: boolean;
}

interface Limit {
  anyOf: AnyOf[];
  title: string;
  default: number;
}

interface JournalResponse {
  properties: Properties13;
  type: string;
  required: string[];
  title: string;
  description: string;
}

interface Properties13 {
  id: Schema11;
  title: Schema11;
  text: Schema11;
  owner_id: Schema11;
  agent_id: Schema11;
  created_at: Createdat2;
  updated_at: Createdat2;
  time: Scope;
  thumbnail_url: Clientid;
  people: Images;
  headline: Clientid;
  images: Images;
  tags: Images;
  is_private: Isprivate;
  shared_with: Images;
}

interface JournalCreate {
  properties: Properties12;
  additionalProperties: boolean;
  type: string;
  required: string[];
  title: string;
  description: string;
}

interface Properties12 {
  title: Title2;
  text: Schema11;
  user_id: Schema11;
  agent_id: Schema11;
  time: Description;
  thumbnail_url: Clientid;
  people: Journalsowned;
  headline: Clientid;
  images: Images;
  tags: Images;
  is_private: Isprivate;
  shared_with: Images;
}

interface Isprivate {
  type: string;
  title: string;
  default: boolean;
}

interface Images {
  items: AnyOf;
  type: string;
  title: string;
  default: any[];
}

interface Title2 {
  type: string;
  maxLength: number;
  title: string;
  description: string;
}

interface JournalContentModel {
  properties: Properties11;
  type: string;
  required: string[];
  title: string;
  description: string;
  examples: Example7[];
}

interface Example7 {
  date: string;
  emotion: string;
  narrative: string;
  people: string[];
  title: string;
}

interface Properties11 {
  title: Title;
  narrative: Narrative;
  date: Description;
  people: Journalsowned;
  emotion: Emotion;
}

interface Emotion {
  anyOf: AnyOf6[];
  title: string;
  description: string;
}

interface AnyOf6 {
  type: string;
  maxLength?: number;
}

interface Narrative {
  type: string;
  minLength: number;
  title: string;
  description: string;
}

interface Title {
  type: string;
  maxLength: number;
  minLength: number;
  title: string;
  description: string;
}

interface HTTPValidationError {
  properties: Properties10;
  type: string;
  title: string;
}

interface Properties10 {
  detail: Schema4;
}

interface ChatUpdateRequest {
  properties: Properties9;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example6;
}

interface Example6 {
  messages: Message[];
  metadata: Metadata4;
  metrics: Metrics;
}

interface Metrics {
  llm_completion_tokens: number;
  llm_prompt_tokens: number;
  stt_audio_duration: number;
  tts_characters_count: number;
}

interface Metadata4 {
  agents: Agent[];
}

interface Agent {
  agent_id: string;
  instructions: string;
}

interface Message {
  content: string[];
  id: string;
  role: string;
  type: string;
}

interface Properties9 {
  messages: Messages2;
  metrics: Metadata;
  metadata: Metadata;
}

interface Messages2 {
  items: Items2;
  type: string;
  title: string;
  description: string;
}

interface ChatResponse {
  properties: Properties8;
  type: string;
  required: string[];
  title: string;
  description: string;
}

interface Properties8 {
  id: Schema11;
  user_id: Schema11;
  agent_id: Schema11;
  created_at: Createdat2;
  metadata: Metadata3;
  messages: Messages;
  usage_summary: Usagesummary;
}

interface Usagesummary {
  anyOf: AnyOf5[];
  title: string;
}

interface Messages {
  items: Items2;
  type: string;
  title: string;
  default: any[];
}

interface Items2 {
  additionalProperties: boolean;
  type: string;
}

interface Metadata3 {
  additionalProperties: boolean;
  type: string;
  title: string;
  default: Schema2;
}

interface Createdat2 {
  type: string;
  format: string;
  title: string;
}

interface ChatCreateResponse {
  properties: Properties7;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example5;
}

interface Example5 {
  id: string;
  participant_name: string;
  participant_token: string;
  room_name: string;
  server_url: string;
}

interface Properties7 {
  id: Schema5;
  server_url: Schema5;
  room_name: Schema5;
  participant_name: Schema5;
  participant_token: Schema5;
}

interface ChatCreateRequest {
  properties: Properties6;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example4;
}

interface Example4 {
  agent_id: string;
  metadata: Metadata2;
  user_id: string;
}

interface Metadata2 {
  title: string;
}

interface Properties6 {
  user_id: Schema5;
  agent_id: Schema5;
  metadata: Metadata;
}

interface Metadata {
  anyOf: AnyOf5[];
  title: string;
  description: string;
}

interface AnyOf5 {
  additionalProperties?: boolean;
  type: string;
}

interface Bodyupdatecurrentuserapiv1usersmepatch {
  properties: Properties5;
  type: string;
  title: string;
}

interface Properties5 {
  user_update: Userupdate;
  memory_update: Userupdate;
}

interface Userupdate {
  anyOf: AnyOf4[];
}

interface AnyOf4 {
  '$ref'?: string;
  type?: string;
}

interface Bodylogintokenpost {
  properties: Properties4;
  type: string;
  required: string[];
  title: string;
}

interface Properties4 {
  grant_type: Granttype;
  username: Schema11;
  password: Schema11;
  scope: Scope;
  client_id: Clientid;
  client_secret: Clientid;
}

interface Clientid {
  anyOf: AnyOf[];
  title: string;
}

interface Scope {
  type: string;
  title: string;
  default: string;
}

interface Granttype {
  anyOf: AnyOf3[];
  title: string;
}

interface AnyOf3 {
  type: string;
  pattern?: string;
}

interface AgentUpdateRequest {
  properties: Properties3;
  type: string;
  title: string;
  description: string;
  example: Example3;
}

interface Example3 {
  description: string;
  is_public: boolean;
  name: string;
}

interface Properties3 {
  name: Description;
  description: Description;
  avatar_url: Description;
  is_public: Description;
  agent_type: Description;
  llm_model: Description;
  voice: Description;
}

interface AgentResponse {
  properties: Properties2;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example2;
}

interface Example2 {
  avatar_url: string;
  chats_owned: string[];
  config: Config2;
  created_at: string;
  description: string;
  followers: string[];
  id: string;
  is_public: boolean;
  journals_owned: string[];
  name: string;
  updated_at: string;
  user_id: string;
}

interface Config2 {
  agent_type: string;
  base_instruction: string;
  llm_model: string;
  voice: string;
}

interface Properties2 {
  id: Schema5;
  name: Schema5;
  description: Description;
  user_id: Schema5;
  is_public: Ispublic2;
  avatar_url: Avatarurl;
  created_at: Createdat;
  updated_at: Description;
  config: Config;
  journals_owned: Journalsowned;
  chats_owned: Journalsowned;
  followers: Journalsowned;
}

interface Journalsowned {
  items: AnyOf;
  type: string;
  title: string;
  description: string;
}

interface Config {
  additionalProperties: boolean;
  type: string;
  title: string;
  description: string;
}

interface Createdat {
  anyOf: AnyOf2[];
  title: string;
  description: string;
}

interface AnyOf2 {
  type: string;
  format?: string;
}

interface Avatarurl {
  anyOf: AnyOf[];
  title: string;
  description: string;
  default: string;
}

interface Ispublic2 {
  type: string;
  description: string;
  default: boolean;
  title: string;
}

interface AgentCreateRequest {
  properties: Properties;
  type: string;
  required: string[];
  title: string;
  description: string;
  example: Example;
}

interface Example {
  description: string;
  is_public: boolean;
  name: string;
  owner_id: string;
}

interface Properties {
  name: Schema5;
  owner_id: Schema5;
  description: Description;
  avatar_url: Description;
  is_public: Ispublic;
  agent_type: Description;
  llm_model: Description;
  voice: Description;
}

interface Ispublic {
  anyOf: AnyOf[];
  title: string;
  description: string;
  default: boolean;
}

interface Description {
  anyOf: AnyOf[];
  description: string;
  title: string;
}

interface Paths {
  '/token': Token;
  '/api/v1/users': Apiv1users;
  '/api/v1/users/{user_id}': Apiv1usersuserid;
  '/api/v1/users/me': Apiv1usersme;
  '/api/v1/users/{user_id}/agent-relationships': Apiv1usersuseridagentrelationships;
  '/api/v1/agents': Apiv1agents;
  '/api/v1/agents/discover': Apiv1agentsdiscover;
  '/api/v1/agents/': Apiv1agents2;
  '/api/v1/agents/{agent_id}': Apiv1agentsagentid;
  '/api/v1/chats': Apiv1chats;
  '/api/v1/chats/{chat_id}/update': Apiv1chatschatidupdate;
  '/api/v1/chats/{chat_id}': Apiv1chatschatid;
  '/api/v1/journals': Apiv1journals;
  '/api/v1/journals/{journal_id}': Apiv1journalsjournalid;
  '/api/v1/journals/search': Apiv1journalssearch;
  '/api/v1/journals/create_mem0': Apiv1journalscreatemem0;
  '/api/v1/journals/update_mem0': Apiv1journalscreatemem0;
  '/api/v1/journals/search_mem0': Apiv1journalssearchmem0;
  '/api/v1/journals/export_mem0': Apiv1journalsexportmem0;
  '/': _;
}

interface _ {
  get: Get11;
}

interface Get11 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  responses: Responses18;
}

interface Responses18 {
  '200': _200;
}

interface Apiv1journalsexportmem0 {
  post: Get10;
}

interface Apiv1journalssearchmem0 {
  post: Post10;
}

interface Post10 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses17;
}

interface Apiv1journalscreatemem0 {
  post: Post9;
}

interface Post9 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody5;
  responses: Responses17;
}

interface Responses17 {
  '200': _2004;
  '422': _422;
}

interface _2004 {
  description: string;
  content: Content8;
}

interface Content8 {
  'application/json': Applicationjson6;
}

interface Applicationjson6 {
  schema: Schema11;
}

interface RequestBody5 {
  required: boolean;
  content: Content7;
}

interface Content7 {
  'application/json': Applicationjson5;
}

interface Applicationjson5 {
  schema: Schema13;
}

interface Schema13 {
  type: string;
  items: Items;
  description: string;
  title: string;
}

interface Items {
  type: string;
  additionalProperties: AnyOf;
}

interface Apiv1journalssearch {
  post: Post8;
}

interface Post8 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody: RequestBody4;
  responses: Responses15;
  security: Security[];
}

interface Apiv1journalsjournalid {
  get: Get10;
  patch: Patch4;
  delete: Delete4;
}

interface Delete4 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter7[];
  responses: Responses16;
}

interface Responses16 {
  '204': _403;
  '422': _422;
}

interface Parameter7 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema12;
  description: string;
}

interface Schema12 {
  type?: string;
  description: string;
  title: string;
  anyOf?: AnyOf[];
}

interface Patch4 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody4;
  responses: Responses15;
}

interface Get10 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses15;
}

interface Responses15 {
  '200': _422;
  '422': _422;
}

interface Apiv1journals {
  post: Post7;
  get: Get9;
}

interface Get9 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter3[];
  responses: Responses14;
}

interface Responses14 {
  '200': _2002;
  '422': _422;
}

interface Post7 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  requestBody: RequestBody4;
  responses: Responses13;
}

interface Responses13 {
  '201': _422;
  '422': _422;
}

interface Apiv1chatschatid {
  get: Get8;
  delete: Delete3;
}

interface Delete3 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter6[];
  responses: Responses10;
}

interface Parameter6 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema11;
}

interface Schema11 {
  type: string;
  title: string;
}

interface Get8 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter5[];
  responses: Responses9;
}

interface Parameter5 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema10;
  description?: string;
}

interface Schema10 {
  type: string;
  title: string;
  description?: string;
}

interface Apiv1chatschatidupdate {
  post: Post6;
}

interface Post6 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody2;
  responses: Responses9;
}

interface Apiv1chats {
  get: Get7;
  post: Post5;
}

interface Post5 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody: RequestBody2;
  responses: Responses12;
  security: Security[];
}

interface Responses12 {
  '201': _422;
  '404': _403;
  '422': _422;
}

interface Get7 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  responses: Responses11;
  security: Security[];
}

interface Responses11 {
  '200': _2002;
  '404': _403;
}

interface Apiv1agentsagentid {
  get: Get6;
  patch: Patch3;
  delete: Delete2;
}

interface Delete2 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter4[];
  responses: Responses10;
}

interface Responses10 {
  '204': _403;
  '404': _403;
  '422': _422;
}

interface Parameter4 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema9;
  description: string;
}

interface Schema9 {
  type: string;
  description: string;
  title: string;
  default?: boolean;
}

interface Patch3 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody4;
  responses: Responses9;
}

interface RequestBody4 {
  required: boolean;
  content: Content6;
}

interface Content6 {
  'application/json': Applicationjson4;
}

interface Applicationjson4 {
  schema: Schema8;
}

interface Schema8 {
  '$ref': string;
  description: string;
}

interface Get6 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses9;
}

interface Apiv1agents2 {
  post: Post4;
}

interface Apiv1agentsdiscover {
  get: Get5;
}

interface Get5 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter[];
  responses: Responses8;
}

interface Apiv1agents {
  get: Get4;
  post: Post4;
}

interface Post4 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  requestBody: RequestBody2;
  responses: Responses9;
}

interface Responses9 {
  '200': _422;
  '404': _403;
  '422': _422;
}

interface Get4 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter3[];
  responses: Responses8;
}

interface Responses8 {
  '200': _2002;
  '404': _403;
  '422': _422;
}

interface Parameter3 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema7;
  description: string;
}

interface Schema7 {
  type?: string;
  description: string;
  default?: number;
  title: string;
  anyOf?: AnyOf[];
}

interface AnyOf {
  type: string;
}

interface Apiv1usersuseridagentrelationships {
  post: Post3;
}

interface Post3 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses7;
}

interface Responses7 {
  '204': _403;
  '403': _403;
  '404': _403;
  '422': _422;
}

interface Apiv1usersme {
  get: Get3;
  patch: Patch2;
}

interface Patch2 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody: RequestBody3;
  responses: Responses4;
  security: Security[];
}

interface Get3 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  responses: Responses6;
  security: Security[];
}

interface Responses6 {
  '200': _422;
  '403': _403;
  '404': _403;
}

interface Apiv1usersuserid {
  get: Get2;
  patch: Patch;
  delete: Delete;
}

interface Delete {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses5;
}

interface Responses5 {
  '200': _2003;
  '403': _403;
  '404': _403;
  '422': _422;
}

interface _2003 {
  description: string;
  content: Content5;
}

interface Content5 {
  'application/json': Applicationjson3;
}

interface Applicationjson3 {
  schema: Schema6;
}

interface Schema6 {
  type: string;
  additionalProperties: boolean;
  title: string;
}

interface Patch {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  requestBody: RequestBody3;
  responses: Responses4;
}

interface RequestBody3 {
  content: Content3;
}

interface Get2 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter2[];
  responses: Responses4;
}

interface Responses4 {
  '200': _422;
  '403': _403;
  '404': _403;
  '422': _422;
}

interface Parameter2 {
  name: string;
  in: string;
  required: boolean;
  schema: Schema5;
  description: string;
}

interface Schema5 {
  type: string;
  description: string;
  title: string;
}

interface Apiv1users {
  post: Post2;
  get: Get;
}

interface Get {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  parameters: Parameter[];
  responses: Responses3;
}

interface Responses3 {
  '200': _2002;
  '403': _403;
  '404': _403;
  '422': _422;
}

interface _2002 {
  description: string;
  content: Content4;
}

interface Content4 {
  'application/json': Applicationjson2;
}

interface Applicationjson2 {
  schema: Schema4;
}

interface Schema4 {
  type: string;
  items: Schema;
  title: string;
}

interface Parameter {
  name: string;
  in: string;
  required: boolean;
  schema: Schema3;
  description: string;
}

interface Schema3 {
  type: string;
  description: string;
  default: number;
  title: string;
}

interface Post2 {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Security[];
  requestBody: RequestBody2;
  responses: Responses2;
}

interface Responses2 {
  '201': _422;
  '403': _403;
  '404': _403;
  '422': _422;
}

interface _403 {
  description: string;
}

interface RequestBody2 {
  required: boolean;
  content: Content3;
}

interface Security {
  OAuth2PasswordBearer: any[];
}

interface Token {
  post: Post;
}

interface Post {
  summary: string;
  description: string;
  operationId: string;
  requestBody: RequestBody;
  responses: Responses;
}

interface Responses {
  '200': _200;
  '422': _422;
}

interface _422 {
  description: string;
  content: Content3;
}

interface Content3 {
  'application/json': Applicationxwwwformurlencoded;
}

interface _200 {
  description: string;
  content: Content2;
}

interface Content2 {
  'application/json': Applicationjson;
}

interface Applicationjson {
  schema: Schema2;
}

interface Schema2 {
}

interface RequestBody {
  content: Content;
  required: boolean;
}

interface Content {
  'application/x-www-form-urlencoded': Applicationxwwwformurlencoded;
}

interface Applicationxwwwformurlencoded {
  schema: Schema;
}

interface Schema {
  '$ref': string;
}

interface Info {
  title: string;
  description: string;
  version: string;
}