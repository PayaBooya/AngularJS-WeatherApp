/**
 * Created with JetBrains WebStorm.
 * User: weiwang
 * Date: 6/22/14
 * Time: 9:57 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    var weatherApp = angular.module('weatherApp', []);

    var cities = [
        {
            name:"San Francisco",
            country:'US'
        },
        {
            name:"London",
            country:'UK'
        }
    ];

    var weatherResults = [];

    weatherApp.factory('weatherDataFactory', function () {
        var toWeatherCardViewModel = function (respData) {
            var result = {
                name:respData.name,
                show:true
            };
            var weatherDetails = [];
            // temp
            weatherDetails.push({
                name:'Temperature',
                details:[
                    {
                        name:'Current Temperature',
                        value:respData.main.temp
                    },
                    {
                        name:'Highest',
                        value:respData.main['temp_max']
                    },
                    {
                        name:'Lowest',
                        value:respData.main['temp_min']
                    }
                ]
            });
            // wind
            weatherDetails.push({
                name:'Wind',
                details:[
                    {
                        name:'Speed',
                        value:respData.wind.speed
                    },
                    {
                        name:'Degree',
                        value:respData.wind.deg
                    }
                ]
            });
            // Humidity
            weatherDetails.push({
                name:'Humidity',
                details:[
                    {
                        name:'Humidity',
                        value:respData.main.humidity
                    }
                ]
            });
            // sunrise and sunset
            weatherDetails.push({
                name:'Sunrise & Sunset',
                details:[
                    {
                        name:'Sunrise',
                        value:respData.sys.sunrise
                    },
                    {
                        name:'Sunset',
                        value:respData.sys.sunset
                    }
                ]
            });

            result.weatherDetails = weatherDetails;
            return result;
        };
        return {

            toWeatherCardViewModel: toWeatherCardViewModel
        };

    });

    weatherApp.service('weatherDataApi', ['$http', "weatherDataFactory", function ($http, weatherDataFactory) {

        var baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

        var weatherForCity = function (city, country, callback) {
            $http.get(baseUrl, {
                params:{
                    q:city + ',' + country
                }
            }).success(function (data, status, headers, config) {
                    console.log(JSON.stringify(data, null, 4));
                    callback(weatherDataFactory.toWeatherCardViewModel(data));
                }
            ).error(function (data, status, headers, config) {
                    callback(null);
                }
            );
        };

        return {
            weatherForCity: weatherForCity
        };
    }]);

    weatherApp.directive('weatherCards', function () {
        return {
            restrict:'E',
            templateUrl:'/templates/weather-card.html',
            controller:function () {
                this.results = weatherResults
            },
            controllerAs:'weather'
        };
    });

    weatherApp.controller("AddCityController", ['$scope', 'weatherDataApi', function ($scope, weatherDataApi) {
        $scope.init = function () {
            // ajax stuff
            _.each(cities, function (city) {
                weatherDataApi.weatherForCity(city.name, city.country, function (data) {
                    if (!data) {
                        console.log('failed to get weather data for city: ' + JSON.stringify(city, null, 4));
                    }
                    else {
                        weatherResults.push(data);
                    }
                });
            });
        };

        this.listCities = cities;
        this.newCity = {};
        this.addCity = function (listCities) {
            this.newCity.createdDate = Date.now();
            this.newCity.country = 'US';
            listCities.push(this.newCity);
            weatherDataApi.weatherForCity(this.newCity.name.trim(), this.newCity.country, function (data) {
                if (!data) {
                    console.log('failed to get weather data for city: ' + JSON.stringify(city, null, 4));
                }
                else {
                    weatherResults.push(data);
                }
            });
            this.newCity = {};
        };

        $scope.init();
    }]);

})();
