import React, { useEffect, useState } from "react";
import { createJob, getJobById, updateJob } from "../../services";
import { useParams } from "react-router-dom";

function NewJob() {
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      setIsEdit(true);
    }
  }, [id]);
  const [jobFormData, setJobFormData] = useState({
    companyName: "",
    logoUrl: "",
    jobPosition: "",
    salary: "",
    jobType: "",
    remote: "",
    location: "",
    jobDescription: "",
    aboutCompany: "",
    skillsRequired: "",
    information: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchJob = async () => {
        const res = await getJobById(id);
        if (res.status === 200) {
          const data = await res.json();
          setJobFormData(data);
        } else {
          console.log(res);
        }
      };
      fetchJob();
    }
  }, [isEdit, id]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const res = isEdit
      ? await updateJob(id, jobFormData)
      : await createJob(jobFormData);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      setJobFormData({
        companyName: "",
        logoUrl: "",
        jobPosition: "",
        salary: "",
        jobType: "",
        remote: "",
        location: "",
        jobDescription: "",
        aboutCompany: "",
        skillsRequired: "",
        information: "",
      });
      alert(`Job ${isEdit ? "updated" : "created"} successfully`);
    } else if (res.status === 401) {
      alert("Login to create job");
    } else {
      console.log(res);
      alert("error");
    }
  };

  return (
    <div>
      NewJob
      <form onSubmit={handleCreateJob}>
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.companyName}
          name="companyName"
          placeholder="enter Company name"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.logoUrl}
          name="logoUrl"
          placeholder="enter Logo URL"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.jobPosition}
          name="jobPosition"
          placeholder="enter Position"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.salary}
          name="salary"
          placeholder="enter Salary"
        />
        <br />
        <select
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.jobType}
          name="jobType"
        >
          <option value="">select</option>
          <option value="full-time">full-time</option>
          <option value="part-time">part-time</option>
          <option value="contract">contract</option>
          <option value="internship">internship</option>
          <option value="freelance">freelance</option>
        </select>{" "}
        <br />
        <select
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.remote}
          name="remote"
        >
          <option value="">select</option>
          <option value="office">office</option>
          <option value="home">home</option>
          <option value="hybrid">hybrid</option>
        </select>{" "}
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.location}
          name="location"
          placeholder="enter Location"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.jobDescription}
          name="jobDescription"
          placeholder="enter Job Description"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.aboutCompany}
          name="aboutCompany"
          placeholder="enter About Company"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.skillsRequired}
          name="skillsRequired"
          placeholder="enter Skills"
        />
        <br />
        <input
          type="text"
          onChange={(e) =>
            setJobFormData({
              ...jobFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={jobFormData.information}
          name="information"
          placeholder="enter Information"
        />
        <br />
        <button type="submit">{isEdit ? "update" : "create"}</button>
      </form>
    </div>
  );
}

export default NewJob;
