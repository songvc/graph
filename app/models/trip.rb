class Trip < ApplicationRecord
    require 'rest-client'

    @url

    def self.getData
        response = RestClient.get(@url, { :content_type => :json })
    end

    def self.retrieve_results
        @url = "https://arrivalist-puzzles.s3.amazonaws.com/national_travel.json"
        JSON.parse(Trip.getData)
    end

end