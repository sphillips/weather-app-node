const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/c3be8c2c6e4c6bd7b87039453f505dbf/' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if(error) {
            callback('Unable to connect to location services.', undefined)
        } else if (body.error){
            callback('Unable to find location. Please try another search.', undefined)
        } else {
            callback(undefined, 'Weather is currently: ' + body.currently.summary + '. ' + body.daily.summary)
        }
    })
}

module.exports = forecast