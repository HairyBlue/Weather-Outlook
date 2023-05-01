import { useState, useEffect } from "react";
import WeatherClass from "./WeatherClass";


const Dashboard = () =>{

    const [lat, setLat] = useState("");
    const [long, setLong] = useState("")
    const [place, setPlace] = useState("")

    const [arrayOfDates, setArrayOfDates] = useState([])
    const [selectedDates, setSelectedDates] = useState(0)

    const [timeForcast, setTimeForcast] = useState([])
    const [selectedTime, setSelectedTime] = useState(0)

    const [isLoading, setLoading] = useState(true)
    const [isMainContent, setIsMainContent] = useState(false)

    window.onbeforeunload = () => {
        localStorage.removeItem('settled_data');
    }
    
    useEffect(()=>{
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude
                    if(lat != lat || lat != undefined)setLat(lat)                
                    if(long != long || long != undefined)setLong(long) 
                },(error)=>{
                    console.log(error)
                    if(error.message == "User denied geolocation prompt"){
                        //navigate to error page      
                        alert("Please Allow Location")                
                    }
                })    
        }       
     }, [])

    useEffect(()=>{
        let mounted = true;
        if(lat != "" && long != ""){
           async function getMtdData(){
                //const data  = await getw("2023-04-19", "6.674172", "125.300943")
                const date = getDateToday()


                const weather =  new WeatherClass(date, lat, long)
           
                if(localStorage.getItem("settled_data") == null){
                    await weather.storeAll()
                    console.log("first fetch data")

                    const settledData = JSON.parse(localStorage.getItem("settled_data"))
                    setPlace(settledData[0])
                    setArrayOfDates(settledData[1])
                   
                }else{
                    const settledData = await getData(lat, long)
                    setPlace(settledData[0])
                    setArrayOfDates(settledData[1]) 
                }
            }
            if(mounted){
                getMtdData() 
                setLoading(false)
            }
        }
        return()=>{
            mounted = false
        }
    }, [lat, long])

    useEffect(()=>{
        if(timeForcast[selectedTime] !== undefined){
            setIsMainContent(true)
        }else{
            setIsMainContent(false)
        }
    }, [timeForcast, selectedTime])

    useEffect(()=>{
        let mounted = true;
        if(arrayOfDates.length > 0){
            async function getTimeForcast(){
                const timeWeatheForast = new WeatherClass(arrayOfDates[selectedDates], lat, long)
                const time_forcast = await timeWeatheForast.TimeWeatherForcast()
                setTimeForcast(time_forcast.forcast)             
            }
            if(mounted){
                getTimeForcast()     
               
            }
        }
        return()=>{
            mounted = false
        }
    }, [arrayOfDates, selectedDates])

    
    return (
        <>
        { isLoading ? 

            <div className="spinner-wrapper ">
                <div className="lds-ring">
                    <div></div><div></div><div></div><div></div>
                </div> 
            </div> :
         
                <div> 
                    <div className="container header mg-top-4 d-block">
                       
                            <h1 className="text-highlight-green fs-900 fw-900"><span>W</span>eather <span>O</span>utlook</h1>
                            <h2 className="fs-500">{place}</h2>
                    </div>
                    <div className="container mini-card-wraper flex-evenly mg-top-16">
                            {arrayOfDates.map((item, index)=>{
                                return(
                                     <div 
                                         className={`box ${index == selectedDates ? "box-active" : "box-inactive"}`} 
                                         key={index}
                                         onClick={()=>{
                                             setSelectedDates(index)
                                             setSelectedTime(0)
                                         }}>
                                     <p className="max-content">{dateConverter(item)}</p>
                                      </div>   
                                  )
                             })}
                    </div>
                                <div className="flex-center container fs-900 fw-900 mg-top-16 " >
                                {isMainContent && 
                                        <div className="flex-2">
                                                <img className="main-img" src={`icons/${timeForcast[selectedTime].weather.icon}.png`} alt="" /> 
                                                <div >

                                                    <p >
                                                        {timeForcast[selectedTime].weather.description}
                                                    </p>   
                                                    <h3 >
                                                        {Math.round(timeForcast[selectedTime].temp)} ℃
                                                    </h3>     

                                                </div>     
                                            </div>
                                }
                                </div>
                                <div className="container mini-card-wraper flex-evenly text-center mg-top-16">
                                        {timeForcast.map((item, index)=>{
                                            return(
                                                <div
                                                    key={index}
                                                    onClick={()=>{
                                                        setSelectedTime(index)
                                                    }}
                                                    className={`box  ${index == selectedTime? "box-active" : "box-inactive"}`}
                                                >
                                                    <p>{timeConverter(item.time)}</p>
                                                    <img src={`icons/${item.weather.icon}.png`} alt="weather-icon" />
                                                    <p className=" max-content fs-700">{Math.round(item.temp)} ℃</p>
                                                </div>
                                            )
                                        })}
                                </div>
                </div>
         }
         </>
     )

    }
 
async function getData(lat, long){
    const dateToday = getDateToday()
    const newData = new WeatherClass(dateToday, lat, long)

    let settledData = JSON.parse(localStorage.getItem("settled_data"))
    if(settledData[1][0] != dateToday){
        await newData.storeAll()
        console.log("new fetch data")
        settledData = JSON.parse(localStorage.getItem("settled_data"))
    }
    console.log("not fetch data")
    return settledData;
}


function getDateToday(){
    let date = new Date()
    let year = date.getFullYear().toString()
    let month = (date.getMonth()+1).toString()
    let day = date.getDate().toString()

    if(month.length < 2){
        month = "0" + month
    }

    if(day.length < 2){
        day = "0" + day
    }
    const todayDate = [year, month, day].join("-")

    return todayDate
}
function dateConverter(date){
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const now =  new Date(date)
    return (days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate())
}
function timeConverter(time){
    const [hourString, min] = time.split(":")
    const hour = +hourString % 24;
    const newTime = (hour % 12 || 12) + ":" + min + (hour < 12 ? " AM": " PM")
    return newTime
}

export default Dashboard;