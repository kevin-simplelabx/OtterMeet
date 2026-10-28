module ApplicationCable
  # Hosts are identified by their login cookie; attendees by the participant token their phone kept (?pt=…).
  class Connection < ActionCable::Connection::Base
    identified_by :account, :participant

    def connect
      self.account = AuthToken.find_account(cookies[ApplicationController::AUTH_COOKIE])
      self.participant = Participant.find_by_token(request.params[:pt])
      reject_unauthorized_connection unless account || participant
    end
  end
end
