import React, { useState, useEffect } from "react";
import { CalendarDays, Hourglass, MapPin, User, Clock, Wallet, Heart, Share2, CheckCircle, Link } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Image from "./../assets/ProfileImages/icon.png"; // Ensure this path is correct
import { motion } from "framer-motion";
import axios from "axios";
// import Blur from "./assets/ProfileImages/blur (3).png"

const JobCard = ({ title, company, location, type, description, daysAgo, image, job }) => {

    return (
        <motion.div
            className="rounded-lg shadow-md p-4 bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600 bg-gray-200 px-2 py-1 rounded">
                    {type}
                </span>
                <span className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })}</span>
            </div>
            <div className="flex items-center mb-3">
                <img
                    src={Image} // Make sure the image path is correct
                    alt="Company Logo"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                    <p className="text-sm text-gray-500">
                        {job.industry}, {job.location}
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{job.jobDescription}</p>
            <div className="flex justify-between">
                <motion.button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Apply Now
                </motion.button>
                <motion.button
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View Details
                </motion.button>
            </div>
        </motion.div>
    );
};


function JobDetails() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const { jobId } = useParams();
    console.log('jobId', jobId)
    const [job, setjob] = useState();
    console.log('job.jobtitle', job)

    const [allJobs, setAllJobs] = useState();
    const [resume, setResume] = useState(null);
    const [videoIntroduction, setVideoIntroduction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log('user_email', user.id)
    const [userInfo, setUserinfo] = useState(null);
    console.log('userInfo.......................', userInfo)
    const hasApplied = job?.studentApplied.includes(user.id);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/job/jobpost/${jobId}`);
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/job/jobpost/`);
                setAllJobs(res.data);
                const data = response.data;
                console.log("Job data fetched:", data);
                setjob(data);
                console.log("Job fetched successfully:", data.jobTitle);
                console.log("Job data:", data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };

        if (jobId) {
            fetchJob();
        }
    }, [jobId, user.id]); // Fetch job details when jobId or user.id changes

    console.log('hry', job?.jobTitle)
    console.log('allJobs', allJobs)

    //     {job && (
    //   <div>
    //     <h2>{job.jobTitle}</h2>
    //     <p>ID: {job._id}</p>
    //     {/* other job details */}
    //   </div>
    // )}

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/profile/${user.id}`
                );
                console.log("User Info!!!!!!!!!!:", response.data);
                setUserinfo(response.data);
                // Optionally, store it in state:
                // setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [jobId, user.id]); // Fetch user info when jobId or user.id changes


    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: user.email,
        phone: "",
        jobTitle: job?.jobTitle,
        linkedInUrl: "",
        portfolioUrl: "",
        additionalInfo: "",
        videoIntroduction: "",
        charCount: 0
    });

    useEffect(() => {
        if (job?.jobTitle) {
            setFormData((prev) => ({
                ...prev,
                jobTitle: job.jobTitle
            }));

        }
        if (userInfo) {
            setFormData((prev) => ({
                ...prev,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email,
                phone: userInfo.phone,
                linkedInUrl: userInfo.linkedProfile,
                portfolioUrl: userInfo.portfolio,
                resume: userInfo.resume,
            }));
        }
    }, [userInfo]);



    const [fileName, setFileName] = useState({
        resume: "",
        videoIntro: "" // or videoIntroduction if you renamed it
    });






    const handleFileChange = (e) => {
        const file = e.target.files[0]; // ✅ get the first file
        const name = e.target.name;     // ✅ name from input: "resume" or "videoIntroduction"

        if (file) {
            setFileName((prev) => ({
                ...prev,
                [name]: file.name,          // store filename
            }));

            // Also store the actual file object to send to backend
            if (name === "resume") setResume(file);
            if (name === "videoIntro") setVideoIntroduction(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'additionalInfo' && { charCount: value.length })
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const submissionData = new FormData();

        // 🔁 Loop through your text fields and append to FormData
        Object.keys(formData).forEach(key => {
            submissionData.append(key, formData[key]);
        });

        // 📁 Append files if present
        if (resume) {
            submissionData.append("resume", resume); // `resume` must be a File object
        }


        console.log("Submission Data:");
        for (let [key, value] of submissionData.entries()) {
            console.log(`${key}:`, value);
        }

        // ✅ Add userId and jobId
        const user = JSON.parse(localStorage.getItem("user"));
        submissionData.append("user", user?.id); // or user._id depending on your schema
        submissionData.append("job", job._id);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit-application`, submissionData);
            console.log("Submitted:", response.data);
            setShowSuccessModal(true); // ✅ Show the modal
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsLoading(false); // 🔁 Hide spinner

        }
    };

    return (
        <>
            {
                job ? (
                    <div className="flex min-h-screen font-sans text-[#333] bg-[#fafbfc] overflow-hidden">
                        {/* Sidebar - Mobile: Hidden by default, Desktop: Always visible */}
                        {/* <div className={`fixed inset-y-0 left-0 w-64 max-w-xs transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform lg:translate-x-0 lg:relative bg-white z-50 shadow-md`}>
                 <Sidebar />             </div> */}

                        {/* Main Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 lg:p-6 lg:ml-12">
                                {/* Job Header - Stack on mobile, row on desktop */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-lg w-[90%]">
                                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                                        <img src={job.companyLogo} className="w-20 h-20 bg-zinc-200 rounded-lg" alt="" />
                                        <div>
                                            <h2 className="text-base md:text-xl font-semibold">{job.jobTitle}</h2>
                                            <p className="text-gray-500 text-sm mt-1 md:mt-2">
                                                {job.location} <br />
                                                {job.employmentType.map((type, index) => (
                                                    <span key={index} className="text-blue-600 ml-1 ">
                                                        <div className=' inline px-3  rounded-sm items-center my-auto bg-blue-200 text-blue-400'>{type}</div>
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-normal">
                                        <Share2 size={20} className="text-gray-500 cursor-pointer" />
                                        <Heart size={20} className="text-gray-500 cursor-pointer" />
                                        <button
                                            onClick={() => {
                                                if (job.externalApplyUrl) {
                                                    window.open(job.externalApplyUrl, '_blank');
                                                } else {
                                                    setIsModalOpen(true);
                                                }
                                            }}

                                            disabled={hasApplied}
                                            className={`${hasApplied ? 'bg-gray-600 cursor-not-allowed' : '   bg-blue-500 hover:bg-blue-600'
                                                } md:w-[160px] sm:w-auto text-white text-base px-4 py-3 rounded-md`}
                                        >
                                            {hasApplied ? 'Applied' : 'Apply Now'}
                                        </button>
                                    </div>
                                </div>

                                {/* Job Content - Stack on mobile, row on desktop */}
                                <div className="flex flex-col lg:flex-row mt-6 gap-6">
                                    {/* Job Description - Full width on mobile, 2/3 on desktop */}
                                    <div className="p-4 md:p-6 bg-white rounded-lg w-full lg:w-2/3">
                                        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {job.jobDescription}
                                        </p>

                                        <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
                                        <ul className="space-y-2 mb-4">
                                            {job.responsibilities}
                                        </ul>

                                        <h3 className="text-lg font-semibold mb-2">Skill & Experience</h3>
                                        <ul className="space-y-2">
                                            {job.skillsAndExperience}
                                        </ul>
                                    </div>

                                    {/* Job Overview - Full width on mobile, 1/3 on desktop */}
                                    <div className="p-4 md:p-6 bg-white rounded-lg w-full lg:w-1/3">
                                        <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
                                        <ul className="space-y-4">
                                            {[
                                                {
                                                    icon: <CalendarDays className="text-purple-500" size={20} />, label: "Date Posted", value: new Date(job.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric"
                                                    })
                                                },
                                                { icon: <Hourglass className="text-purple-500" size={20} />, label: "Expiration Date", value: "April 06, 2021" },
                                                { icon: <MapPin className="text-purple-500" size={20} />, label: "Location", value: job.location },
                                                { icon: <User className="text-purple-500" size={20} />, label: "Job Title", value: job.jobTitle },
                                                { icon: <Clock className="text-purple-500" size={20} />, label: "Hours", value: "32hr / week" },
                                                { icon: <Wallet className="text-purple-500" size={20} />, label: "Salary", value: job.sallery }
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center space-x-3">
                                                    {item.icon}
                                                    <div>
                                                        <p className="text-gray-700 font-medium">{item.label}</p>
                                                        <p className="text-gray-500 text-sm">{item.value}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-6">
                                            <h2 className="text-xl font-semibold mb-3">Categories</h2>
                                            {
                                                job.categories.map((category, i) => (
                                                    <span key={i} className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                                                        {category}
                                                    </span>
                                                ))
                                            }


                                            <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    job.requiredSkills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm mr-2 mb-2">
                                                            {skill}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                {/* Open Jobs Section */}
                                {/* <div className="bg-white-100 w-full text-start mt-8">
                        <h2 className="text-2xl md:text-3xl mb-6">Open Jobs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allJobs.map((job, index) => (
                                <JobCard key={index} job={job} />
                            ))}
                        </div>
                    </div> */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 flex-col overflow-scroll z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                        <div className="relative max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-md overflow-y-auto ">
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                            >
                                                ✖
                                            </button>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-zinc-200 text-white font-bold text-lg p-2 rounded w-[68px] h-[68px] my-auto flex items-center justify-center">
                                                    <img src={job.companyLogo} alt="" />
                                                </div>
                                                <div className="">
                                                    <h2 className="text-2xl font-semibold object-cover">{job.companyName}</h2>
                                                    <p className="text-gray-500 text-sm mt-2">{job.location}&middot; </p>
                                                </div>
                                            </div>
                                            <hr className="mt-5" />
                                            <h2 className="text-2xl font-bold text-gray-700 mt-3">
                                                Submit your application
                                            </h2>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                {/* Personal Information Section */}
                                                <div className="space-y-6">
                                                    {/* Full Name */}
                                                    <div className="flex  gap-2 w-full justify-between">
                                                        <div className="w-6/12">
                                                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                                                                First Name*
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="firstname"
                                                                name="firstname"
                                                                value={formData.firstname}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Enter your full name"
                                                            />
                                                        </div>
                                                        <div className="w-6/12">
                                                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Last Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="lastname"
                                                                name="lastname"
                                                                value={formData.lastname}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Enter your last name"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email Address*
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={user.email}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Enter your email"
                                                        />
                                                    </div>

                                                    {/* Phone */}
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Phone Number*
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Enter your phone number"
                                                        />
                                                    </div>

                                                    {/* Job Title */}
                                                    <div>
                                                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Job Title*
                                                        </label>
                                                        {job && (
                                                            <input
                                                                type="text"
                                                                id="jobTitle"
                                                                name="jobTitle"
                                                                value={job?.jobTitle}

                                                                required
                                                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="Enter your job title"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Links Section */}
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-medium text-gray-700">Links</h3>

                                                    {/* LinkedIn */}
                                                    <div>
                                                        <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                                            LinkedIn URL*
                                                        </label>
                                                        <input
                                                            type="url"
                                                            id="linkedInUrl"
                                                            name="linkedInUrl"
                                                            value={formData.linkedInUrl}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://linkedin.com/in/yourprofile"
                                                        />
                                                    </div>

                                                    {/* Portfolio */}
                                                    <div>
                                                        <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Portfolio URL*
                                                        </label>
                                                        <input
                                                            type="url"
                                                            id="portfolioUrl"
                                                            name="portfolioUrl"
                                                            value={formData.portfolioUrl}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://yourportfolio.com"
                                                        />
                                                    </div>
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
                                                </div>



                                                {/* Divider */}
                                                <div className="border-t border-gray-200 my-6"></div>

                                                {/* File Uploads Section */}
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
                                                    {!showUploader && userInfo?.resume && (
                                                        <div className="flex items-center justify-between">
                                                            <a
                                                                href={`${import.meta.env.VITE_BACKEND_URL}${userInfo.resume}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-500 hover:underline"
                                                            >
                                                                {userInfo.resume.split("/").pop()}
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
                                                    {!userInfo?.resume && !resume && !showUploader && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowUploader(true)}
                                                            className="text-sm text-indigo-600 hover:underline"
                                                        >
                                                            Upload Resume
                                                        </button>
                                                    )}
                                                </div>


                                                {/* Divider */}
                                                <div className="border-t border-gray-200 my-6"></div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 w-full text-white px-4 py-2 rounded-md"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                            Submitting...
                                                        </span>
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </button>

                                                {/* Terms and Conditions */}
                                                <div className="flex gap-2 item-center justify-center">
                                                    <input type="checkbox" name="" id="" />
                                                    <p className="text-xs text-gray-500 text-center ">
                                                        By sending the request you can confirm that you accept our Terms of Service and Privacy Policy.
                                                    </p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span className="loader spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></span>
                        <span>Loading...</span>
                    </div>
                )
            }

            {/* Applicsation successfuly submitted popup */}
            {showSuccessModal && (
                <div className="absolute inset-0 flex-col overflow-scroll z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                    <div className="bg-white rounded-lg shadow-md p-6 w-80 text-center">
                        <h2 className="text-lg font-semibold mb-4">🎉 Application Submitted!</h2>
                        <p className="text-sm text-gray-600 mb-4">Thank you for applying. We'll get back to you soon.</p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate("/candidate_dashboard/Cand_job"); // or any route
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </>

    );
}

export default JobDetails;