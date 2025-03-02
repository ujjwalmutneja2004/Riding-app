//the effect of when clicking enter destin it goes to top 
//as flex end so niche se bharna start hota ha 
// The red div (h-[70%] bg-red-500) is inside a flex container (flex flex-col justify-end).
// When not hidden, absolute top-0 moves it to the top of the flex container, which is aligned at the bottom.
// When hidden (hidden class applied), it is removed from the layout, so the other div takes up the space.

import { useState,useRef } from "react"
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'


const Homee = () => {
  const [pickup,setPickup]=useState('')
  const [destination,setDestination]=useState('')
  const [panelOpen,setPanelOpen]=useState(false)
  const panelRef = useRef(null)

  const submitHandler=(e)=>{
    //so that if user press enetr form do not submit
    e.preventDefault()

  }



  useGSAP(function(){
  
      if(panelOpen){
        gsap.to(panelRef.current,{
         height:'70%' 
      })
    }
    else{
       gsap.to(panelRef.current,{
        height:'0%'
       })
    }
  },[panelOpen])



  
  return (
    <div className="h-screen relative ">
         <img className='w-16  absolute left-5 top-5 mb-10'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" />
        
        {/* temp map */}
         <div className='h-screen w-screen'>
            <img className='h-full w-full object-cover'  src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt=""/>
         </div>

  
         <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
            <div className="h-[30%] p-6 bg-white realtive">
              <h5 onClick ={()=>{
                setPanelOpen(false)
              }}
                className="absolute top-6 right-6 text-xl">
              <i className="ri-arrow-down-wide-fill"></i>
              </h5>
              <h4 className="text-2xl font-semibold">Find a trip</h4>
              <form onSubmit={(e)=>{
                submitHandler(e)
              }}>
                {/* <div className="line absolute h-5 w-1 top-[%] left-8 bg-gray-700 rounded-full"> </div> */}
                <input 
                onClick={()=>{
                  setPanelOpen(true)
                }}
                value={pickup}
                onChange={(e)=>{
                  setPickup(e.target.value)
                }}
                className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Add a pick up location"  ></input>
                <input 
                   onClick={()=>{
                    setPanelOpen(true)
                  }}
                  value={destination}
                  onChange={(e)=>{
                    setDestination(e.target.value)
                  }}
                className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3" type="text" placeholder="Enter your Destination"  ></input>

              </form>
           </div>

          <div ref={panelRef} className="h-[70%] bg-red-500 h-0">

          </div>

         </div>

    </div>
  )
}

export default Homee