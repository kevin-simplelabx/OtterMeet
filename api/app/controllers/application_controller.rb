class ApplicationController < ActionController::API
  include ActionController::Cookies

  AUTH_COOKIE = :om_session

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { error: e.record.errors.full_messages.first }, status: :unprocessable_content
  end
  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: "We couldn’t find that one. It may have drifted off." }, status: :not_found
  end
  rescue_from ActionController::ParameterMissing do |e|
    render json: { error: "Something’s missing from that request (#{e.param})." }, status: :bad_request
  end

  private

  def current_account
    return @current_account if defined?(@current_account)
    @current_account = AuthToken.find_account(cookies[AUTH_COOKIE])
  end

  def require_account!
    render json: { error: "Please log in to keep going." }, status: :unauthorized unless current_account
  end

  def sign_in(account)
    cookies[AUTH_COOKIE] = {
      value: AuthToken.issue!(account), httponly: true, same_site: :lax,
      secure: Rails.env.production?, expires: AuthToken::TTL.from_now
    }
  end

  def sign_out
    AuthToken.revoke(cookies[AUTH_COOKIE])
    cookies.delete(AUTH_COOKIE)
  end
end
