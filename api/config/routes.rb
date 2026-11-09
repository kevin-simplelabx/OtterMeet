Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  scope "/api", defaults: { format: :json } do
    post "auth/signup", to: "auth#signup"
    post "auth/login", to: "auth#login"
    post "auth/logout", to: "auth#logout"
    get "auth/me", to: "auth#me"
    patch "account", to: "accounts#update"

    resources :sessions, only: %i[index create show update destroy] do
      member do
        put :blocks, action: :update_blocks
        post :go_live
        post :finish
        get :live, to: "live#show"
        get "blocks/:block_id/results", action: :block_results
      end
      get :question_bank, on: :collection
      get :word_packs, on: :collection
    end

    # Attendees: no account, just the room code.
    get "join/:code", to: "join#show"
    post "join/:code", to: "join#create"
    get "join/:code/me", to: "join#me"
    patch "join/:code/me", to: "join#update"

    match "*path", to: ->(_) { [404, { "content-type" => "application/json" }, [{ error: "We couldn’t find that one. It may have drifted off." }.to_json]] }, via: :all
  end
end
