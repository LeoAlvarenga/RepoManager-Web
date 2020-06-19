import React, { useState, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import api from "./services/api";

import Header from "./components/header/Header";

import "./App.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [formData, setFormData] = useState({
    title: '',
    owner: ''
  })

  useEffect(() => {
    api.get("projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  async function handleAddProject( title, owner) {
    const response = await api.post("projects", {
      title,
      owner
    });

    const project = response.data;

    setProjects([...projects, project]);
  }

  async function handleDeleteProject(id) {
    console.log("entrou aqui");
    console.log("id", id);

    const response = await api.delete(`projects/${id}`);

    if (response.status === 204) {
      const filteredProjects = projects.filter((project) => project.id !== id);

      setProjects(filteredProjects);
      return;
    }

    console.log(response.statusText);
    return;
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  function handleInputChange(event) {
    // name and value of the input
    const { name, value } = event.target;
    // name of the input in []
    setFormData({ ...formData, [name]: value })
  } 

  function handleSubmit() {
    const { title, owner } = formData
    console.log(title, owner)

    handleAddProject(title, owner)

    handleClose()
  }

  return (
    <>
      <Header />
      <main>
        {projects.map((project) => (
          <div className="card" key={project.id}>
            <h2 className="card-title">{project.title}</h2>
            <Grid container spacing={2} justify="space-between">
              <Grid item>
                <div className="card-content">
                  <p>Owner:</p>
                  <p>{project.owner}</p>
                </div>
              </Grid>
              <Grid item>
                <Delete
                  color="error"
                  className="delete-icon"
                  onClick={() => handleDeleteProject(project.id)}
                />
              </Grid>
            </Grid>
          </div>
        ))}
      </main>

      <footer>
        <button
          className="add-button"
          type={"button"}
          onClick={handleClickOpen}
        >
          Adicionar Projeto
        </button>
      </footer>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="dialog" id="alert-dialog-slide-title" className="dialog-title">Add Project</DialogTitle>
        <DialogContent className="dialog">
          <form>
            <fieldset>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="owner">Owner:</label>
                  <input
                    type="text"
                    name="owner"
                    id="owner"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </DialogContent>
        <DialogActions className="dialog">
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
