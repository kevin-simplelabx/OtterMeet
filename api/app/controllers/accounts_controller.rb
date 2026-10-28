class AccountsController < ApplicationController
  before_action :require_account!

  def update
    if params[:new_password].present?
      unless current_account.authenticate(params[:current_password].to_s)
        return render json: { error: "That current password doesn’t match. Give it another go." }, status: :unprocessable_content
      end
      current_account.update!(password: params[:new_password])
    end
    current_account.update!(name: params[:name]) if params.key?(:name)
    render json: { host: current_account }
  end
end
