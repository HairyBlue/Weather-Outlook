
// import dotenv from "dotenv"
// dotenv.config()

export const CurrentWeather = async(lat, long)=> {
    return await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_OPEN_WEATHER}&units=metric`)).json()
    //return data.json()
}
export const WeatherForcast = async(lat, long)=>{
    return await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_OPEN_WEATHER}&units=metric`)).json()
    //return data.json()
}
export const Location = async(lat, long)=>{
    return await (await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${import.meta.env.VITE_MAP_BOX}`)).json()
    //return data.json()
}