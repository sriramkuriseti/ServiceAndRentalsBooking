// Icons Import
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import "../App.css"
// Image and Video Import

// Component Imports
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"

import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/Timeline"


import {ImagesObject} from "../data/categories-home"



function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
    

        {/* Heading */}
        <div className="mt-4 text-center text-4xl font-semibold">
           Begin your 
          <HighlightText text={"Enterprise "} />
            or Address your 
           <HighlightText text={"Requirements"} />
           .
        </div>

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our platform, you can effortlessly access and provide products, services, and rental items, all while enjoying a seamless experience that includes comprehensive listings, user reviews, and real-time support from our dedicated team.
        </div>
    {/* ////////////////////////////////////////////////////////////////////////// */}

    <div className = "flex lg:flex-row my-10 justify-between flex-col lg:gap-1 gap-2">
      {/* left side*/}
      <div className=" bg-opacity-1 lg:w-[40%] w-[100%] h-70 ml-5 flex flex-col gap-8  p-5 border rounded border-l-caribbeangreen-5 bg-image-box bg-[url('D:\WEB DEVELOPMENT PROJECTS\MINIPROJECT\miniProject\src\assets\Images\business-home.jpeg')]  bg-cover "> 

          {/* Heading */} 
          <div className="text-4xl text-caribbeangreen-900 font-semibold">
                 Have a 
                <HighlightText text={"Bussiness"} />  ?
          </div>

          {/* Sub Heading */}
          <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
               "Start Selling With Us in 1 min "
          </div>

        {/* Button Group */}
        <div className="flex gap-7 mt-7">
          <CTAButton active="true" linkto="/signup">
            <div className="flex items-center gap-2">
              Register Now 
            <FaArrowRight />
            </div>
          </CTAButton>
         
        </div>
       </div>

        {/* right side*/}
        
          
        <div className="lg:w-[50%] w-[100%] flex flex-row justify-center mr-5  gap-4  h-86">
      
           <div className="w-64 md:min-h-full border  border-l-caribbeangreen-5 bg-[url('D:\WEB DEVELOPMENT PROJECTS\MINIPROJECT\miniProject\src\assets\Images\service-home.avif')] bg-cover bg-center bg-image-box flex items-end justify-center text-caribbeangreen-900 text-xl font-bold shadow-lg rounded-lg">
              Services
           </div>

           <div className="w-64 min-h-full bg-[url('D:\WEB DEVELOPMENT PROJECTS\MINIPROJECT\miniProject\src\assets\Images\products-home.png')] bg-cover bg-center bg-image-box flex items-end justify-center text-caribbeangreen-900 text-xl font-bold shadow-lg rounded-lg">
              Products
           </div>

           <div className="w-64 min-h-full bg-[url('D:\WEB DEVELOPMENT PROJECTS\MINIPROJECT\miniProject\src\assets\Images\rent-home.jpg')]  bg-cover bg-center bg-image-box flex items-end justify-center text-caribbeangreen-900 text-xl font-bold shadow-lg rounded-lg">
              Rentals
           </div>
    
        </div>
        

        
    </div>

 {/* //////////////////////////////////////////////////////////////////////////////// */}

   <div className="flex flex-row lg:w-100% flex-wrap  justify-between mb-4 gap-1">

          {ImagesObject.map((image, index) => (
          <div key={index} className="lg:w-1/10 md:w-3/6 group flex flex-col justify-center items-center p-4 rounded-full bg-image-box cursor-pointer  ">
            <img
              src={image.src}
              alt={image.title}
              className="w-5/6 h-5/6 items-center justify-center object-cover group-hover:border-4 rounded"
            />
            <p className="text-center mt-2">{image.title}</p>
          </div>
        ))}
         </div>

 {/* ///////////////////////////////////////////////////////////////////////////////// */}
        
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

{/* ///////////////////////////////////////////////////////////////////////////////// */}

{/* 
        {/* CTA Buttons }
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1  }
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                 Have a 
                <HighlightText text={"Bussiness"} />  ?
              </div>
            }
            subheading={
              "Start Selling With Us in 1 min "
            }
            ctabtn1={{
              btnText: "Register Now ",
              link: "/signup",
              active: true,
            }}

            features ={HomepageSellers}
          />
        </div>

        {/* Code Section 2 }
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
             
            features ={HomepageSellers}
          />
        </div>
         */}
{/* ///////////////////////////////////////////////////////////////////////////////// */}

        {/* Explore Section */}
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          {/* Explore Full Catagory Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Find your Need
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
            Get the services you need to {" "}
              <HighlightText text={"get your work done."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern QuickService is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home