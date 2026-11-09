# Zero-app participation: attendees join a room by code with a nickname and avatar, no login.
class JoinController < ApplicationController
  before_action :load_session
  before_action :load_participant, only: %i[me update]

  def show
    render json: { room: room_json, avatars: Participant::AVATARS, groups: @session.groups }
  end

  def create
    unless @session.live?
      return render json: { error: "The river isn’t open yet. Hang tight until your host says go." }, status: :conflict
    end
    if @session.participants.count >= @session.settings.fetch("max_participants", 150).to_i
      return render json: { error: "This raft is full, sorry. Have a word with your host." }, status: :conflict
    end

    participant, token = Participant.issue!(session: @session, nickname: params[:nickname], avatar_icon: params[:avatar],
                                            group_code: params[:group].presence)
    LiveSeating.seat_latecomer(@session)
    LiveBroadcast.roster(@session)
    render json: { participant:, token:, room: room_json, groups: @session.groups }, status: :created
  end

  # Lets a phone that locked or dropped off rejoin with the token it kept in localStorage.
  def me
    render json: { participant: @participant, room: room_json, groups: @session.groups }
  end

  # Attendees can change their table (say they sat down somewhere else). Games pick it up from the next deal.
  def update
    @participant.update!(group_code: params[:group].presence)
    LiveBroadcast.roster(@session)
    render json: { participant: @participant }
  end

  private

  def load_session
    @session = Session.includes(:timeline_blocks).find_by!(room_code: params[:code].to_s.upcase)
  end

  def load_participant
    @participant = @session.participants.find_by_token(request.headers["X-Participant-Token"])
    render json: { error: "You haven’t joined this room yet." }, status: :not_found unless @participant
  end

  def room_json = LiveBroadcast.public_state(@session)
end
