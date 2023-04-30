import {CurrentWeather, WeatherForcast, Location} from "../api"

class WeatherClass{
    weatherForcast;
    constructor(date, lat, long){
        this.date = date;
        this.lat = lat;
        this.long = long;    
    }

    async storeAll(){
        // const datass = [this.setlocation(), this.setDateForcast(), this.setCurrentWeather()]
        // const place_name = await this.getlocation();
        // const forcastDate = await this.getDateForcast();
        // const curWeather = await this.getCurrentWeather();
        // const newData = []
        //     for await (const data of datass){
        //         newData.push(data)
        //     }
        //    return newData
        //return {place_name, forcastDate, curWeather}
        const settledData =  await Promise.all([this.Location(), this.DateForcast()])
        localStorage.setItem("settled_data",JSON.stringify(settledData))
    }
    // async fetchAll(){
    //    const settledData = await Promise.all([this.Location(), this.DateForcast()])
    //    return settledData
    // }
    
    async DateForcast(){  
        const data = await WeatherForcast(this.lat, this.long)
        const list = data.list
     

        const dates = list.reduce((acc, curr)=>{
           const toSplit = curr.dt_txt.split(" ")
           const dates = toSplit[0]
           if(acc[dates]==null)acc[dates]=[]
           if(acc[dates] == acc[dates])acc[dates].push(curr)
           return acc
        }, {})
        return Object.keys(dates)
    }

    async Location(){
        const location = await Location(this.lat, this.long)
        const placeName = location.features[0]?.place_name.split(", ");
        return placeName[1];        
    }

     async TimeWeatherForcast(){
            const data = await WeatherForcast(this.lat, this.long)
            const list = data.list 

            const forcastObject = {}
            const key = "forcast"
            forcastObject[key] = []
           
            
            for(let j = 0; j < list.length; j++){
                const splitDT = list[j].dt_txt.split(" ")
                const dt = splitDT[0] 
                const tm = splitDT[1]
                
                if(dt == this.date){
                    let details = {
                        time: tm,
                        date:  dt,
                        temp: list[j].main.temp,
                        feel:  list[j].main.feels_like,
                        humidity:  list[j].main.humidity,
                        weather: {
                            main:  list[j].weather[0].main,
                            description: list[j].weather[0].description,
                            icon:  list[j].weather[0].icon
                        }
                    }
                    forcastObject[key].push(details)
                   }
            }      
            return forcastObject
    }
}

export default WeatherClass;



    //  async CurrentWeather(){
    //     const current = await CurrentWeather(this.lat, this.long)
    //     const currentWeather = {
    //         temp: current.main.temp,
    //         feel: current.main.feels_like,
    //         main:  current.weather[0].main,
    //         description: current.weather[0].description
    //     }
    //     return currentWeather;
    // }