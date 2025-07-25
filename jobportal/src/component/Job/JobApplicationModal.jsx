import React, { useState , useContext, useEffect, use} from "react";
import { X } from "lucide-react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
const JobApplicationModal = ({ isOpen, onClose, jobDetails }) => {
  const { user } = useContext(AuthContext);
  const [userinfo, setUserInfo] = useState("");
  console.log('user info !!!!!!!!!!!!!!!', userinfo);
  const [info, setInfo] = useState('');
  console.log('info',info);
  console.log('jb',jobDetails._id)
   const userid = JSON.parse(localStorage.getItem("user"));
    console.log("userId", userid?.id);
  
   const [showUploader, setShowUploader] = useState(false);

  
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: info,
    phone: "",
    jobTitle: jobDetails.jobTitle,
    linkedinUrl: "",
    portfolioUrl: "",
    additionalInfo: "",
    videoIntroduction:'',
  });



  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const user_id = storedUser ? storedUser.id : null;
    const fetchUserInfo = async () => {
      const user = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${user_id}`);
      console.log('user!!!!!!!!!!!...........', user.data);
      setUserInfo(user.data);

    }
    fetchUserInfo();
  
   
  },[])

  useEffect(() => {
    if (userinfo) {
      setInfo(userinfo.email || ''); // If userinfo is null, set empty string
      setFormData(prevFormData => ({
        ...prevFormData,
        firstname: userinfo?.firstname ,
        lastname: userinfo?.lastname ,
        email: userinfo?.email ,
        jobTitle: jobDetails?.jobTitle || '',
        phone: userinfo?.phone ,
        linkedinUrl: userinfo?.linkedProfile ,
        portfolioUrl: userinfo?.portfolio ,

      }));
    }
  },[ userinfo]);
  

  useEffect(() => {
    setInfo(user?.email || ''); // If user is null, set empty string
  }, [user]); 

  const [wordCount, setWordCount] = useState(0);
  const maxWords = 500;
  
  // Add state for file uploads
  const [resume, setResume] = useState(null);
  const [videoIntroduction, setVideoIntroduction] = useState(null);
  
  // Add loading and success states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "additionalInfo") {
      const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
      setWordCount(words);
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  
  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "resume") {
      setResume(files[0]);
    } else if (name === "videoIntroduction") {
      setVideoIntroduction(files[0]);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage("");

  try {
    const submitData = new FormData();

    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add files
    if (resume) {
      submitData.append("resume", resume);
    }
    

    // ✅ Add userId and jobId
    const user = JSON.parse(localStorage.getItem("user"));
    submitData.append("user", user?.id); // or user._id depending on your schema
    submitData.append("job", jobDetails._id);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submit-application`, {
      method: "POST",
      body: submitData
    });

    const data = await response.json();
    console.log("Server Response:", data);

    if (response.ok) {
      alert("Application submitted successfully!");
      onClose();
    } else {
      setErrorMessage(data.message || "Failed to submit application");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    setErrorMessage("Network error. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent backdrop */}
      <div className="fixed inset-0 backdrop-blur-sm  mt-2/12 bg-opacity-30" onClick={onClose}></div>
      
      {/* The modal itself - centered with fixed width */}
      <div className="relative bg-white rounded-lg w-full max-w-xl mx-4 overflow-y-auto max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className={`h-9 w-9 rounded-md flex items-center justify-center ${jobDetails?.color || ""} text-white text-base font-bold`}>
              <img src={jobDetails.companyLogo} alt="" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{jobDetails?.jobTitle || "Brand Designer"}</h3>
              <p className="text-xs text-gray-500">{jobDetails?.companyName || "Zend"} • {jobDetails?.location || "Paris, France"} • {jobDetails?.type || "Full-time"}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="ml-auto text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal body */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Submit your application</h2>
          <p className="text-sm text-gray-500 mb-4">Fill the details in the form below to share your background with the job poster.</p>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
           <div className="flex justify-between">
             {/* First Name */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                placeholder="first name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                required
                placeholder="last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>

           </div>
               
              
          
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                
                value={ info}
                onChange={handleChange}
              />
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle" 
                required
                placeholder="Enter your current or most recent job title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={jobDetails.jobTitle}
                onChange={handleChange}
              />
            </div>
            
            {/* Links Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Links</h3>
              
              {/* LinkedIn */}
              <div className="mb-3">
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                />
              </div>
              
              {/* Portfolio */}
              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  id="portfolioUrl"
                  name="portfolioUrl"
                  placeholder="https://portfolio.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Additional Information */}
            {/* <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
             
                <div className="flex items-center space-x-1 px-2 py-1 border-b border-gray-300 bg-gray-50">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">S</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                  </button>
                </div>
                
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows="3"
                  placeholder="Add additional information that is relevant to the position"
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                ></textarea>
                
                <div className="px-3 py-1 text-xs text-gray-500 text-right">
                  {wordCount}/{maxWords}
                </div>
              </div>
            </div> */}
            
            {/* Video Introduction */}
            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-2">Attach your Video Introduction</label>
              <input
                type="text"
                id="videoFile"
                name="videoIntroduction"
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.videoIntroduction}
                onChange={handleChange}
              />
              
            </div>
            
            {/* Resume Upload */}
 
    <div className="mb-4">
      <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-2">
        Attach your resume*
      </label>

      {/* File Input */}
      {showUploader && (
        <>
          <input
            type="file"
            id="resumeFile"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <label
            htmlFor="resumeFile"
            className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-blue-600 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {resume
              ? resume.name
              : "Choose Resume"}
          </label>
        </>
      )}

      {/* Existing Resume Info */}
      {!showUploader && userinfo?.resume && (
        <div className="flex items-center justify-between">
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}${userinfo.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            {userinfo.resume.split("/").pop()}
          </a>
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="ml-4 text-sm text-indigo-600 hover:underline"
          >
            Change Resume
          </button>
        </div>
      )}

      {/* If no resume at all */}
      {!userinfo?.resume && !resume && !showUploader && (
        <button
          type="button"
          onClick={() => setShowUploader(true)}
          className="text-sm text-indigo-600 hover:underline"
        >
          Upload Resume
        </button>
      )}
    </div>
  



            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mt-2 disabled:bg-indigo-400"
              disabled={isLoading}
             
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>
            
            {/* Terms and Privacy Notice */}
            <div className="text-xs text-gray-500 mt-2">
              By sending this request you can confirm that you accept our <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;