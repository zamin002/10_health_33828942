const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const KEY = process.env.API_KEY

router.get('/gyms', (req, res) => {
  res.render('gyms', {gyms: null, postcode: '', center: null, key: KEY})
});

router.post('/gyms', async (req, res) => {
  const postcode = req.body.postcode.trim()

  // Geocode postcode --> lat/long
  // Places API doesn't work properly with postcode searches, works much better with geographical coordinates instead
  const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&key=${KEY}`
  const geo = await fetch(geoUrl).then(r => r.json())

  if (!geo.results.length) {
    return res.render('gyms', { gyms: null, postcode, center: null, key: KEY })
  }

  const {lat,lng} = geo.results[0].geometry.location

  // Find gyms nearby
  const placesUrl = 'https://places.googleapis.com/v1/places:searchNearby'
  const places = await fetch(placesUrl,{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": "places.displayName,places.location"
    },
    body: JSON.stringify({
      includedTypes: ["gym"],
      locationRestriction: {
        circle: {center: { latitude: lat, longitude: lng }, radius: 3000}
      }
    })
  }).then(r => r.json())

  const gyms = (places.places || []).map(p => ({
    name: p.displayName.text,
    lat: p.location.latitude,
    lng: p.location.longitude
  }))

  res.render('gyms', {gyms, postcode, center: {lat, lng}, key: KEY})
})

module.exports = router