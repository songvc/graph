class TripsController < ApiController
    def index
        @results = Trip.retrieve_results
        render json: @results.to_json
    end
end