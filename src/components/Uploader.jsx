import React, { useState } from "react";
import { useForm } from "react-hook-form"; // For handling forms.
import axios from "axios"; // For handling form submissions.
import "bootstrap/dist/css/bootstrap.css"; // For styling

const Uploader = () => {
  const [progress, setProgress] = useState(0); // Defines the progess percentage
  const {
    register, // Registers a form field to a form
    handleSubmit, // passes a handleSubmit function which is called when form is submitted
  } = useForm();
  const onSubmit = async (data) => {
    // Async function that gets called while form is submitted. Passed as handleSubmit
    const formdata = new FormData(); // Creates new form data
    for (let i = 0; i < data.file.length; i++) {
      // loops through all selected files.
      const file = data.file[i]; // gets an iterated file
      formdata.append("file", file); //adds a file to form data
    }
    try {
      const res = await axios({
        baseURL: "http://localhost:8000",
        url: "/api/upload",
        method: "post",
        data: formdata,
        onUploadProgress: (progress) => {
          // function for detecting progress of uploading
          const { loaded, total } = progress; // gets uploaded file size and total file size
          const percentage = Math.floor((loaded / total) * 100); // converts file size to percentage
          setProgress(percentage); // sets the percentage as progress
        },
      });
      setProgress(0); // while uploading is done resets the progess to 0
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mt-5">
      <form
        onSubmit={
          handleSubmit(
            onSubmit
          ) /* tells that onsubmit should get called while form is submitted */
        }
      >
        <h3>
          Upload Progress: {progress}% {/* Shows upload progress text */}
        </h3>
        <div className="input-group mb-3">
          <input
            name="file"
            type="file"
            multiple
            {
              ...register("file") /* Registers the filed to react-hook-form */
            }
            className="form-control"
            onChange={
              () => setProgress(0) /* On change the progress is reset to 0 */
            }
            id="inputGroupFile02"
          />
          <label className="input-group-text" htmlFor="inputGroupFile02">
            Upload
          </label>
          <div className="progress w-100 mt-3">
            <div
              className="progress-bar"
              style={
                {
                  width: `${progress}%`,
                } /* decides the width of progress bar at a given time from progress percentage*/
              }
            />
          </div>
        </div>
        <div className="input-group mb-3">
          <button className="btn btn-success">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default Uploader;
