import { useState, useEffect, useCallback, useRef } from "react";
import { getJobs } from "../../services";
import { useNavigate } from "react-router-dom";
// import { deleteJob } from "../../services";
import Header from "../Header/Header";
import "./home.css";
import logo from "../../assets/india.png";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const fetchJobs = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      const res = await getJobs({
        limit,
        offset: offset * limit,
        name: search,
        signal,
      });

      if (res.status === 200) {
        const data = await res.json();
        setJobs(data.jobs);
        setCount(data.count);
      } else {
        console.error("Failed to fetch jobs", res);
      }
    } catch (error) {
      // Handle abort or other errors
      if (error.name === "AbortError") {
        console.log("Request was cancelled");
      } else {
        console.error("Error fetching jobs", error);
      }
    } finally {
      setLoading(false);
    }
  }, [limit, offset, search]);

  // Debounced fetch jobs
  const debouncedFetchJobs = useCallback(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchJobs();
    }, 2000); // 500ms debounce time
  }, [fetchJobs]);

  // Effect to trigger debounced fetch
  useEffect(() => {
    debouncedFetchJobs();

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [limit, offset, search, debouncedFetchJobs]);

  // const handleDeleteJob = async (id) => {
  //   try {
  //     const res = await deleteJob(id);
  //     if (res.status === 200) {
  //       const data = await res.json();
  //       console.log(data);
  //       alert("Job deleted successfully");
  //       fetchJobs();
  //     } else if (res.status === 401) {
  //       alert("You are not authorized to delete this job");
  //     } else {
  //       console.log(res);
  //       alert("Error deleting job");
  //     }
  //   } catch (error) {
  //     console.error("Delete job error", error);
  //     alert("Error deleting job");
  //   }
  // };

  return (
    <div>
      <Header />
      <div className="searchComponent">
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search"
          />
        </div>
        <div className="skillset">
          <div className="skills">
            <select value={limit}>
              <option value="#">skills</option>
              <option value="python">python</option>
              <option value="java">java</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
            </select>
          </div>
          <div className="clear">
            <button>Clear</button>
          </div>
          <div className="btn">
            <button onClick={() => navigate(`/newjob/`)}>+ Add Job</button>
          </div>
        </div>
      </div>

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="jobs">
          <div
          // style={{
          //   height: "400px",
          //   width: "400px",
          //   overflow: "scroll",
          //   border: "1px solid black",
          //   margin: "10px",
          //   padding: "10px",
          // }}
          >
            {jobs.map((job) => (
              <div key={job.id} className="Job-card">
                <div className="company">
                  <div className="image">
                    <img src={job.logoUrl} alt="logo" />
                  </div>

                  <div className="company-desc">
                    <div className="job-position">{job.jobPosition}</div>
                    <div className="specs">
                      <i className="fa-solid fa-user-group">11-50</i>
                      <div className="job-salary">{job.salary}</div>
                      <div className="flex">
                        <img src={logo} alt="india-logo" />
                        <div className="job-location">{job.location}</div>
                      </div>
                    </div>
                    <div className="job-specs">
                      <div className="remote">{job.remote}</div>
                      <div className="job-type">{job.jobType}</div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="skills">
                    {job.skillsRequired.map((item) => (
                      <div key={job._id} className="skill">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="edit">
                    <button
                      className="editBtn"
                      onClick={() => navigate(`/editJob/${job._id}`)}
                    >
                      Edit Details
                    </button>
                    {/* <button onClick={() => handleDeleteJob(job._id)}>
                    Delete
                  </button> */}
                    <button
                      className="viewDetails"
                      onClick={() => {
                        navigate(`/jobDesc/${job._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
            <button
              disabled={offset === 0}
              onClick={() => setOffset((prevOffset) => prevOffset - 1)}
            >
              Prev
            </button>
            <button
              disabled={offset * limit + limit >= count}
              onClick={() => setOffset((prevOffset) => prevOffset + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
