import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Box,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  let [comments, setComments] = useState([]);
  let [search, setSearch] = useState("");
  let [name, setName] = useState("");
  let [body, setBody] = useState("");
  let [email, setEmail] = useState("");
  let [postId, setPostId] = useState("");

  useEffect(() => {
    async function fetchAllData() {
      let response = await axios.get(
        "https://jsonplaceholder.typicode.com/comments"
      );
      setComments(response.data);
    }
    fetchAllData();
  }, []);

  //Handle Add
  async function handleAdd() {
    if (!name || !email || !body || !postId) {
      alert("Please Fill All the fields");
      return false;
    } else {
      let id = comments.length + 1;
      let obj = {
        id,
        postId,
        name,
        email,
        body,
      };
      let response = await axios.post(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
        obj
      );
      handleClose();

      setComments([...comments, obj]);
    }
  }

  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="App home-container">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            sx={{ width: "400px", m: 1 }}
            label="Post Id"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />

          <TextField
            sx={{ width: "400px", m: 1 }}
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            sx={{ width: "400px", m: 1 }}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            sx={{ width: "400px", m: 1 }}
            multiline
            maxRows={4}
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="card-action">
            <Button variant="outlined" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </Box>
      </Modal>

      <div className="head-bar">
        
        <div className="search-container">
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="add-btn-box">
          <Button variant="contained" onClick={handleOpen}>
            Add Comment
          </Button>
        </div>
      </div>

      <div className="comments-container">
      <h2>Comments</h2>
        {comments && (
          <div className="comments">
            {search
              ? comments
                  .filter(
                    (val) =>
                      val.name.includes(search) ||
                      val.email.toLowerCase().includes(search.toLowerCase()) ||
                      val.body.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((val, index) => (
                    <Cards
                      key={index}
                      data={val}
                      comments={comments}
                      setComments={setComments}
                    />
                  ))
              : comments.map((val, index) => (
                  <Cards
                    key={index}
                    data={val}
                    comments={comments}
                    setComments={setComments}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Cards = ({ data, comments, setComments }) => {
  let [name, setName] = useState("");
  let [body, setBody] = useState("");
  let [email, setEmail] = useState("");

  useEffect(() => {
    setBody(data.body);
    setName(data.name);
    setEmail(data.email);
  }, []);

  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Handle Edit
  async function handleEdit() {
    let obj = {
      postId: data.postId,
      id: data.id,
      name,
      email,
      body,
    };
    let response = await axios.put(
      `https://jsonplaceholder.typicode.com/comments/${data.id}`,
      obj
    );

    let temp = [];
    comments.map((val) => {
      if (val.id === data.id) {
        temp.push(obj);
      } else {
        temp.push(val);
      }
    });
    setComments([...temp]);
    handleClose();
  }

  //Handle Delete
  async function handleDelete() {
    let response = await axios.delete(
      `https://jsonplaceholder.typicode.com/comments/${data.id}`
    );
    let temp = comments.filter((val) => {
      if (val.id !== data.id) return val;
    });
    setComments([...temp]);
    handleClose();
  }
  return (
    <Card sx={{ m: 2, maxWidth: 345 }} className="card">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            sx={{ width: "400px", m: 1 }}
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            sx={{ width: "400px", m: 1 }}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            sx={{ width: "400px", m: 1 }}
            multiline
            maxRows={4}
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="card-action">
            <Button variant="outlined" size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </Box>
      </Modal>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.id}. {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.email}
        </Typography>
        <br />
        <Typography
          variant="body2"
          color="text.secondary"
          className="card-body"
        >
          {data.body}
        </Typography>
      </CardContent>
      <CardActions>
        <div className="card-action">
          <Button variant="contained" size="small" onClick={handleOpen}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </CardActions>
    </Card>
  );
};

export default App;
