# Snapshot of a live session for the host cockpit and stage canvas when they first load.
class LiveController < ApplicationController
  before_action :require_account!

  def show
    session = current_account.sessions.includes(:timeline_blocks, :participants).find(params[:id])
    render json: { session:, live: LiveBroadcast.public_state(session), roster: LiveBroadcast.roster_json(session),
                   qna: LiveBroadcast.qna_feed_json(session), qna_queue: LiveBroadcast.qna_queue_json(session) }
  end
end
