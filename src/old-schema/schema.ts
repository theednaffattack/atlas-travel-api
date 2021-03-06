import gql from "graphql-tag";

export const schema = gql`
  input AddHotelLikeInput {
    hotelId: ID!
  }

  input Amenity {
    name: [String!]
  }

  input BaseListInput {
    skip: Int = 0
    take: Int = 25
  }

  input BaseReviewInput {
    value: Float!
    title: String!
    text: String!
    hotelId: ID!
  }

  input ChangePasswordInput {
    password: String!
    token: String
  }

  input DateInput {
    from: String!
    to: String!
    hotelId: String!
  }

  input DateInputSimple {
    from: DateTime = false
    to: DateTime = false
  }

  scalar DateTime

  input EditUserInput {
    firstName: String!
    lastName: String!
    email: String!
    teamId: ID!
  }

  type EventEntity {
    id: ID!
    attendees: [User!]!
    end_time: DateTime!
    name: String!
    organizerId: ID!
    organizer: User!
    price: Float!
    start_time: DateTime!
    venueId: ID!
    venue: Venue!
  }

  input FileInput {
    id: ID!
    uri: String!
  }

  input GetAllHotelInput {
    skip: Int = 0
    take: Int = 25
    dates: DateInputSimple
    from: DateTime
    to: DateTime
    prices: PriceRangeInput
    amenities: [Amenity]
  }

  input GetFileObjectInput {
    id: ID!
    uri: String!
  }

  input GetMessagesInput {
    sentBy: String!
    user: String!
  }

  type Hotel {
    id: ID!
    name: String!
    hotelLikes: [HotelLike!]
    photos: [Photo!]
    price: Float!
    amenities: [String!]
    reviews: [Review!]
    rooms: [Room!]
    loveCount: Float
    commentCount: Float
    address: String
    suite: String
    city: String
    state: String
    zipCode: String
    zipCodeSuffix: Float
    weatherIconName: String
    distanceKm: String
    temperature: String
    weatherDescription: String
    coordinates: PointObjectClassType
  }

  input HotelGetInput {
    hotelId: ID!
  }

  input HotelInput {
    commentCount: Float
    coordinates: PointObjectInput
    distanceKm: String
    loveCount: Float
    name: String!
    photos: [PhotoInput!]
    price: Float!
    temperature: String
    weatherDescription: String
    weatherIconName: String
  }

  type HotelLike {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    hotelId: ID!
    hotel: Hotel!
    userId: ID!
    user: User!
  }

  type HotelResolverReturnFake {
    id: ID!
    name: String!
    hotelLikes: [HotelLike!]
    photos: [Photo!]
    price: Float!
    amenities: [String!]
    reviews: [Review!]
    rooms: [Room!]
    loveCount: Float
    commentCount: Float
    address: String
    suite: String
    city: String
    state: String
    zipCode: String
    zipCodeSuffix: Float
    weatherIconName: String
    distanceKm: String
    temperature: String
    weatherDescription: String
    coordinates: PointObject
  }

  type Image {
    id: ID!
    uri: String!
    user: User!
  }

  input ImageSubInput {
    type: String!
    lastModified: Float!
    lastModifiedDate: DateTime!
    size: Int!
    name: String!
    webkitRelativePath: String!
    path: String!
  }

  type Message {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    message: String!
    sentBy: ID!
    user: User!
  }

  type MessageOutput {
    message: String!
  }

  type MessageSubType {
    id: ID!
    message: String
    sentBy: String!
    user: User!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Mutation {
    createHotel(data: HotelInput!): Hotel!
    createUser(data: RegisterInput!): User!
    changePasswordFromContextUserid(data: PasswordInput!): User
    changePasswordFromToken(data: ChangePasswordInput!): User
    confirmUser(token: String!): Boolean!
    forgotPassword(email: String!): Boolean!
    login(password: String!, email: String!): User
    logout: Boolean!
    register(data: RegisterInput!): User!
    addProfilePicture(data: UploadProfilePictureInput!): UploadProfilePictueReturnType!
    editUserInfo(data: EditUserInput!): User!
    adminEditUserInfo(data: EditUserInput!): UserClassTypeWithReferenceIds!
    addNewMessage(sentBy: String!, message: String!): Boolean!
    createReview(data: BaseReviewInput!): Review!
    signS3(files: [ImageSubInput!]!, action: S3SignatureAction!): SignedS3Payload!
    signS3GetObject(files: [FileInput!]!, action: S3SignatureAction = getObject): SignedS3Payload!
    addHotelLike(data: AddHotelLikeInput!): HotelLike!
    removeHotelLike(data: RemoveHotelLikeInput!): String!
    createReservation(data: ReservationInput!): Reservation!
  }

  input PasswordInput {
    password: String!
  }

  type Photo {
    id: ID!
    uri: String!
    name: String!
    description: String
    isPublished: Boolean
    hotelId: ID!
  }

  input PhotoInput {
    uri: String!
    name: String!
    description: String
    isPublished: Boolean
  }

  type PointObject {
    longitude: Float!
    latitude: Float!
  }

  type PointObjectClassType {
    type: String!
    coordinates: [Int!]!
  }

  input PointObjectInput {
    X: Float!
    Y: Float!
  }

  input PriceRangeInput {
    low: Int
    high: Int
  }

  type Query {
    me: User
    helloWorld: String!
    getMyMessages(input: GetMessagesInput!): [Message!]
    getAllHotels(data: GetAllHotelInput): [HotelResolverReturnFake]
    getAllReservations: [Reservation!]!
    getAllReservationsByHotelIDAndDateFilter(data: ReservationInput!): [Reservation]
  }

  input RegisterInput {
    password: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  input RemoveHotelLikeInput {
    hotelLikeId: ID!
    hotelId: ID!
  }

  type Reservation {
    id: ID!
    from: DateTime!
    to: DateTime!
    user: User!
    room: Room!
  }

  input ReservationInput {
    dates: DateInput!
  }

  type Review {
    id: ID!
    value: Float!
    title: String!
    text: String!
    user: User!
    hotel: Hotel!
    venue: Venue!
  }

  type Room {
    id: ID!
    roomNumber: String!
    type: String!
    beds: Float!
    maxOccupancy: Float!
    costPerNight: Float!
    reservations: [Reservation!]
    hotel: Hotel!
  }

  enum S3SignatureAction {
    putObject
    getObject
  }

  type Saved {
    id: ID
    user: User!
  }

  type SignedS3Payload {
    signatures: [SignedS3SubPayload!]!
  }

  type SignedS3SubPayload {
    uri: String!
    signedRequest: String!
  }

  type Subscription {
    newMessage: MessageSubType!
  }

  type UploadProfilePictueReturnType {
    message: String!
    profileImgUrl: String!
  }

  input UploadProfilePictureInput {
    user: ID!
    image: String
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    messages: [Message!]
    event_ownerships: [EventEntity!]
    hotelLikes: [HotelLike!]
    savedItems: [Saved!]
    reservations: [Reservation]
    events: [EventEntity]
    reviews: [Review!]
    followers: [User]
    following: [User]
    profileImageUri: String
    name: String
    images: [Image!]!
  }

  type UserClassTypeWithReferenceIds {
    id: ID
    firstName: String
    lastName: String
    email: String
    messages: [Message!]
    reservations: [Reservation!]
    reviewLikes: [Review!]
    reviews: [Review!]
    followers: [User]
    following: [User]
    profileImageUri: String
    name: String
  }

  type Venue {
    id: ID!
    name: String!
    events: [EventEntity]
    photos: [Photo!]
    amenities: [String!]
    type: [String!]
    reviews: [Review!]
    seats: [VenueSeating!]
    loveCount: Float
    commentCount: Float
    address: String
    suite: String
    city: String
    state: String
    zipCode: String
    zipCodeSuffix: Float
    coordinates: PointObject
  }

  type VenueSeating {
    id: ID!
    roomNumber: String!
    type: String!
    beds: Float!
    maxOccupancy: Float!
    costPerNight: Float!
    reserved: [Reservation!]
    venue: Venue!
  }
`;
