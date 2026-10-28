# Zero-app participation: attendees join a room by code with a nickname and avatar, no login.
class JoinController < ApplicationController
  before_action :load_session

  def show
    render json: { room: room_json, avatars: Participant::AVATARS }
  end

  def create
    unless @session.live?
      return render json: { error: "The river isn’t open yet. Hang tight until your host says go." }, status: :conflict
    end
    if @session.participants.count >= @session.settings.fetch("max_participants", 150).to_i
      return render json: { error: "This raft is full, sorry. Have a word with your host." }, status: :conflict
    end

    participant, token = Participant.issue!(session: @session, nickname: params[:nickname], avatar_icon: params[:avatar])
    LiveBroadcast.roster(@session)
    render json: { participant:, token:, room: room_json }, status: :created
  end

  # Lets a phone that locked or dropped off rejoin with the token it kept in localStorage.
  def me
    participant = @session.participants.find_by_token(request.headers["X-Participant-Token"])
    return render json: { error: "You haven’t joined this room yet." }, status: :not_found unless participant
    render json: { participant:, room: room_json }
  end

  private

  def load_session
    @session = Session.includes(:timeline_blocks).find_by!(room_code: params[:code].to_s.upcase)
  end

  def room_json = LiveBroadcast.public_state(@session)
end
