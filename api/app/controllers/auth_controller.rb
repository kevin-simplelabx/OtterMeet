class AuthController < ApplicationController
  def signup
    account = Account.create!(params.permit(:name, :email, :password))
    sign_in(account)
    render json: { host: account }, status: :created
  end

  def login
    account = Account.find_by(email: params[:email].to_s.strip.downcase)
    if account&.authenticate(params[:password].to_s)
      sign_in(account)
      render json: { host: account }
    else
      render json: { error: "That email and password don’t match. Give it another go." }, status: :unauthorized
    end
  end

  def logout
    sign_out
    head :no_content
  end

  def me
    render json: { host: current_account }
  end
end
