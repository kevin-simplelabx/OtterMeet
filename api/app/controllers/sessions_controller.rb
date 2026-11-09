# Host-side CRUD for live sessions (events) and their timelines. Everything is scoped to the signed-in account.
class SessionsController < ApplicationController
  before_action :require_account!
  before_action :load_session, except: %i[index create question_bank word_packs]

  def index
    sessions = current_account.sessions.includes(:timeline_blocks).order(updated_at: :desc)
    render json: { sessions: }
  end

  def create
    session = current_account.sessions.new(title: params[:title])
    session.timeline_blocks.build(DEFAULT_TIMELINE.each_with_index.map { |b, i| b.merge(position: i, config: Activities.defaults_for(b[:block_type])) })
    session.save!
    render json: { session: }, status: :created
  end

  def show
    render json: { session: @session }
  end

  def update
    @session.title = params[:title] if params.key?(:title)
    if params.key?(:settings)
      settings = params.require(:settings)
      @session.settings = @session.settings.merge(settings.permit(:allow_emoji_shower, :collect_game_feedback, :max_participants).to_h)
      @session.settings = @session.settings.merge("groups" => Session.clean_groups(settings[:groups])) if settings.key?(:groups)
    end
    @session.save!
    LiveBroadcast.state(@session) if @session.live? && params.dig(:settings, :groups)
    render json: { session: @session }
  end

  # Saves the whole timeline in one go, which is what the drag-and-drop builder sends. Blocks keep their ids
  # (and so their votes and answers); only blocks left out are deleted.
  def update_blocks
    blocks = params.require(:blocks)
    Session.transaction do
      existing = @session.timeline_blocks.index_by(&:id)
      kept = blocks.each_with_index.map do |b, i|
        block = existing[b[:id]] || @session.timeline_blocks.new
        config = b[:config].respond_to?(:permit!) ? b[:config].permit!.to_h : {}
        block.update!(position: i, block_type: b[:block_type], title: b[:title],
                      duration_estimate_sec: b[:duration_estimate_sec] || 300,
                      config: config.presence || Activities.defaults_for(b[:block_type]))
        block.id
      end
      @session.timeline_blocks.where.not(id: kept).destroy_all
      @session.update!(active_block_index: [@session.active_block_index, blocks.size - 1].min.clamp(0..))
    end
    LiveBroadcast.state(@session.reload) if @session.live?
    render json: { session: @session.reload }
  end

  # Results for one block: the cockpit's private view (feedback answers stay off the projector).
  def block_results
    block = @session.timeline_blocks.find(params[:block_id])
    results = block.block_type == "FEEDBACK" ? Activities::Feedback.results(block) : Activities.tally(block, 0)
    render json: { block: block.as_json, results: }
  end

  def question_bank
    render json: { questions: Activities.question_bank }
  end

  def word_packs
    render json: { packs: Activities.word_packs.map { |pk| { id: pk[:id], name: pk[:name], tribes: pk[:tribes].size, sample: pk[:tribes].first(3).map { |t| t[:name] } } } }
  end

  def destroy
    @session.destroy!
    head :no_content
  end

  def go_live
    @session.update!(status: "LIVE", active_block_index: 0)
    LiveStore.set_step(@session, 0)
    LiveStore.set_blackout(@session, false)
    Activities.on_enter(@session, @session.active_block, 0)
    LiveBroadcast.state(@session)
    render json: { session: @session }
  end

  def finish
    @session.update!(status: "COMPLETED")
    LiveBroadcast.state(@session)
    render json: { session: @session }
  end

  private

  def load_session
    @session = current_account.sessions.includes(:timeline_blocks).find(params[:id])
  end

  DEFAULT_TIMELINE = [
    { block_type: "LOBBY", title: "Lobby & check-in", duration_estimate_sec: 600 },
    { block_type: "THIS_OR_THAT", title: "Crowd debate", duration_estimate_sec: 300 },
    { block_type: "QNA", title: "Town hall Q&A", duration_estimate_sec: 900 },
    { block_type: "FEEDBACK", title: "Survey & wrap", duration_estimate_sec: 300 }
  ].freeze
end
