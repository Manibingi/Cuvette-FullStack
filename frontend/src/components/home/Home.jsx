import React, { useEffect, useState } from "react";
import { deleteJob, getJobs } from "../../services";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const res = await getJobs({ limit, offset: offset * limit, name: search });
    if (res.status === 200) {
      const data = await res.json();
      setJobs(data.jobs);
      setCount(data.count);
    } else {
      console.log(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [limit, offset, search]);

  const handleDeleteJob = async (id) => {
    const res = await deleteJob(id);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      alert("Job deleted successfully");
      fetchJobs();
    } else if (res.status === 401) {
      alert("You are not authorized to delete");
    } else {
      console.log(res);
      alert("error");
    }
  };

  console.log(jobs);

  return (
    <div>
      Home
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="search"
          />
          <div>
            {jobs.map((job) => (
              <div key={job.id}>
                <h2>{job.companyName}</h2>
                <p>{job.salary}</p>
                <button onClick={() => navigate(`/editJob/${job._id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
              </div>
            ))}
          </div>
          <select value={limit} onChange={(e) => setLimit(e.target.value)}>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
          <button
            disabled={offset === 0}
            onClick={() => setOffset((offset) => offset - 1)}
          >
            Prev
          </button>
          <button
            disabled={offset * limit + limit >= count}
            onClick={() => setOffset((offset) => offset + 1)}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
