# Somebody joined while a group game is under way: deal them in straight away instead of leaving them watching.
# Split Words slots them into a pair (or trio); Imposter seats them at their own table while cards are being read.
# Other games need nothing: anyone can answer from the moment they arrive.
module LiveSeating
  module_function

  def seat_latecomer(session)
    block = session.active_block
    return unless session.live? && block
    step = LiveStore.step(session)
    case block.block_type
    when "SPLIT_WORDS"
      return unless step.zero? && Squad.exists?(timeline_block: block, round: 0)
      Activities::SplitWords.rescue!(session, block)
    when "IMPOSTER"
      round, phase = Activities::Imposter.current(step)
      return unless phase == "words" && Squad.exists?(timeline_block: block, round:)
      Activities::Imposter.rescue!(session, block, step)
    else
      return
    end
    # Partners and tablemates see the newcomer too.
    LiveBroadcast.mine_all(session)
    Activities.mark_dirty(session, block)
  rescue ArgumentError
    nil
  end
end
