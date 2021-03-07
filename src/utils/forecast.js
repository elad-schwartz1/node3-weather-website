const request = require('request')

/**
 * Takes in latitude and longitude coords and returns the weather
 * forecast for that area.
 */
const forecast = (longitude, latitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=b314ea5610fbb532e4f4d57771f3f01f&query=' +
        longitude + ',' + latitude;
    request({url: url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to network')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined, {
                data: body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature +
                    ' degrees out. It feels like: ' + body.current.feelslike
            })
        }
    })
}

module.exports = forecast